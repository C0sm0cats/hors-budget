'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .julien-whiteboard-note{position:fixed;z-index:12;transform:translate(-50%,-50%) rotate(-1.8deg);pointer-events:none;color:#273c40;font-family:"Comic Sans MS","Bradley Hand",cursive;font-weight:700;text-align:left;line-height:1.05;text-shadow:none;white-space:nowrap}
    .julien-whiteboard-note strong{display:block;font-size:11px;transform:rotate(-1deg)}
    .julien-whiteboard-note span{display:block;font-size:9px;margin-top:3px;color:#8e4b50;transform:rotate(.8deg)}
    .julien-whiteboard-note b{display:block;font-size:10px;margin-top:4px;color:#3e7d54;transform:rotate(-.7deg)}
  `;
  document.head.append(style);
  const note=document.createElement('div');note.className='julien-whiteboard-note';note.innerHTML='<strong>intercontrat ↓</strong><span>12%   9%   6%   3%</span><b>objectif : 0%</b>';note.hidden=true;document.body.append(note);
  function visible(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=innerWidth&&p.y>=0&&p.y<=innerHeight;}
  function loop(){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer||s.level!==1){note.hidden=true;requestAnimationFrame(loop);return;}
    const x=6.05,y=surface(1,x)+1.72,p=renderer.project(x,y,-1.02);
    if(visible(p)){note.style.left=p.x+'px';note.style.top=p.y+'px';note.hidden=false;}else note.hidden=true;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
