'use strict';
// Native furniture and PNG whiteboards for the two reference offices.
(()=>{
  function coffeeMachine(mesh,sign,surface){
    // Ground-floor coffee station, just right of the starting plant (-8.15).
    const x=-6.95,y=surface(0,x),z=-.62;
    mesh.box(x,y+.82,z,.92,1.64,.62,'#303e48');
    mesh.box(x,y+.08,z,.99,.16,.69,'#192932');
    mesh.box(x,y+1.63,z,1.01,.12,.69,'#739298');
    mesh.box(x,y+.76,z+.325,.74,1.06,.035,'#172832');
    mesh.box(x,y+1.19,z+.35,.48,.24,.025,'#8bbba7');
    for(const dx of [-.23,0,.23])mesh.box(x+dx,y+.97,z+.35,.11,.08,.035,dx===0?'#d9f18a':'#a9c3c5');
    mesh.box(x,y+.68,z+.36,.54,.41,.03,'#0c1922');
    mesh.box(x,y+.81,z+.44,.15,.12,.16,'#b5c4c8');
    mesh.box(x,y+.45,z+.45,.66,.07,.26,'#82949b');
    mesh.cylinder(x,y+.57,z+.46,.115,.18,'#f4ead2',12);
    mesh.cylinder(x,y+.667,z+.46,.088,.008,'#67402a',12);
    mesh.box(x+.14,y+.57,z+.46,.08,.09,.07,'#f4ead2');
    sign(x,y+1.45,z+.36,.72,.19,(c,W,H)=>{
      c.fillStyle='#203742';c.fillRect(0,0,W,H);
      c.fillStyle='#f3e3ad';c.font='900 '+H*.74+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('CAFÉ',W/2,H/2,W*.9);
    });
  }
  function draw(mesh,sign,level,surface){
    globalThis.OfficeBoards=[];
    if(level===2){globalThis.OfficeBoards=[];globalThis.OfficeBoard=null;return;}
    if(level===0)coffeeMachine(mesh,sign,surface);
    const techServicesDirector=level===1;
    globalThis.OfficeBoard=globalThis.OfficeWhiteboards.draw(sign,techServicesDirector?'techServicesDirector':'projectDirector',techServicesDirector?-1.15:-1.9,4.57,-1.20);
    globalThis.OfficePlaques.draw(mesh,sign,techServicesDirector?'techServicesDirector':'projectDirector',techServicesDirector?3.55:1.45,techServicesDirector?4.98:4.99,-1.22);
    const deskX=techServicesDirector?2.25:.85;
    globalThis.OfficeDesks.draw(sign,techServicesDirector?'techServicesDirector':'projectDirector',deskX,surface(1,deskX),-.55,4.1);
    if(!techServicesDirector)globalThis.OfficeSpecialSignage.draw(sign,'cooptation',-4.7,4.56,-1.20,1.85);
  }
  globalThis.OfficeDecor={draw};
})();
