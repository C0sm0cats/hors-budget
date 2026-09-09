'use strict';
// Keep the office geography aligned with the story: KÉKÉ + CHACHA in the LCP7 open space,
// JUJU in the Pays de la Loire direction, and RORO in a native Grand Ouest seminar/VIP zone.
(()=>{
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  const card=(sign,x,y,z,w,h,paint)=>sign(x,y,z,w,h,(c,W,H)=>{c.clearRect(0,0,W,H);paint(c,W,H);});
  const glyphs={
    a:'M11 9 Q3 4 2 13 Q1 24 10 18 L12 7 L11 20',b:'M4 0 L1 20 M3 12 Q12 3 13 11 Q14 21 2 20',c:'M12 9 Q5 4 2 12 Q0 22 11 19',d:'M11 9 Q3 5 2 13 Q0 23 10 18 L14 0 L11 20',e:'M2 14 Q14 14 11 8 Q7 4 3 10 Q-1 23 12 18',f:'M3 24 L7 4 Q10 -3 14 2 M1 10 L12 9',g:'M12 9 Q4 4 2 13 Q1 23 11 17 M13 7 L9 26 Q5 31 1 26',h:'M5 0 L1 20 M3 13 Q12 4 13 10 L11 20',i:'M6 8 L4 18 Q4 22 9 18 M7 2 L7.5 2.5',j:'M8 8 L5 26 Q2 31 -2 26 M9 2 L9.5 2.5',k:'M5 0 L1 20 M13 8 L3 15 L12 21',l:'M3 17 Q14 2 9 0 Q5 -1 3 15 Q2 23 10 18',m:'M1 20 L3 8 L3 15 Q9 3 9 10 L8 20 Q14 4 16 9 L15 20',n:'M1 20 L3 8 L3 15 Q11 3 12 10 L10 20',o:'M10 8 Q2 4 1 14 Q0 23 9 19 Q16 10 10 8 Z',p:'M0 27 L4 8 M3 12 Q11 3 13 10 Q15 20 3 19',q:'M12 9 Q4 4 2 12 Q0 23 11 17 M13 7 L9 28',r:'M2 20 L4 8 L4 14 Q10 4 14 9',s:'M12 8 Q4 5 3 10 Q2 13 9 14 Q16 21 1 20',t:'M8 2 L5 17 Q4 23 12 18 M1 9 L14 8',u:'M3 8 L1 17 Q2 25 11 15 M13 8 L10 20',v:'M2 8 L5 20 Q12 14 14 7',w:'M2 8 L3 20 L10 10 L11 20 L18 7',x:'M2 8 L12 20 M13 7 L1 21',y:'M2 8 L5 19 L13 7 M13 7 L6 26 Q3 30 0 26',z:'M2 9 L14 8 L1 20 L13 19',
    A:'M0 21 L9 0 L16 20 M4 13 L13 12',B:'M1 21 L4 1 Q20 -1 13 9 L3 11 Q23 6 15 18 Q10 22 1 21',C:'M15 3 Q5 -2 2 10 Q-1 24 13 18',D:'M2 21 L4 1 Q22 0 17 12 Q13 22 2 21',E:'M17 0 L5 1 L1 20 L14 20 M4 10 L13 9',F:'M1 21 L4 1 L18 0 M3 10 L14 9',G:'M17 3 Q5 -3 2 10 Q-1 25 15 18 L16 11 L9 11',H:'M4 0 L1 21 M18 0 L14 21 M3 11 L16 10',I:'M3 1 L15 0 M10 1 L6 20 M0 21 L13 20',J:'M4 1 L18 0 M13 1 L10 17 Q6 25 0 18',K:'M4 0 L1 20 M16 0 L3 12 L14 21',L:'M4 0 L1 20 L15 19',M:'M0 20 L4 0 L9 14 L17 0 L16 20',N:'M1 21 L4 0 L14 20 L18 0',O:'M11 0 Q2 -1 1 12 Q0 24 12 20 Q22 14 18 4 Q16 0 11 0 Z',P:'M1 21 L4 1 Q19 -2 16 7 Q15 12 3 11',R:'M1 21 L4 1 Q19 -2 16 7 Q15 12 3 11 M8 11 L15 21',S:'M16 2 Q5 -3 3 5 Q1 10 11 11 Q23 22 1 20',T:'M0 1 L20 0 M11 1 L7 21',U:'M3 0 L1 15 Q2 27 13 17 L17 0',V:'M1 1 L6 21 L19 0',
    '0':'M8 0 Q0 0 1 13 Q2 23 10 19 Q17 13 13 3 Q12 0 8 0 Z','1':'M2 6 L9 0 L5 21 M0 21 L12 21','2':'M1 5 Q8 -4 14 3 Q18 8 1 20 L15 20','3':'M2 2 Q18 -2 12 8 L7 11 Q20 9 13 18 Q7 24 0 19','4':'M13 0 L1 14 L17 14 M12 0 L9 22','7':'M1 1 L16 0 L5 21','&':'M15 20 Q-2 6 7 1 Q15 -3 13 5 Q10 9 3 13 Q-2 22 9 21 Q15 19 18 11','/':'M1 23 L14 -1',':':'M6 7 L6.5 7.5 M4 18 L4.5 18.5','—':'M0 12 L20 11'
  };
  function pen(c,text,x,y,size,color,maxWidth=Infinity){
    maxWidth=Math.min(maxWidth,980-x);
    const advance=ch=>ch===' '?10:'il'.includes(ch)?12:'mwMO'.includes(ch)?22:18;
    const width=[...text].reduce((n,ch)=>n+advance(ch),0)*size;
    size*=Math.min(1,maxWidth/width);
    c.save();c.translate(x,y);c.strokeStyle=color;c.lineCap='round';c.lineJoin='round';
    let cursor=0;
    [...text].forEach((ch,i)=>{
      if(ch!==' '){const base=ch.normalize('NFD')[0],path=glyphs[base]||glyphs[ch];if(path){c.save();c.translate(cursor,Math.sin(i*1.8)*.7);c.scale(size,size);c.rotate(Math.sin(i*2.3)*.02);c.lineWidth=2+Math.sin(i)*.12;c.stroke(new Path2D(path));if(ch!==base){if(base===base.toUpperCase())c.translate(0,-5);c.stroke(new Path2D(ch==='ê'||ch==='ô'?'M3 3 L8 -1 L13 3':ch==='à'||ch==='è'?'M5 -1 L9 3':'M6 3 L11 -1'));}c.restore();}}
      cursor+=advance(ch)*size;
    });
    c.restore();
  }
  function roughRect(c,x,y,w,h,color,seed=0){c.save();c.strokeStyle=color;c.lineWidth=4;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(x+2,y+Math.sin(seed)*2);c.lineTo(x+w-3,y+2);c.lineTo(x+w,y+h-3);c.lineTo(x+3,y+h);c.closePath();c.stroke();c.restore();}

  function businessBoard(c,W,H){
    c.scale(W/1000,H/520);const g=c.createLinearGradient(0,0,1000,520);g.addColorStop(0,'#f6f4eb');g.addColorStop(1,'#e7e6df');c.fillStyle=g;c.fillRect(0,0,1000,520);
    const ink='#344753',pink='#ad5192',blue='#21699b',green='#38855a';
    pen(c,'Business & Développement',42,28,2.3,ink,900);c.strokeStyle=pink;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(42,88);c.lineTo(918,83);c.stroke();
    const cols=[{x:58,w:275,color:blue,title:'PROSPECTS',value:'12',sub:'pipeline'},{x:365,w:275,color:pink,title:'OPPORTUNITÉS',value:'7',sub:'TJM / CV / STAFFING'},{x:672,w:270,color:green,title:'CLIENTS',value:'4',sub:'suivi / fidélisation'}];
    cols.forEach((col,i)=>{roughRect(c,col.x,126,col.w,190,col.color,i+.7);pen(c,col.title,col.x+18,145,1.48,col.color,col.w-34);pen(c,col.value,col.x+24,198,3.8,col.color,col.w*.55);pen(c,col.sub,col.x+18,278,1.25,col.color,col.w-34);});
    // Reserve separate lower columns for the objective and CHACHA's absence note.
    pen(c,'objectif : transformer',55,350,1.4,ink,440);
    pen(c,'les opportunités',55,390,1.4,ink,440);
    pen(c,'en missions réalisables',55,430,1.4,ink,440);
    pen(c,'Au Power UP Tour',550,350,1.65,pink,405);
    pen(c,'retour après le séminaire',550,400,1.25,pink,405);
    pen(c,'— CHACHA',600,446,2,pink,260);
    c.strokeStyle=pink;c.lineWidth=4;c.beginPath();c.arc(926,459,20,0,Math.PI);c.moveTo(914,442);c.lineTo(914,445);c.moveTo(938,442);c.lineTo(938,445);c.stroke();
  }

  function addBusinessOffice(mesh,sign,surface){
    const floor=2,fy=surface(floor,0),wallY=fy+1.35;mesh.box(0,wallY,-1.17,14.4,2.72,.13,'#493b4c');for(const x of [-7.12,7.12])mesh.box(x,wallY,-1.02,.16,2.72,.18,'#c5a260');
    const board={level:0,floor,name:'CHACHA',x:-2.45,y:fy+1.7,z:-.95,w:4.55,h:1.55};mesh.box(board.x,board.y,board.z-.07,board.w+.18,board.h+.17,.09,'#776b75');mesh.box(board.x,board.y,board.z-.025,board.w+.05,board.h+.04,.04,'#c7c7c0');
    const item=card(sign,board.x,board.y,board.z,board.w,board.h,businessBoard);globalThis.OfficeBoards=globalThis.OfficeBoards||[];globalThis.OfficeBoards.push({...board,canvas:item.surface});
    const plaqueX=2.35,plaqueY=fy+1.82;mesh.box(plaqueX,plaqueY,-1.02,3.1,.82,.08,'#c6a052');card(sign,plaqueX,plaqueY,-.96,2.98,.73,(c,W,H)=>{c.fillStyle='#313844';c.fillRect(0,0,W,H);c.strokeStyle='#c6a052';c.lineWidth=7;c.strokeRect(4,4,W-8,H-8);c.textAlign='center';c.textBaseline='middle';c.fillStyle='#f2e7c7';c.font='900 '+H*.27+'px system-ui';c.fillText('CHACHA',W*.5,H*.34,W*.82);c.fillStyle='#d7b9cf';c.font='800 '+H*.145+'px system-ui';c.fillText('BUSINESS MANAGER',W*.5,H*.69,W*.88);});
    const deskX=1.8,dy=surface(floor,deskX),z=-.55;mesh.box(deskX,dy+.55,z,3.8,.16,.86,'#8a684e');for(const dx of [-1.35,1.35])mesh.box(deskX+dx,dy+.25,z,.18,.52,.66,'#624b3b');mesh.box(deskX-.25,dy+1.05,z+.12,1.38,.82,.13,'#263843');mesh.box(deskX-.25,dy+1.05,z+.20,1.20,.66,.035,'#2d414b');
    mesh.box(deskX-.21,dy+.79,z+.26,.25,.46,.13,'#4f646d');
    mesh.box(deskX+.78,dy+.43,.02,.68,.18,.65,'#855f79');mesh.box(deskX+.78,dy+.89,-.20,.68,.82,.15,'#855f79');for(const sx of [-.25,.25])mesh.cylinder(deskX+.78+sx,dy+.12,.02,.065,.24,'#263843',8);
  }

  function regionalBoard(c,W,H){
    c.scale(W/1000,H/520);const g=c.createLinearGradient(0,0,1000,520);g.addColorStop(0,'#f5f3e9');g.addColorStop(1,'#e2e7e4');c.fillStyle=g;c.fillRect(0,0,1000,520);
    const ink='#344753',blue='#21699b',green='#38855a',gold='#a67b31',red='#ca485b';
    pen(c,'Activité Région Grand Ouest',40,28,2.35,ink,920);c.strokeStyle=blue;c.lineWidth=4;c.beginPath();c.moveTo(40,88);c.lineTo(930,84);c.stroke();
    pen(c,'RÉSULTATS',55,126,1.7,blue,300);c.strokeStyle=blue;c.lineWidth=5;c.beginPath();c.moveTo(65,300);c.lineTo(65,172);c.lineTo(445,172);c.stroke();
    const pts=[[95,274],[190,248],[285,218],[395,184]];c.strokeStyle=green;c.lineWidth=7;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();pts.forEach(([x,y])=>{c.fillStyle=green;c.beginPath();c.arc(x,y,7,0,Math.PI*2);c.fill();});
    roughRect(c,515,128,405,190,gold,.4);pen(c,'BUDGET',545,153,1.65,gold,320);pen(c,'OBJECTIFS',545,210,1.4,ink,320);pen(c,'ARBITRAGES',545,258,1.4,red,320);
    pen(c,'stratégie · performance · région',70,370,1.45,ink,760);pen(c,'— RORO',760,435,2.1,blue,190);
  }

  function addRegionalDirectionZone(mesh,sign,surface){
    globalThis.OfficeBoards=[];globalThis.OfficeBoard=null;
    const floor=3,fy=surface(floor,0),wallY=fy+1.35;mesh.box(0,wallY,-1.18,14.4,2.72,.13,'#284653');for(const x of [-7.12,7.12])mesh.box(x,wallY,-1.02,.16,2.72,.18,'#c5a260');
    const board={level:2,floor,name:'RORO',x:-2.0,y:fy+1.70,z:-.96,w:4.9,h:1.55};mesh.box(board.x,board.y,board.z-.07,board.w+.18,board.h+.17,.09,'#66777c');mesh.box(board.x,board.y,board.z-.025,board.w+.05,board.h+.04,.04,'#c7ccc7');
    const item=card(sign,board.x,board.y,board.z,board.w,board.h,regionalBoard);globalThis.OfficeBoards.push({...board,canvas:item.surface});globalThis.OfficeBoard=globalThis.OfficeBoards[0];
    const plaqueX=3.25,plaqueY=fy+1.82;mesh.box(plaqueX,plaqueY,-1.03,3.35,.72,.08,'#c6a052');card(sign,plaqueX,plaqueY,-.97,3.23,.63,(c,W,H)=>{c.fillStyle='#223c49';c.fillRect(0,0,W,H);c.strokeStyle='#c6a052';c.lineWidth=7;c.strokeRect(4,4,W-8,H-8);c.textAlign='center';c.textBaseline='middle';c.fillStyle='#f4e7c3';c.font='900 '+H*.28+'px system-ui';c.fillText('RORO',W*.5,H*.31,W*.86);c.fillStyle='#acd0db';c.font='800 '+H*.14+'px system-ui';c.fillText('DIRECTEUR RÉGION GRAND OUEST',W*.5,H*.69,W*.9);});
    // Table d'arbitrage, dos du moniteur et mobilier premium : une zone de direction dans le séminaire,
    // pas un ancien bureau privé déplacé depuis un autre étage.
    const tx=2.2,ty=surface(floor,tx);mesh.box(tx,ty+.55,-.48,3.5,.16,.92,'#8d6a4c');for(const dx of [-1.25,1.25])mesh.box(tx+dx,ty+.25,-.48,.18,.52,.72,'#5d493a');mesh.box(tx-.15,ty+1.08,-.26,1.45,.88,.14,'#263943');
    mesh.box(tx-.15,ty+1.08,-.18,1.28,.73,.035,'#2d414b');
    mesh.box(tx-.11,ty+.79,-.12,.25,.46,.13,'#4f646d');
    mesh.box(6.2,ty+.34,-.50,1.85,.46,.75,'#61566a');mesh.box(6.2,ty+.74,-.70,1.85,.64,.18,'#77697d');mesh.cylinder(5.0,ty+.25,-.55,.28,.50,'#d7d1bd',8,.22);for(const [dx,a] of [[-.22,-.45],[0,0],[.22,.45]])mesh.box(5.0+dx,ty+.86,-.55,.16,.92,.07,'#4f854d',a);
  }

  function seminarDecor(mesh,sign,surface){
    const floor1=surface(1,0),floor2=surface(2,0);card(sign,0,floor1+1.55,-1.12,8.9,1.05,(c,W,H)=>{const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#173247');g.addColorStop(.55,'#31556b');g.addColorStop(1,'#684158');c.fillStyle=g;c.fillRect(0,0,W,H);c.fillStyle='#d9f18a';c.font='900 '+H*.26+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('POWER UP TOUR',W/2,H*.43,W*.9);c.fillStyle='#f4e9d1';c.font='800 '+H*.095+'px system-ui';c.fillText('RÉGION GRAND OUEST · LEADERSHIP · CROISSANCE · ALIGNEMENT',W/2,H*.76,W*.9);});
    mesh.box(0,floor1+.18,-.45,4.3,.35,1.45,'#634557');mesh.box(0,floor1+.62,-.55,1.05,.88,.75,'#2d4754');card(sign,0,floor1+.88,-.12,.82,.42,(c,W,H)=>{c.fillStyle='#203b48';c.fillRect(0,0,W,H);c.fillStyle='#d9f18a';c.font='900 '+H*.34+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('POWER UP',W/2,H*.52,W*.9);});
    for(const x of [-5.3,4.8]){mesh.box(x,floor2+.37,-.52,2.3,.50,.82,'#745d72');mesh.box(x,floor2+.78,-.78,2.3,.70,.18,'#8d7087');for(const sx of [-.9,.9])mesh.box(x+sx,floor2+.18,-.52,.16,.38,.7,'#4b3e49');}
    mesh.box(0,floor2+.34,-.52,2,.25,.9,'#b98f66');for(let i=0;i<5;i++)mesh.cylinder(-.7+i*.35,floor2+.56,-.52,.10,.09,i%2?'#e0c384':'#dca3b4',8);
    card(sign,0,floor2+1.55,-1.08,4.6,.82,(c,W,H)=>{c.fillStyle='#263c49';c.fillRect(0,0,W,H);c.fillStyle='#f1d38a';c.font='900 '+H*.21+'px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('ESPACE VIP · DIRECTION RÉGION GRAND OUEST',W/2,H*.48,W*.92);c.fillStyle='#a9d2df';c.font='800 '+H*.095+'px system-ui';c.fillText('BUFFET · RÉSULTATS · ARBITRAGES',W/2,H*.76,W*.9);});
  }

  decor.draw=(mesh,sign,level,surface)=>{
    if(level===2){addRegionalDirectionZone(mesh,sign,surface);seminarDecor(mesh,sign,surface);return;}
    originalDraw(mesh,sign,level,surface);
    if(level===0)addBusinessOffice(mesh,sign,surface);
  };
})();
