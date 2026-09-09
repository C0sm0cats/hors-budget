'use strict';
(()=>{
  // Bounds of the visible artwork: omit transparent outer margins without editing the PNGs.
  const definitions={
    cooptation:{file:'cooptation.png',crop:[53,204,1149,847]},
    powerUpTour:{file:'POWER_UP_TOUR.png',crop:[15,79,2143,512]},
    vip:{file:'espace_VIP.png',crop:[26,115,2121,414]}
  };
  const offline=location.protocol==='file:',assets={};
  for(const [key,definition] of Object.entries(definitions)){
    const image=new Image();
    const ready=new Promise((resolve,reject)=>{
      image.addEventListener('load',resolve,{once:true});
      image.addEventListener('error',()=>reject(new Error('Panneau introuvable : '+definition.file)),{once:true});
    });
    assets[key]={...definition,image,ready};
    if(!offline)image.src='signage/'+definition.file;
  }
  const sourceReady=offline?new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='special-signage-offline.js?v=1';
    script.onload=()=>{for(const a of Object.values(assets))a.image.src=OfficeSpecialSignageOffline[a.file];resolve();};
    script.onerror=()=>reject(new Error('Panneaux hors ligne introuvables'));document.head.append(script);
  }):Promise.resolve();
  globalThis.OfficeSpecialSignage={
    ready:Promise.all([sourceReady,...Object.values(assets).map(a=>a.ready)]).then(()=>true),
    draw(sign,key,x,y,z,w){
      const {image,crop}=assets[key],h=w*crop[3]/crop[2];
      const item=sign(x,y,z,w,h,(c,W,H)=>{
        c.clearRect(0,0,W,H);
        if(image.complete&&image.naturalWidth){c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(image,...crop,0,0,W,H);}
      });
      if(!image.complete)image.addEventListener('load',()=>item.update(),{once:true});
      return item;
    }
  };
})();
