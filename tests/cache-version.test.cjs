const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');

test('cleanup overlay is cache-busted and never reads comedy applause unsafely',()=>{
  const html=readFileSync(join(__dirname,'../index.html'),'utf8');
  const cleanup=readFileSync(join(__dirname,'../cleanup.js'),'utf8');
  assert.ok(html.includes('cleanup.js?v=10'));
  assert.equal(cleanup.includes('Arcade.state.comedy.applause'),false);
  assert.equal(cleanup.includes('s.comedy.applause'),false);
  assert.ok(cleanup.includes('s.comedy?.miracle'));
});
