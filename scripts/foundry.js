import {readFile, stat} from 'node:fs/promises';
import {validateMission} from '../lib/foundry/policy.js';
import {SourceRegistry} from '../lib/foundry/registry.js';
import {localDatabase} from '../lib/foundry/local-db.js';

// Development CLI only. It never fetches a URL or connects to Cloudflare.
const [command, input, databasePath, ...extra] = process.argv.slice(2);
let db;
try {
  if (extra.length || !['validate','register','inspect'].includes(command) || !input || (command === 'register' ? !databasePath : databasePath)) throw new Error('Usage: node scripts/foundry.js validate <mission.json> | register <mission.json> <local.sqlite> | inspect <local.sqlite>');
  if (command === 'inspect') {
    db = localDatabase(input, {readOnly:true});
    const registry = new SourceRegistry(db);
    console.log(JSON.stringify({mode:'local-only',sources:await registry.list(),due:await registry.due()}, null, 2));
  } else {
    if ((await stat(input)).size > 1_000_000) throw new Error('Mission file exceeds 1 MB');
    const mission = validateMission(JSON.parse(await readFile(input,'utf8')));
    if (command === 'validate') console.log(JSON.stringify({valid:true,mission},null,2));
    else {
      db = localDatabase(databasePath);
      db.exec(await readFile(new URL('../migrations/0003_foundry_registry.sql',import.meta.url),'utf8'));
      const registry = new SourceRegistry(db), receipts = [];
      for (const origin of mission.sources) receipts.push(await registry.register(origin));
      console.log(JSON.stringify({mode:'local-only',missionId:mission.id,created:receipts.filter(r=>r.created).length,sources:receipts.map(r=>r.source),acquisition:'disabled; sources are pending policy review'},null,2));
    }
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { db?.close(); }
