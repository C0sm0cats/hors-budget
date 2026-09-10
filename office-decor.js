'use strict';
// Native furniture and PNG whiteboards for the two reference offices.
(()=>{
  function draw(mesh,sign,level,surface){
    globalThis.OfficeBoards=[];
    if(level===2){globalThis.OfficeBoards=[];globalThis.OfficeBoard=null;return;}
    const techServicesDirector=level===1;
    globalThis.OfficeBoard=globalThis.OfficeWhiteboards.draw(sign,techServicesDirector?'techServicesDirector':'projectDirector',techServicesDirector?-1.15:-1.9,4.57,-1.20);
    globalThis.OfficePlaques.draw(mesh,sign,techServicesDirector?'techServicesDirector':'projectDirector',techServicesDirector?3.55:1.45,techServicesDirector?4.98:4.99,-1.22);
    const deskX=techServicesDirector?2.25:.85;
    globalThis.OfficeDesks.draw(sign,techServicesDirector?'techServicesDirector':'projectDirector',deskX,surface(1,deskX),-.55,4.1);
    if(!techServicesDirector)globalThis.OfficeSpecialSignage.draw(sign,'cooptation',-4.7,4.56,-1.20,1.85);
  }
  globalThis.OfficeDecor={draw};
})();
