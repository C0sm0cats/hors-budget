'use strict';
(()=>{
  const canvas=document.createElement('canvas');
  canvas.id='inetumDecor';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'1'});
  document.body.insertBefore(canvas,document.getElementById('overlay'));
  const ctx=canvas.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const decor=[
    [
      {x:-7.2,y:1.45,w:5.1,h:.72,title:'INETUM LCP7',sub:'LA CHAPELLE SUR ERDRE',accent:'#d6f382',a:'#153247',b:'#274f60',kind:'site'},
      {x:-6.4,y:4.45,w:3.2,h:.68,title:'ORDRE DE MISSION',sub:'AFFECTATION · CLIENT',accent:'#8fd7e8',a:'#173247',b:'#24566d'},
      {x:-1.6,y:4.45,w:2.8,h:.68,title:'COOPTATION',sub:'RECOMMANDEZ UN TALENT',accent:'#f1c75b',a:'#29384a',b:'#465468'},
      {x:5.1,y:4.45,w:2.7,h:.68,title:'SWILE',sub:'AVANTAGES SALARIÉS',accent:'#f59bbd',a:'#352d49',b:'#4e3f64'},
      {x:-6.2,y:7.45,w:3.25,h:.68,title:'SUCCESS FACTORS',sub:'OBJECTIFS · CARRIÈRE',accent:'#d6f382',a:'#203b3e',b:'#33575a'},
      {x:-1.6,y:7.45,w:3.15,h:.68,title:'MYPEOPLEDOC',sub:'DOCUMENTS RH',accent:'#8fd7e8',a:'#26394f',b:'#355b76'},
      {x:5.15,y:7.45,w:3.05,h:.68,title:'CHRONOTIME 2',sub:'TEMPS · ABSENCES',accent:'#f1c75b',a:'#3a3445',b:'#584a62'},
      {x:-6.2,y:10.42,w:2.95,h:.68,title:'SAP CONCUR',sub:'NOTES DE FRAIS',accent:'#8fd7e8',a:'#24394c',b:'#335b72'},
      {x:-1.45,y:10.42,w:3.65,h:.68,title:'LEARNING ACADEMY',sub:'FORMATIONS · CERTIFICATIONS',accent:'#d6f382',a:'#243f3a',b:'#3b5d52'},
      {x:5.25,y:10.42,w:2.55,h:.68,title:'GCOMP',sub:'COMPENSATION',accent:'#f59bbd',a:'#3d2e43',b:'#59435d'}
    ],
    [
      {x:0,y:7.25,w:8.8,h:1.18,title:'POWER UP',sub:'RÉACTIVONS NOTRE PUISSANCE COLLECTIVE POUR FAIRE DE LA FRANCE LE MOTEUR DE CROISSANCE DU GROUPE',accent:'#d6f382',a:'#142b41',b:'#285269',kind:'hero'},
      {x:-6.2,y:10.42,w:3.5,h:.72,title:"LET'S CONNECT FRANCE",sub:'COMMUNAUTÉ · ÉCHANGES',accent:'#f1c75b',a:'#3b3142',b:'#5a4858'},
      {x:0,y:10.42,w:3.55,h:.72,title:'DO YOU SPEAK GEN AI?',sub:'IA · ACCULTURATION',accent:'#8fd7e8',a:'#23364e',b:'#315c79'},
      {x:6.05,y:10.42,w:4.15,h:.72,title:'GLOBAL SERVICE CENTER',sub:'01 78 91 96 51',accent:'#f59bbd',a:'#3d2f42',b:'#60465c'}
    ],
    [
      {x:-5.8,y:7.45,w:3.9,h:.94,title:'CHARITY DAY',sub:'ENSEMBLE · SOLIDAIRES',accent:'#d6f382',a:'#24433f',b:'#3d6559',kind:'event'},
      {x:1.3,y:7.45,w:5.4,h:.94,title:'SUMMER PARTY',sub:'LE POWER UP TOUR',accent:'#f5b75d',a:'#55364d',b:'#80536b',kind:'event'}
    ]
  ];

  const roundRect=(x,y,w,h,r)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
  const lines=(text,maxWidth,maxLines,font)=>{
    ctx.font=font;
    const out=[],words=text.split(' ');let line='';
    for(const word of words){
      const test=line?line+' '+word:word;
      if(!line||ctx.measureText(test).width<=maxWidth)line=test;
      else{out.push(line);line=word;if(out.length===maxLines-1)break;}
    }
    if(line&&out.length<maxLines)out.push(line);
    return out;
  };
  const projectedSize=d=>{
    const c=renderer.project(d.x,d.y,-1.1),l=renderer.project(d.x-d.w/2,d.y,-1.1),r=renderer.project(d.x+d.w/2,d.y,-1.1),t=renderer.project(d.x,d.y+d.h/2,-1.1),b=renderer.project(d.x,d.y-d.h/2,-1.1);
    return {c,w:Math.abs(r.x-l.x),h:Math.abs(b.y-t.y)};
  };

  function card(d,alpha=1){
    const q=projectedSize(d),p=q.c;
    if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<-250||p.x>innerWidth+250||p.y<-120||p.y>innerHeight+120)return;
    const w=Math.max(90,q.w),h=Math.max(34,q.h),x=p.x-w/2,y=p.y-h/2,r=Math.max(5,h*.12);
    ctx.save();ctx.globalAlpha=alpha;
    ctx.shadowColor='#07131b99';ctx.shadowBlur=Math.max(4,h*.18);ctx.shadowOffsetY=Math.max(2,h*.08);
    roundRect(x,y,w,h,r);const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,d.a);g.addColorStop(1,d.b);ctx.fillStyle=g;ctx.fill();ctx.shadowColor='transparent';
    ctx.strokeStyle='#d9edf02e';ctx.lineWidth=Math.max(1,h*.018);ctx.stroke();
    roundRect(x,y,w,h,r);ctx.save();ctx.clip();ctx.fillStyle=d.accent;ctx.fillRect(x, y, Math.max(4,w*.018),h);
    ctx.globalAlpha=.11;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+w*.88,y+h*.15,h*.55,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.globalAlpha=alpha;
    ctx.textAlign='left';ctx.textBaseline='middle';
    const tag=(d.kind==='event'?'INETUM · ÉVÉNEMENT':d.kind==='site'?'INETUM · SITE':'INETUM · INTERNE');
    ctx.fillStyle='#d6e4e6';ctx.font=`800 ${Math.max(7,h*.105)}px system-ui`;ctx.fillText(tag,x+w*.07,y+h*.17,w*.76);
    const titleSize=Math.max(10,d.kind==='hero'?h*.27:h*.30);ctx.fillStyle='#fff7df';ctx.font=`900 ${titleSize}px system-ui`;ctx.fillText(d.title,x+w*.07,y+(d.kind==='hero'?h*.43:h*.48),w*.85);
    const subSize=Math.max(7,d.kind==='hero'?h*.105:h*.135),font=`800 ${subSize}px system-ui`;ctx.fillStyle=d.accent;
    const ls=lines(d.sub,w*.82,d.kind==='hero'?3:2,font),base=d.kind==='hero'?h*.66:h*.77,step=d.kind==='hero'?h*.13:h*.15;
    ls.forEach((line,i)=>ctx.fillText(line,x+w*.07,y+base+i*step,w*.84));
    ctx.fillStyle=d.accent;ctx.beginPath();ctx.arc(x+w*.93,y+h*.2,Math.max(2.5,h*.035),0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  let last=0;
  function draw(now){
    requestAnimationFrame(draw);
    if(!window.devicePixelRatio||typeof Arcade==='undefined'||typeof renderer==='undefined'||!Arcade.state)return;
    if(!reduced&&now-last<16)return;last=now;
    const ratio=Math.min(devicePixelRatio||1,1.5),W=Math.round(innerWidth*ratio),H=Math.round(innerHeight*ratio);
    if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,innerWidth,innerHeight);
    const s=Arcade.state;if(!['playing','transition','levelIntro','bossIntro'].includes(s.phase))return;
    const set=decor[s.level]||[];
    for(const d of set)card(d,.94);
  }
  requestAnimationFrame(draw);
})();
