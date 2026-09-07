import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseCsv,profileDataset,executePlan} from '../src/engine.js';
import {canonicalPlan,comparisonPlan} from '../src/canonical.js';
import {canonicalSemantics} from '../src/semantics.js';

const rows=parseCsv(fs.readFileSync(new URL('../public/orders.csv',import.meta.url),'utf8'));
const profile=profileDataset(rows);

test('canonical trace records the operations the engine executed',()=>{
  const trace=executePlan(rows,canonicalPlan,profile,canonicalSemantics).evidence.trace;
  assert.deepEqual(trace.operations,[
    {type:'filter',inputRows:13,outputRows:12,filters:[{field:'status',operator:'neq',value:'cancelled'}]},
    {type:'group',inputRows:12,outputRows:11,dimensions:[{field:'order_date',outputField:'order_date_month',bucket:'month'},{field:'region',outputField:'region',bucket:null}]},
    {type:'aggregate',inputRows:12,outputRows:11,metrics:[{semanticId:'orders.net_revenue',field:'net_revenue',aggregation:'sum',outputField:'sum_net_revenue'}]},
    {type:'sort',inputRows:11,outputRows:11,sort:[{field:'order_date_month',direction:'asc'}]}
  ]);
  assert.deepEqual(trace.semanticContext,{metrics:[{id:'orders.net_revenue',version:1}]});
  assert.deepEqual(trace.result,{rowCount:11});
  assert.equal(trace.version,1);
  assert.equal(trace.planVersion,1);
  assert.equal(trace.engineVersion,'0.5.0');
  assert.equal(Object.isFrozen(trace),true);
  assert.equal(Object.isFrozen(trace.operations[0]),true);
});

test('comparison trace records grouping, ranking, and actual periods',()=>{
  const trace=executePlan(rows,comparisonPlan,profile,canonicalSemantics).evidence.trace;
  assert.deepEqual(trace.operations.map(operation=>[operation.type,operation.inputRows,operation.outputRows]),[
    ['filter',13,12],['group',12,6],['aggregate',12,6],['rank',6,3],['compare',6,3]
  ]);
  assert.deepEqual(trace.operations.at(-2).ranking,comparisonPlan.ranking);
  assert.deepEqual(trace.operations.at(-1).comparison,{...comparisonPlan.comparison,latestPeriod:'2024',previousPeriod:'2023'});
  assert.equal(trace.result.rowCount,3);
});

test('limit trace preserves pre-limit and final row counts',()=>{
  const plan={...canonicalPlan,limit:2};
  const trace=executePlan(rows,plan,profile,canonicalSemantics).evidence.trace;
  assert.deepEqual(trace.operations.at(-1),{type:'limit',inputRows:11,outputRows:2,limit:2});
  assert.equal(trace.result.rowCount,2);
});
