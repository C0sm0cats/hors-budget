'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent='.rodolphe-safe{position:fixed;z-index:4;width:62px;height:70px;transform:translate(-50%,-50%);pointer-events:none;border:3px solid #1e2b34;border-radius:7px;background:linear-gradient(145deg,#71818a,#35444d 58%,#202b32);box-shadow:inset 0 0 0 3px #93a2a8,inset 0 0 18px #111a,0 8px 16px #07162588}.rodolphe-safe::before{content:"";position:absolute;inset:8px;border:2px solid #aeb8bc;border-radius:4px;box-shadow:inset 0 0 0 2px #28353c}.rodolphe-safe span{position:absolute;left:50%;top:9px;transform:translateX(-50%);font:900 7px/1 system-ui;letter-spacing:1px;color:#d6f382;text-shadow:0 1px 2px #000}.rodolphe-safe i{position:absolute;left:17px;top:31px;width:17px;height:17px;border:3px solid #c6d0d3;border-radius:50%;box-sizing:border-box}.rodolphe-safe i::before,.rodolphe-safe i::after{content:"";position:absolute;left:5px;top:-3px;width:2px;height:17px;background:#c6d0d3}.rodolphe-safe i::after{transform:rotate(90deg)}.rodolphe-safe b{position:absolute;right:11px;top:31px;width:4px;height:18px;border-radius:3px;background:#c6d0d3;box-shadow:0 0 0 1px #1c262c}';
  document.head.append(style);
  const safe=document.createElement('div');safe.className='rodolphe-safe';safe.innerHTML='<span>BUDGET</span><i></i><b></b>';safe.hidden=true;document.body.append(safe);

  function syncSafe(){
    let s=null;try{s=Arcade?.state;}catch{}
    const visible=s&&s.level===2&&s.boss&&renderer&&!['help','records','paused','won','lost','title'].includes(s.phase);
    if(!visible){safe.hidden=true;requestAnimationFrame(syncSafe);return;}
    const x=-7.35,y=surface(4,x)+.72,z=.36;
    const pos=renderer.project(x,y,z),left=renderer.project(x-.45,y,z),right=renderer.project(x+.45,y,z);
    if(!pos||!Number.isFinite(pos.x)||pos.x<-80||pos.x>innerWidth+80||pos.y<-80||pos.y>innerHeight+80){safe.hidden=true;requestAnimationFrame(syncSafe);return;}
    const scale=Math.max(.55,Math.min(1.45,Math.abs(right.x-left.x)/55));
    safe.style.left=pos.x+'px';safe.style.top=pos.y+'px';safe.style.transform='translate(-50%,-50%) scale('+scale+')';safe.hidden=false;
    requestAnimationFrame(syncSafe);
  }
  requestAnimationFrame(syncSafe);
})();
