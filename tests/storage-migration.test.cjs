const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const game=fs.readFileSync('game.js','utf8');
const index=fs.readFileSync('index.html','utf8');
test('save storage uses canonical key with legacy migration',()=>{
  assert.match(game,/STORAGE='hors-budget\.arcade\.v1'/);
  assert.match(game,/LEGACY_STORAGE='mutine\.kevin\.arcade\.v3'/);
  assert.match(game,/stored\|\|legacy/);
  assert.match(game,/localStorage\.setItem\(STORAGE,legacy\)/);
  assert.match(index,/game\.js\?v=44/);
});
