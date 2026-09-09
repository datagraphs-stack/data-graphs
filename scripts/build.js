import {cp,rm,mkdir} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await Promise.all([cp('index.html','dist/index.html'),cp('lab','dist/lab',{recursive:true}),cp('src','dist/src',{recursive:true}),cp('public','dist',{recursive:true})]);
console.log('Built DataGraphs foundry homepage and preserved Studio / Lab in dist/');
