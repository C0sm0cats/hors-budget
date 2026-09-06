'use strict';
// Native geometry and pen strokes reproduce the two reference offices without external assets.
(()=>{
const glyphs={
        a:'M11 9 Q3 4 2 13 Q1 24 10 18 L12 7 L11 20',
        c:'M12 9 Q5 4 2 12 Q0 22 11 19',
        d:'M11 9 Q3 5 2 13 Q0 23 10 18 L14 0 L11 20',
        e:'M2 14 Q14 14 11 8 Q7 4 3 10 Q-1 23 12 18',
        f:'M3 24 L7 4 Q10 -3 14 2 M1 10 L12 9',
        g:'M12 9 Q4 4 2 13 Q1 23 11 17 M13 7 L9 26 Q5 31 1 26',
        i:'M6 8 L4 18 Q4 22 9 18 M7 2 L7.5 2.5',
        l:'M3 17 Q14 2 9 0 Q5 -1 3 15 Q2 23 10 18',
        m:'M1 20 L3 8 L3 15 Q9 3 9 10 L8 20 Q14 4 16 9 L15 20',
        n:'M1 20 L3 8 L3 15 Q11 3 12 10 L10 20',
        o:'M10 8 Q2 4 1 14 Q0 23 9 19 Q16 10 10 8 Z',
        p:'M0 27 L4 8 M3 12 Q11 3 13 10 Q15 20 3 19',
        r:'M2 20 L4 8 L4 14 Q10 4 14 9',
        s:'M12 8 Q4 5 3 10 Q2 13 9 14 Q16 21 1 20',
        t:'M8 2 L5 17 Q4 23 12 18 M1 9 L14 8',
        u:'M3 8 L1 17 Q2 25 11 15 M13 8 L10 20',
        v:'M2 8 L5 20 Q12 14 14 7',
        C:'M15 3 Q5 -2 2 10 Q-1 24 13 18',
        I:'M3 1 L15 0 M10 1 L6 20 M0 21 L13 20',
        K:'M4 0 L1 20 M16 0 L3 12 L14 21',
        M:'M0 20 L4 0 L9 14 L17 0 L16 20',
        P:'M1 21 L4 1 Q19 -2 16 7 Q15 12 3 11',
        R:'M1 21 L4 1 Q19 -2 16 7 Q15 12 3 11 M8 11 L15 21',
        E:'M17 0 L5 1 L1 20 L14 20 M4 10 L13 9',
        S:'M16 2 Q5 -3 3 5 Q1 10 11 11 Q23 22 1 20',
        '3':'M2 2 Q18 -2 12 8 L7 11 Q20 9 13 18 Q7 24 0 19',
        '1':'M2 6 L9 0 L5 21 M0 21 L12 21',
        '-':'M2 12 L14 11'
      };
  Object.assign(glyphs,{
    b:'M4 0 L1 20 M3 12 Q12 3 13 11 Q14 21 2 20',
    h:'M5 0 L1 20 M3 13 Q12 4 13 10 L11 20',
    j:'M8 8 L5 26 Q2 31 -2 26 M9 2 L9.5 2.5',
    k:'M5 0 L1 20 M13 8 L3 15 L12 21',
    q:'M12 9 Q4 4 2 12 Q0 23 11 17 M13 7 L9 28',
    w:'M2 8 L3 20 L10 10 L11 20 L18 7',
    x:'M2 8 L12 20 M13 7 L1 21',
    y:'M2 8 L5 19 L13 7 M13 7 L6 26 Q3 30 0 26',
    z:'M2 9 L14 8 L1 20 L13 19',
    A:'M0 21 L9 0 L16 20 M4 13 L13 12',
    B:'M1 21 L4 1 Q20 -1 13 9 L3 11 Q23 6 15 18 Q10 22 1 21',
    D:'M2 21 L4 1 Q22 0 17 12 Q13 22 2 21',
    F:'M1 21 L4 1 L18 0 M3 10 L14 9',
    G:'M17 3 Q5 -3 2 10 Q-1 25 15 18 L16 11 L9 11',
    H:'M4 0 L1 21 M18 0 L14 21 M3 11 L16 10',
    J:'M4 1 L18 0 M13 1 L10 17 Q6 25 0 18',
    L:'M4 0 L1 20 L15 19',
    N:'M1 21 L4 0 L14 20 L18 0',
    O:'M11 0 Q2 -1 1 12 Q0 24 12 20 Q22 14 18 4 Q16 0 11 0 Z',
    T:'M0 1 L20 0 M11 1 L7 21',
    U:'M3 0 L1 15 Q2 27 13 17 L17 0',
    V:'M1 1 L6 21 L19 0',
    '0':'M8 0 Q0 0 1 13 Q2 23 10 19 Q17 13 13 3 Q12 0 8 0 Z',
    '2':'M1 5 Q8 -4 14 3 Q18 8 1 20 L15 20',
    '5':'M15 1 L4 1 L2 10 Q17 6 15 15 Q12 24 1 19',
    '6':'M14 1 Q3 -1 1 13 Q0 24 10 20 Q18 13 10 10 Q5 8 1 14',
    '9':'M12 10 Q1 15 1 5 Q2 -3 12 1 Q18 5 11 17 L7 22',
    '%':'M2 21 L16 0 M4 0 Q-2 1 1 6 Q7 9 7 3 Q7 0 4 0 Z M13 14 Q7 15 10 20 Q16 24 17 17 Q17 14 13 14 Z',
    '/':'M1 23 L14 -1',
    ':':'M6 7 L6.5 7.5 M4 18 L4.5 18.5',
    '!':'M8 0 L5 14 M4 20 L4.5 20.5',
    '↑':'M8 21 L10 0 M3 8 L10 0 L16 8',
    '→':'M0 11 L20 10 L14 4 M20 10 L13 17',
    '—':'M0 12 L20 11',
    '•':'M5 10 L6 11'
  });
  function pen(c,text,x,y,size,color,maxWidth=Infinity){
    maxWidth=Math.min(maxWidth,980-x);
    const advance=ch=>ch===' '?10:'il'.includes(ch)?12:'mwMO'.includes(ch)?22:18;
    const width=[...text].reduce((n,ch)=>n+advance(ch),0)*size;
    size*=Math.min(1,maxWidth/width);
    c.save();c.translate(x,y);c.strokeStyle=color;c.lineCap='round';c.lineJoin='round';
    let cursor=0;
    [...text].forEach((ch,i)=>{
      if(ch!==' '){
        const base=ch.normalize('NFD')[0];
        c.save();c.translate(cursor,Math.sin(i*1.8)*.7);c.scale(size,size);c.rotate(Math.sin(i*2.3)*.02);
        c.lineWidth=2.0+Math.sin(i)*.12;c.stroke(new Path2D(glyphs[base]));
        if(ch!==base)c.stroke(new Path2D(ch==='ê'||ch==='ô'?'M3 3 L8 -1 L13 3':ch==='à'||ch==='è'?'M5 -1 L9 3':'M6 3 L11 -1'));
        c.restore();
      }
      cursor+=advance(ch)*size;
    });c.restore();
  }
  const ink='#344753',red='#ca485b',green='#38855a',blue='#21699b',pink='#ad5192';
  function paper(c,W,H,height){c.scale(W/1000,H/height);const g=c.createLinearGradient(0,0,1000,height);g.addColorStop(0,'#f6f4eb');g.addColorStop(1,'#e7e6df');c.fillStyle=g;c.fillRect(0,0,1000,height);}
  function kevinBoard(c,W,H){
    paper(c,W,H,560);
    pen(c,'Congés – Tips'.replace('–','—'),90,35,3,ink,800);
    ['Poser les CP tôt','Éviter les ponts','Pas de report au-delà du 31/05','Anticiper avec le manager'].forEach((t,i)=>pen(c,'• '+t,55,112+i*47,1.8,red,890));
    ['Il faut privilégier les CP puis RS puis RE',
     'car les CP ne peuvent pas être reportés',
     'au delà du 31 Mai'].forEach((text,i)=>pen(c,text,55,323+i*39,1.45,blue,890));
    pen(c,'— Kévin',705,455,2.4,red,250);
    c.strokeStyle=red;c.lineWidth=6;c.lineCap='round';c.beginPath();c.arc(196,474,29,.12,Math.PI-.12);c.stroke();
    c.beginPath();c.moveTo(180,453);c.lineTo(181,455);c.moveTo(211,453);c.lineTo(212,455);c.stroke();
  }
  function julienBoard(c,W,H){
    paper(c,W,H,360);
    pen(c,'INTERCONTRAT',30,22,2.4,ink,450);pen(c,'MARGE / SALAIRES',540,25,1.85,blue,440);
    c.strokeStyle=ink;c.lineWidth=4;c.lineCap='round';
    c.beginPath();c.moveTo(35,84);c.lineTo(35,228);c.lineTo(420,220);c.moveTo(520,68);c.lineTo(520,231);c.lineTo(968,226);c.stroke();
    const dots=[[55,105],[167,154],[276,183],[390,205]];
    c.strokeStyle=red;c.lineWidth=6;c.beginPath();dots.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();
    dots.forEach(([x,y],i)=>{c.fillStyle=red;c.beginPath();c.arc(x,y,6,0,7);c.fill();pen(c,['12 %','9 %','6 %','3 %'][i],x-8,y-31,1.3,green,70);});
    pen(c,'0 %',427,212,1.3,green);pen(c,'objectif : 0 %',86,255,2,green);
    const up=[[544,208],[659,171],[775,138],[913,96]];
    c.strokeStyle=blue;c.beginPath();up.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();
    up.forEach(([x,y])=>{c.fillStyle=blue;c.beginPath();c.arc(x,y,6,0,7);c.fill();});
    c.strokeStyle=pink;c.beginPath();c.moveTo(544,211);c.lineTo(960,199);c.stroke();
    [555,667,778,908].forEach(x=>{c.fillStyle=pink;c.beginPath();c.arc(x,211-(x-544)*12/416,5,0,7);c.fill();});
    pen(c,'marge ↑',829,59,1.35,blue,145);pen(c,'salaires →',817,164,1.25,pink,157);
    pen(c,'— Julien',805,264,1.9,blue,170);
    pen(c,'capacité immédiatement disponible !',30,318,1.6,ink,760);
  }
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
    if(level>1)return;
    const julien=level===1,board={x:julien?-1.15:-1.9,y:4.72,z:-1.22,w:julien?5.3:2.9,h:1.50};
    const {x,y,z,w,h}=board;
    mesh.box(x,y,z-.07,w+.18,h+.16,.10,'#737f83');
    mesh.box(x,y,z-.015,w+.06,h+.04,.045,'#c2c8c3');
    mesh.box(x,y-h/2-.055,z+.13,w+.16,.07,.28,'#7e8d90');
    const item=sign(x,y,z+.02,w,h,julien?julienBoard:kevinBoard);
    globalThis.OfficeBoard={level,...board,z:z+.02,canvas:item.surface};
    const plaqueX=julien?3.05:1.45,plaqueY=4.87,plaqueW=2.12;
    mesh.box(plaqueX,plaqueY,-1.27,plaqueW+.07,.65,.07,'#c6a052');
    sign(plaqueX,plaqueY,-1.22,plaqueW,.59,(c,W,H)=>{
      c.fillStyle='#293f49';c.fillRect(0,0,W,H);c.strokeStyle='#c6a052';c.lineWidth=8;c.strokeRect(4,4,W-8,H-8);
      c.fillStyle='#ede2c0';c.textBaseline='middle';c.font='bold '+H*.28+'px system-ui';c.fillText(julien?'JULIEN':'KÉVIN',W*.09,H*.35);
      c.fillStyle='#acd0db';c.font='bold '+H*.17+'px system-ui';c.fillText(julien?'DTS · PAYS DE LA LOIRE':'DIRECTEUR DE PROJETS',W*.09,H*.70,W*.84);
    });
    const deskX=julien?2.25:.85;
    desk(mesh,deskX,surface(1,deskX),-.65,julien);
    if(!julien){
      const poster=(x,y,w,h,paint)=>{mesh.box(x,y,-1.26,w+.14,h+.14,.08,'#566970');sign(x,y,-1.20,w,h,paint);};
      poster(-4.7,4.56,1.55,1.24,(c,W,H)=>{
        c.fillStyle='#353445';c.fillRect(0,0,W,H);c.fillStyle='#252f3d';c.fillRect(0,0,W,H*.22);
        c.fillStyle='#e5dadd';c.font='bold '+H*.12+'px system-ui';c.textAlign='center';c.fillText('COOPTATION',W/2,H*.16,W*.9);
        c.strokeStyle='#cd83a8';c.lineWidth=H*.023;
        for(const dx of [-.17,0,.17]){c.beginPath();c.arc(W*(.5+dx),H*.34,H*.043,0,7);c.moveTo(W*(.5+dx),H*.39);c.lineTo(W*(.5+dx),H*.52);c.moveTo(W*(.5+dx)-H*.05,H*.45);c.lineTo(W*(.5+dx)+H*.05,H*.45);c.stroke();}
        c.fillStyle='#df9aba';c.font='bold '+H*.12+'px system-ui';c.fillText('1 TALENT =',W/2,H*.71,W*.9);c.fillText('1 PRIME ?',W/2,H*.88,W*.9);
      });
      poster(4.65,4.43,1.05,1.24,(c,W,H)=>{
        c.fillStyle='#243b46';c.fillRect(0,0,W,H);c.strokeStyle='#647c81';c.lineWidth=8;c.strokeRect(10,10,W-20,H-20);
        c.fillStyle='#eee9d8';c.textAlign='center';c.font='bold '+H*.12+'px system-ui';c.fillText('BUDGET',W/2,H*.22,W*.9);c.fillText('VALIDÉ',W/2,H*.40,W*.9);
        c.strokeStyle='#a8d477';c.lineWidth=H*.045;c.beginPath();c.moveTo(W*.3,H*.69);c.lineTo(W*.46,H*.81);c.lineTo(W*.76,H*.52);c.stroke();
        c.lineWidth=H*.018;c.strokeRect(W*.2,H*.58,W*.5,H*.30);
      });
    }
  }
  globalThis.OfficeDecor={draw};
})();
