import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('homepage describes the foundry without claiming a launched market dataset',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html,/living data graphs/);
  assert.match(html,/not a launched dataset/);
  assert.match(html,/href="\/lab\/"/);
  assert.doesNotMatch(html,/id="app"/);
});
test('Lab preserves the original Studio bootstrap',()=>{
  const html=readFileSync(new URL('../lab/index.html',import.meta.url),'utf8');
  assert.match(html,/id="app"/); assert.match(html,/src="\/src\/app.js"/); assert.match(html,/href="\/src\/style.css"/);
});
test('Lab and existing share routes precede the Pages fallback',()=>{
  const lines=readFileSync(new URL('../public/_redirects',import.meta.url),'utf8').trim().split('\n');
  assert.ok(lines.indexOf('/g/* /lab/index.html 200')<lines.indexOf('/* /index.html 200'));
  assert.ok(lines.includes('/lab/* /lab/index.html 200'));
  assert.ok(lines.includes('/lab /lab/ 301'));
});
