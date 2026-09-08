const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const game=fs.readFileSync('game.js','utf8');
const index=fs.readFileSync('index.html','utf8');
test('canonical runtime cast keys use KÉKÉ and CHACHA naming',()=>{
  assert.match(game,/const CAST=\{keke:/);
  assert.match(game,/,chacha:\{/);
  assert.doesNotMatch(game,/CAST=\{kevin:/);
  assert.doesNotMatch(game,/kind==='kevin'/);
  assert.doesNotMatch(game,/kind==='charline'/);
  assert.doesNotMatch(game,/charlineIn|charlineX|kevinX/);
  assert.match(game,/person\(moving,'keke'/);
  assert.match(game,/person\(moving,'chacha'/);
  assert.match(index,/game\.js\?v=45/);
  assert.match(game,/LEGACY_STORAGE='mutine\.kevin\.arcade\.v3'/);
});
