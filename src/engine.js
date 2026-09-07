import {metricById} from './semantics.js';
import {createExecutionTrace} from './trace.js';

/** @typedef {'string'|'number'|'date'|'boolean'|'unknown'} ColumnType */
/** @typedef {{field:string,operator:'eq'|'neq',value:string}} Filter */
/** @typedef {{version:1,source:string,filters:Filter[],dimensions:{field:string,bucket?:'month'|'year'}[],metrics:{semanticId:string,field:string,aggregation:'sum'|'count'|'average'|'min'|'max'}[],sort?:{field:string,direction:'asc'|'desc'}[],limit?:number,ranking?:{dimension:string,by:string,limit:number,period:'latest'},comparison?:{periodDimension:string,offset:'previous_year'},visualization:{type:'line'|'bar'|'table'}} AnalysisPlan */

const aggregations=new Set(['sum','count','average','min','max']);
const filterOperators=new Set(['eq','neq']);
const visualizationTypes=new Set(['line','bar','table']);
const isoDate=/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])(?:T.*)?$/;
const strictNumber=/^-?(?:\d+|\d*\.\d+)$/;

export function parseCsv(text) {
  const rows=[]; let row=[], field='', quote=false;
  for(let i=0;i<text.length;i++){const c=text[i], n=text[i+1]; if(c==='"'&&quote&&n==='"'){field+='"';i++;} else if(c==='"'){quote=!quote;} else if(c===','&&!quote){row.push(field);field='';} else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&n==='\n')i++;row.push(field);if(row.some(x=>x!==''))rows.push(row);row=[];field='';} else field+=c;}
  if(field||row.length){row.push(field);rows.push(row);} if(quote) throw new Error('CSV contains an unclosed quote.'); if(rows.length<2) throw new Error('CSV must contain a header and at least one data row.');
  const headers=rows[0].map(x=>x.trim()); if(new Set(headers).size!==headers.length||headers.some(x=>!x)) throw new Error('CSV headers must be non-empty and unique.');
  return rows.slice(1).map((values,i)=>{if(values.length!==headers.length)throw new Error(`Row ${i+2} has ${values.length} values; expected ${headers.length}.`);return Object.fromEntries(headers.map((h,j)=>[h,values[j]]));});
}

export function inferType(name, values){const nonNull=values.filter(v=>v.trim()!==''); if(!nonNull.length)return 'unknown'; if(/(^|_)id$/i.test(name))return 'string'; if(nonNull.every(v=>/^(true|false)$/i.test(v)))return 'boolean'; if(nonNull.every(v=>isoDate.test(v)&&!Number.isNaN(Date.parse(v))))return 'date'; if(nonNull.every(v=>strictNumber.test(v)&&Number.isFinite(Number(v))))return 'number'; return 'string';}
export function profileDataset(rows){const columns=Object.keys(rows[0]||{}).map(name=>{const values=rows.map(r=>r[name]??''), type=inferType(name,values), nonNull=values.filter(v=>v.trim()!==''); const out={name,type,nullCount:values.length-nonNull.length,uniqueCount:new Set(nonNull).size,samples:[...new Set(nonNull)].slice(0,3)}; if(type==='number')Object.assign(out,{min:Math.min(...nonNull.map(Number)),max:Math.max(...nonNull.map(Number))}); if(type==='date')Object.assign(out,{min:[...nonNull].sort()[0],max:[...nonNull].sort().at(-1)}); return out;}); return {rowCount:rows.length,columns,warnings:columns.filter(c=>c.nullCount>0).map(c=>`${c.name} contains ${c.nullCount} blank value(s).`)};}

