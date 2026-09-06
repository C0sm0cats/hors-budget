'use strict';
// Habille les obstacles roulants en cartons de projet ESN sans toucher à leur physique.
(()=>{
  const labels=[['PROJET CRITIQUE','CRA','MIGRATION','URGENT'],['BUDGET','NAO','COMEX','RFP'],['SÉMINAIRE','POWER UP','GOODIES','ROADMAP']];
  const style=document.createElement('style');
  style.textContent='.project-obstacle{position:fixed;z-index:8;width:52px;height:42px;transform:translate(-50%,-68%);pointer-events:none;box-sizing:border-box;border:3px solid #49351f;border-radius:3px;background:#c99a5c;box-shadow:inset 0 0 0 2px #e2bd82,0 5px 8px #07162566;font:900 7px/1 system-ui;color:#392716;text-align:center;letter-spacing:.05em;padding-top:17px}.project-obstacle::before{content:"";position:absolute;left:4px;right:4px;top:8px;border-top:3px solid #75532f}.project-obstacle::after{content:"";position:absolute;left:50%;top:-3px;bottom:0;border-left:3px solid #a97943;transform:translateX(-50%)}.project-obstacle span{position:relative;z-index:1;background:#f1dfb8;padding:2px 3px;white-space:nowrap}.project-obstacle.urgent span{background:#f2a29b;color:#571d18}';
  document.head.append(style);
  const boxes=[];
  const getBox=i=>{if(boxes[i])return boxes[i];const el=document.createElement('div');el.className='project-obstacle';const span=document.createElement('span');el.append(span);document.body.append(el);boxes[i]={el,span,label:''};return boxes[i];};
  function loop(){
    const s=typeof Arcade!=='undefined'?Arcade.state:null,ready=s&&typeof renderer!=='undefined'&&s.phase==='playing',barrels=ready?(s.barrels||[]):[];
    for(let i=0;i<barrels.length;i++){
      const b=barrels[i],box=getBox(i),pool=labels[s.level]||labels[0];
      if(!box.label){box.label=pool[Math.floor(Math.random()*pool.length)];box.span.textContent=box.label;box.el.classList.toggle('urgent',box.label==='URGENT'||box.label==='PROJET CRITIQUE');}
      const y=Number.isFinite(b.y)?b.y:surface(b.floor||0,b.x),p=renderer.project(b.x,y+.62,.12),visible=p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>-60&&p.x<innerWidth+60&&p.y>-60&&p.y<innerHeight+60;
      box.el.hidden=!visible;if(visible){box.el.style.left=p.x+'px';box.el.style.top=p.y+'px';}
    }
    for(let i=barrels.length;i<boxes.length;i++){boxes[i].el.hidden=true;boxes[i].label='';}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
