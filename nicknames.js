'use strict';
(()=>{
  const swap=text=>String(text)
    .replaceAll('KÉVIN','KÉKÉ').replaceAll('Kévin','KÉKÉ')
    .replaceAll('JULIEN','JUJU').replaceAll('Julien','JUJU')
    .replaceAll('RODOLPHE','RORO').replaceAll('Rodolphe','RORO')
    .replaceAll('CHARLINE','CHACHA').replaceAll('Charline','CHACHA');

  const originalDraw=globalThis.OfficeDecor?.draw;
  if(originalDraw){
    globalThis.OfficeDecor.draw=(mesh,sign,level,surface)=>{
      const wrappedSign=(x,y,z,w,h,draw)=>sign(x,y,z,w,h,(c,W,H)=>{
        const fillText=c.fillText;
        c.fillText=function(text,...args){return fillText.call(this,swap(text),...args);};
        try{draw(c,W,H);}finally{c.fillText=fillText;}
      });
      originalDraw(mesh,wrappedSign,level,surface);
      const board=globalThis.OfficeBoard;
      if(board){
        board.name=swap(board.name);
        const c=board.canvas?.getContext?.('2d');
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
  }

  const rewriteDom=()=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const next=swap(node.nodeValue);
      if(next!==node.nodeValue)node.nodeValue=next;
    }
  };
  rewriteDom();
  new MutationObserver(rewriteDom).observe(document.body,{subtree:true,childList:true,characterData:true});
})();
