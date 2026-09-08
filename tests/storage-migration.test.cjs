const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const game=fs.readFileSync('game.js','utf8');
test('migrates legacy storage once without changing the canonical key',()=>{
  assert.match(game,/const STORAGE='hors-budget\.arcade\.v1',LEGACY_STORAGE='mutine\.kevin\.arcade\.v3'/);
  assert.match(game,/legacy=stored===null\?localStorage\.getItem\(LEGACY_STORAGE\):null/);
  assert.match(game,/localStorage\.setItem\(STORAGE,legacy\)/);
  assert.match(game,/localStorage\.removeItem\(LEGACY_STORAGE\)/);
});
