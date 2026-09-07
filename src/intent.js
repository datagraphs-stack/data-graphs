import {canonicalPlan,comparisonPlan} from './canonical.js';
import {validatePlan} from './engine.js';

export const InterpretationStatus=Object.freeze({RESOLVED:'RESOLVED',NEEDS_CLARIFICATION:'NEEDS_CLARIFICATION',QUALIFIED:'QUALIFIED'});

const comparisonChoices=Object.freeze([
  {id:'monthly_yoy',label:'Monthly year over year',description:'Keep monthly grain and compare each month with the same month one year earlier.',available:false},
  {id:'annual_totals',label:'Annual regional totals',description:'Rank regions by the latest annual total and compare with the previous calendar year.',available:true},
  {id:'rank_annual_show_monthly',label:'Annual rank, monthly series',description:'Rank using annual totals but display monthly current and prior-year series.',available:false}
]);

export function createModelIntentProvider({fetchImpl=fetch}={}){
  return {id:'cloudflare-workers-ai',version:'1',async propose(input){
    const response=await fetchImpl('/api/intent',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(intentRequest(input))});
    let body;try{body=await response.json();}catch{body={};}
    if(!response.ok)return unavailableInterpretation(input.question,body.error||'The intent provider is unavailable.');
    return interpretCandidate({...input,candidate:body.candidate,provider:body.provider});
  }};
}

export function interpretCandidate({question,profile,semantics,previousRevision,candidate,provider={id:'unknown-model',version:'unknown'}}){
  const context={profileColumnCount:profile?.columns?.length??0,semanticVersion:semantics?.version??null,parentRevision:previousRevision?.number??null};
  let proposedPlan=candidate?.plan;
  if(candidate?.intent){try{proposedPlan=compileIntentProposal(candidate.intent,profile,semantics);}catch(error){return unavailableInterpretation(question,`The proposed intent failed validation: ${error.message}`,provider,context);}}
  if(!proposedPlan)return unavailableInterpretation(question,candidate?.cannotInterpret||'No candidate analytical plan was proposed.',provider,context);
  const validation=validatePlan(proposedPlan,profile,semantics);
  if(!validation.valid)return unavailableInterpretation(question,`The proposed plan failed validation: ${validation.errors.join(' ')}`,provider,context);
  const previousMonthly=Boolean(previousRevision)&&(!previousRevision.plan||previousRevision.plan.dimensions?.some(dimension=>dimension.bucket==='month'));
  const candidateAnnual=proposedPlan.dimensions.some(dimension=>dimension.bucket==='year');
  const proposal=candidate.intent?{proposal:structuredClone(candidate.intent)}:{};
  if(previousMonthly&&candidateAnnual&&proposedPlan.comparison?.offset==='previous_year')return {status:InterpretationStatus.NEEDS_CLARIFICATION,provider,question,context,...proposal,ambiguities:[{id:'comparison_grain',prompt:'How should “compare with the previous year” change the monthly analysis?',material:true,choices:comparisonChoices}],pendingCandidates:{annual_totals:{plan:structuredClone(proposedPlan)}}};
  return {status:InterpretationStatus.RESOLVED,provider,question,context,...proposal,candidate:{plan:structuredClone(proposedPlan)},qualifications:[]};
}

