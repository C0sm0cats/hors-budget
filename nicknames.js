'use strict';
(()=>{
  const swap=text=>String(text)
    .replace(/K(?:É|E)VIN/gi,'KÉKÉ')
    .replace(/JULIEN/gi,'JUJU')
    .replace(/RODOLPHE/gi,'RORO')
    .replace(/CHARLINE/gi,'CHACHA');

  const proto=globalThis.CanvasRenderingContext2D?.prototype;
  if(proto&&!proto.__nicknamePatched){
    const fill=proto.fillText,stroke=proto.strokeText;
    proto.fillText=function(text,...args){return fill.call(this,swap(text),...args);};
    proto.strokeText=function(text,...args){return stroke.call(this,swap(text),...args);};
    Object.defineProperty(proto,'__nicknamePatched',{value:true});
  }

  const originalDraw=globalThis.OfficeDecor?.draw;
  if(originalDraw&&!originalDraw.__nicknameWrapped){
    const wrapped=(mesh,sign,level,surface)=>{
      const wrappedSign=(x,y,z,w,h,draw)=>sign(x,y,z,w,h,(c,W,H)=>draw(c,W,H));
      originalDraw(mesh,wrappedSign,level,surface);

      const boards=globalThis.OfficeBoards||[];
      for(const board of boards)if(board?.name)board.name=swap(board.name);
      const board=globalThis.OfficeBoard;
      if(board?.name)board.name=swap(board.name);

      if(board?.canvas){
        const c=board.canvas.getContext?.('2d');
        if(c&&level===0){
          const W=board.canvas.width,H=board.canvas.height;
          c.save();
          c.fillStyle='#eceae1';c.fillRect(W*.69,H*.78,W*.28,H*.17);
          c.fillStyle='#ca485b';c.textAlign='left';c.textBaseline='middle';c.font='900 '+Math.max(16,H*.07)+'px system-ui';
          c.fillText('— KÉKÉ',W*.71,H*.865,W*.24);c.restore();
        }else if(c&&level===1){
          const W=board.canvas.width,H=board.canvas.height;
          c.save();
          c.fillStyle='#eceae1';c.fillRect(W*.78,H*.68,W*.2,H*.18);
          c.fillStyle='#21699b';c.textAlign='left';c.textBaseline='middle';c.font='900 '+Math.max(15,H*.065)+'px system-ui';
          c.fillText('— JUJU',W*.8,H*.77,W*.17);c.restore();
        }
      }
    };
    wrapped.__nicknameWrapped=true;
    globalThis.OfficeDecor.draw=wrapped;
  }

  const visibleAttrs=['aria-label','title','alt','data-speaker','placeholder','value'];
  const selector=visibleAttrs.map(attr=>'['+attr+']').join(',');

  const rewriteDom=()=>{
    if(!document.body)return;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const next=swap(node.nodeValue);
      if(next!==node.nodeValue)node.nodeValue=next;
    }
    for(const el of document.body.querySelectorAll(selector)){
      for(const attr of visibleAttrs){
        if(!el.hasAttribute(attr))continue;
        const old=el.getAttribute(attr),next=swap(old);
        if(next!==old)el.setAttribute(attr,next);
      }
    }
  };

  const syncObjects=()=>{
    const boards=globalThis.OfficeBoards||[];
    for(const board of boards)if(board?.name)board.name=swap(board.name);
    if(globalThis.OfficeBoard?.name)globalThis.OfficeBoard.name=swap(globalThis.OfficeBoard.name);
    rewriteDom();
  };

  syncObjects();
  new MutationObserver(rewriteDom).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:visibleAttrs});
  setInterval(syncObjects,1000);
})();
