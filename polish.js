'use strict';
(()=>{
  const bossHud=document.createElement('div');
  bossHud.className='boss-hud';bossHud.hidden=true;
  bossHud.innerHTML='<div class="boss-hud-title"><span>RODOLPHE · DIRECTEUR</span><span id="bossHpText">3 / 3</span></div><div class="boss-track"><div class="boss-fill" id="bossFill"></div></div>';
  document.body.append(bossHud);
  const bossFill=bossHud.querySelector('#bossFill'),bossHpText=bossHud.querySelector('#bossHpText');

  const cinema=document.createElement('div');
  cinema.className='cinematic-card';cinema.hidden=true;
  cinema.innerHTML='<div class="cinematic-copy"><small></small><strong></strong><em></em></div>';
  document.body.append(cinema);
  const cinemaSmall=cinema.querySelector('small'),cinemaStrong=cinema.querySelector('strong'),cinemaEm=cinema.querySelector('em');

  const worldmark=document.createElement('div');worldmark.className='inetum-worldmark';worldmark.textContent='INETUM';document.body.append(worldmark);
  const tags=[];
  const ensureTag=(i,type)=>{if(!tags[i]){const el=document.createElement('div');el.className='projectile-tag';document.body.append(el);tags[i]=el;}const el=tags[i];el.className='projectile-tag '+type;el.textContent=type==='cr'?'CR':'DOSSIER';el.hidden=false;return el;};
  const hideTagsFrom=i=>{for(let n=i;n<tags.length;n++)tags[n].hidden=true;};

  const levelCopy=[
    ['NIVEAU 1','OPEN SPACE','Le salaire émotionnel ne paie pas le loyer.'],
    ['NIVEAU 2','LA DIRECTION','Ici, même les décisions ont besoin d’une réunion.'],
    ['NIVEAU 3','ROOFTOP DU SÉMINAIRE','Dernier atelier : reprendre le budget.']
  ];
  let lastLevel=-1,lastPhase='title',bossIntroSeen=false,cinemaTimer=null;

  function cinematic(kind,small,strong,em,duration=1050,freeze=true){
    if(cinemaTimer)clearTimeout(cinemaTimer);
    const s=Arcade.state,previous=s.phase;
    if(freeze&&previous==='playing'){Arcade.keys.clear();s.phase=kind;document.body.dataset.phase=kind;}
    cinema.className='cinematic-card '+(kind==='bossIntro'?'boss-intro':'level-intro');
    cinemaSmall.textContent=small;cinemaStrong.textContent=strong;cinemaEm.textContent=em;cinema.hidden=false;
    requestAnimationFrame(()=>cinema.classList.add('show'));
    cinemaTimer=setTimeout(()=>{
      cinema.classList.remove('show');
      setTimeout(()=>{cinema.hidden=true;},180);
      if(freeze&&s.phase===kind){s.phase='playing';document.body.dataset.phase='playing';}
      cinemaTimer=null;
    },duration);
  }

  function update(){
    const s=Arcade.state;
    if(!s||!renderer){requestAnimationFrame(update);return;}

    if(s.phase==='playing'&&s.level!==lastLevel){
      lastLevel=s.level;bossIntroSeen=false;
      const [a,b,c]=levelCopy[s.level];cinematic('levelIntro',a,b,c,1050,true);
    }

    if(s.boss.active&&s.boss.hp>0){
      bossHud.hidden=false;
      bossFill.style.width=(s.boss.hp/3*100)+'%';bossHpText.textContent=s.boss.hp+' / 3';
      bossHud.classList.toggle('vulnerable',!!s.boss.open);
      if(!bossIntroSeen&&s.level===2){
        bossIntroSeen=true;
        cinematic('bossIntro','BOSS FINAL','RODOLPHE','DIRECTEUR · GARDIEN DU BUDGET',1250,true);
      }
    }else bossHud.hidden=true;

    let i=0;
    for(const p of s.papers){const pos=renderer.project(p.x,p.y,.98),el=ensureTag(i++,'cr');el.style.left=pos.x+'px';el.style.top=pos.y+'px';}
    for(const h of s.hostile){if(h.kind!=='boss')continue;const pos=renderer.project(h.x,h.y,.98),el=ensureTag(i++,'dossier');el.style.left=pos.x+'px';el.style.top=pos.y+'px';el.style.transform='translate(-50%,-50%) rotate('+(h.reflected?'-8deg':'8deg')+')';}
    hideTagsFrom(i);

    const mark=renderer.project(-4,13.6,-1.08);
    worldmark.style.left=mark.x+'px';worldmark.style.top=mark.y+'px';
    worldmark.hidden=mark.x<0||mark.x>innerWidth||mark.y<0||mark.y>innerHeight;

    lastPhase=s.phase;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();