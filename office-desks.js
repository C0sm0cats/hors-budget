'use strict';
(()=>{
  // Bounds of the visible artwork: omit transparent outer margins without editing the PNGs.
  const definitions={"businessManager":{"file":"bureau-business-manager.png","crop":[399,42,1374,636]},"projectDirector":{"file":"bureau-directeur-projets.png","crop":[137,14,1897,679]},"techServicesDirector":{"file":"bureau-directeur-technologies-services.png","crop":[0,0,2093,705]},"regionalDirector":{"file":"bureau-directeur-region-pays-loire.png","crop":[203,4,1766,704]}};
  const offline=location.protocol==='file:',assets={};
  for(const [key,definition] of Object.entries(definitions)){
    const image=new Image();
    const ready=new Promise((resolve,reject)=>{
      image.addEventListener('load',resolve,{once:true});
      image.addEventListener('error',()=>reject(new Error('Bureau introuvable : '+definition.file)),{once:true});
    });
    assets[key]={...definition,image,ready};
    if(!offline)image.src='signage/'+definition.file;
  }
  const sourceReady=offline?new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='office-desks-offline.js?v=1';
    script.onload=()=>{for(const a of Object.values(assets))a.image.src=OfficeDesksOffline[a.file];resolve();};
    script.onerror=()=>reject(new Error('Bureaux hors ligne introuvables'));document.head.append(script);
  }):Promise.resolve();
  globalThis.OfficeDesks={
    ready:Promise.all([sourceReady,...Object.values(assets).map(a=>a.ready)]).then(()=>{if(typeof renderer!=='undefined'&&renderer)renderer.rebuild();return true;}),
    draw(sign,key,x,floorY,z,w){
      const {image,crop}=assets[key],h=w*crop[3]/crop[2];
      const item=sign(x,floorY+h/2,z,w,h,(c,W,H)=>{
        c.clearRect(0,0,W,H);
        if(image.complete&&image.naturalWidth){c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(image,...crop,0,0,W,H);}
      });
      return item;
    }
  };
})();
