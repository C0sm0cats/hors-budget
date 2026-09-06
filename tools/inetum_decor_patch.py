from pathlib import Path
p=Path('game.js')
s=p.read_text()
old="""const BACKGROUND_SIGNS=[
 {positions:[[-6,4.8],[-1,7.8],[5,10.8]],texts:['CRA À VALIDER','OPEN SPACE'],bg:'#36515b',fg:'#bfd3d3',border:'#6b858b'},
 {positions:[[-6,4.8],[0,7.8],[5.5,10.8]],texts:['KPI · COMEX','OBJECTIF 140 %'],bg:'#312c43',fg:'#f0cf83',border:'#977b73'},
 {positions:[[-6,4.8],[0,7.8],[5.5,10.8]],texts:['SÉMINAIRE','BUDGET 2027'],bg:'#f0d39b',fg:'#7b4540',border:'#ba8271'}
];"""
new="""const INETUM_DECOR=[
 [
  {x:-6.7,y:1.65,w:4.8,h:.72,title:'INETUM LCP7',sub:'LA CHAPELLE SUR ERDRE',accent:'#d6f382',bg:'#173247',bg2:'#284c5f'},
  {x:-6.4,y:4.75,w:3.15,h:.66,title:'ORDRE DE MISSION',sub:'AFFECTATION · CLIENT',accent:'#8fd7e8',bg:'#173247',bg2:'#22516a'},
  {x:-2.15,y:4.75,w:2.8,h:.66,title:'COOPTATION',sub:'RECOMMANDEZ UN TALENT',accent:'#f1c75b',bg:'#26384d',bg2:'#3e5063'},
  {x:5.45,y:4.75,w:2.75,h:.66,title:'SWILE',sub:'AVANTAGES SALARIÉS',accent:'#f59bbd',bg:'#342b49',bg2:'#493c61'},
  {x:-6.25,y:7.75,w:3.25,h:.66,title:'SUCCESS FACTORS',sub:'OBJECTIFS · CARRIÈRE',accent:'#d6f382',bg:'#213a3f',bg2:'#315559'},
  {x:-1.75,y:7.75,w:3.3,h:.66,title:'MYPEOPLEDOC',sub:'DOCUMENTS RH',accent:'#8fd7e8',bg:'#253a52',bg2:'#345875'},
  {x:5.3,y:7.75,w:3.1,h:.66,title:'CHRONOTIME 2',sub:'TEMPS · ABSENCES',accent:'#f1c75b',bg:'#3b3446',bg2:'#574962'},
  {x:-6.2,y:10.72,w:2.95,h:.66,title:'SAP CONCUR',sub:'NOTES DE FRAIS',accent:'#8fd7e8',bg:'#24394c',bg2:'#335b72'},
  {x:-1.7,y:10.72,w:3.45,h:.66,title:'LEARNING ACADEMY',sub:'FORMATIONS · CERTIFICATIONS',accent:'#d6f382',bg:'#243f3a',bg2:'#3b5d52'},
  {x:5.45,y:10.72,w:2.65,h:.66,title:'GCOMP',sub:'COMPENSATION',accent:'#f59bbd',bg:'#3d2e43',bg2:'#59435d'}
 ],
 [
  {x:0,y:7.55,w:8.4,h:1.12,title:'POWER UP',sub:'RÉACTIVONS NOTRE PUISSANCE COLLECTIVE POUR FAIRE DE LA FRANCE LE MOTEUR DE CROISSANCE DU GROUPE',accent:'#d6f382',bg:'#152c42',bg2:'#244e63',hero:true},
  {x:-6.2,y:10.65,w:3.4,h:.72,title:\"LET'S CONNECT FRANCE\",sub:'COMMUNAUTÉ · ÉCHANGES',accent:'#f1c75b',bg:'#3b3142',bg2:'#5a4858'},
  {x:0,y:10.65,w:3.55,h:.72,title:'DO YOU SPEAK GEN AI?',sub:'IA · ACCULTURATION',accent:'#8fd7e8',bg:'#23364e',bg2:'#315c79'},
  {x:6.15,y:10.65,w:4.1,h:.72,title:'GLOBAL SERVICE CENTER',sub:'01 78 91 96 51',accent:'#f59bbd',bg:'#3d2f42',bg2:'#60465c'}
 ],
 [
  {x:-5.7,y:7.75,z:-.98,w:3.8,h:.92,title:'CHARITY DAY',sub:'ENSEMBLE · SOLIDAIRES',accent:'#d6f382',bg:'#23433f',bg2:'#3c6459',event:true},
  {x:1.25,y:7.75,z:-.98,w:5.2,h:.92,title:'SUMMER PARTY',sub:'LE POWER UP TOUR',accent:'#f5b75d',bg:'#56364d',bg2:'#80536b',event:true}
 ]
];"""
assert old in s
s=s.replace(old,new,1)
old2="""  // Signs belong to the back wall, so depth testing hides them behind actors and props.
  // Append after the existing actor sign to preserve the legacy cleanup draw order.
  const background=BACKGROUND_SIGNS[level];
  for(const [i,[x,y]] of background.positions.entries()){
    sign(x,y,-1.32,2.5,.48,(c,w,h)=>{
      c.fillStyle=background.bg;c.fillRect(0,0,w,h);
      c.strokeStyle=background.border;c.lineWidth=8;c.strokeRect(4,4,w-8,h-8);
      c.fillStyle=background.fg;c.font='900 '+h*.4+'px system-ui';c.textAlign='center';c.textBaseline='middle';
      c.fillText(background.texts[i%background.texts.length],w/2,h/2,w*.9);
    });
  }"""
