const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
function setup(){
  const frames=[];
  const s={level:1,levelTime:0,phase:'playing',player:{floor:4,x:0},hostile:[],floaters:[],score:0,comedy:{miracle:0},hitStop:0};
  const ctx=vm.createContext({Arcade:{state:s},renderer:{},surface:()=>12,
    performance:{now:()=>0},document:{getElementById:()=>({})},requestAnimationFrame:fn=>frames.push(fn)});
  vm.runInContext(readFileSync('tech-services-boss.js','utf8'),ctx);
  const tick=(wallTime,gameTime=s.levelTime)=>{s.levelTime=gameTime;frames.shift()(wallTime);};
  tick(0);
  return {s,tick,boss:ctx.TechServicesBoss.state(s)};
}
test('DIRECTEUR TECHNOLOGIES SERVICES attack cooldown advances only with gameplay time, including after pause',()=>{
  const {s,tick}=setup();
  tick(1000,1);assert.equal(s.hostile.length,0);
  s.phase='paused';tick(20000);
  s.phase='playing';tick(20001);assert.equal(s.hostile.length,0);
  tick(20801,1.81);assert.equal(s.hostile.length,1);
});
for(const freeze of ['miracle','hitStop'])test(`DIRECTEUR TECHNOLOGIES SERVICES does not attack or take damage during ${freeze}`,()=>{
  const {s,tick,boss}=setup();
  if(freeze==='miracle')s.comedy.miracle=2;else s.hitStop=.1;
  s.hostile.push({techServicesDirector:true,reflected:true,life:2,x:5.35});
  tick(10000);assert.equal(boss.hp,3);assert.equal(s.hostile.length,1);
  s.comedy.miracle=0;s.hitStop=0;tick(10001,.01);
  assert.equal(boss.hp,2);assert.equal(s.hostile.length,1);
});
test('DIRECTEUR TECHNOLOGIES SERVICES telegraphs before releasing a KPI and preserves the warning during pause',()=>{
  const {s,tick,boss}=setup();tick(1300,1.3);
  assert.equal(boss.preparing,true);assert.equal(s.hostile.length,0);
  s.phase='paused';tick(9000);assert.equal(boss.preparing,true);
  s.phase='playing';tick(9500,1.81);assert.equal(boss.preparing,false);assert.equal(s.hostile.length,1);
});
test('approaching DIRECTEUR TECHNOLOGIES SERVICES after waiting below still gives a warning window',()=>{
  const {s,tick,boss}=setup();s.player.floor=0;tick(10000,10);
  s.player.floor=3;tick(10010,10.01);assert.equal(boss.preparing,true);assert.equal(s.hostile.length,0);
  tick(10620,10.62);assert.equal(s.hostile.length,1);
});
