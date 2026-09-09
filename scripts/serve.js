import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.csv':'text/csv'};
const inside=(base,file)=>file===base||file.startsWith(base+path.sep);
http.createServer(async(req,res)=>{
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname==='/') pathname='/index.html';
    else if(pathname==='/lab'||pathname.startsWith('/lab/')||pathname.startsWith('/g/')) pathname='/lab/index.html';
    let file=path.resolve(root,pathname.slice(1));
    if(!inside(root,file)) throw new Error('Invalid path');
    try {if(!(await stat(file)).isFile()) throw new Error();}
    catch {const publicRoot=path.resolve(root,'public');file=path.resolve(publicRoot,pathname.slice(1));if(!inside(publicRoot,file)||!(await stat(file)).isFile()) throw new Error();}
    res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');
    res.end(await readFile(file));
  } catch {res.statusCode=404;res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('DataGraphs: http://localhost:4173; Lab: http://localhost:4173/lab/'));
