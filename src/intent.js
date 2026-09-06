import {canonicalPlan,comparisonPlan} from './canonical.js';

export const InterpretationStatus=Object.freeze({RESOLVED:'RESOLVED',NEEDS_CLARIFICATION:'NEEDS_CLARIFICATION',QUALIFIED:'QUALIFIED'});

const comparisonChoices=Object.freeze([
  {id:'monthly_yoy',label:'Monthly year over year',description:'Keep monthly grain and compare each month with the same month one year earlier.',available:false},
  {id:'annual_totals',label:'Annual regional totals',description:'Rank regions by the latest annual total and compare with the previous calendar year.',available:true},
  {id:'rank_annual_show_monthly',label:'Annual rank, monthly series',description:'Rank using annual totals but display monthly current and prior-year series.',available:false}
]);

export function createProvingIntentProvider(){
  return {id:'deterministic-proving-adapter',version:'1',propose({question,profile,semantics,previousRevision}){
    const normalized=question.trim().toLowerCase();
    const context={profileColumnCount:profile.columns.length,semanticVersion:semantics.version,parentRevision:previousRevision?.number??null};
    if(normalized.includes('top three')&&normalized.includes('previous year'))return {status:InterpretationStatus.NEEDS_CLARIFICATION,provider:{id:this.id,version:this.version},question,context,ambiguities:[{id:'comparison_grain',prompt:'How should “compare with the previous year” change the monthly analysis?',material:true,choices:comparisonChoices}]};
    if(normalized.includes('monthly')&&normalized.includes('net revenue')&&normalized.includes('region')&&normalized.includes('cancel'))return {status:InterpretationStatus.RESOLVED,provider:{id:this.id,version:this.version},question,context,candidate:{plan:structuredClone(canonicalPlan)},qualifications:[]};
    return {status:InterpretationStatus.NEEDS_CLARIFICATION,provider:{id:this.id,version:this.version},question,context,ambiguities:[{id:'unsupported_intent',prompt:'This proving adapter cannot safely interpret that question.',material:true,choices:[]}]};
  }};
}

export function resolveClarification(interpretation,ambiguityId,choiceId){
  if(interpretation.status!==InterpretationStatus.NEEDS_CLARIFICATION)throw new Error('Only an unresolved interpretation can be clarified.');
  const ambiguity=interpretation.ambiguities.find(item=>item.id===ambiguityId),choice=ambiguity?.choices.find(item=>item.id===choiceId);
  if(!choice)throw new Error('Unknown clarification choice.');
  if(!choice.available)throw new Error('That interpretation is visible but not yet supported by the deterministic engine.');
  return {...interpretation,status:InterpretationStatus.QUALIFIED,ambiguities:[],candidate:{plan:structuredClone(comparisonPlan)},qualifications:[`Confirmed interpretation: ${choice.description}`],resolution:{ambiguityId,choiceId}};
}
