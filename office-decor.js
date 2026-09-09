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
    if(!julien){
      const poster=(x,y,w,h,paint)=>{mesh.box(x,y,-1.26,w+.14,h+.14,.08,'#566970');sign(x,y,-1.20,w,h,paint);};
      poster(-4.7,4.56,1.55,1.24,(c,W,H)=>{
        c.fillStyle='#353445';c.fillRect(0,0,W,H);c.fillStyle='#252f3d';c.fillRect(0,0,W,H*.22);
        c.fillStyle='#e5dadd';c.font='bold '+H*.12+'px system-ui';c.textAlign='center';c.fillText('COOPTATION',W/2,H*.16,W*.9);
        // Font-independent handshake icon.
        c.save();c.translate(W*.5,H*.41);c.scale(W*.30,H*.18);
        c.strokeStyle='#df9aba';c.fillStyle='#353445';c.lineWidth=.09;c.lineJoin='round';c.lineCap='round';
        c.beginPath();c.moveTo(-1,-.35);c.lineTo(-.55,-.72);c.lineTo(-.12,-.52);c.lineTo(.2,-.62);c.lineTo(.62,-.32);c.lineTo(1,-.5);c.lineTo(1,.25);c.lineTo(.68,.42);c.lineTo(.25,.82);c.lineTo(-.12,.7);c.lineTo(-.62,.24);c.lineTo(-1,.38);c.closePath();c.fill();c.stroke();
        c.beginPath();c.moveTo(.2,-.62);c.lineTo(-.22,-.08);c.quadraticCurveTo(-.02,.2,.2,-.02);c.lineTo(.36,-.18);c.lineTo(.68,.42);c.moveTo(-.46,.22);c.lineTo(-.12,.7);c.moveTo(-.2,.08);c.lineTo(.2,.62);c.moveTo(-.72,-.54);c.lineTo(-.62,.24);c.moveTo(.78,-.4);c.lineTo(.68,.42);c.stroke();c.restore();
        c.fillStyle='#df9aba';c.font='bold '+H*.12+'px system-ui';c.fillText('1 TALENT =',W/2,H*.71,W*.9);c.fillText('1 PRIME',W/2,H*.88,W*.9);
      });
    }
  }
  globalThis.OfficeDecor={draw};
})();
