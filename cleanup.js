'use strict';
(()=>{
  if(!renderer?.gl||typeof renderer.draw!=='function')return;
  const gl=renderer.gl,originalDraw=renderer.draw.bind(renderer),rawDrawArrays=gl.drawArrays.bind(gl);
  let signDrawIndex=0,inRendererDraw=false;
  gl.drawArrays=function(mode,first,count){
    if(inRendererDraw&&mode===gl.TRIANGLES&&count===6){
      signDrawIndex++;
      if(signDrawIndex===4)return;
    }
    return rawDrawArrays(mode,first,count);
  };
  renderer.draw=function(dt){
    signDrawIndex=0;
    inRendererDraw=true;
    try{return originalDraw(dt);}finally{inRendererDraw=false;}
  };
})();
