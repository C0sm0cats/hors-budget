'use strict';
(()=>{
  if(!renderer?.gl||typeof renderer.draw!=='function')return;
  const gl=renderer.gl;
  const rawDrawArrays=gl.drawArrays.bind(gl),rawBindTexture=gl.bindTexture.bind(gl);
  let textureBindIndex=0,inRendererDraw=false;

  gl.bindTexture=function(target,texture){
    if(inRendererDraw&&target===gl.TEXTURE_2D&&texture)textureBindIndex++;
    return rawBindTexture(target,texture);
  };
  gl.drawArrays=function(mode,first,count){
    // The fourth textured sign is Basile's old +3 % placard.
    if(inRendererDraw&&textureBindIndex===4&&mode===gl.TRIANGLES&&count===6)return;
    return rawDrawArrays(mode,first,count);
  };

  const originalDraw=renderer.draw.bind(renderer);
  renderer.draw=function(dt){
    textureBindIndex=0;
    inRendererDraw=true;
    try{return originalDraw(dt);}finally{inRendererDraw=false;}
  };

  // Run after polish.js each frame so the glasses use the exact camera/state
  // that was just rendered, avoiding one-frame drift during Rodolphe's jump.
  function syncRodolphe(){
    const s=Arcade?.state,glasses=document.querySelector('.rodolphe-glasses'),name=document.querySelector('.rodolphe-name-fix');
    if(s&&glasses&&renderer){
      const visible=s.boss.hp>0&&!['help','records','paused','won','lost'].includes(s.phase);
      glasses.hidden=!visible;
      if(name)name.hidden=!visible||s.phase==='title';
      if(visible){
        const rowing=!s.boss.active&&Math.floor(s.visual/6)%2===1;
        const bossX=s.boss.x-(s.boss.recoil>0?.24*(s.boss.recoil/.28):0);
        const drawX=bossX+(rowing?Math.sin(s.visual*6)*.18:0);
        const bounce=rowing&&!matchMedia('(prefers-reduced-motion: reduce)').matches?Math.abs(Math.sin(s.visual*7))*.48:0;
        const face=renderer.project(drawX,s.boss.y+.32+bounce+1.16*1.27,.15+.19*1.27);
        glasses.style.left=face.x+'px';
        glasses.style.top=face.y+'px';
        glasses.style.setProperty('transform','translate(-50%,-50%) scale('+(s.phase==='title'?'.82':'1.12')+')','important');
        if(name&&!name.hidden){
          const np=renderer.project(drawX,s.boss.y+.32+bounce+2.12,.45);
          name.style.left=np.x+'px';name.style.top=np.y+'px';
        }
      }
    }
    requestAnimationFrame(syncRodolphe);
  }
  requestAnimationFrame(syncRodolphe);
})();
