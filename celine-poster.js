'use strict';
(()=>{
  if(!globalThis.OfficeDecor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=globalThis.OfficeDecor.draw;

  function poster(mesh,sign){
    const x=3.18,y=4.55,z=-1.20,h=1.48,w=h*(314/354);
    mesh.box(x,y,z-.06,w+.08,h+.08,.08,'#17232b');

    const image=new Image();
    let item,loaded=false,retried=false;
    const paint=(c,W,H)=>{
      c.fillStyle='#29485d';c.fillRect(0,0,W,H);
      c.strokeStyle='#e8ddbd';c.lineWidth=Math.max(3,H*.018);c.strokeRect(W*.055,H*.045,W*.89,H*.91);
      c.fillStyle='#eadbb8';c.textAlign='center';c.textBaseline='middle';c.font='900 '+Math.max(13,H*.105)+'px system-ui';c.fillText('CÉLINE DION',W*.5,H*.13,W*.82);
      if(loaded&&image.naturalWidth)c.drawImage(image,0,0,W,H);
    };

    item=sign(x,y,z,w,h,paint);
    image.onload=()=>{loaded=true;item.update();};
    image.onerror=()=>{
      if(retried)return;
      retried=true;
      image.src=new URL('celine-dion-poster.png?reload='+Date.now(),document.baseURI).href;
    };
    image.decoding='async';
    image.src=new URL('celine-dion-poster.png?v=2',document.baseURI).href;
  }

  globalThis.OfficeDecor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level===0)poster(mesh,sign);
  };
})();
