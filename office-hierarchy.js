'use strict';
// Keep the office geography aligned with the story: KÉKÉ + CHACHA in the LCP7 open space,
// JUJU in the Pays de la Loire direction, and RORO at the top of the Grand Ouest seminar.
(()=>{
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  const card=(sign,x,y,z,w,h,paint)=>sign(x,y,z,w,h,(c,W,H)=>{
    c.clearRect(0,0,W,H);paint(c,W,H);
  });

  function businessBoard(c,W,H){
    const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f7f3ec');g.addColorStop(1,'#ebe5e6');
    c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#3d4650';c.font='900 '+H*.105+'px system-ui';c.textBaseline='middle';c.fillText('BUSINESS & DÉVELOPPEMENT',W*.055,H*.12,W*.86);
    c.strokeStyle='#bc5f91';c.lineWidth=Math.max(3,H*.012);c.beginPath();c.moveTo(W*.055,H*.2);c.lineTo(W*.945,H*.2);c.stroke();
    const cols=[['PROSPECTS','#5d8aa8'],['OPPORTUNITÉS','#b85e90'],['CLIENTS','#668b69']];
    cols.forEach(([label,color],i)=>{
      const x=W*(.06+i*.305),bw=W*.27;
      c.fillStyle=color+'22';c.fillRect(x,H*.28,bw,H*.43);
      c.strokeStyle=color;c.lineWidth=Math.max(2,H*.008);c.strokeRect(x,H*.28,bw,H*.43);
      c.fillStyle=color;c.font='900 '+H*.055+'px system-ui';c.fillText(label,x+W*.018,H*.34,bw-W*.03);
      const n=[12,7,4][i];c.font='900 '+H*.17+'px system-ui';c.fillText(String(n),x+W*.02,H*.53,bw-W*.04);
      c.font='800 '+H*.038+'px system-ui';c.fillText(i===0?'PIPELINE':i===1?'TJM · CV · STAFFING':'SUIVI · FIDÉLISATION',x+W*.02,H*.65,bw-W*.04);
    });
    c.fillStyle='#3d4650';c.font='800 '+H*.045+'px system-ui';c.fillText('OBJECTIF : TRANSFORMER LES OPPORTUNITÉS EN MISSIONS RÉALISABLES',W*.055,H*.82,W*.87);
    c.fillStyle='#bc5f91';c.font='900 '+H*.052+'px system-ui';c.fillText('CHACHA · BUSINESS MANAGER',W*.055,H*.92,W*.75);
  }

  function addBusinessOffice(mesh,sign,surface){
    const floor=2,fy=surface(floor,0),wallY=fy+1.35;
    // A dedicated business bay hides the generic wall cards on this floor and makes CHACHA's
    // empty workplace the narrative clue that sends KÉKÉ towards the Power UP Tour.
    mesh.box(0,wallY,-1.17,14.4,2.72,.13,'#493b4c');
    for(const x of [-7.12,7.12])mesh.box(x,wallY,-1.02,.16,2.72,.18,'#c5a260');

    const board={level:0,floor,name:'CHACHA',x:-2.45,y:fy+1.7,z:-.95,w:4.55,h:1.55};
    mesh.box(board.x,board.y,board.z-.07,board.w+.18,board.h+.17,.09,'#776b75');
    mesh.box(board.x,board.y,board.z-.025,board.w+.05,board.h+.04,.04,'#c7c7c0');
    const item=card(sign,board.x,board.y,board.z,board.w,board.h,businessBoard);
    globalThis.OfficeBoards=globalThis.OfficeBoards||[];
    globalThis.OfficeBoards.push({...board,canvas:item.surface});

    const plaqueX=2.35,plaqueY=fy+1.82;
    mesh.box(plaqueX,plaqueY,-1.02,2.8,.66,.08,'#c6a052');
    card(sign,plaqueX,plaqueY,-.96,2.68,.57,(c,W,H)=>{
      c.fillStyle='#313844';c.fillRect(0,0,W,H);c.strokeStyle='#c6a052';c.lineWidth=7;c.strokeRect(4,4,W-8,H-8);
      c.fillStyle='#f2e7c7';c.font='900 '+H*.29+'px system-ui';c.textBaseline='middle';c.fillText('CHACHA',W*.07,H*.34,W*.86);
      c.fillStyle='#d7a7c4';c.font='900 '+H*.18+'px system-ui';c.fillText('BUSINESS MANAGER',W*.07,H*.72,W*.86);
    });

    const deskX=1.8,dy=surface(floor,deskX),z=-.55;
    mesh.box(deskX,dy+.55,z,3.8,.16,.86,'#8a684e');
    for(const dx of [-1.35,1.35])mesh.box(deskX+dx,dy+.25,z,.18,.52,.66,'#624b3b');
    mesh.box(deskX-.25,dy+1.05,z+.12,1.38,.82,.13,'#263843');
    mesh.box(deskX-.25,dy+1.05,z+.20,1.20,.66,.025,'#d6e8df');
    card(sign,deskX-.25,dy+1.05,z+.225,1.14,.60,(c,W,H)=>{
      c.fillStyle='#21323a';c.fillRect(0,0,W,H);
      c.fillStyle='#d7f095';c.font='900 '+H*.12+'px system-ui';c.fillText('PIPELINE',W*.06,H*.16,W*.75);
      const vals=[.34,.62,.82,.48];vals.forEach((v,i)=>{c.fillStyle=['#6e9cab','#bc6993','#d2b15f','#6b956d'][i];c.fillRect(W*(.08+i*.21),H*(.84-v*.55),W*.12,H*v*.55);});
    });
    // Empty chair: CHACHA is not here. The small event card makes the absence explicit.
    mesh.box(deskX+.78,dy+.43,.02,.68,.18,.65,'#855f79');
    mesh.box(deskX+.78,dy+.89,-.20,.68,.82,.15,'#855f79');
    for(const sx of [-.25,.25])mesh.cylinder(deskX+.78+sx,dy+.12,.02,.065,.24,'#263843',8);
    card(sign,5.55,fy+1.7,-.95,2.5,1.32,(c,W,H)=>{
      const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#233b50');g.addColorStop(1,'#5f3b58');c.fillStyle=g;c.fillRect(0,0,W,H);
      c.fillStyle='#d9f18a';c.font='900 '+H*.11+'px system-ui';c.textAlign='center';c.fillText('ABSENTE',W/2,H*.2,W*.9);
      c.fillStyle='#fff0d0';c.font='900 '+H*.13+'px system-ui';c.fillText('POWER UP',W/2,H*.44,W*.88);c.fillText('TOUR',W/2,H*.59,W*.88);
      c.fillStyle='#f0b4d1';c.font='800 '+H*.065+'px system-ui';c.fillText('SÉMINAIRE · ROOFTOP',W/2,H*.81,W*.9);
    });
  }

  function seminarDecor(mesh,sign,surface){
    const floor1=surface(1,0),floor2=surface(2,0);
    card(sign,0,floor1+1.55,-1.12,8.9,1.05,(c,W,H)=>{
      const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#173247');g.addColorStop(.55,'#31556b');g.addColorStop(1,'#684158');c.fillStyle=g;c.fillRect(0,0,W,H);
      c.fillStyle='#d9f18a';c.font='900 '+H*.26+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('POWER UP TOUR',W/2,H*.43,W*.9);
      c.fillStyle='#f4e9d1';c.font='800 '+H*.095+'px system-ui';c.fillText('RÉGION GRAND OUEST · LEADERSHIP · CROISSANCE · ALIGNEMENT',W/2,H*.76,W*.9);
    });
    // Seminar podium and lounge on the two middle floors. They replace the old CHACHA office here.
    mesh.box(0,floor1+.18,-.45,4.3,.35,1.45,'#634557');
    mesh.box(0,floor1+.62,-.55,1.05,.88,.75,'#2d4754');
    card(sign,0,floor1+.88,-.12,.82,.42,(c,W,H)=>{c.fillStyle='#203b48';c.fillRect(0,0,W,H);c.fillStyle='#d9f18a';c.font='900 '+H*.34+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('POWER UP',W/2,H*.52,W*.9);});

    for(const x of [-5.3,4.8]){
      mesh.box(x,floor2+.37,-.52,2.3,.50,.82,'#745d72');
      mesh.box(x,floor2+.78,-.78,2.3,.70,.18,'#8d7087');
      for(const sx of [-.9,.9])mesh.box(x+sx,floor2+.18,-.52,.16,.38,.7,'#4b3e49');
    }
    mesh.box(0,floor2+.34,-.52,2.0,.25,.9,'#b98f66');
    for(let i=0;i<5;i++)mesh.cylinder(-.7+i*.35,floor2+.56,-.52,.10,.09,i%2?'#e0c384':'#dca3b4',8);
    card(sign,0,floor2+1.55,-1.08,4.6,.82,(c,W,H)=>{
      c.fillStyle='#263c49';c.fillRect(0,0,W,H);c.fillStyle='#f1d38a';c.font='900 '+H*.21+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('ESPACE VIP · DIRECTION RÉGION GRAND OUEST',W/2,H*.48,W*.92);
      c.fillStyle='#a9d2df';c.font='800 '+H*.095+'px system-ui';c.fillText('BUFFET · RÉSULTATS · ARBITRAGES',W/2,H*.76,W*.9);
    });
  }

  function shiftedRoroMesh(mesh){
    const wrapper={};
    for(const method of ['box','cylinder','ring','tri','quad']){
      if(typeof mesh[method]!=='function')continue;
      wrapper[method]=(...args)=>{
        // The old level-3 layout drew RORO on floor 1 and CHACHA on floor 2.
        // Keep only RORO and move the complete office two floors upward.
        if(method==='box'||method==='cylinder'||method==='ring'){
          const y=args[1];if(Number.isFinite(y)){if(y>=5.75)return;args[1]=y+6;}
        }
        return mesh[method](...args);
      };
    }
    return wrapper;
  }

  function shiftedRoroSign(sign){
    return (x,y,z,w,h,draw)=>{
      if(y>=5.75){const surface=document.createElement('canvas');surface.width=1;surface.height=1;return {surface,update(){},move(){}};}
      return sign(x,y+6,z,w,h,draw);
    };
  }

  decor.draw=(mesh,sign,level,surface)=>{
    if(level===2){
      originalDraw(shiftedRoroMesh(mesh),shiftedRoroSign(sign),level,surface);
      const roro=(globalThis.OfficeBoards||[]).find(b=>b.name==='RORO');
      if(roro){roro.floor=3;roro.y+=6;globalThis.OfficeBoards=[roro];globalThis.OfficeBoard=roro;}
      else {globalThis.OfficeBoards=[];globalThis.OfficeBoard=null;}
      seminarDecor(mesh,sign,surface);
      return;
    }
    originalDraw(mesh,sign,level,surface);
    if(level===0)addBusinessOffice(mesh,sign,surface);
  };
})();
