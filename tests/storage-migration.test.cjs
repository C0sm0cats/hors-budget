const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const source=readFileSync('game.js','utf8').split('function soundFX')[0];
const current='hors-budget.arcade.v1',legacy='mutine.kevin.arcade.v3';
function load(entries,failWrite=false,failRemove=false){
  const data=new Map(Object.entries(entries));
  const ctx=vm.createContext({document:{getElementById:()=>({})},localStorage:{
    getItem:key=>data.get(key)??null,
    setItem(key,value){if(failWrite)throw Error('quota');data.set(key,value);},
    removeItem(key){if(failRemove)throw Error('blocked');data.delete(key);}
  }});
  vm.runInContext(source,ctx);
  return {data,read:code=>vm.runInContext(code,ctx)};
}
test('migrates the legacy record once and preserves career data',()=>{
  const saved=JSON.stringify({score:1234,career:{times:[22],medals:['OR'],challenges:['Sans PowerPoint']}});
  const g=load({[legacy]:saved});
  assert.equal(g.read('record'),1234);
  assert.equal(g.read('career.times[0]'),22);
  assert.equal(g.read('career.challenges[0]'),'Sans PowerPoint');
  assert.equal(g.data.get(current),saved);assert.equal(g.data.has(legacy),false);
});
test('canonical save takes precedence over the legacy record',()=>{
  const g=load({[current]:'{"score":0}',[legacy]:'{"score":999}'});
  assert.equal(g.read('record'),0);
});
for(const operation of ['write','remove'])test(`migration ${operation} failure preserves the readable record in memory`,()=>{
  const g=load({[legacy]:'{"score":1234}'},operation==='write',operation==='remove');
  assert.equal(g.read('record'),1234);
  assert.equal(g.data.has(legacy),true);
  assert.equal(g.read('canSave'),false);
});
test('malformed challenges do not disable saving valid record fields',()=>{
  const g=load({[current]:'{"score":42,"career":{"times":[20],"challenges":"invalid"}}'});
  assert.equal(g.read('record'),42);assert.equal(g.read('career.times[0]'),20);
  assert.equal(g.read('career.challenges.length'),0);assert.equal(g.read('canSave'),true);
  g.read('saveRecord(50)');assert.equal(JSON.parse(g.data.get(current)).score,50);
});
test('invalid JSON leaves defaults and does not delete the legacy save',()=>{
  const g=load({[legacy]:'invalid'});
  assert.equal(g.read('record'),0);assert.equal(g.data.has(legacy),true);
});
