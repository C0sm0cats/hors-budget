const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

test('DIRECTEUR RÉGION GRAND OUEST stops ambient refusals immediately after defeat and resumes on a new run',()=>{
  const elements=[],frames=[];
  const element=()=>({hidden:true,style:{removeProperty(key){delete this[key];},setProperty(key,value){this[key]=value;}},dataset:{},className:'',textContent:'',
    classList:{add(){},contains(name){return name==='main-banter';}},append(el){elements.push(el);},
    getBoundingClientRect(){const width=parseFloat(this.style.width)||300,paired=this.style.transform==='none',left=(parseFloat(this.style.left)||0)-(paired?0:width/2),top=(parseFloat(this.style.top)||0)-(paired?0:60);return {left,right:left+width,top,bottom:top+60,width,height:60};}});
  const state=()=>({level:0,phase:'playing',player:{x:0,y:0,floor:0},princess:{x:8,y:12},boss:{x:-8,y:12,hp:3},enemies:[],hostile:[],comedy:{delivery:0},floaters:[],score:0});
  const arcade={state:state()};
  const ctx=vm.createContext({document:{body:element(),head:element(),createElement:element,
    querySelector(){return {getBoundingClientRect(){return {bottom:80};}};},getElementById:element},
    performance:{now:()=>0},innerWidth:1366,innerHeight:768,Arcade:arcade,
    renderer:{project:(x,y)=>({x:680+x*40,y:600-y*30})},surface:floor=>floor*3,
    requestAnimationFrame:fn=>frames.push(fn)});
  for(const file of ['banter-fair.js','tech-services-boss.js'])vm.runInContext(readFileSync(join(__dirname,'..',file),'utf8'),ctx);
  const tick=now=>{const pending=frames.splice(0);pending.forEach(fn=>fn(now));};
  const bubble=elements.find(el=>el.dataset.speaker==='DIRECTEUR RÉGION GRAND OUEST');
  arcade.state.level=2;tick(0);tick(8000);
  assert.equal(bubble.hidden,false);
  arcade.state.boss.hp=0;tick(8100);
  assert.equal(bubble.hidden,true);
  tick(30000);assert.equal(bubble.hidden,true);
  arcade.state=state();arcade.state.level=2;tick(31000);tick(39000);
  assert.equal(bubble.hidden,false);
});
