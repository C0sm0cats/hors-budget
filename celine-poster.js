'use strict';
(()=>{
  if(!globalThis.OfficeDecor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=globalThis.OfficeDecor.draw;
  const image=new Image();
  image.decoding='async';
  image.src='celine-dion-poster.png?v=1';

  function poster(mesh,sign){
    const x=3.18,y=4.55,z=-1.20,h=1.48,w=h*(314/354);
    mesh.box(x,y,z-.06,w+.08,h+.08,.08,'#17232b');
    let item;
    const paint=(c,W,H)=>{
      c.fillStyle='#000';c.fillRect(0,0,W,H);
      if(image.complete&&image.naturalWidth)c.drawImage(image,0,0,W,H);
    };
    item=sign(x,y,z,w,h,paint);
    if(!image.complete||!image.naturalWidth){
      image.addEventListener('load',()=>item.update(),{once:true});
    }
  }

  globalThis.OfficeDecor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level===0)poster(mesh,sign);
  };
})();
