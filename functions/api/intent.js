const MODEL='@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const PROMPT_VERSION='datagraph-plan-v1';
const MAX_BODY_BYTES=32_000;
const HOURLY_STAGING_BUDGET=100;
const allowedKeys=new Set(['question','profile','semantics','previousRevision']);

export async function onRequestPost({request,env}){
  try{
    const declared=Number(request.headers.get('content-length')||0);if(declared>MAX_BODY_BYTES)return json({error:'Intent context exceeds the proof limit.'},413);
    const input=await request.json();if(!validInput(input))return json({error:'Question and bounded analytical context are required.'},400);
    if(!await consumeBudget(env.DB))return json({error:'The staging intent budget is temporarily exhausted. Try again later.'},429,{'retry-after':'3600'});
    const messages=[{role:'system',content:systemPrompt()},{role:'user',content:JSON.stringify(input)}];
    const result=await env.AI.run(MODEL,{messages,max_tokens:1400,temperature:0,response_format:{type:'json_schema',json_schema:responseSchema()}});
    const candidate=parseCandidate(result?.response??result);
    return json({candidate,provider:{id:'cloudflare-workers-ai',version:'1',model:MODEL,promptVersion:PROMPT_VERSION}});
  }catch{return json({error:'The intent provider could not produce a candidate plan.'},502);}
}

export function onRequest(){return json({error:'Method not allowed.'},405,{allow:'POST'});}

function validInput(input){return input&&typeof input==='object'&&!Array.isArray(input)&&Object.keys(input).every(key=>allowedKeys.has(key))&&typeof input.question==='string'&&input.question.trim().length>0&&input.question.length<=2000&&Number.isSafeInteger(input.profile?.rowCount)&&Array.isArray(input.profile?.columns)&&input.profile.columns.length<=200&&input.profile.columns.every(column=>column&&typeof column.name==='string'&&typeof column.type==='string')&&input.semantics&&Number.isSafeInteger(input.semantics.version)&&Array.isArray(input.semantics.metrics)&&(input.previousRevision===null||input.previousRevision&&typeof input.previousRevision.question==='string'&&input.previousRevision.plan);}
function parseCandidate(value){if(typeof value==='string')value=JSON.parse(value);if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid model response.');return value;}
async function consumeBudget(db){const bucket=new Date().toISOString().slice(0,13);await db.prepare('INSERT INTO intent_usage (hour_bucket, request_count) VALUES (?, 1) ON CONFLICT(hour_bucket) DO UPDATE SET request_count = request_count + 1').bind(bucket).run();const row=await db.prepare('SELECT request_count FROM intent_usage WHERE hour_bucket = ?').bind(bucket).first();return row.request_count<=HOURLY_STAGING_BUDGET;}
function json(value,status=200,headers={}){return new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store',...headers}});}
function systemPrompt(){return `You propose intent slots; deterministic code compiles and validates the analytical plan. You never compute or invent result values. Return only {"intent":{...}} or {"cannotInterpret":"reason"}. The only supported metricId is orders.net_revenue. timeGrain is month or year. groupBy must be ["region"]. statusPolicy must be "declared", meaning the supplied semantic status exclusions apply. comparison is none or previous_year. ranking is none or top_3_latest. visualization is line, bar, or table. For monthly net revenue by region excluding cancelled orders use month, none, none, line. For top three regions compared with previous year use year, previous_year, top_3_latest, bar. For follow-ups use the previous revision context. Do not output a plan, fields, results, totals, SQL, code, or prose. Provider prompt version: ${PROMPT_VERSION}.`;}
function responseSchema(){return {type:'object',properties:{intent:{type:'object',properties:{metricId:{type:'string',enum:['orders.net_revenue']},timeGrain:{type:'string',enum:['month','year']},groupBy:{type:'array',items:{type:'string',enum:['region']},minItems:1,maxItems:1},statusPolicy:{type:'string',enum:['declared']},comparison:{type:'string',enum:['none','previous_year']},ranking:{type:'string',enum:['none','top_3_latest']},visualization:{type:'string',enum:['line','bar','table']}},required:['metricId','timeGrain','groupBy','statusPolicy','comparison','ranking','visualization'],additionalProperties:false},cannotInterpret:{type:'string'}},additionalProperties:false};}
