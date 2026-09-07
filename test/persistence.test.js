import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {onRequest} from '../functions/api/datagraphs/[[id]].js';
import {appendRevision,createDataGraph} from '../src/datagraph.js';
import {executePlan,parseCsv,profileDataset} from '../src/engine.js';
import {canonicalPlan,comparisonPlan} from '../src/canonical.js';
import {canonicalSemantics} from '../src/semantics.js';
import {createProvingIntentProvider,resolveClarification} from '../src/intent.js';

class MemoryD1{
  rows=new Map();
  prepare(sql){return {bind:(...values)=>({first:async()=>{const row=this.rows.get(values[0]);if(!row)return null;if(sql.includes('envelope, write_token_hash'))return {envelope:row.envelope,write_token_hash:row.write_token_hash};if(sql.includes('write_token_hash'))return {write_token_hash:row.write_token_hash};if(sql.includes('envelope'))return {envelope:row.envelope};return {id:row.id};},run:async()=>{if(sql.startsWith('INSERT'))this.rows.set(values[0],{id:values[0],envelope:values[1],write_token_hash:values[2]});else if(sql.startsWith('UPDATE'))this.rows.get(values[2]).envelope=values[0];else if(sql.startsWith('DELETE'))this.rows.delete(values[0]);return {success:true};}})};}
}

const sourceBytes=new Uint8Array(fs.readFileSync(new URL('../public/orders.csv',import.meta.url))),rows=parseCsv(new TextDecoder().decode(sourceBytes)),profile=profileDataset(rows),provider=createProvingIntentProvider(),question='Show monthly net revenue by region, excluding cancelled orders.',interpretation=provider.propose({question,profile,semantics:canonicalSemantics}),output=executePlan(rows,canonicalPlan,profile,canonicalSemantics);
async function graph(){return createDataGraph({sourceBytes,originalFilename:'orders.csv',profile,semantics:canonicalSemantics,question,interpretation,plan:canonicalPlan,output,dataGraphId:'dg_persistence_test'});}
const invoke=(DB,method,id,body,token)=>onRequest({env:{DB},params:{id},request:new Request(`https://example.test/api/datagraphs${id?`/${id}`:''}`,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(token?{authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined})});

test('create and public read retain the exact validated DataGraph',async()=>{
  const DB=new MemoryD1(),original=await graph(),created=await invoke(DB,'POST',undefined,original),receipt=await created.json();
  assert.equal(created.status,201);assert.equal(receipt.path,'/g/dg_persistence_test');assert.match(receipt.writeToken,/^[0-9a-f]{64}$/);
  const read=await invoke(DB,'GET','dg_persistence_test'),body=await read.json();assert.equal(read.status,200);assert.deepEqual(body.dataGraph,original);assert.equal(body.writeToken,undefined);
});

test('authorized append preserves immutable history and unauthorized writes fail',async()=>{
  const DB=new MemoryD1(),original=await graph(),receipt=await (await invoke(DB,'POST',undefined,original)).json();
  assert.equal((await invoke(DB,'PUT',original.dataGraphId,original)).status,403);
  const followup='Show the top three regions by net revenue and compare them with the previous year.',pending=provider.propose({question:followup,profile,semantics:canonicalSemantics,previousRevision:{number:1}}),qualified=resolveClarification(pending,'comparison_grain','annual_totals'),next=await appendRevision(original,{question:followup,interpretation:qualified,plan:comparisonPlan,output:executePlan(rows,comparisonPlan,profile,canonicalSemantics)});
  const updated=await invoke(DB,'PUT',original.dataGraphId,next,receipt.writeToken);assert.equal(updated.status,200);assert.equal((await updated.json()).revisionCount,2);
  const rewritten=structuredClone(next);rewritten.revisions[0].question='rewritten history';assert.equal((await invoke(DB,'PUT',original.dataGraphId,rewritten,receipt.writeToken)).status,422);
});

test('invalid envelopes, route mismatches, deletion, and missing graphs fail safely',async()=>{
  const DB=new MemoryD1();assert.equal((await invoke(DB,'POST',undefined,{schemaVersion:1})).status,422);assert.equal((await invoke(DB,'GET','dg_missing')).status,404);
  const original=await graph(),receipt=await (await invoke(DB,'POST',undefined,original)).json();assert.equal((await invoke(DB,'PUT','dg_other',original,receipt.writeToken)).status,404);assert.equal((await invoke(DB,'DELETE',original.dataGraphId,undefined,'wrong')).status,403);assert.equal((await invoke(DB,'DELETE',original.dataGraphId,undefined,receipt.writeToken)).status,204);assert.equal((await invoke(DB,'GET',original.dataGraphId)).status,404);
});
