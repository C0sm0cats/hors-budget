const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const game=fs.readFileSync('game.js','utf8');
test('KÉKÉ and CHACHA use canonical runtime cast keys',()=>{
  assert.match(game,/CAST=\{keke:/);
  assert.match(game,/,chacha:\{/);
  assert.doesNotMatch(game,/CAST=\{kevin:/);
  assert.doesNotMatch(game,/,charline:\{/);
  assert.doesNotMatch(game,/kind==='kevin'|kind==='charline'|charlineIn|charlineX|kevinX/);
  assert.match(game,/chachaIn/);
  assert.match(game,/person\(moving,'keke'/);
  assert.match(game,/person\(moving,'chacha'/);
});
