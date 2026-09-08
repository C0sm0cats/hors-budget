const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const index=fs.readFileSync('index.html','utf8');
const readme=fs.readFileSync('README.md','utf8');
test('public metadata describes the current multi-file game coherently',()=>{
  assert.match(index,/<meta name="description" content="[^"]+">/);
  assert.match(index,/<link rel="canonical" href="https:\/\/c0sm0cats\.github\.io\/hors-budget\/">/);
  assert.match(readme,/HTML, CSS, JavaScript, assets graphiques/);
  assert.match(readme,/game\.js.*moteur canonique/);
  assert.doesNotMatch(readme,/un seul fichier HTML/);
});
