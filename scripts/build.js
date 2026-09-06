import {cp,rm,mkdir} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist/src',{recursive:true});
await Promise.all([cp('index.html','dist/index.html'),cp('src','dist/src',{recursive:true}),cp('public','dist',{recursive:true})]);
console.log('Built static application in dist/');