new2="""  // Inetum internal-life decor is part of the 3D world: depth-tested, framed and static.
  // This deliberately avoids floating DOM overlays, so scenery animations cannot fight the signage.
  const fitLines=(c,text,maxWidth,maxLines)=>{
    const words=text.split(' '),lines=[];let line='';
    for(const word of words){const test=line?line+' '+word:word;if(c.measureText(test).width<=maxWidth||!line)line=test;else{lines.push(line);line=word;if(lines.length===maxLines-1)break;}}
    if(line&&lines.length<maxLines)lines.push(line);return lines;
  };
  for(const d of INETUM_DECOR[level]){
    const z=d.z??-1.32;
    world.box(d.x,d.y,z-.045,d.w+.12,d.h+.12,.075,d.event?'#6a4d5c':'#172b3b');
    sign(d.x,d.y,z,d.w,d.h,(c,w,h)=>{
      const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,d.bg);g.addColorStop(1,d.bg2);c.fillStyle=g;c.fillRect(0,0,w,h);
      c.fillStyle=d.accent;c.fillRect(0,0,Math.max(14,w*.018),h);
      c.globalAlpha=.12;c.fillStyle='#ffffff';c.beginPath();c.arc(w*.88,h*.18,h*.55,0,Math.PI*2);c.fill();c.globalAlpha=1;
      c.textAlign='left';c.textBaseline='middle';
      c.fillStyle='#d9e6e7';c.font='800 '+Math.max(18,h*.105)+'px system-ui';c.fillText(d.event?'INETUM · ÉVÉNEMENT':'INETUM · INTERNE',w*.07,h*.17,w*.78);
      const titleSize=d.hero?h*.28:h*.31;c.fillStyle='#fff8df';c.font='900 '+titleSize+'px system-ui';c.fillText(d.title,w*.07,d.hero?h*.46:h*.48,w*.86);
      c.fillStyle=d.accent;c.font='800 '+(d.hero?h*.115:h*.14)+'px system-ui';
      const lines=fitLines(c,d.sub,w*.83,d.hero?3:2),base=d.hero?h*.68:h*.77,step=d.hero?h*.135:h*.16;
      lines.forEach((line,i)=>c.fillText(line,w*.07,base+i*step,w*.85));
      c.fillStyle=d.accent;c.beginPath();c.arc(w*.93,h*.2,Math.max(5,h*.035),0,Math.PI*2);c.fill();
    });
  }"""
assert old2 in s
s=s.replace(old2,new2,1)
p.write_text(s)
i=Path('index.html')
t=i.read_text()
assert 'game.js?v=21' in t
i.write_text(t.replace('game.js?v=21','game.js?v=22',1))
