export const canonicalSemantics=deepFreeze({
  version:1,
  metrics:[{
    id:'orders.net_revenue',
    version:1,
    label:'Net revenue',
    sourceField:'net_revenue',
    aggregation:'sum',
    timeField:'order_date',
    nullPolicy:'exclude_null_values_and_report',
    statusPolicy:{field:'status',exclude:['cancelled'],includeOtherStatuses:true},
    unit:{kind:'currency',currency:'unknown'},
    qualifications:['Currency is not declared by the source.','Refunded rows are included because the canonical proving policy excludes only cancelled rows.']
  }]
});

function deepFreeze(value){if(value&&typeof value==='object'){Object.freeze(value);for(const child of Object.values(value))deepFreeze(child);}return value;}

export function metricById(semantics,id){return semantics?.metrics?.find(metric=>metric.id===id);}
