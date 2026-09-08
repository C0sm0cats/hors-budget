'use strict';
(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPerf=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4)||innerWidth<700;
  if(lowPerf)document.body.classList.add('perf-low');

  const bossHud=document.createElement('div');
  bossHud.className='boss-hud';
  bossHud.hidden=true;
  bossHud.innerHTML='<div class="boss-hud-title"><span>RORO · DIRECTEUR RÉGION GRAND OUEST</span><span id="bossHpText">3 / 3</span></div><div class="boss-track"><div class="boss-fill" id="bossFill"></div></div>';
  document.body.append(bossHud);
  const bossFill=bossHud.querySelector('#bossFill'),bossHpText=bossHud.querySelector('#bossHpText');

  const cinema=document.createElement('div');
  cinema.className='cinematic-card';
  cinema.hidden=true;
  cinema.innerHTML='<div class="cinematic-copy"><small></small><strong></strong><em></em><span class="cinematic-hint"></span></div>';
  document.body.append(cinema);
  const cinemaSmall=cinema.querySelector('small'),cinemaStrong=cinema.querySelector('strong'),cinemaEm=cinema.querySelector('em'),cinemaHint=cinema.querySelector('.cinematic-hint');

  const rodolpheGlasses=document.createElement('div');
  rodolpheGlasses.className='rodolphe-glasses';
  rodolpheGlasses.innerHTML='<i></i><b></b><i></i>';
  document.body.append(rodolpheGlasses);
  const rodolpheName=document.createElement('div');
  rodolpheName.className='rodolphe-name-fix';
  rodolpheName.textContent='RORO';
  document.body.append(rodolpheName);

  const safeStyle=document.createElement('style');
  safeStyle.textContent='.rodolphe-safe{position:fixed;z-index:4;width:62px;height:70px;transform:translate(-50%,-50%);pointer-events:none;border:3px solid #1e2b34;border-radius:7px;background:linear-gradient(145deg,#71818a,#35444d 58%,#202b32);box-shadow:inset 0 0 0 3px #93a2a8,inset 0 0 18px #111a,0 8px 16px #07162588}.rodolphe-safe::before{content:"";position:absolute;inset:8px;border:2px solid #aeb8bc;border-radius:4px;box-shadow:inset 0 0 0 2px #28353c}.rodolphe-safe span{position:absolute;left:50%;top:9px;transform:translateX(-50%);font:900 7px/1 system-ui;letter-spacing:1px;color:#d6f382;text-shadow:0 1px 2px #000}.rodolphe-safe i{position:absolute;left:17px;top:31px;width:17px;height:17px;border:3px solid #c6d0d3;border-radius:50%;box-sizing:border-box}.rodolphe-safe i::before,.rodolphe-safe i::after{content:"";position:absolute;left:5px;top:-3px;width:2px;height:17px;background:#c6d0d3}.rodolphe-safe i::after{transform:rotate(90deg)}.rodolphe-safe b{position:absolute;right:11px;top:31px;width:4px;height:18px;border-radius:3px;background:#c6d0d3;box-shadow:0 0 0 1px #1c262c}';
  document.head.append(safeStyle);
  const rodolpheSafe=document.createElement('div');
  rodolpheSafe.className='rodolphe-safe';
  rodolpheSafe.innerHTML='<span>BUDGET</span><i></i><b></b>';
  rodolpheSafe.hidden=true;
  document.body.append(rodolpheSafe);

  const tags=[];
  const ensureTag=(i,type)=>{
    if(!tags[i]){
      const el=document.createElement('div');
      el.className='projectile-tag';
      document.body.append(el);
      tags[i]=el;
    }
    const el=tags[i];
    el.className='projectile-tag '+type;
    el.textContent=type==='cr'?'CR':'DOSSIER';
    el.hidden=false;
    el.style.transform=type==='cr'?'translate(-50%,-50%) rotate(-4deg)':'translate(-50%,-50%) rotate(8deg)';
    return el;
  };
  const hideTagsFrom=i=>{for(let n=i;n<tags.length;n++)tags[n].hidden=true;};

  const levelCopy=[
    ['NIVEAU 1','OPEN SPACE · LCP7','KÉKÉ · DIRECTEUR DE PROJETS · CHACHA · BUSINESS MANAGER'],
    ['NIVEAU 2','DIRECTION TECHNOLOGIES SERVICES','JUJU · DIRECTEUR TECHNOLOGIES SERVICES PAYS DE LA LOIRE'],
    ['NIVEAU 3','POWER UP TOUR · GRAND OUEST','RORO · DIRECTEUR RÉGION GRAND OUEST']
  ];

  let lastState=null,cinemaVersion=0,lastLevel=-1,bossIntroSeen=false,cinemaTimer=null,finaleSeen=false,waitingIntro=false,introState=null;

  function closeCinema(){
    if(cinemaTimer){clearTimeout(cinemaTimer);cinemaTimer=null;}
    cinema.classList.remove('show');
    const s=Arcade.state,setPlaying=introState&&s===introState&&['levelIntro','bossIntro'].includes(s.phase);
    const version=++cinemaVersion;
    setTimeout(()=>{if(version===cinemaVersion)cinema.hidden=true;},reduced?0:180);
    if(setPlaying){s.phase='playing';document.body.dataset.phase='playing';}
    waitingIntro=false;
    introState=null;
  }

  function cinematic(kind,small,strong,em,duration=1050,freeze=true,waitForInput=false){
    cinemaVersion++;
    if(cinemaTimer)clearTimeout(cinemaTimer);
    const s=Arcade.state,previous=s.phase;
    if(freeze&&previous==='playing'){
      Arcade.keys.clear();
      s.phase=kind;
      document.body.dataset.phase=kind;
    }
    introState=s;
    waitingIntro=waitForInput;
    cinema.className='cinematic-card '+(kind==='bossIntro'?'boss-intro':kind==='finale'?'finale-intro':'level-intro');
    cinemaSmall.textContent=small;
    cinemaStrong.textContent=strong;
    cinemaEm.textContent=em;
    cinemaHint.textContent=waitForInput?'APPUYEZ SUR UNE TOUCHE OU CLIQUEZ POUR CONTINUER':'';
    cinema.hidden=false;
    if(!reduced)requestAnimationFrame(()=>cinema.classList.add('show'));else cinema.classList.add('show');
    if(!waitForInput)cinemaTimer=setTimeout(closeCinema,reduced?Math.min(duration,650):duration);
  }

  const dismissIntro=e=>{
    if(!waitingIntro)return;
    if(e.type==='keydown'&&['Shift','Control','Alt','Meta'].includes(e.key))return;
    e.preventDefault();
    e.stopPropagation();
    closeCinema();
  };
  document.addEventListener('keydown',dismissIntro,true);
  document.addEventListener('pointerdown',dismissIntro,true);

  function positionRodolphe(s){
    const visible=s.level===2&&s.boss.hp>0&&!['help','records','paused','won','lost'].includes(s.phase),showName=visible&&s.phase!=='title';
    rodolpheGlasses.hidden=!visible;rodolpheName.hidden=!showName;rodolpheSafe.hidden=!visible;if(!visible)return;
    const rowing=!(s.comedy?.miracle>0)&&!s.boss.active&&Math.floor(s.visual/6)%2===1;
    const bossX=s.boss.x-(s.boss.recoil>0?.24*(s.boss.recoil/.28):0),drawX=bossX+(rowing?Math.sin(s.visual*6)*.18:0),bounce=rowing&&!reduced?Math.abs(Math.sin(s.visual*7))*.48:0;
    const scale=1.27,eyeY=s.boss.y+.32+bounce+1.16*scale,eyeZ=.15+.19*scale,eyeHalf=.105*scale;
    const face=renderer.project(drawX,eyeY,eyeZ),leftEye=renderer.project(drawX-eyeHalf,eyeY,eyeZ),rightEye=renderer.project(drawX+eyeHalf,eyeY,eyeZ);
    const projectedEyeGap=Math.hypot(rightEye.x-leftEye.x,rightEye.y-leftEye.y),glassesScale=Math.max(.28,Math.min(2.4,projectedEyeGap/19));
    rodolpheGlasses.style.left=face.x+'px';rodolpheGlasses.style.top=face.y+'px';rodolpheGlasses.style.setProperty('transform','translate(-50%,-50%) scale('+glassesScale+')','important');
    if(showName){const np=renderer.project(drawX,s.boss.y+.32+bounce+2.12,.45);rodolpheName.style.left=np.x+'px';rodolpheName.style.top=np.y+'px';}
    const sx=-7.35,sy=surface(4,sx)+.72,sz=.36,sp=renderer.project(sx,sy,sz),sl=renderer.project(sx-.45,sy,sz),sr=renderer.project(sx+.45,sy,sz);
    if(sp&&Number.isFinite(sp.x)&&sp.x>=-80&&sp.x<=innerWidth+80&&sp.y>=-80&&sp.y<=innerHeight+80){
      const safeScale=Math.max(.55,Math.min(1.45,Math.abs(sr.x-sl.x)/55));
      rodolpheSafe.style.left=sp.x+'px';rodolpheSafe.style.top=sp.y+'px';rodolpheSafe.style.transform='translate(-50%,-50%) scale('+safeScale+')';rodolpheSafe.hidden=false;
    }else rodolpheSafe.hidden=true;
    const overlay=document.getElementById('overlay');if(overlay){const ctx=overlay.getContext('2d'),ratio=Math.min(devicePixelRatio||1,1.5),legacy=renderer.project(s.boss.x,s.boss.y+2.05,.65);ctx.save();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(legacy.x-64,legacy.y-16,128,32);ctx.restore();}
  }

  function resetPresentation(s){
    lastState=s;
    lastLevel=-1;
    bossIntroSeen=false;
    finaleSeen=false;
    cinemaVersion++;
    if(cinemaTimer)clearTimeout(cinemaTimer);
    cinemaTimer=null;
    waitingIntro=false;
    introState=null;
    cinema.hidden=true;
    cinema.classList.remove('show');
  }

  function update(){
    const s=Arcade.state;
    if(!s||!renderer){requestAnimationFrame(update);return;}
    if(s!==lastState)resetPresentation(s);

    if(s.phase==='playing'&&s.level!==lastLevel){
      lastLevel=s.level;
      bossIntroSeen=false;
      finaleSeen=false;
      const [a,b,c]=levelCopy[s.level];
      cinematic('levelIntro',a,b,c,0,true,true);
    }

    if(s.level===1&&s.player.floor>=3&&['playing','paused'].includes(s.phase)&&globalThis.JulienBoss){
      const hp=globalThis.JulienBoss.state(s).hp;
      bossHud.hidden=false;
      bossHud.querySelector('.boss-hud-title span').textContent=hp>0?'JUJU · ACCÈS ROOFTOP VERROUILLÉ':'JUJU · ACCÈS ROOFTOP OUVERT';
      bossHpText.textContent=hp+' / 3 KPI';
      bossFill.style.width=(hp/3*100)+'%';
      bossHud.classList.toggle('vulnerable',hp===0);
    }else if(s.level===2&&s.boss.active&&s.boss.hp>0){
      bossHud.querySelector('.boss-hud-title span').textContent='RORO · DIRECTEUR RÉGION GRAND OUEST';
      bossHud.hidden=false;
      bossFill.style.width=(s.boss.hp/3*100)+'%';
      bossHpText.textContent=s.boss.hp+' / 3';
      bossHud.classList.toggle('vulnerable',!!s.boss.open);
      if(!bossIntroSeen&&s.phase==='playing'){
        bossIntroSeen=true;
        cinematic('bossIntro','BOSS FINAL','RORO','DIRECTEUR RÉGION GRAND OUEST · GARDIEN DU BUDGET',0,true,true);
      }
    }else bossHud.hidden=true;

    if(s.phase==='won'&&!finaleSeen){
      finaleSeen=true;
      cinematic('finale','CHACHA EST LIBÉRÉE','BUDGET DÉBLOQUÉ','POUR TOUS LES EMPLOYÉS',reduced?700:1550,false,false);
    }

    let i=0;
    for(const p of s.papers){
      const pos=renderer.project(p.x,p.y,.98),el=ensureTag(i++,'cr');
      el.style.left=pos.x+'px';el.style.top=pos.y+'px';
    }
    for(const h of s.hostile){
      if(h.kind!=='boss')continue;
      const pos=renderer.project(h.x,h.y,.98),el=ensureTag(i++,'dossier');
      el.style.left=pos.x+'px';el.style.top=pos.y+'px';
      el.style.transform='translate(-50%,-50%) rotate('+(h.reflected?'-8deg':'8deg')+')';
    }
    hideTagsFrom(i);

    positionRodolphe(s);
    if(lowPerf&&s.particles&&s.particles.length>90)s.particles.splice(0,s.particles.length-90);
    if(reduced){s.impact=0;s.hitFlash=Math.min(s.hitFlash||0,.04);}
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();