const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

test('Julien uses the visible main dialogue channel only while alive on level two',()=>{
  const elements=[],frames=[];
  const element=()=>({hidden:true,style:{},dataset:{},className:'',textContent:'',
    classList:{add(){}},append(el){elements.push(el);},
    getBoundingClientRect(){const left=(parseFloat(this.style.left)||0)-150,top=(parseFloat(this.style.top)||0)-60;return {left,right:left+300,top,bottom:top+60,width:300,height:60};}});
  const state=()=>({level:0,phase:'playing',player:{x:0,y:0,floor:0},princess:{x:8,y:12},boss:{x:-8,y:12},enemies:[],hostile:[],comedy:{delivery:0},floaters:[],score:0});
  const arcade={state:state()};
  const ctx=vm.createContext({document:{body:element(),head:element(),createElement:element,
    querySelector(){return {getBoundingClientRect(){return {bottom:80};}};},getElementById:element},
    performance:{now:()=>0},innerWidth:1366,innerHeight:768,Arcade:arcade,
    renderer:{project:(x,y)=>({x:680+x*40,y:600-y*30})},surface:floor=>floor*3,
    requestAnimationFrame:fn=>frames.push(fn)});
  for(const file of ['banter-fair.js','julien-boss.js'])vm.runInContext(readFileSync(join(__dirname,'..',file),'utf8'),ctx);
  const tick=now=>{const pending=frames.splice(0);pending.forEach(fn=>fn(now));};
  const bubble=elements.find(el=>el.className.split(' ').includes('julien'));
  assert.ok(bubble.className.includes('fair-bubble'),'must pass the CSS visibility filter');
  assert.equal(bubble.dataset.speaker,'JULIEN');
  tick(0);tick(1400);assert.equal(bubble.hidden,true);
  arcade.state=state();arcade.state.level=1;tick(1500);tick(2800);
  assert.equal(bubble.hidden,false);assert.ok(bubble.textContent.length>15);
  const first=bubble.textContent;
  arcade.state.phase='paused';tick(3000);assert.equal(bubble.hidden,true);
  arcade.state.phase='playing';tick(3100);assert.equal(bubble.hidden,false);
  tick(30000);assert.notEqual(bubble.textContent,first);
  ctx.JulienBoss.state(arcade.state).hp=0;tick(30100);assert.equal(bubble.hidden,true);
  arcade.state=state();arcade.state.level=1;tick(31000);tick(32300);assert.equal(bubble.hidden,false);
  arcade.state.level=2;tick(32400);assert.equal(bubble.hidden,true);
});
