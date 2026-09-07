export function assessDatasetCompatibility(profile,semantics){
  const columns=new Map((profile?.columns||[]).map(column=>[column.name,column.type])),metric=semantics?.metrics?.find(item=>item.id==='orders.net_revenue');
  const requirements=[
    {field:metric?.timeField||'order_date',type:'date',purpose:'calendar grouping'},
    {field:'region',type:'string',purpose:'regional grouping'},
    {field:metric?.sourceField||'net_revenue',type:'number',purpose:'net revenue aggregation'},
    {field:metric?.statusPolicy?.field||'status',type:'string',purpose:'declared status exclusions'}
  ];
  const issues=requirements.flatMap(requirement=>!columns.has(requirement.field)?[`Missing required column “${requirement.field}” for ${requirement.purpose}.`]:columns.get(requirement.field)!==requirement.type?[`“${requirement.field}” must infer as ${requirement.type}, but inferred ${columns.get(requirement.field)}.`]:[]);
  return {compatible:issues.length===0,requirements,issues};
}
