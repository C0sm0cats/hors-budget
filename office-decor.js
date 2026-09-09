'use strict';
// Native furniture and PNG whiteboards for the two reference offices.
(()=>{
  function desk(mesh,x,y,z,julien){
    mesh.box(x,y+.55,z,4.1,.16,.85,'#896548');
    for(const dx of [-1.5,1.5])mesh.box(x+dx,y+.24,z,.19,.53,.62,'#5d4534');
    mesh.box(x,y+.28,z-.18,2.9,.30,.12,'#715036');
    // The reference shows the dark back of the monitor and its central support.
    mesh.box(x+.1,y+1.08,z+.12,1.48,.88,.14,'#263943');
    mesh.box(x+.1,y+1.08,z+.20,1.30,.73,.035,'#2d414b');
    mesh.box(x+.14,y+.79,z+.26,.25,.46,.13,'#4f646d');
    for(let i=0;i<3;i++){
      mesh.box(x-1.34,y+.66+i*.065,z+.14,.58,.055,.36,'#e9e6cd');
      mesh.box(x-1.34,y+.69+i*.065,z+.14,.63,.018,.38,julien?'#bbaa59':'#b95261');
    }
    if(!julien){mesh.cylinder(x-.86,y+.76,z+.17,.13,.25,'#d9dac9',10);mesh.ring(x-.70,y+.77,z+.17,.09,.024,'#d9dac9');}
    const px=x+(julien?-.70:1.10);
    mesh.box(px,y+.77,z+.15,.21,.28,.21,'#b9c1ba');
    for(let i=0;i<3;i++)mesh.box(px-.07+i*.065,y+.99+(i%2)*.08,z+.15,.035,.32,.035,['#847798','#bd676b','#455e70'][i]);
    const plantX=x+1.65;
    mesh.cylinder(plantX,y+.76,z+.10,.19,.28,'#ebe5cf',6,.13);
    for(const [dx,dy,a] of [[-.16,1.07,-.3],[0,1.20,.05],[.15,1.11,.3],[-.05,1.29,-.08]])mesh.box(plantX+dx,y+dy,z+.10,.13,.56,.06,dy>1.2?'#518c48':'#3c743e',a);
  }
  function draw(mesh,sign,level,surface){
    globalThis.OfficeBoards=[];
    if(level===2){globalThis.OfficeBoards=[];globalThis.OfficeBoard=null;return;}
    const julien=level===1;
    globalThis.OfficeBoard=globalThis.OfficeWhiteboards.draw(sign,julien?'juju':'keke',julien?-1.15:-1.9,4.57,-1.20);
    globalThis.OfficePlaques.draw(mesh,sign,julien?'juju':'keke',julien?3.55:1.45,julien?4.98:4.99,-1.22);
    const deskX=julien?2.25:.85;
    desk(mesh,deskX,surface(1,deskX),-.65,julien);
    if(!julien)globalThis.OfficeSpecialSignage.draw(sign,'cooptation',-4.7,4.56,-1.20,1.85);
  }
  globalThis.OfficeDecor={draw};
})();
