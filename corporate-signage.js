'use strict';
// Decorative office signage is rendered from PNG atlases. Whiteboards, character plaques and
// the Céline Dion poster remain separate systems. Each sign stays on its original level.
(()=>{
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  const atlases=[
    {src:'signage-level0.png',image:new Image(),sprites:{
      site:[7,85,261,78],mission:[282,72,261,104],swile:[557,65,261,118],purchase:[863,7,199,234],
      concur:[7,322,261,99],peopleDoc:[282,322,261,99],chronotime:[557,322,261,99],support:[832,331,261,80]
    }},
    {src:'signage-level1.png',image:new Image(),sprites:{
      success:[6,63,268,107],gcomp:[286,63,268,107],academy:[566,67,268,99],
      powerUp:[6,312,268,76],connect:[286,302,268,97],genAi:[566,302,268,97]
    }},
    {src:'signage-level2.png',image:new Image(),sprites:{
      charity:[10,97,580,225],summer:[610,111,580,197]
    }}
  ];
  atlases.forEach(a=>{a.image.decoding='async';a.image.src=a.src;});

  const band=(mesh,y,color,h=3.05)=>mesh.box(0,y,-1.15,20.7,h,.12,color);
  const panel=(mesh,sign,level,key,x,y,w,h,frame='#263945')=>{
    mesh.box(x,y,-1.03,w+.14,h+.14,.08,frame);
    const atlas=atlases[level],rect=atlas.sprites[key];
    let item;
    const paint=(c,W,H)=>{
      c.fillStyle='#1e252b';c.fillRect(0,0,W,H);
      if(atlas.image.complete&&atlas.image.naturalWidth){
        c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
        c.drawImage(atlas.image,...rect,0,0,W,H);
      }
    };
    item=sign(x,y,-.97,w,h,paint);
    const refresh=()=>item?.update?.();
    if(atlas.image.complete&&atlas.image.naturalWidth)refresh();
    else atlas.image.addEventListener('load',refresh,{once:true});
  };

  function drawLevel0(mesh,sign){
    band(mesh,1.45,'#29495b',3.35);
    panel(mesh,sign,0,'site',-6.5,1.45,4.9,1.46,'#263945');
    panel(mesh,sign,0,'mission',-1.1,1.45,4.2,1.68,'#465b62');
    panel(mesh,sign,0,'swile',4.8,1.45,3.4,1.53,'#7b4f69');
    panel(mesh,sign,0,'purchase',4.65,4.43,1.35,1.58,'#586a70');
    band(mesh,10.42,'#29495b',3.15);
    panel(mesh,sign,0,'concur',-6.8,10.42,3.4,1.28);
    panel(mesh,sign,0,'peopleDoc',-3.05,10.42,3.25,1.23);
    panel(mesh,sign,0,'chronotime',.55,10.42,3.25,1.23);
    panel(mesh,sign,0,'support',5.35,10.42,4.2,1.30);
  }
  function drawLevel1(mesh,sign){
    band(mesh,1.45,'#453b55',3.25);
    panel(mesh,sign,1,'success',-5.9,1.45,3.7,1.48);
    panel(mesh,sign,1,'gcomp',0,1.45,3.7,1.48);
    panel(mesh,sign,1,'academy',5.9,1.45,4.0,1.47);
    band(mesh,7.75,'#453b55',3.35);
    panel(mesh,sign,1,'powerUp',0,7.75,9.2,2.20,'#1a3143');
    band(mesh,10.42,'#453b55',3.15);
    panel(mesh,sign,1,'connect',-4.8,10.42,4.2,1.50,'#5b4856');
    panel(mesh,sign,1,'genAi',2.1,10.42,4.5,1.62,'#263b55');
  }
  function drawLevel2(mesh,sign){
    band(mesh,1.72,'#344d60',3.35);
    panel(mesh,sign,2,'charity',-4.5,1.72,4.7,1.82,'#486252');
    panel(mesh,sign,2,'summer',2.7,1.72,5.2,1.76,'#68475b');
  }

  decor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level===0)drawLevel0(mesh,sign);
    else if(level===1)drawLevel1(mesh,sign);
    else drawLevel2(mesh,sign);
  };
})();
