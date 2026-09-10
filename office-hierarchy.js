'use strict';
// Keep the office geography aligned with the story: DIRECTEUR DE PROJETS + BUSINESS MANAGER in the LCP7 open space,
// DIRECTEUR TECHNOLOGIES SERVICES in the Pays de la Loire direction, and DIRECTEUR RÉGION GRAND OUEST in a native Grand Ouest seminar/VIP zone.
(()=>{
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  const card=(sign,x,y,z,w,h,paint)=>sign(x,y,z,w,h,(c,W,H)=>{c.clearRect(0,0,W,H);paint(c,W,H);});
  function addBusinessOffice(mesh,sign,surface){
    const floor=2,fy=surface(floor,0),wallY=fy+1.35;mesh.box(0,wallY,-1.17,14.4,2.72,.13,'#493b4c');for(const x of [-7.12,7.12])mesh.box(x,wallY,-1.02,.16,2.72,.18,'#c5a260');
    globalThis.OfficeWhiteboards.draw(sign,'businessManager',-2.45,fy+1.5,-.95);
    globalThis.OfficePlaques.draw(mesh,sign,'businessManager',2.35,fy+1.95,-.96);
    const deskX=1.8;globalThis.OfficeDesks.draw(sign,'businessManager',deskX,surface(floor,deskX),-.55,3.8);
  }

  function addRegionalDirectionZone(mesh,sign,surface){
    globalThis.OfficeBoards=[];globalThis.OfficeBoard=null;
    const floor=3,fy=surface(floor,0),wallY=fy+1.35;mesh.box(0,wallY,-1.18,14.4,2.72,.13,'#284653');for(const x of [-7.12,7.12])mesh.box(x,wallY,-1.02,.16,2.72,.18,'#c5a260');
    globalThis.OfficeBoard=globalThis.OfficeWhiteboards.draw(sign,'regionalDirector',-3.25,fy+1.5,-.96);
    globalThis.OfficePlaques.draw(mesh,sign,'regionalDirector',3.85,fy+1.84,-.97);
    const tx=2.2,ty=surface(floor,tx);globalThis.OfficeDesks.draw(sign,'regionalDirector',tx,ty,-.48,3.5);
    mesh.box(6.2,ty+.34,-.50,1.85,.46,.75,'#61566a');mesh.box(6.2,ty+.74,-.70,1.85,.64,.18,'#77697d');mesh.cylinder(5.0,ty+.25,-.55,.28,.50,'#d7d1bd',8,.22);for(const [dx,a] of [[-.22,-.45],[0,0],[.22,.45]])mesh.box(5.0+dx,ty+.86,-.55,.16,.92,.07,'#4f854d',a);
  }

  function seminarDecor(mesh,sign,surface){
    const floor1=surface(1,0),floor2=surface(2,0);
    globalThis.OfficeSpecialSignage.draw(sign,'powerUpTour',0,floor1+1.85,-1.12,5.6);
    mesh.box(0,floor1+.18,-.45,4.3,.35,1.45,'#634557');mesh.box(0,floor1+.62,-.55,1.05,.88,.75,'#2d4754');card(sign,0,floor1+.88,-.12,.82,.42,(c,W,H)=>{c.fillStyle='#203b48';c.fillRect(0,0,W,H);c.fillStyle='#d9f18a';c.font='900 '+H*.34+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('POWER UP',W/2,H*.52,W*.9);});
    for(const x of [-5.3,4.8]){mesh.box(x,floor2+.37,-.52,2.3,.50,.82,'#745d72');mesh.box(x,floor2+.78,-.78,2.3,.70,.18,'#8d7087');for(const sx of [-.9,.9])mesh.box(x+sx,floor2+.18,-.52,.16,.38,.7,'#4b3e49');}
    mesh.box(0,floor2+.34,-.52,2,.25,.9,'#b98f66');for(let i=0;i<5;i++)mesh.cylinder(-.7+i*.35,floor2+.56,-.52,.10,.09,i%2?'#e0c384':'#dca3b4',8);
    globalThis.OfficeSpecialSignage.draw(sign,'vip',0,floor2+1.65,-1.08,6.8);
  }

  decor.draw=(mesh,sign,level,surface)=>{
    if(level===2){addRegionalDirectionZone(mesh,sign,surface);seminarDecor(mesh,sign,surface);return;}
    originalDraw(mesh,sign,level,surface);
    if(level===0)addBusinessOffice(mesh,sign,surface);
  };
})();
