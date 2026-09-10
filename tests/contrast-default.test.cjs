const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const index=fs.readFileSync('index.html','utf8');
const polish=fs.readFileSync('polish.js','utf8');
const css=fs.readFileSync('polish.css','utf8');

test('enhanced contrast is the native permanent theme and has no mode marker or toggle',()=>{
  assert.match(index,/<body data-phase="title">/);
  assert.doesNotMatch(index,/high-contrast|id="contrastButton"/);
  assert.doesNotMatch(polish,/contrastButton|high-contrast/);
  assert.doesNotMatch(css,/\.high-contrast/);
  assert.match(css,/body\{filter:contrast\(1\.18\) saturate\(1\.08\)\}/);
  assert.match(index,/polish\.css\?v=23/);
  assert.match(index,/banter-fair\.js\?v=27/);
});
