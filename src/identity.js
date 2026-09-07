export function canonicalJson(value){return JSON.stringify(normalize(value));}

function normalize(value){
  if(Array.isArray(value))return value.map(normalize);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(key=>value[key]!==undefined).map(key=>[key,normalize(value[key])]));
  if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Content identity cannot include a non-finite number.');
  return value;
}

export async function sha256Hex(value){
  const bytes=typeof value==='string'?new TextEncoder().encode(value):value;
  if(!(bytes instanceof Uint8Array))throw new Error('SHA-256 input must be a string or Uint8Array.');
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}

export async function contentHash(value){return sha256Hex(canonicalJson(value));}

export function bytesToBase64(bytes){let binary='';for(let offset=0;offset<bytes.length;offset+=0x8000)binary+=String.fromCharCode(...bytes.subarray(offset,offset+0x8000));return btoa(binary);}
export function base64ToBytes(value){const binary=atob(value),bytes=new Uint8Array(binary.length);for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);return bytes;}
