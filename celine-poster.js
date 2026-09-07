'use strict';
(()=>{
  if(!globalThis.OfficeDecor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=globalThis.OfficeDecor.draw;

  const image=new Image();
  image.decoding='async';
  image.src=new URL('celine-dion-poster.png?v=4',document.baseURI).href;

  function poster(mesh,sign){
    // Keep the poster in the free wall space between Kévin's nameplate and BUDGET VALIDÉ.
    const x=3.32,y=4.43,z=-1.20,h=1.24,w=h*(314/354);
    mesh.box(x,y,z-.06,w+.08,h+.08,.08,'#17232b');
    let item;
    const paint=(c,W,H)=>{
      c.fillStyle='#29485d';c.fillRect(0,0,W,H);
      if(image.complete&&image.naturalWidth)c.drawImage(image,0,0,W,H);
    };
    item=sign(x,y,z,w,h,paint);
    const refresh=()=>item?.update();
    if(image.complete&&image.naturalWidth)refresh();
    else image.addEventListener('load',refresh,{once:true});
  }

  globalThis.OfficeDecor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level===0)poster(mesh,sign);
  };
})();
