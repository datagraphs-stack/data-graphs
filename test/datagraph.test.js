import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {canonicalJson,contentHash,sha256Hex} from '../src/identity.js';
import {appendRevision,createDataGraph,deserializeDataGraph,recomputeRevision,serializeDataGraph,validateDataGraph} from '../src/datagraph.js';
import {executePlan,parseCsv,profileDataset} from '../src/engine.js';
import {canonicalPlan,comparisonPlan} from '../src/canonical.js';
import {canonicalSemantics} from '../src/semantics.js';
import {createProvingIntentProvider,resolveClarification} from '../src/intent.js';

const sourceBytes=new Uint8Array(fs.readFileSync(new URL('../public/orders.csv',import.meta.url)));
const rows=parseCsv(new TextDecoder().decode(sourceBytes)),profile=profileDataset(rows),provider=createProvingIntentProvider();
const firstQuestion='Show monthly net revenue by region, excluding cancelled orders.';
const firstInterpretation=provider.propose({question:firstQuestion,profile,semantics:canonicalSemantics});
const firstOutput=executePlan(rows,canonicalPlan,profile,canonicalSemantics);

async function canonicalGraph(){return createDataGraph({sourceBytes,originalFilename:'orders.csv',profile,semantics:canonicalSemantics,question:firstQuestion,interpretation:firstInterpretation,plan:canonicalPlan,output:firstOutput,createdAt:'2026-09-07T00:00:00.000Z',dataGraphId:'dg_test_entity'});}

test('canonical JSON and SHA-256 identities are deterministic',async()=>{
  assert.equal(canonicalJson({b:2,a:{d:4,c:3}}),'{"a":{"c":3,"d":4},"b":2}');
  assert.equal(await sha256Hex('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(await contentHash({b:2,a:1}),await contentHash({a:1,b:2}));
});

test('DataGraph round trip retains exact source and recomputes its authoritative result',async()=>{
  const graph=await canonicalGraph(),restored=deserializeDataGraph(serializeDataGraph(graph)),validation=await validateDataGraph(restored);
  assert.equal(validation.valid,true,validation.errors.join(' '));
  assert.equal(graph.source.byteLength,sourceBytes.byteLength);
  assert.match(graph.source.sourceId,/^src_[0-9a-f]{64}$/);
  assert.match(graph.source.profileHash,/^[0-9a-f]{64}$/);
  assert.match(graph.semanticsHash,/^[0-9a-f]{64}$/);
  assert.notEqual(graph.dataGraphId,graph.source.sourceId);
  assert.match(graph.revisions[0].revisionId,/^rev_/);
  assert.match(graph.revisions[0].contentHash,/^[0-9a-f]{64}$/);
  const recomputed=await recomputeRevision(restored,graph.revisions[0].revisionId);
  assert.equal(recomputed.matches,true);
  assert.equal(recomputed.traceMatches,true);
  assert.deepEqual(recomputed.output.rows,graph.revisions[0].result.rows);
});

test('revision identity binds parent, interpretation, trace, and result',async()=>{
  let graph=await canonicalGraph();
  const question='Show the top three regions by net revenue and compare them with the previous year.';
  const unresolved=provider.propose({question,profile,semantics:canonicalSemantics,previousRevision:{number:1}}),interpretation=resolveClarification(unresolved,'comparison_grain','annual_totals'),output=executePlan(rows,comparisonPlan,profile,canonicalSemantics);
  graph=await appendRevision(graph,{question,interpretation,plan:comparisonPlan,output,createdAt:'2026-09-07T00:01:00.000Z'});
  assert.equal(graph.revisions[1].parentRevisionId,graph.revisions[0].revisionId);
  assert.equal(graph.revisions[1].parentContentHash,graph.revisions[0].contentHash);
  assert.notEqual(graph.revisions[1].revisionId,graph.revisions[0].revisionId);
  assert.equal((await validateDataGraph(graph)).valid,true);
  assert.equal((await recomputeRevision(graph,graph.revisions[1].revisionId)).matches,true);
  assert.equal(Object.isFrozen(graph.revisions[1]),true);
});

test('entity identities do not change deterministic content identity',async()=>{
  const first=await canonicalGraph(),second=await createDataGraph({sourceBytes,originalFilename:'orders.csv',profile,semantics:canonicalSemantics,question:firstQuestion,interpretation:firstInterpretation,plan:canonicalPlan,output:firstOutput,createdAt:'2027-01-01T00:00:00.000Z',dataGraphId:'dg_other_entity'});
  assert.notEqual(first.dataGraphId,second.dataGraphId);
  assert.notEqual(first.revisions[0].revisionId,second.revisions[0].revisionId);
  assert.equal(first.source.sourceId,second.source.sourceId);
  assert.equal(first.revisions[0].contentHash,second.revisions[0].contentHash);
});

test('DataGraph validation detects source, result, and lineage tampering',async()=>{
  const graph=deserializeDataGraph(serializeDataGraph(await canonicalGraph()));
  graph.source.content=graph.source.content.slice(0,-4)+'AAAA';
  assert.match((await validateDataGraph(graph)).errors.join(' '),/Source content hash mismatch/);
  const resultGraph=deserializeDataGraph(serializeDataGraph(await canonicalGraph()));
  resultGraph.revisions[0].result.rows[0].sum_net_revenue=999;
  assert.match((await validateDataGraph(resultGraph)).errors.join(' '),/content hash mismatch|result hash mismatch/);
  const lineageGraph=deserializeDataGraph(serializeDataGraph(await canonicalGraph()));
  lineageGraph.revisions[0].parentRevisionId='rev_wrong';
  assert.match((await validateDataGraph(lineageGraph)).errors.join(' '),/parent mismatch/);
  const semanticGraph=deserializeDataGraph(serializeDataGraph(await canonicalGraph()));
  semanticGraph.semantics.metrics[0].unit.currency='USD';
  assert.match((await validateDataGraph(semanticGraph)).errors.join(' '),/Semantic context hash mismatch/);
  const profileGraph=deserializeDataGraph(serializeDataGraph(await canonicalGraph()));
  profileGraph.source.profile.rowCount=999;
  assert.match((await validateDataGraph(profileGraph)).errors.join(' '),/profile hash mismatch/);
  const malformed=await validateDataGraph({schemaVersion:1,dataGraphId:'dg_broken',revisions:[{}]});
  assert.equal(malformed.valid,false);
  assert.match(malformed.errors.join(' '),/invalid source artifact|Revision 1/);
});
