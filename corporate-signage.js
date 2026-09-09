'use strict';
// One PNG asset per decorative office sign. Whiteboards, character plaques and the Céline Dion
// poster stay in their dedicated renderers. Every sign remains on its original level.
(()=>{
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  const sources={
    site:'signage/inetum-lcp7.png?v=2',
    mission:'signage/ordre-mission.png?v=2',
    swile:'signage/swile.png?v=2',
    purchase:'signage/bon-commande.png?v=2',
    concur:'signage/sap-concur.png?v=2',
    peopleDoc:'signage/mypeopledoc.png?v=2',
    chronotime:'signage/chronotime-2.png?v=2',
    support:'signage/global-service-center.png?v=2',
    success:'signage/success-factors.png?v=2',
    gcomp:'signage/gcomp.png?v=2',
    academy:'signage/learning-academy.png?v=2',
    powerUp:'signage/power-up.png?v=2',
    connect:'signage/lets-connect-france.png?v=2',
    genAi:'signage/gen-ai.png?v=2',
    charity:'signage/charity-day.png?v=2',
    summer:'signage/summer-party.png?v=2'
  };
  const images={};
  Object.entries(sources).forEach(([key,src])=>{
    const image=new Image();
    image.decoding='async';
    image.src=src;
    images[key]=image;
  });

  // A restrained wall strip groups the signs without turning the decor into large dark panels.
  const band=(mesh,y,color,h=2.42)=>mesh.box(0,y,-1.15,20.7,h,.12,color);
  const panel=(mesh,sign,key,x,y,w,h,frame='#263945')=>{
    const image=images[key];
    mesh.box(x,y,-1.03,w+.14,h+.14,.08,frame);
    let item;
    const paint=(c,W,H)=>{
      // Keep a neutral backing only while the PNG is loading; the PNG fills the complete panel.
      c.fillStyle='#eef0e8';c.fillRect(0,0,W,H);
      if(image.complete&&image.naturalWidth){
        c.imageSmoothingEnabled=true;
        c.imageSmoothingQuality='high';
        c.drawImage(image,0,0,W,H);
      }
    };
    item=sign(x,y,-.97,w,h,paint);
    const refresh=()=>item?.update?.();
    if(image.complete&&image.naturalWidth)refresh();
    else image.addEventListener('load',refresh,{once:true});
  };

  function drawLevel0(mesh,sign){
    band(mesh,1.45,'#29495b');
    panel(mesh,sign,'site',-6.6,1.45,4.8,1.44,'#263945');
    panel(mesh,sign,'mission',-1.25,1.45,3.6,1.44,'#465b62');
    panel(mesh,sign,'swile',4.45,1.45,2.8,1.26,'#7b4f69');
    panel(mesh,sign,'purchase',4.65,4.43,1.05,1.23,'#586a70');

    band(mesh,10.42,'#29495b');
    panel(mesh,sign,'concur',-6.7,10.42,3.0,1.14);
    panel(mesh,sign,'peopleDoc',-3.1,10.42,3.0,1.14);
    panel(mesh,sign,'chronotime',.55,10.42,3.0,1.14);
    panel(mesh,sign,'support',5.65,10.42,4.0,1.24);
  }

  function drawLevel1(mesh,sign){
    band(mesh,1.45,'#453b55');
    panel(mesh,sign,'success',-5.8,1.45,3.4,1.36,'#526253');
    panel(mesh,sign,'gcomp',0,1.45,3.2,1.28,'#77436a');
    panel(mesh,sign,'academy',5.6,1.45,3.8,1.40,'#31483f');

    band(mesh,7.75,'#453b55');
    panel(mesh,sign,'powerUp',0,7.75,8.4,2.40,'#1a3143');

    band(mesh,10.42,'#453b55');
    panel(mesh,sign,'connect',-4.7,10.42,4.0,1.44,'#5b4856');
    panel(mesh,sign,'genAi',2.0,10.42,4.1,1.48,'#263b55');
  }

  function drawLevel2(mesh,sign){
    band(mesh,1.72,'#344d60');
    panel(mesh,sign,'charity',-4.7,1.72,4.4,1.71,'#486252');
    panel(mesh,sign,'summer',2.4,1.72,5.4,1.83,'#68475b');
  }

  decor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level===0)drawLevel0(mesh,sign);
    else if(level===1)drawLevel1(mesh,sign);
    else drawLevel2(mesh,sign);
  };
})();
