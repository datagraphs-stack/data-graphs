import {readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
let count = 0;
async function check(directory) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const path = join(directory,entry.name);
    if (entry.isDirectory()) await check(path);
    else if (entry.isFile() && /\.(?:js|mjs)$/u.test(entry.name)) {
      const result = spawnSync(process.execPath,['--check',path],{stdio:'inherit'});
      if (result.status !== 0) throw new Error(`Syntax check failed: ${path}`);
      count++;
    }
  }
}
for (const directory of ['src','functions','lib','scripts','test']) await check(directory);
console.log(`Syntax checked ${count} JavaScript modules.`);