function isRecord(value){return value!==null&&typeof value==='object'&&!Array.isArray(value);}
function unexpectedKeys(value,allowed,label){return isRecord(value)?Object.keys(value).filter(key=>!allowed.includes(key)).map(key=>`Unsupported ${label} field: ${key}`):[];}
function outputFields(plan){return new Set([...(plan.dimensions||[]).map(d=>d.bucket?`${d.field}_${d.bucket}`:d.field),...(plan.metrics||[]).map(m=>`${m.aggregation}_${m.field}`)]);}
export function validatePlan(plan,profile,semantics){
  const errors=[];
  if(!isRecord(plan))return {valid:false,errors:['Plan must be an object.']};
  errors.push(...unexpectedKeys(plan,['version','source','filters','dimensions','metrics','sort','limit','ranking','comparison','visualization'],'plan'));
  if(plan.version!==1)errors.push(`Unsupported plan version: ${String(plan.version)}`);
  if(plan.source!=='orders')errors.push(`Unknown source: ${String(plan.source)}`);
  for(const key of ['filters','dimensions','metrics'])if(!Array.isArray(plan[key]))errors.push(`${key} must be an array.`);
  if(!isRecord(plan.visualization)||!visualizationTypes.has(plan.visualization?.type))errors.push('visualization.type must be line, bar, or table.');
  if(plan.sort!==undefined&&!Array.isArray(plan.sort))errors.push('sort must be an array when provided.');
  if(plan.limit!==undefined&&(!Number.isSafeInteger(plan.limit)||plan.limit<1))errors.push('limit must be a positive safe integer.');
  const filters=Array.isArray(plan.filters)?plan.filters:[], dimensions=Array.isArray(plan.dimensions)?plan.dimensions:[], metrics=Array.isArray(plan.metrics)?plan.metrics:[], sort=Array.isArray(plan.sort)?plan.sort:[];
  if(!dimensions.length)errors.push('At least one dimension is required.');
  if(!metrics.length)errors.push('At least one metric is required.');
  const types=Object.fromEntries((profile?.columns||[]).map(c=>[c.name,c.type]));
  for(const f of filters){errors.push(...unexpectedKeys(f,['field','operator','value'],'filter'));if(!isRecord(f)||typeof f.field!=='string'){errors.push('Each filter requires a field.');continue;}if(!(f.field in types))errors.push(`Unknown field: ${f.field}`);if(!filterOperators.has(f.operator))errors.push(`Unsupported filter operator: ${String(f.operator)}`);if(typeof f.value!=='string')errors.push(`Filter value must be a source string: ${f.field}`);}
  for(const d of dimensions){errors.push(...unexpectedKeys(d,['field','bucket'],'dimension'));if(!isRecord(d)||typeof d.field!=='string'){errors.push('Each dimension requires a field.');continue;}if(!(d.field in types))errors.push(`Unknown field: ${d.field}`);if(d.bucket!==undefined&&!['month','year'].includes(d.bucket))errors.push(`Unsupported date bucket: ${String(d.bucket)}`);if(d.bucket&&types[d.field]!=='date')errors.push(`Date bucketing requires a date field: ${d.field}`);}
  for(const m of metrics){errors.push(...unexpectedKeys(m,['semanticId','field','aggregation'],'metric'));if(!isRecord(m)||typeof m.field!=='string'){errors.push('Each metric requires a field.');continue;}if(!(m.field in types))errors.push(`Unknown field: ${m.field}`);if(!aggregations.has(m.aggregation))errors.push(`Unsupported aggregation: ${String(m.aggregation)}`);else if(m.aggregation!=='count'&&types[m.field]!=='number')errors.push(`${m.aggregation} requires a numeric field: ${m.field}`);const semantic=metricById(semantics,m.semanticId);if(!semantic)errors.push(`Unknown metric semantic: ${String(m.semanticId)}`);else{if(semantic.sourceField!==m.field)errors.push(`Metric field conflicts with semantic ${semantic.id}.`);if(semantic.aggregation!==m.aggregation)errors.push(`Metric aggregation conflicts with semantic ${semantic.id}.`);if(!dimensions.some(d=>d.field===semantic.timeField))errors.push(`Metric time field is absent from dimensions: ${semantic.timeField}`);const policyFilter=filters.find(f=>f.field===semantic.statusPolicy.field&&f.operator==='neq');if(semantic.statusPolicy.exclude.length&&!semantic.statusPolicy.exclude.includes(policyFilter?.value))errors.push(`Status exclusion conflicts with semantic ${semantic.id}.`);}}
  const outputs=outputFields({dimensions,metrics});
  for(const s of sort){errors.push(...unexpectedKeys(s,['field','direction'],'sort'));if(!isRecord(s)||typeof s.field!=='string'){errors.push('Each sort requires a field.');continue;}if(!outputs.has(s.field))errors.push(`Sort field is not in result: ${s.field}`);if(s.direction!=='asc'&&s.direction!=='desc')errors.push(`Unsupported sort direction: ${String(s.direction)}`);}
  if(plan.ranking!==undefined){const r=plan.ranking;errors.push(...unexpectedKeys(r,['dimension','by','limit','period'],'ranking'));if(!isRecord(r))errors.push('ranking must be an object.');else{if(!outputs.has(r.dimension)||!dimensions.some(d=>(d.bucket?`${d.field}_${d.bucket}`:d.field)===r.dimension))errors.push(`Ranking dimension is not in result: ${String(r.dimension)}`);if(!outputs.has(r.by)||!metrics.some(m=>`${m.aggregation}_${m.field}`===r.by))errors.push(`Ranking metric is not in result: ${String(r.by)}`);if(!Number.isSafeInteger(r.limit)||r.limit<1)errors.push('ranking.limit must be a positive safe integer.');if(r.period!=='latest')errors.push(`Unsupported ranking period: ${String(r.period)}`);}}
  if(plan.comparison!==undefined){const c=plan.comparison;errors.push(...unexpectedKeys(c,['periodDimension','offset'],'comparison'));if(!isRecord(c))errors.push('comparison must be an object.');else{const period=dimensions.find(d=>(d.bucket?`${d.field}_${d.bucket}`:d.field)===c.periodDimension);if(!period||period.bucket!=='year')errors.push(`Comparison period must be a year-bucketed dimension: ${String(c.periodDimension)}`);if(c.offset!=='previous_year')errors.push(`Unsupported comparison offset: ${String(c.offset)}`);if(!plan.ranking)errors.push('Previous-year comparison requires ranking semantics.');}}
  errors.push(...unexpectedKeys(plan.visualization,['type'],'visualization'));
  return {valid:errors.length===0,errors:[...new Set(errors)]};
}

