import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceOrigin, sourceId, sourcePolicy, validateMission} from '../lib/foundry/policy.js';
import {SourceRegistry} from '../lib/foundry/registry.js';
import {localDatabase} from '../lib/foundry/local-db.js';
const migration = readFileSync(new URL('../migrations/0003_foundry_registry.sql', import.meta.url), 'utf8');
const now = 1_800_000_000_000;
const active = {status:'active', note:'Fixture-only approval; not a real crawl permission.'};
const fixture = () => ({version:1,id:'test-market',name:'Test market',sources:['https://vendor-one.com'],budget:{maxPagesPerSource:5,maxRequests:10,requestDelayMs:1000,maxResponseBytes:100000}});
function setup(t) { const db=localDatabase(); db.exec(migration); t.after(()=>db.close()); return {db,registry:new SourceRegistry(db)}; }

test('source normalization preserves identity boundaries', async () => {
  assert.equal(sourceOrigin('https://Vendor-One.COM.:443/'), 'https://vendor-one.com');
  assert.equal(await sourceId('https://Vendor-One.COM/'), await sourceId('https://vendor-one.com'));
  assert.notEqual(await sourceId('https://www.vendor-one.com'), await sourceId('https://vendor-one.com'));
});
for (const input of ['http://vendor.com','https://127.0.0.1','https://127.1','https://0x7f000001','https://2130706433','https://[::1]','https://localhost','https://a.internal','https://a.local','https://a.test','https://a.invalid','https://a.onion','https://user:pass@vendor.com','https://vendor.com:8443','https://vendor.com/pricing','https://vendor.com?token=secret','https://vendor.com#x','https://vendor.com\\@127.0.0.1',' https://vendor.com','https://vendor.com\n','https://a..com','https://-a.com','https://a.corp']) {
  test(`reject unsafe/non-origin input ${JSON.stringify(input)}`,()=>assert.throws(()=>sourceOrigin(input)));
}
test('registration policy fails closed by default',()=>{
  assert.equal(sourcePolicy().status,'pending');
  assert.throws(()=>sourcePolicy({status:'active'}));
  assert.throws(()=>sourcePolicy({refreshSeconds:0}));
  assert.throws(()=>sourcePolicy({status:'unknown'}));
  assert.throws(()=>sourcePolicy({status:'active',note:' '}));
  assert.throws(()=>sourcePolicy({note:'x',unexpected:true}));
});
test('mission contract bounds costs and rejects ambiguous/unknown inputs',()=>{
  const input=fixture(), mission=validateMission(input);
  assert.equal(mission.sources.length,1);
  assert.ok(Object.isFrozen(mission.budget));
  for(const change of [{version:2},{sources:[]},{sources:Array(101).fill('https://a.com')},{sources:['https://A.com/','https://a.com']},{id:'../../oops'},{arbitraryCode:'run'}]) assert.throws(()=>validateMission({...input,...change}));
  for(const change of [{maxRequests:Infinity},{maxPagesPerSource:21},{requestDelayMs:0},{maxResponseBytes:20_000_000},{unknown:1}]) assert.throws(()=>validateMission({...input,budget:{...input.budget,...change}}));
});
test('migration is additive and repeatable; registration is durable and idempotent',async t=>{
  const {db,registry}=setup(t);
  db.exec("CREATE TABLE studio_fixture (id TEXT); INSERT INTO studio_fixture VALUES ('preserve')");
  db.exec(migration);
  const first=await registry.register('https://vendor-one.com',{},now);
  assert.equal(first.created,true); assert.equal(first.source.status,'pending');
  const second=await registry.register('https://Vendor-One.com/',active,now+1);
  assert.equal(second.created,false); assert.equal(second.source.status,'pending');
  assert.equal((await registry.list()).length,1);
  assert.equal((await registry.get(first.source.source_id)).origin,'https://vendor-one.com');
  assert.equal((await registry.due({nowMs:now})).length,0);
  assert.equal(await registry.claim({nowMs:now}),null);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM foundry_source_policy_events').first()).n,1);
  assert.equal((await db.prepare('SELECT id FROM studio_fixture').first()).id,'preserve');
});
test('policy activation is audited, and pause invalidates outstanding leases',async t=>{
  const {db,registry}=setup(t);
  const {source}=await registry.register('https://vendor-one.com',{},now);
  await registry.setPolicy(source.source_id,active,now+1);
  const lease=await registry.claim({nowMs:now+2}); assert.ok(lease);
  await registry.setPolicy(source.source_id,{status:'paused',note:'Opt-out review'},now+3);
  assert.equal(await registry.release(source.source_id,lease.lease_token,{nowMs:now+4}),false);
  assert.equal(await registry.claim({nowMs:now+4}),null);
  const events=await db.prepare('SELECT policy_revision,status FROM foundry_source_policy_events ORDER BY policy_revision').all();
  assert.deepEqual(events.results.map(e=>e.status),['pending','active','paused']);
  await assert.rejects(()=>registry.setPolicy(source.source_id,active,now),/timestamp/);
});
test('atomic lease ownership, expiry and stale-worker protection',async t=>{
  const {registry}=setup(t);
  const {source}=await registry.register('https://vendor-one.com',active,now);
  const [a,b]=await Promise.all([registry.claim({nowMs:now,leaseSeconds:10}),registry.claim({nowMs:now,leaseSeconds:10})]);
  assert.ok(a); assert.equal(b,null);
  assert.equal((await registry.due({nowMs:now+1})).length,0);
  const newer=await registry.claim({nowMs:now+10_000,leaseSeconds:10}); assert.ok(newer);
  assert.notEqual(a.lease_token,newer.lease_token);
  assert.equal(await registry.release(source.source_id,a.lease_token,{nowMs:now+10_001}),false);
  assert.equal(await registry.release(source.source_id,newer.lease_token,{nowMs:now+10_002}),true);
  assert.equal(await registry.claim({nowMs:now+10_003}),null);
  assert.equal((await registry.due({nowMs:now+10_002+86_400_000})).length,1);
});
test('expired lease cannot release without reclaiming',async t=>{
  const {registry}=setup(t);
  const {source}=await registry.register('https://vendor-one.com',active,now);
  const lease=await registry.claim({nowMs:now,leaseSeconds:10});
  assert.equal(await registry.release(source.source_id,lease.lease_token,{nowMs:now+10_000}),false);
});
test('source list is bounded and excludes lease credentials',async t=>{
  const {registry}=setup(t);
  await registry.register('https://vendor-one.com',active,now); await registry.register('https://vendor-two.com',active,now);
  await registry.claim({nowMs:now});
  const first=await registry.list({limit:1}), next=await registry.list({limit:1,after:first[0].source_id});
  assert.equal(next.length,1); assert.notEqual(next[0].source_id,first[0].source_id);
  assert.equal('lease_token' in first[0],false);
  await assert.rejects(()=>registry.list({limit:1000}));
  await assert.rejects(()=>registry.get("'; DROP TABLE foundry_sources; --"));
});
test('transaction failure rolls back prior statements',async t=>{
  const {db}=setup(t);
  db.exec('CREATE TABLE transaction_probe (id INTEGER PRIMARY KEY)');
  await assert.rejects(()=>db.batch([db.prepare('INSERT INTO transaction_probe VALUES (1)'),db.prepare('INSERT INTO transaction_probe VALUES (1)')]));
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM transaction_probe').first()).n,0);
});

test('registered source survives a database close and reopen',async t=>{
  const {mkdtempSync,rmSync}=await import('node:fs');
  const {tmpdir}=await import('node:os');
  const {join}=await import('node:path');
  const dir=mkdtempSync(join(tmpdir(),'datagraphs-registry-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const file=join(dir,'registry.sqlite');
  const first=localDatabase(file);first.exec(migration);
  const {source}=await new SourceRegistry(first).register('https://vendor-one.com',{},now);first.close();
  const second=localDatabase(file,{readOnly:true});t.after(()=>second.close());
  assert.equal((await new SourceRegistry(second).get(source.source_id)).origin,'https://vendor-one.com');
  await assert.rejects(()=>new SourceRegistry(second).setPolicy(source.source_id,active,now+1));
});
