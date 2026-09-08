const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
function setup(){
  const frames=[];
  const s={level:1,levelTime:0,phase:'playing',player:{floor:4,x:0},hostile:[],floaters:[],score:0,comedy:{miracle:0},hitStop:0};
  const ctx=vm.createContext({Arcade:{state:s},renderer:{},surface:()=>12,
    performance:{now:()=>0},document:{getElementById:()=>({})},requestAnimationFrame:fn=>frames.push(fn)});
  vm.runInContext(readFileSync('julien-boss.js','utf8'),ctx);
  const tick=(wallTime,gameTime=s.levelTime)=>{s.levelTime=gameTime;frames.shift()(wallTime);};
  tick(0);
  return {s,tick,boss:ctx.JulienBoss.state(s)};
}
test('JUJU attack cooldown advances only with gameplay time, including after pause',()=>{
  const {s,tick}=setup();
  tick(1000,1);assert.equal(s.hostile.length,0);
  s.phase='paused';tick(20000);
  s.phase='playing';tick(20001);assert.equal(s.hostile.length,0);
  tick(20801,1.81);assert.equal(s.hostile.length,1);
});
for(const freeze of ['miracle','hitStop'])test(`JUJU does not attack or take damage during ${freeze}`,()=>{
  const {s,tick,boss}=setup();
  if(freeze==='miracle')s.comedy.miracle=2;else s.hitStop=.1;
  s.hostile.push({julien:true,reflected:true,life:2,x:5.35});
  tick(10000);assert.equal(boss.hp,3);assert.equal(s.hostile.length,1);
  s.comedy.miracle=0;s.hitStop=0;tick(10001,.01);
  assert.equal(boss.hp,2);assert.equal(s.hostile.length,1);
});
