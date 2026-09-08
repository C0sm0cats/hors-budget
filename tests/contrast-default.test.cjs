const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const index=fs.readFileSync('index.html','utf8');
const polish=fs.readFileSync('polish.js','utf8');

test('enhanced contrast is the permanent default and has no toggle',()=>{
  assert.match(index,/<body class="high-contrast" data-phase="title">/);
  assert.doesNotMatch(index,/id="contrastButton"/);
  assert.doesNotMatch(polish,/contrastButton/);
  assert.match(index,/polish\.js\?v=26/);
});
