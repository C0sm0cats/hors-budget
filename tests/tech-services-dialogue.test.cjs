const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

test('DIRECTEUR TECHNOLOGIES SERVICES uses the visible main dialogue channel only while alive on level two',()=>{
  const elements=[],frames=[];
  const element=()=>({hidden:true,style:{removeProperty(key){delete this[key];},setProperty(key,value){this[key]=value;}},dataset:{},className:'',textContent:'',
    classList:{add(){},contains(name){return name==='main-banter';}},append(el){elements.push(el);},
    getBoundingClientRect(){const width=parseFloat(this.style.width)||300,paired=this.style.transform==='none',left=(parseFloat(this.style.left)||0)-(paired?0:width/2),top=(parseFloat(this.style.top)||0)-(paired?0:60);return {left,right:left+width,top,bottom:top+60,width,height:60};}});
  const state=()=>({level:0,phase:'playing',player:{x:0,y:0,floor:0},princess:{x:8,y:12},boss:{x:-8,y:12},enemies:[],hostile:[],comedy:{delivery:0},floaters:[],score:0});
  const arcade={state:state()};
  const ctx=vm.createContext({document:{body:element(),head:element(),createElement:element,
    querySelector(){return {getBoundingClientRect(){return {bottom:80};}};},getElementById:element},
    performance:{now:()=>0},innerWidth:1366,innerHeight:768,Arcade:arcade,
    renderer:{actorBounds:new Map([['techServicesDirector',{left:880,right:920,top:240,bottom:300}],['regionalDirector',{left:340,right:380,top:240,bottom:300}],['projectDirector',{left:660,right:700,top:540,bottom:600}]]),project:(x,y)=>({x:680+x*40,y:600-y*30})},surface:floor=>floor*3,
    requestAnimationFrame:fn=>frames.push(fn)});
  for(const file of ['banter-fair.js','tech-services-boss.js'])vm.runInContext(readFileSync(join(__dirname,'..',file),'utf8'),ctx);
  const tick=now=>{ctx.DialoguePresentation.update(now);const pending=frames.splice(0);pending.forEach(fn=>fn(now));};
  const bubble=elements.find(el=>el.className.split(' ').includes('techServicesDirector'));
  assert.ok(bubble.className.includes('fair-bubble'),'must pass the CSS visibility filter');
  assert.equal(bubble.dataset.speaker,'DIRECTEUR TECHNOLOGIES SERVICES');
  tick(0);tick(1400);assert.equal(bubble.hidden,true);
  arcade.state=state();arcade.state.level=1;tick(1500);tick(2800);
  assert.equal(bubble.hidden,false);assert.ok(bubble.textContent.length>15);
  const first=bubble.textContent;
  arcade.state.phase='paused';tick(3000);assert.equal(bubble.hidden,true);
  arcade.state.phase='playing';tick(3100);assert.equal(bubble.hidden,false);
  tick(30000);assert.notEqual(bubble.textContent,first);
  ctx.TechServicesBoss.state(arcade.state).hp=0;tick(30100);assert.equal(bubble.hidden,true);
  arcade.state=state();arcade.state.level=1;tick(31000);tick(32300);assert.equal(bubble.hidden,false);
  arcade.state.level=2;tick(32400);assert.equal(bubble.hidden,true);
});
