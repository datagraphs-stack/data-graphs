import {base64ToBytes,bytesToBase64,canonicalJson,contentHash,sha256Hex} from './identity.js';
import {executePlan,parseCsv,profileDataset} from './engine.js';

export const DATAGRAPH_SCHEMA_VERSION=1;
export const PROFILE_VERSION=1;

export async function createDataGraph({sourceBytes,originalFilename,profile,semantics,question,interpretation,plan,output,createdAt=new Date().toISOString(),dataGraphId=`dg_${crypto.randomUUID()}`}){
  const sourceHash=await sha256Hex(sourceBytes),profileHash=await contentHash(profile),semanticsHash=await contentHash(semantics);
  const source={sourceId:`src_${sourceHash}`,originalFilename,byteLength:sourceBytes.byteLength,sha256:sourceHash,rowCount:profile.rowCount,profileVersion:PROFILE_VERSION,profileHash,profile:structuredClone(profile),contentEncoding:'base64',content:bytesToBase64(sourceBytes)};
  const graph={schemaVersion:DATAGRAPH_SCHEMA_VERSION,dataGraphId,source,semanticsHash,semantics:structuredClone(semantics),revisions:[]};
  return appendRevision(graph,{question,interpretation,plan,output,createdAt});
}

export async function appendRevision(graph,{question,interpretation,plan,output,createdAt=new Date().toISOString(),revisionId=`rev_${crypto.randomUUID()}`}){
  const parent=graph.revisions.at(-1),parentRevisionId=parent?.revisionId??null,parentContentHash=parent?.contentHash??null;
  const resultHash=await contentHash(output.rows);
  const revisionContent={parentContentHash,sourceId:graph.source.sourceId,semanticsHash:graph.semanticsHash,semanticVersion:graph.semantics.version,question,interpretation:structuredClone(interpretation),validatedPlan:structuredClone(plan),planVersion:plan.version,executionTrace:structuredClone(output.evidence.trace),engineVersion:output.evidence.engineVersion,result:{rows:structuredClone(output.rows),sha256:resultHash},visualization:structuredClone(plan.visualization),warnings:structuredClone(output.evidence.warnings)};
  const revisionHash=await contentHash(revisionContent);
  const revision={revisionId,parentRevisionId,contentHash:revisionHash,createdAt,...revisionContent};
  return deepFreeze({...structuredClone(graph),revisions:[...structuredClone(graph.revisions),revision]});
}

export function serializeDataGraph(graph){return JSON.stringify(graph);}
export function deserializeDataGraph(serialized){return JSON.parse(serialized);}

export async function validateDataGraph(graph){
  const errors=[];
  if(!graph||graph.schemaVersion!==DATAGRAPH_SCHEMA_VERSION)errors.push(`Unsupported DataGraph schema version: ${String(graph?.schemaVersion)}`);
  if(typeof graph?.dataGraphId!=='string'||!graph.dataGraphId.startsWith('dg_'))errors.push('Invalid DataGraph entity identity.');
  if(!graph?.semantics||await contentHash(graph.semantics)!==graph.semanticsHash)errors.push('Semantic context hash mismatch.');
  let sourceBytes;
  try{if(graph.source.contentEncoding!=='base64')throw new Error();sourceBytes=base64ToBytes(graph.source.content);if(await sha256Hex(sourceBytes)!==graph.source.sha256)errors.push('Source content hash mismatch.');if(sourceBytes.byteLength!==graph.source.byteLength)errors.push('Source byte length mismatch.');if(graph.source.sourceId!==`src_${graph.source.sha256}`)errors.push('Source identity mismatch.');if(await contentHash(graph.source.profile)!==graph.source.profileHash)errors.push('Source profile hash mismatch.');const parsedRows=parseCsv(new TextDecoder('utf-8',{fatal:true}).decode(sourceBytes)),actualProfile=profileDataset(parsedRows);if(await contentHash(actualProfile)!==await contentHash(graph.source.profile)||parsedRows.length!==graph.source.rowCount)errors.push('Source profile does not match source bytes.');}catch{errors.push('Invalid source artifact.');}
  const revisions=Array.isArray(graph?.revisions)?graph.revisions:[];
  if(!Array.isArray(graph?.revisions))errors.push('DataGraph revisions must be an array.');
  for(let index=0;index<revisions.length;index++){
    const revision=revisions[index];if(!revision||typeof revision!=='object'){errors.push(`Revision ${index+1} is invalid.`);continue;}
    try{const {revisionId,parentRevisionId,contentHash:storedHash,createdAt,...content}=revision,expectedParent=index?revisions[index-1]:null;if(parentRevisionId!==(expectedParent?.revisionId??null)||content.parentContentHash!==(expectedParent?.contentHash??null))errors.push(`Revision ${index+1} parent mismatch.`);const actualHash=await contentHash(content);if(typeof revisionId!=='string'||!revisionId.startsWith('rev_'))errors.push(`Revision ${index+1} identity is invalid.`);if(actualHash!==storedHash)errors.push(`Revision ${index+1} content hash mismatch.`);if(!Array.isArray(content.result?.rows)||await contentHash(content.result.rows)!==content.result.sha256)errors.push(`Revision ${index+1} result hash mismatch.`);}catch{errors.push(`Revision ${index+1} is invalid.`);}
  }
  if(!revisions.length)errors.push('DataGraph must contain at least one revision.');
  return {valid:errors.length===0,errors,sourceBytes};
}

export async function recomputeRevision(graph,revisionId){
  const validation=await validateDataGraph(graph);
  if(!validation.valid)throw new Error(validation.errors.join(' '));
  const revision=graph.revisions.find(item=>item.revisionId===revisionId);
  if(!revision)throw new Error('Unknown revision.');
  const sourceText=new TextDecoder('utf-8',{fatal:true}).decode(validation.sourceBytes),rows=parseCsv(sourceText),profile=profileDataset(rows),output=executePlan(rows,revision.validatedPlan,profile,graph.semantics),resultHash=await contentHash(output.rows);
  const traceMatches=canonicalJson(output.evidence.trace)===canonicalJson(revision.executionTrace);
  return {matches:resultHash===revision.result.sha256&&traceMatches,traceMatches,output,resultHash,storedResultHash:revision.result.sha256};
}

function deepFreeze(value){if(value&&typeof value==='object'){Object.freeze(value);for(const child of Object.values(value))deepFreeze(child);}return value;}
