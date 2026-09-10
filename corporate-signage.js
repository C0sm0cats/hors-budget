'use strict';
// One PNG asset per decorative office sign. Whiteboards, character plaques and the Céline Dion
// poster stay in their dedicated renderers. Every sign remains on its original level.
(()=>{
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  const sources={
    site:'signage/inetum-lcp7.png?v=3',
    mission:'signage/ordre-mission.png?v=3',
    swile:'signage/swile.png?v=3',
    purchase:'signage/bon-commande.png?v=3',
    concur:'signage/sap-concur.png?v=3',
    peopleDoc:'signage/mypeopledoc.png?v=3',
    chronotime:'signage/chronotime-2.png?v=3',
    support:'signage/global-service-center.png?v=3',
    success:'signage/success-factors.png?v=3',
    gcomp:'signage/gcomp.png?v=3',
    academy:'signage/learning-academy.png?v=3',
    powerUp:'signage/power-up.png?v=3',
    connect:'signage/lets-connect-france.png?v=3',
    genAi:'signage/gen-ai.png?v=3',
    charity:'signage/charity-day.png?v=3',
    summer:'signage/summer-party.png?v=3'
  };
  const aspects={site:4/3,mission:3/4,swile:3/4,purchase:3/4,concur:3/4,peopleDoc:3/4,chronotime:3/4,support:4/3,success:3/4,gcomp:1122/1402,academy:1122/1402,powerUp:4/3,connect:1122/1402,genAi:1122/1402,charity:1122/1402,summer:1122/1402};
  const images={},pending=[];
  const offline=location.protocol==='file:';
  Object.entries(sources).forEach(([key,src])=>{
    const image=new Image();
    image.decoding='async';
    pending.push(new Promise((resolve,reject)=>{
      image.addEventListener('load',resolve,{once:true});
      image.addEventListener('error',()=>reject(new Error('Affiche introuvable : '+src)),{once:true});
    }));
    images[key]=image;
    if(!offline)image.src=src;
  });
  const sourceReady=offline?new Promise((resolve,reject)=>{
    // Local PNG URLs taint canvases. Load a self-contained bundle only in file:// mode.
    const script=document.createElement('script');
    script.src='signage-offline.js?v=1';
    script.onload=()=>{
      for(const [key,src] of Object.entries(sources))images[key].src=globalThis.OfficeSignageOffline[src.split('?')[0]];
      resolve();
    };
    script.onerror=()=>reject(new Error('Affiches hors ligne introuvables'));
    document.head.append(script);
  }):Promise.resolve();
  globalThis.OfficeSignageReady=Promise.all([sourceReady,...pending]).then(()=>true);

  // A restrained wall strip groups the signs without turning the decor into large dark panels.
  const band=(mesh,y,color,h=2.42)=>mesh.box(0,y,-1.15,20.7,h,.12,color);
  const panel=(mesh,sign,key,x,y,w,h,frame='#263945')=>{
    w=Math.min(w,h*aspects[key]);h=w/aspects[key];
    const image=images[key];
    mesh.box(x,y,-1.03,w+.14,h+.14,.08,frame);
    let item;
    const paint=(c,W,H)=>{
      // Preserve the entire PNG, even if a future replacement has a different aspect ratio.
      c.fillStyle='#eef0e8';c.fillRect(0,0,W,H);
      if(image.complete&&image.naturalWidth){
        c.imageSmoothingEnabled=true;
        c.imageSmoothingQuality='high';
        const scale=Math.min(W/image.naturalWidth,H/image.naturalHeight);
        const iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;
        c.drawImage(image,(W-iw)/2,(H-ih)/2,iw,ih);
      }
    };
    item=sign(x,y,-.97,w,h,paint);
    const refresh=()=>item?.update?.();
    if(image.complete&&image.naturalWidth)refresh();
    else image.addEventListener('load',refresh,{once:true});
  };

  function drawLevel0(mesh,sign){
    band(mesh,1.45,'#29495b');
    panel(mesh,sign,'site',-3.5,1.9,1.9,1.6);
    panel(mesh,sign,'mission',.4,1.65,2,2.0,'#465b62');
    panel(mesh,sign,'swile',4.9,1.65,2,2.0,'#7b4f69');
    panel(mesh,sign,'purchase',4.65,4.43,1.05,1.4,'#586a70');
    band(mesh,10.42,'#29495b');
    panel(mesh,sign,'concur',-3.85,10.65,2,2.0);
    panel(mesh,sign,'peopleDoc',-1.9,10.65,2,2.0);
    panel(mesh,sign,'chronotime',.6,10.65,2,2.0);
    panel(mesh,sign,'support',7.9,10.65,2.1,1.6);
  }
  function drawLevel1(mesh,sign){
    band(mesh,1.45,'#453b55');
    panel(mesh,sign,'success',-8.5,1.35,2,2.1,'#526253');
    // A side-mounted shaft panel stays clear of both the moving cabin and DIRECTEUR TECHNOLOGIES SERVICES's board.
    mesh.box(-1.04,1.6,-.92,.18,.09,.12,'#dbc489');
    panel(mesh,sign,'gcomp',-1.9,1.6,1.5,1.875,'#77436a');
    panel(mesh,sign,'academy',4.8,1.6,2,2.1,'#31483f');
    band(mesh,7.75,'#453b55');
    panel(mesh,sign,'powerUp',0,7.6,3.0,2.25,'#1a3143');
    band(mesh,10.42,'#453b55');
    panel(mesh,sign,'connect',-1.7,10.6,2,2.05,'#5b4856');
    panel(mesh,sign,'genAi',5.0,10.6,2,2.05,'#263b55');
  }
  function drawLevel2(mesh,sign){
    band(mesh,1.72,'#344d60');
    panel(mesh,sign,'charity',-6.55,1.35,2,2.15,'#486252');
    panel(mesh,sign,'summer',2.4,1.65,2,2.15,'#68475b');
  }
  decor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level===0)drawLevel0(mesh,sign);
    else if(level===1)drawLevel1(mesh,sign);
    else drawLevel2(mesh,sign);
  };
})();
