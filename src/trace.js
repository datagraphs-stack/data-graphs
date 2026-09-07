export const EXECUTION_TRACE_VERSION=1;

export function createExecutionTrace({plan,engineVersion,sourceRows,filteredRows,groupedRows,preLimitRows,resultRows,semantics,warnings,comparison}){
  const dimensions=plan.dimensions.map(dimension=>({field:dimension.field,outputField:dimension.bucket?`${dimension.field}_${dimension.bucket}`:dimension.field,bucket:dimension.bucket??null}));
  const metrics=plan.metrics.map(metric=>({semanticId:metric.semanticId,field:metric.field,aggregation:metric.aggregation,outputField:`${metric.aggregation}_${metric.field}`}));
  const operations=[
    {type:'filter',inputRows:sourceRows,outputRows:filteredRows,filters:structuredClone(plan.filters)},
    {type:'group',inputRows:filteredRows,outputRows:groupedRows,dimensions},
    {type:'aggregate',inputRows:filteredRows,outputRows:groupedRows,metrics}
  ];
  if(plan.ranking)operations.push({type:'rank',inputRows:groupedRows,outputRows:preLimitRows,ranking:structuredClone(plan.ranking)});
  if(plan.comparison)operations.push({type:'compare',inputRows:groupedRows,outputRows:preLimitRows,comparison:{...structuredClone(plan.comparison),latestPeriod:comparison.latestPeriod,previousPeriod:comparison.previousPeriod}});
  if(plan.sort?.length)operations.push({type:'sort',inputRows:preLimitRows,outputRows:preLimitRows,sort:structuredClone(plan.sort)});
  if(plan.limit)operations.push({type:'limit',inputRows:preLimitRows,outputRows:resultRows,limit:plan.limit});
  return deepFreeze({version:EXECUTION_TRACE_VERSION,planVersion:plan.version,engineVersion,source:{id:plan.source,rowCount:sourceRows},semanticContext:{metrics:semantics.map(metric=>({id:metric.id,version:metric.version}))},operations,warnings:structuredClone(warnings),result:{rowCount:resultRows}});
}

function deepFreeze(value){if(value&&typeof value==='object'){Object.freeze(value);for(const child of Object.values(value))deepFreeze(child);}return value;}
