'use strict';
(()=>{
  // Mapping follows the supplied images' headings, not their numerical order in the level.
  const definitions={
    projectDirector:{officeTitle:'Bureau du Directeur de Projets',name:'DIRECTEUR DE PROJETS',file:'Whiteboard02.png',level:0,floor:1},
    businessManager:{officeTitle:'Bureau de la Business Manager',name:'BUSINESS MANAGER',file:'Whiteboard01.png',level:0,floor:2},
    techServicesDirector:{officeTitle:'Bureau du Directeur Technologies Services Pays de la Loire',name:'DIRECTEUR TECHNOLOGIES SERVICES',file:'Whiteboard03.png',level:1,floor:1},
    regionalDirector:{officeTitle:'Bureau du Directeur Région Grand Ouest',name:'DIRECTEUR RÉGION GRAND OUEST',file:'Whiteboard04.png',level:2,floor:3}
  };
  const offline=location.protocol==='file:',assets={};
  for(const [key,definition] of Object.entries(definitions)){
    const image=new Image();
    const ready=new Promise((resolve,reject)=>{
      image.addEventListener('load',resolve,{once:true});
      image.addEventListener('error',()=>reject(new Error('Tableau introuvable : '+definition.file)),{once:true});
    }).then(()=>true);
    assets[key]={key,...definition,image,ready};
    if(!offline)image.src='signage/'+definition.file;
  }
  const sourceReady=offline?new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='whiteboards-offline.js?v=1';
    script.onload=()=>{for(const asset of Object.values(assets))asset.image.src=OfficeWhiteboardOffline[asset.file];resolve();};
    script.onerror=()=>reject(new Error('Tableaux hors ligne introuvables'));
    document.head.append(script);
  }):Promise.resolve();
  globalThis.OfficeWhiteboards={
    ready:Promise.all([sourceReady,...Object.values(assets).map(a=>a.ready)]).then(()=>true),
    draw(sign,key,x,y,z,h=1.8){
      const asset=assets[key],w=h*4/3;
      const item=sign(x,y,z,w,h,(c,W,H)=>{
        c.clearRect(0,0,W,H);
        if(asset.image.complete&&asset.image.naturalWidth){
          c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(asset.image,0,0,W,H);
        }
      });
      if(!asset.image.complete)asset.image.addEventListener('load',()=>item.update(),{once:true});
      const board={...asset,x,y,z,w,h,canvas:item.surface};
      globalThis.OfficeBoards=globalThis.OfficeBoards||[];globalThis.OfficeBoards.push(board);
      return board;
    }
  };
})();