export function compileIntentProposal(intent,profile,semantics){
  const allowed=['metricId','timeGrain','groupBy','statusPolicy','comparison','ranking','visualization'],unexpected=Object.keys(intent||{}).filter(key=>!allowed.includes(key));
  if(!intent||typeof intent!=='object'||Array.isArray(intent)||unexpected.length)throw new Error(`unsupported fields: ${unexpected.join(', ')||'invalid proposal'}`);
  const metric=semantics?.metrics?.find(item=>item.id===intent.metricId);if(!metric)throw new Error('unknown metric semantic');
  const columns=new Set((profile?.columns||[]).map(column=>column.name));if(!columns.has(metric.sourceField)||!columns.has(metric.timeField))throw new Error('semantic fields are absent from the dataset');
  if(!['month','year'].includes(intent.timeGrain))throw new Error('unsupported time grain');
  if(!Array.isArray(intent.groupBy)||intent.groupBy.length!==1||intent.groupBy[0]!=='region'||!columns.has('region'))throw new Error('unsupported grouping');
  if(intent.statusPolicy!=='declared')throw new Error('status policy was not explicitly accepted');
  if(!['none','previous_year'].includes(intent.comparison)||!['none','top_3_latest'].includes(intent.ranking)||!['line','bar','table'].includes(intent.visualization))throw new Error('unsupported analytical operation');
  const filters=metric.statusPolicy.exclude.map(value=>({field:metric.statusPolicy.field,operator:'neq',value}));
  const plan={version:1,source:'orders',filters,dimensions:[{field:metric.timeField,bucket:intent.timeGrain},{field:'region'}],metrics:[{semanticId:metric.id,field:metric.sourceField,aggregation:metric.aggregation}],visualization:{type:intent.visualization}};
  if(intent.comparison==='none'&&intent.ranking==='none'){plan.sort=[{field:`${metric.timeField}_${intent.timeGrain}`,direction:'asc'}];return plan;}
  if(intent.comparison!=='previous_year'||intent.ranking!=='top_3_latest'||intent.timeGrain!=='year')throw new Error('ranking and comparison semantics conflict');
  plan.ranking={dimension:'region',by:`${metric.aggregation}_${metric.sourceField}`,limit:3,period:'latest'};plan.comparison={periodDimension:`${metric.timeField}_year`,offset:'previous_year'};return plan;
}

function unavailableInterpretation(question,reason,provider={id:'cloudflare-workers-ai',version:'1'},context={}){return {status:InterpretationStatus.NEEDS_CLARIFICATION,provider,question,context,ambiguities:[{id:'unsupported_intent',prompt:reason,material:true,choices:[]}]};}
function intentRequest({question,profile,semantics,previousRevision}){return {question,profile:{rowCount:profile?.rowCount,columns:(profile?.columns||[]).map(({name,type,nullCount})=>({name,type,nullCount}))},semantics,previousRevision:previousRevision?{question:previousRevision.question,plan:previousRevision.plan}:null};}

/** Deterministic fixture adapter only; production Studio uses createModelIntentProvider. */
export function createProvingIntentProvider(){
  return {id:'deterministic-test-fixture',version:'1',propose({question,profile,semantics,previousRevision}){
    const normalized=question.trim().toLowerCase(),plan=normalized.includes('top three')&&normalized.includes('previous year')?comparisonPlan:normalized.includes('monthly')&&normalized.includes('net revenue')&&normalized.includes('region')&&normalized.includes('cancel')?canonicalPlan:null;
    return interpretCandidate({question,profile,semantics,previousRevision,candidate:plan?{plan:structuredClone(plan)}:{cannotInterpret:'This test fixture cannot safely interpret that question.'},provider:{id:this.id,version:this.version}});
  }};
}

export function resolveClarification(interpretation,ambiguityId,choiceId){
  if(interpretation.status!==InterpretationStatus.NEEDS_CLARIFICATION)throw new Error('Only an unresolved interpretation can be clarified.');
  const ambiguity=interpretation.ambiguities.find(item=>item.id===ambiguityId),choice=ambiguity?.choices.find(item=>item.id===choiceId);
  if(!choice)throw new Error('Unknown clarification choice.');
  if(!choice.available)throw new Error('That interpretation is visible but not yet supported by the deterministic engine.');
  const plan=interpretation.pendingCandidates?.[choiceId]?.plan;if(!plan)throw new Error('No validated candidate exists for that clarification.');
  const {pendingCandidates,...base}=interpretation;
  return {...base,status:InterpretationStatus.QUALIFIED,ambiguities:[],candidate:{plan:structuredClone(plan)},qualifications:[`Confirmed interpretation: ${choice.description}`],resolution:{ambiguityId,choiceId}};
}
