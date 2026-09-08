const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {join}=require('node:path');
test('legacy runtime patch layers are gone and canonical assets are cache-busted',()=>{
  const root=join(__dirname,'..'),html=readFileSync(join(root,'index.html'),'utf8');
  assert.ok(html.includes('game.js?v=43'));assert.ok(html.includes('polish.js?v=26'));assert.ok(html.includes('polish.css?v=18'));assert.equal(html.includes('roles-polish.js'),false);assert.equal(html.includes('<style>.rodolphe-glasses'),false);
  assert.ok(html.includes('<link rel="icon" href="data:,">'));
  assert.equal(html.includes('cleanup.js'),false);assert.equal(html.includes('main-dialogue-cleanup.js'),false);
  assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);assert.equal(existsSync(join(root,'roles-polish.js')),false);
});
