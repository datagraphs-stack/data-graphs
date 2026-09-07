import {canonicalJson,sha256Hex} from '../../../src/identity.js';
import {validateDataGraph} from '../../../src/datagraph.js';

const MAX_ENVELOPE_BYTES=1_000_000;
const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store',...headers}});
const routeId=params=>Array.isArray(params.id)?params.id.join('/'):params.id;

export async function onRequest(context){
  try{
    if(context.request.method==='POST'&&!routeId(context.params))return createGraph(context);
    const id=routeId(context.params);
    if(!id?.startsWith('dg_'))return json({error:'Invalid DataGraph ID.'},400);
    if(context.request.method==='GET')return readGraph(context,id);
    if(context.request.method==='PUT')return updateGraph(context,id);
    if(context.request.method==='DELETE')return deleteGraph(context,id);
    return json({error:'Method not allowed.'},405,{allow:'GET, POST, PUT, DELETE'});
  }catch{return json({error:'Persistence request failed.'},500);}
}

async function readEnvelope(request){
  const declared=Number(request.headers.get('content-length')||0);
  if(declared>MAX_ENVELOPE_BYTES)throw new RequestError('DataGraph exceeds the 1 MB proof limit.',413);
  let graph;try{graph=await request.json();}catch{throw new RequestError('Request body must be JSON.',400);}
  const bytes=new TextEncoder().encode(JSON.stringify(graph)).byteLength;
  if(bytes>MAX_ENVELOPE_BYTES)throw new RequestError('DataGraph exceeds the 1 MB proof limit.',413);
  const validation=await validateDataGraph(graph);
  if(!validation.valid)throw new RequestError('DataGraph validation failed.',422,validation.errors);
  return graph;
}

async function createGraph({request,env}){
  try{
    const graph=await readEnvelope(request),existing=await env.DB.prepare('SELECT id FROM datagraphs WHERE id = ?').bind(graph.dataGraphId).first();
    if(existing)return json({error:'DataGraph already exists.'},409);
    const writeToken=token(),writeTokenHash=await sha256Hex(writeToken),now=new Date().toISOString();
    await env.DB.prepare('INSERT INTO datagraphs (id, envelope, write_token_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').bind(graph.dataGraphId,JSON.stringify(graph),writeTokenHash,now,now).run();
    return json({dataGraphId:graph.dataGraphId,writeToken,path:`/g/${graph.dataGraphId}`},201);
  }catch(error){return requestError(error);}
}

async function readGraph({env},id){const row=await env.DB.prepare('SELECT envelope FROM datagraphs WHERE id = ?').bind(id).first();return row?json({dataGraph:JSON.parse(row.envelope)}):json({error:'DataGraph not found.'},404);}

async function updateGraph({request,env},id){
  try{
    const row=await env.DB.prepare('SELECT envelope, write_token_hash FROM datagraphs WHERE id = ?').bind(id).first();
    if(!row)return json({error:'DataGraph not found.'},404);
    if(!await authorized(request,row.write_token_hash))return json({error:'Write authorization required.'},403);
    const graph=await readEnvelope(request);if(graph.dataGraphId!==id)throw new RequestError('Route and DataGraph IDs differ.',409);
    const stored=JSON.parse(row.envelope);
    if(canonicalJson(stored.source)!==canonicalJson(graph.source)||canonicalJson(stored.semantics)!==canonicalJson(graph.semantics)||stored.semanticsHash!==graph.semanticsHash)throw new RequestError('Stored source and semantics are immutable.',409);
    if(graph.revisions.length<stored.revisions.length||stored.revisions.some((revision,index)=>canonicalJson(revision)!==canonicalJson(graph.revisions[index])))throw new RequestError('Stored revision history is immutable.',409);
    await env.DB.prepare('UPDATE datagraphs SET envelope = ?, updated_at = ? WHERE id = ?').bind(JSON.stringify(graph),new Date().toISOString(),id).run();
    return json({dataGraphId:id,path:`/g/${id}`,revisionCount:graph.revisions.length});
  }catch(error){return requestError(error);}
}

async function deleteGraph({request,env},id){const row=await env.DB.prepare('SELECT write_token_hash FROM datagraphs WHERE id = ?').bind(id).first();if(!row)return json({error:'DataGraph not found.'},404);if(!await authorized(request,row.write_token_hash))return json({error:'Write authorization required.'},403);await env.DB.prepare('DELETE FROM datagraphs WHERE id = ?').bind(id).run();return new Response(null,{status:204});}
async function authorized(request,hash){const value=request.headers.get('authorization')||'',provided=value.startsWith('Bearer ')?value.slice(7):'';return provided&&await sha256Hex(provided)===hash;}
function token(){const bytes=crypto.getRandomValues(new Uint8Array(32));return [...bytes].map(byte=>byte.toString(16).padStart(2,'0')).join('');}
function requestError(error){return error instanceof RequestError?json({error:error.message,details:error.details},error.status):json({error:'Persistence request failed.'},500);}
class RequestError extends Error{constructor(message,status,details){super(message);this.status=status;this.details=details;}}
