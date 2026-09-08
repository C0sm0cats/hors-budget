const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
function game(){
  const elements=new Map(),storage=new Map();
  const element=()=>({dataset:{},classList:{toggle(){}},setAttribute(){},focus(){},replaceChildren(){},append(){}});
  const ctx=vm.createContext({document:{body:element(),createElement:element,getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);}},localStorage:{getItem:()=>null,setItem:(k,v)=>storage.set(k,v)}});
  vm.runInContext(readFileSync('game.js','utf8').split('function createRenderer(){')[0],ctx);
  const run=code=>vm.runInContext(code,ctx);
  run(`renderer={rebuild(){}};sound=false;Arcade.start();
    const s=Arcade.state;s.lives=1;s.score=100;s.player.invulnerable=0;
    s.enemies=[];s.pickups=[];s.obstacleIn=999;s.gagIn=999;s.spawnIn=999;
    s.hostile=[{x:s.player.x,y:s.player.y+.8,vx:0,life:1}];`);
  return {run,elements,storage};
}
for(const effect of ['slides','reflected dossier'])test(`fatal damage ends scoring before a pending ${effect}`,()=>{
  const g=game();
  if(effect==='slides')g.run(`s.slideTime=1;s.slideTick=0;Math.random=()=>.5;s.barrels=[{x:0,y:1}];`);
  else g.run(`s.boss.active=true;s.boss.open=true;s.boss.clock=2;s.boss.cycle=0;s.hostile.push({kind:'boss',reflected:true,x:s.boss.x,y:s.boss.y+1,vx:0,life:1});`);
  g.run('Arcade.physics(1/90)');
  assert.equal(g.run('s.phase'),'lost');
  assert.equal(g.run('s.score'),100);
  assert.equal(g.elements.get('endScore').textContent,'100');
  assert.equal(JSON.parse(g.storage.get('hors-budget.arcade.v1')).score,100);
  if(effect==='reflected dossier')assert.equal(g.run('s.boss.hp'),3);
});