function dimensionValue(row,d){const value=row[d.field]; return d.bucket==='month'?value.slice(0,7):d.bucket==='year'?value.slice(0,4):value;}
function decimalParts(value){const [whole,fraction='']=value.split('.');return {scale:fraction.length,integer:BigInt(whole+fraction)};}
function aggregateDecimal(values,aggregation){
  const parsed=values.map(decimalParts), scale=Math.max(0,...parsed.map(v=>v.scale));
  const integers=parsed.map(v=>v.integer*10n**BigInt(scale-v.scale));
  const selected=aggregation==='min'?integers.reduce((a,b)=>a<b?a:b):aggregation==='max'?integers.reduce((a,b)=>a>b?a:b):integers.reduce((a,b)=>a+b,0n);
  if(aggregation==='average')return Number(selected)/values.length/10**scale;
  return Number(selected)/10**scale;
}
function applyComparison(result,plan){
  if(!plan.comparison||!plan.ranking)return result;
  const {periodDimension}=plan.comparison,{dimension,by,limit}=plan.ranking;
  const periods=[...new Set(result.map(row=>row[periodDimension]))].sort();
  const currentPeriod=periods.at(-1), previousPeriod=String(Number(currentPeriod)-1);
  const lookup=new Map(result.map(row=>[`${row[periodDimension]}\0${row[dimension]}`,row[by]]));
  return result.filter(row=>row[periodDimension]===currentPeriod&&row[by]!==null).sort((a,b)=>b[by]-a[by]||String(a[dimension]).localeCompare(String(b[dimension]))).slice(0,limit).map(row=>{const current=row[by],previous=lookup.get(`${previousPeriod}\0${row[dimension]}`)??null,change=previous===null?null:aggregateDecimal([String(current),String(-previous)],'sum');return {...row,previous_period:previousPeriod,[`previous_${by}`]:previous,[`change_${by}`]:change,[`percent_change_${by}`]:previous===null||previous===0?null:change/previous};});
}
export function executePlan(rows,plan,profile,semantics){const validation=validatePlan(plan,profile,semantics);if(!validation.valid)throw new Error(validation.errors.join(' ')); const filtered=rows.filter(r=>plan.filters.every(f=>f.operator==='eq'?r[f.field]===f.value:r[f.field]!==f.value)); const groups=new Map(); for(const row of filtered){const dims=plan.dimensions.map(d=>dimensionValue(row,d));const key=JSON.stringify(dims);if(!groups.has(key))groups.set(key,{dims,rows:[]});groups.get(key).rows.push(row);} let result=[...groups.values()].map(g=>{const out=Object.fromEntries(plan.dimensions.map((d,i)=>[d.bucket?`${d.field}_${d.bucket}`:d.field,g.dims[i]]));for(const m of plan.metrics){const vals=g.rows.map(r=>r[m.field]).filter(v=>strictNumber.test(v));const key=`${m.aggregation}_${m.field}`;out[key]=m.aggregation==='count'?g.rows.length:vals.length?aggregateDecimal(vals,m.aggregation):null;}return out;}); const groupedRows=result.length;result=applyComparison(result,plan);for(const s of [...(plan.sort||[])].reverse())result.sort((a,b)=>(a[s.field]>b[s.field]?1:a[s.field]<b[s.field]?-1:0)*(s.direction==='asc'?1:-1));const preLimitRows=result.length;if(plan.limit)result=result.slice(0,plan.limit);const usedSemantics=plan.metrics.map(metric=>metricById(semantics,metric.semanticId)),engineVersion='0.5.0',warnings=[...profile.warnings,...usedSemantics.flatMap(metric=>metric.qualifications)],comparison=plan.comparison?{latestPeriod:result[0]?.[plan.comparison.periodDimension]??null,previousPeriod:result[0]?.previous_period??null,ranking:structuredClone(plan.ranking)}:null,trace=createExecutionTrace({plan,engineVersion,sourceRows:rows.length,filteredRows:filtered.length,groupedRows,preLimitRows,resultRows:result.length,semantics:usedSemantics,warnings,comparison});return {rows:result,evidence:{source:plan.source,sourceRows:rows.length,filteredRows:filtered.length,resultRows:result.length,columnsUsed:[...new Set([...plan.filters,...plan.dimensions,...plan.metrics].map(x=>x.field))],plan:structuredClone(plan),semantics:structuredClone(usedSemantics),semanticContextVersion:semantics.version,engineVersion,arithmetic:'base-10 fixed-point aggregation; decimal scale derived per group',comparison,warnings,trace}};}
