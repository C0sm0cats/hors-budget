const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

test('Julien uses the visible main dialogue channel only while alive on level two',()=>{
  const elements=[],frames=[];
  const element=()=>({hidden:true,style:{},dataset:{},className:'',textContent:'',
    classList:{add(){}},append(el){elements.push(el);},
    getBoundingClientRect(){const width=parseFloat(this.style.width)||300,paired=this.style.transform==='none',left=(parseFloat(this.style.left)||0)-(paired?0:width/2),top=(parseFloat(this.style.top)||0)-(paired?0:60);return {left,right:left+width,top,bottom:top+60,width,height:60};}});
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
  const charline=elements.find(el=>el.className.split(' ').includes('charline'));
  tick(7500);
  for(const width of [1366,390,1920]){
    ctx.innerWidth=width;
    ctx.renderer.project=(x,y)=>({x:width/2+x*(width<500?8:40),y:600-y*30});
    tick(7600);
    assert.equal(bubble.hidden,false);assert.equal(charline.hidden,false);
    assert.equal(bubble.dataset.paired,'true');assert.equal(charline.dataset.paired,'true');
    const j=bubble.getBoundingClientRect(),c=charline.getBoundingClientRect();
    assert.ok(j.right+8<=c.left,'both speakers need separate space');
    assert.ok(j.left>=0&&c.right<=width);assert.equal(j.top,c.top);
  }
  // Reproduce Kevin beside Charline at the upper-right edge (without Julien).
  const kevin=elements.find(el=>el.className.split(' ').includes('kevin'));
  arcade.state.level=0;arcade.state.player.x=6;ctx.innerWidth=1366;
  ctx.renderer.project=x=>({x:900+x*16,y:69});
  let stable=null;
  for(let frame=0;frame<120;frame++){
    tick(8000+frame);
    assert.equal(charline.hidden,false);assert.equal(kevin.hidden,false);
    const c=charline.getBoundingClientRect(),k=kevin.getBoundingClientRect();
    assert.ok(c.left>=k.right+8||c.right<=k.left-8||c.top>=k.bottom+8||c.bottom<=k.top-8);
    const layout=JSON.stringify(c);if(stable!==null)assert.equal(layout,stable,'stationary bubbles must not flicker');stable=layout;
  }
  arcade.state.level=1;arcade.state.player.x=0;
  ctx.renderer.project=(x,y)=>({x:680+x*40,y:600-y*30});
  tick(30000);assert.notEqual(bubble.textContent,first);
  ctx.JulienBoss.state(arcade.state).hp=0;tick(30100);assert.equal(bubble.hidden,true);
  arcade.state=state();arcade.state.level=1;tick(31000);tick(32300);assert.equal(bubble.hidden,false);
  arcade.state.level=2;tick(32400);assert.equal(bubble.hidden,true);
});
