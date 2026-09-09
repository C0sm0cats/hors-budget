const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const game=fs.readFileSync('game.js','utf8');
test('main cast uses role-based runtime keys',()=>{
  assert.match(game,/CAST=\{projectDirector:/);
  assert.match(game,/,businessManager:\{/);
  assert.match(game,/CAST\.techServicesDirector=\{/);
  assert.match(game,/,regionalDirector:\{/);
  assert.match(game,/person\(moving,'projectDirector'/);
  assert.match(game,/person\(moving,'businessManager'/);
  assert.match(game,/person\(moving,'techServicesDirector'/);
  assert.match(game,/person\(moving,'regionalDirector'/);
});
