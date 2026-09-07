'use strict';
// Replace the repeated corporate plaques with level-specific signage that looks like different
// tools, campaigns and events instead of one template with different words.
(()=>{
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  const panel=(mesh,sign,x,y,w,h,paint,frame='#263945')=>{
    mesh.box(x,y,-1.03,w+.14,h+.14,.08,frame);
    sign(x,y,-.97,w,h,paint);
  };
  const text=(c,value,x,y,size,color,max,weight=900,align='left')=>{
    c.fillStyle=color;c.font=weight+' '+size+'px system-ui';c.textAlign=align;c.textBaseline='middle';c.fillText(value,x,y,max);
  };
  const band=(mesh,y,color)=>mesh.box(0,y,-1.15,20.7,2.42,.12,color);

  function site(c,W,H){
    c.fillStyle='#102f42';c.fillRect(0,0,W,H);c.fillStyle='#d5f382';c.fillRect(0,0,W*.035,H);
    text(c,'INETUM',W*.08,H*.22,H*.18,'#f6f2df',W*.72);text(c,'LCP7',W*.08,H*.52,H*.29,'#d5f382',W*.48);
    text(c,'LA CHAPELLE-SUR-ERDRE',W*.08,H*.79,H*.09,'#9bc8d2',W*.82,800);
    c.strokeStyle='#9bc8d255';c.lineWidth=3;c.strokeRect(W*.72,H*.18,W*.18,H*.6);
    for(let i=0;i<4;i++){c.fillStyle=i%2?'#d5f382':'#6ca8b6';c.fillRect(W*(.75+(i%2)*.07),H*(.25+Math.floor(i/2)*.22),W*.045,H*.11);}
  }
  function mission(c,W,H){
    c.fillStyle='#f3efe3';c.fillRect(0,0,W,H);c.fillStyle='#284b5c';c.fillRect(0,0,W,H*.19);
    text(c,'ORDRE DE MISSION',W*.06,H*.095,H*.1,'#fff7df',W*.88);
    const rows=[['CLIENT','________________'],['MISSION','________________'],['DÉBUT','__/__/____'],['FIN','__/__/____']];
    rows.forEach(([a,b],i)=>{const y=H*(.33+i*.15);text(c,a,W*.07,y,H*.065,'#58666b',W*.2,800);text(c,b,W*.34,y,H*.06,'#344753',W*.56,700);});
    c.strokeStyle='#c66c77';c.lineWidth=5;c.strokeRect(W*.72,H*.68,W*.19,H*.19);text(c,'VALIDÉ',W*.815,H*.775,H*.07,'#c66c77',W*.16,900,'center');
  }
  function swile(c,W,H){
    c.fillStyle='#ffeff4';c.fillRect(0,0,W,H);c.fillStyle='#ff5d86';c.beginPath();c.arc(W*.22,H*.5,H*.25,0,Math.PI*2);c.fill();
    text(c,'S',W*.22,H*.5,H*.27,'#fff',W*.25,900,'center');text(c,'SWILE',W*.43,H*.39,H*.2,'#342943',W*.49);
    text(c,'REPAS · AVANTAGES',W*.43,H*.67,H*.08,'#795c72',W*.49,800);
  }
  function concur(c,W,H){
    c.fillStyle='#eef6fb';c.fillRect(0,0,W,H);c.fillStyle='#1c75a8';c.fillRect(0,0,W*.29,H);
    text(c,'SAP',W*.145,H*.27,H*.14,'#fff',W*.22,900,'center');text(c,'CONCUR',W*.145,H*.55,H*.15,'#d5f382',W*.24,900,'center');
    text(c,'NOTE DE FRAIS',W*.37,H*.22,H*.1,'#284557',W*.56);
    [0,1,2].forEach(i=>{const y=H*(.43+i*.16);c.fillStyle='#d8e5eb';c.fillRect(W*.38,y,W*.43,H*.07);c.fillStyle=i===2?'#8dbf72':'#6894a9';c.fillRect(W*.38,y,W*(.2+i*.07),H*.07);});
  }
  function peopleDoc(c,W,H){
    c.fillStyle='#f7f9fa';c.fillRect(0,0,W,H);c.fillStyle='#2d6f8c';c.fillRect(W*.07,H*.14,W*.28,H*.72);
    c.fillStyle='#fff';for(let i=0;i<4;i++)c.fillRect(W*.11,H*(.25+i*.13),W*.2,H*.025);
    text(c,'MyPeopleDoc',W*.43,H*.32,H*.15,'#2d596b',W*.5);text(c,'DOCUMENTS RH',W*.43,H*.62,H*.08,'#6d7f86',W*.5,800);
  }
  function chronotime(c,W,H){
    c.fillStyle='#322d43';c.fillRect(0,0,W,H);c.strokeStyle='#f0c55b';c.lineWidth=H*.045;c.beginPath();c.arc(W*.23,H*.5,H*.25,0,Math.PI*2);c.stroke();
    c.beginPath();c.moveTo(W*.23,H*.5);c.lineTo(W*.23,H*.31);c.moveTo(W*.23,H*.5);c.lineTo(W*.36,H*.57);c.stroke();
    text(c,'CHRONOTIME 2',W*.47,H*.38,H*.14,'#fff2cf',W*.47);text(c,'TEMPS · ABSENCES',W*.47,H*.66,H*.07,'#e3b85d',W*.47,800);
  }
  function support(c,W,H){
    c.fillStyle='#172f3b';c.fillRect(0,0,W,H);c.fillStyle='#8fd7e8';c.fillRect(0,H*.78,W,H*.22);
    text(c,'GLOBAL SERVICE CENTER',W*.06,H*.24,H*.1,'#dff5f7',W*.88);text(c,'01 78 91 96 51',W*.06,H*.55,H*.18,'#fff2cf',W*.88);
    text(c,'SUPPORT',W*.5,H*.89,H*.08,'#193b48',W*.8,900,'center');
  }
  function success(c,W,H){
    c.fillStyle='#edf5ef';c.fillRect(0,0,W,H);c.fillStyle='#568a65';c.fillRect(0,0,W,H*.18);
    text(c,'SUCCESS FACTORS',W*.06,H*.09,H*.09,'#fff',W*.88);text(c,'OBJECTIFS',W*.06,H*.34,H*.11,'#385d47',W*.4);
    const vals=[.35,.55,.72,.86];vals.forEach((v,i)=>{c.fillStyle='#bed3c2';c.fillRect(W*(.08+i*.21),H*.75-H*.42*v,W*.11,H*.42*v);});
    text(c,'CARRIÈRE · PERFORMANCE',W*.06,H*.88,H*.065,'#65786b',W*.88,800);
  }
  function gcomp(c,W,H){
    c.fillStyle='#faf2f7';c.fillRect(0,0,W,H);c.fillStyle='#9b4f82';c.fillRect(W*.06,H*.12,W*.3,H*.76);
    c.fillStyle='#fff';c.beginPath();c.arc(W*.21,H*.34,H*.11,0,7);c.fill();c.fillRect(W*.12,H*.51,W*.18,H*.2);
    text(c,'GCOMP',W*.43,H*.34,H*.18,'#71375f',W*.5);text(c,'CV · COMPÉTENCES',W*.43,H*.65,H*.07,'#876c7e',W*.5,800);
  }
  function academy(c,W,H){
    c.fillStyle='#1f3d39';c.fillRect(0,0,W,H);c.fillStyle='#d5f382';
    c.beginPath();c.moveTo(W*.08,H*.42);c.lineTo(W*.25,H*.22);c.lineTo(W*.42,H*.42);c.lineTo(W*.25,H*.62);c.closePath();c.fill();
    c.fillRect(W*.2,H*.61,W*.1,H*.06);text(c,'LEARNING',W*.49,H*.33,H*.13,'#f0f3df',W*.46);text(c,'ACADEMY',W*.49,H*.56,H*.13,'#d5f382',W*.46);
    text(c,'FORMATIONS · CERTIFICATIONS',W*.49,H*.78,H*.055,'#a8c4b8',W*.46,800);
  }
  function powerUp(c,W,H){
    const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#112f45');g.addColorStop(.55,'#234f65');g.addColorStop(1,'#5a405c');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#d5f382';for(let i=0;i<8;i++){c.save();c.translate(W*.12+i*W*.11,H*.23);c.rotate((i-3.5)*.08);c.fillRect(-W*.012,0,W*.024,H*.24);c.restore();}
    text(c,'POWER UP',W*.5,H*.36,H*.25,'#fff6dc',W*.82,900,'center');
    text(c,'RÉACTIVONS NOTRE PUISSANCE COLLECTIVE',W*.5,H*.65,H*.075,'#d5f382',W*.88,900,'center');
    text(c,'POUR FAIRE DE LA FRANCE LE MOTEUR DE CROISSANCE DU GROUPE',W*.5,H*.81,H*.052,'#bcd8df',W*.9,800,'center');
  }
  function connect(c,W,H){
    c.fillStyle='#443548';c.fillRect(0,0,W,H);const pts=[[.18,.3],[.43,.25],[.72,.37],[.31,.68],[.67,.7]];c.strokeStyle='#f0c55b';c.lineWidth=4;
    c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(W*x,H*y):c.moveTo(W*x,H*y));c.stroke();pts.forEach(([x,y])=>{c.fillStyle='#f0c55b';c.beginPath();c.arc(W*x,H*y,H*.055,0,7);c.fill();});
    text(c,"LET'S CONNECT",W*.5,H*.46,H*.14,'#fff0d8',W*.85,900,'center');text(c,'FRANCE',W*.5,H*.66,H*.1,'#f0c55b',W*.7,900,'center');
  }
  function genAi(c,W,H){
    c.fillStyle='#17283e';c.fillRect(0,0,W,H);c.strokeStyle='#8fd7e8';c.lineWidth=4;
    for(let i=0;i<12;i++){const a=i*Math.PI*2/12;c.beginPath();c.moveTo(W*.24,H*.5);c.lineTo(W*(.24+Math.cos(a)*.18),H*(.5+Math.sin(a)*.34));c.stroke();}
    c.fillStyle='#d5f382';c.beginPath();c.arc(W*.24,H*.5,H*.12,0,7);c.fill();
    text(c,'DO YOU SPEAK',W*.49,H*.34,H*.095,'#d5eaf0',W*.46);text(c,'GEN AI?',W*.49,H*.58,H*.18,'#d5f382',W*.46);text(c,'IA · ACCULTURATION',W*.49,H*.8,H*.06,'#8fd7e8',W*.46,800);
  }
  function charity(c,W,H){
    c.fillStyle='#f0f6e8';c.fillRect(0,0,W,H);c.fillStyle='#4f8b62';c.beginPath();c.arc(W*.22,H*.45,H*.22,0,7);c.fill();
    c.fillStyle='#fff';c.beginPath();c.moveTo(W*.22,H*.61);c.bezierCurveTo(W*.03,H*.42,W*.12,H*.24,W*.22,H*.35);c.bezierCurveTo(W*.32,H*.24,W*.42,H*.42,W*.22,H*.61);c.fill();
    text(c,'CHARITY DAY',W*.48,H*.36,H*.16,'#376649',W*.48);text(c,'ENSEMBLE · SOLIDAIRES',W*.48,H*.66,H*.07,'#64836c',W*.48,800);
  }
  function summer(c,W,H){
    const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#683c58');g.addColorStop(1,'#e18a6d');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='#f6d67e';c.beginPath();c.arc(W*.78,H*.25,H*.13,0,7);c.fill();
    for(let i=0;i<5;i++){c.strokeStyle=i%2?'#f6d67e':'#f1b2ce';c.lineWidth=4;c.beginPath();c.moveTo(W*(.08+i*.17),H*.83);c.lineTo(W*(.16+i*.17),H*.55);c.stroke();}
    text(c,'SUMMER PARTY',W*.08,H*.28,H*.18,'#fff1db',W*.62);text(c,'LE POWER UP TOUR',W*.08,H*.55,H*.1,'#f6d67e',W*.68);text(c,'ROOFTOP · GRAND OUEST',W*.08,H*.76,H*.065,'#f4c8d7',W*.64,800);
  }

  function cooptation(c,W,H){
    c.fillStyle='#24384a';c.fillRect(0,0,W,H);
    c.fillStyle='#f1c75b';for(const [x,y] of [[.2,.3],[.5,.22],[.78,.35],[.34,.7],[.68,.72]]){c.beginPath();c.arc(W*x,H*y,H*.065,0,Math.PI*2);c.fill();}
    c.strokeStyle='#f1c75b';c.lineWidth=4;c.beginPath();c.moveTo(W*.2,H*.3);c.lineTo(W*.5,H*.22);c.lineTo(W*.78,H*.35);c.moveTo(W*.5,H*.22);c.lineTo(W*.34,H*.7);c.lineTo(W*.68,H*.72);c.stroke();
    text(c,'COOPTATION',W*.5,H*.48,H*.13,'#fff1d8',W*.82,900,'center');text(c,'RECOMMANDEZ UN TALENT',W*.5,H*.83,H*.065,'#f1c75b',W*.82,800,'center');
  }

  function purchaseOrder(c,W,H){
    c.fillStyle='#f5f1e4';c.fillRect(0,0,W,H);c.fillStyle='#294b5c';c.fillRect(0,0,W,H*.18);
    text(c,'BON DE COMMANDE',W*.5,H*.1,H*.065,'#fff7df',W*.9,900,'center');
    [['PROJET',.32],['FOURNISSEUR',.44],['MONTANT',.56]].forEach(([label,y])=>{text(c,label,W*.08,H*y,H*.038,'#53666c',W*.3,800);c.strokeStyle='#93a2a8';c.lineWidth=3;c.beginPath();c.moveTo(W*.38,H*y);c.lineTo(W*.9,H*y);c.stroke();});
    c.strokeStyle='#5f9b65';c.lineWidth=Math.max(5,H*.018);c.strokeRect(W*.18,H*.65,W*.64,H*.2);
    text(c,'APPROUVÉ',W*.5,H*.73,H*.078,'#5f9b65',W*.58,900,'center');text(c,'PROTECTION PROJET',W*.5,H*.82,H*.03,'#5f9b65',W*.7,800,'center');
  }

  function drawLevel0(mesh,sign){
    band(mesh,1.45,'#29495b');
    panel(mesh,sign,-6.6,1.45,4.8,.9,site);panel(mesh,sign,-1.25,1.45,3.6,.9,mission,'#465b62');panel(mesh,sign,4.45,1.45,2.8,.9,swile,'#7b4f69');
    panel(mesh,sign,-2.4,4.65,2.5,.68,cooptation,'#3d4d5d');
    panel(mesh,sign,4.65,4.43,1.05,1.24,purchaseOrder,'#586a70');
    band(mesh,10.42,'#29495b');
    panel(mesh,sign,-6.7,10.42,3.0,.82,concur);panel(mesh,sign,-3.1,10.42,3.0,.82,peopleDoc);panel(mesh,sign,.55,10.42,3.0,.82,chronotime);panel(mesh,sign,5.65,10.42,4.0,.82,support);
  }
  function drawLevel1(mesh,sign){
    band(mesh,1.45,'#453b55');
    panel(mesh,sign,-5.8,1.45,3.4,.9,success);panel(mesh,sign,0,1.45,3.2,.9,gcomp);panel(mesh,sign,5.6,1.45,3.8,.9,academy);
    band(mesh,7.75,'#453b55');panel(mesh,sign,0,7.75,9.1,1.25,powerUp,'#1a3143');
    band(mesh,10.42,'#453b55');panel(mesh,sign,-4.7,10.42,4.0,.9,connect,'#5b4856');panel(mesh,sign,2.0,10.42,4.1,.9,genAi,'#263b55');
  }
  function drawLevel2(mesh,sign){
    band(mesh,1.72,'#344d60');panel(mesh,sign,-4.7,1.72,4.4,1.08,charity,'#486252');panel(mesh,sign,2.4,1.72,5.4,1.08,summer,'#68475b');
  }

  decor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level===0)drawLevel0(mesh,sign);else if(level===1)drawLevel1(mesh,sign);else drawLevel2(mesh,sign);
  };
})();
