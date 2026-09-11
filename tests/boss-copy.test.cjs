const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');

test('KPI impacts produce successive replies and pause does not consume them',()=>{
  let frame;
  const s={level:1,levelTime:2,phase:'playing',hitStop:0,player:{floor:4,x:0},hostile:[],floaters:[],score:0};
  const ctx=vm.createContext({Arcade:{state:s},renderer:{},surface:()=>12,requestAnimationFrame:fn=>{frame=fn;},document:{getElementById:()=>null}});
  vm.runInContext(source('tech-services-boss.js'),ctx);
  for(const [i,text] of ['Ce chiffre est sorti de son contexte.','On va revoir la méthode de calcul.','Le reporting ne reflète pas le terrain.'].entries()){
    s.hostile=[{techServicesDirector:true,reflected:true,life:1,x:6}];frame();
    assert.equal(s.bossReaction.text,text);
    assert.equal(s.bossReaction.speaker,'techServicesDirector');
    assert.equal(ctx.TechServicesBoss.state(s).hp,2-i);
    const until=s.bossReaction.until;s.phase='paused';frame();assert.equal(s.bossReaction.until,until);s.phase='playing';
  }
  assert.equal(s.gate,2.6);
});

test('boss reaction has priority, expires on game time and survives the defeat',()=>{
  const nodes=[],banner={textContent:""};
  const element=()=>({hidden:true,textContent:'',dataset:{},style:{removeProperty(){},setProperty(){}},classList:{add(){},contains(){return false;}},getBoundingClientRect(){return {width:200,height:40};}});
  const s={phase:'playing',level:1,levelTime:5,player:{floor:4},enemies:[],comedy:{},bossReaction:{speaker:'techServicesDirector',text:'Le reporting ne reflète pas le terrain.',until:8.5}};
  const ctx=vm.createContext({Arcade:{state:s},renderer:{actorBounds:new Map([['techServicesDirector',{left:490,right:510,top:300,bottom:350}]])},TechServicesBoss:{defeated:()=>true,state:()=>({hp:0})},innerWidth:1200,innerHeight:800,performance:{now:()=>0},document:{body:{classList:{add(){}},append(el){nodes.push(el);}},head:{append(){}},createElement:element,getElementById:()=>banner,querySelectorAll:()=>[]}});
  vm.runInContext(source('banter-fair.js'),ctx);
  ctx.DialoguePresentation.update(1000);
  const reply=nodes.find(n=>n.textContent===s.bossReaction.text);
  assert.ok(reply);assert.equal(reply.hidden,false);
  assert.ok(nodes.filter(n=>!n.hidden).length<=2);
  s.phase='paused';ctx.DialoguePresentation.update(9000);assert.equal(reply.hidden,true);
  s.phase='playing';ctx.DialoguePresentation.update(10000);assert.equal(reply.hidden,false);
  ctx.renderer.actorBounds.set('techServicesDirector',{left:490,right:510,top:10,bottom:60});
  ctx.DialoguePresentation.update(10500);assert.equal(reply.hidden,true);assert.equal(banner.textContent,s.bossReaction.text+' · ACCÈS OUVERT →');
  s.levelTime=9;ctx.DialoguePresentation.update(11000);assert.equal(reply.hidden,true);
});
