'use strict';
(()=>{
  const assets=globalThis.OfficePlaqueAssets;
  const images=Object.fromEntries(Object.entries(assets).map(([key,asset])=>{
    const image=new Image();image.src=asset.png;return [key,image];
  }));
  globalThis.OfficePlaques={draw(mesh,sign,key,x,y,z){
    const asset=assets[key],image=images[key];
    // A shared pixel density keeps lettering and padding identical across all four desks.
    const w=asset.width/260,h=asset.height/260;
    mesh.box(x,y,z-.04,w+.035,h+.035,.06,'#665439');
    const item=sign(x,y,z,w,h,(c,W,H)=>{
      c.fillStyle='#172a34';c.fillRect(0,0,W,H);
      if(image.complete&&image.naturalWidth){
        c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
        c.drawImage(image,0,0,W,H);
      }
    });
    if(!image.complete)image.addEventListener('load',()=>item.update(),{once:true});
    return item;
  }};
})();
