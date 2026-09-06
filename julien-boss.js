'use strict';
(()=>{
  const lines=[
    "L’intercontrat baisse. J’ai surtout changé l’échelle du graphique.",
    "La courbe est rouge, mais le commentaire est vert.",
    "On n’a pas trop d’intercontrat. On a de la capacité immédiatement disponible.",
    "J’ai demandé un plan d’action. On m’a envoyé un tableau de suivi.",
    "Le staffing est sous contrôle. Il manque juste les missions.",
    "Le taux d’activité remonte dès qu’on retire les gens qui ne facturent pas.",
    "Ce n’est pas un bench. C’est un vivier de compétences.",
    "Le graphique descend. Heureusement, l’objectif aussi.",
    "On va industrialiser la sortie d’intercontrat. Première étape : une réunion.",
    "J’ai trois courbes et quatre couleurs. Le problème est donc documenté.",
    "Les compétences sont disponibles. Les budgets clients un peu moins.",
    "Le plan de charge est plein. Principalement de plans de charge."
  ];
  const states=new WeakMap();
  const X=6.65;
  function state(s){let b=states.get(s);if(!b){b={hp:3,flash:0,nextAttack:performance.now()+2400,lastNow:performance.now()};states.set(s,b);}return b;}
  const defeated=s=>state(s).hp<=0;
  globalThis.JulienBoss={x:X,state,defeated};

  const style=document.createElement('style');
  style.textContent=`
    .julien-name{position:fixed;z-index:34;transform:translate(-50%,-100%);padding:3px 6px;border-radius:5px;background:#142c3eee;color:#bfe8f2;font:900 10px/1.15 system-ui;text-align:center;pointer-events:none;white-space:nowrap;text-shadow:0 1px #0008}
    .julien-name small{display:block;margin-top:2px;color:#e7dba9;font-size:8px;letter-spacing:.03em}
  `;
  document.head.append(style);

  const bubble=document.createElement('div');bubble.className='actor-bubble julien';bubble.hidden=true;document.body.append(bubble);
  const name=document.createElement('div');name.className='julien-name';name.hidden=true;document.body.append(name);

  let nextLine=performance.now()+700,until=0,last=-1;
  function pick(){let i=Math.floor(Math.random()*lines.length);if(i===last)i=(i+1)%lines.length;last=i;return lines[i];}
  function visibleX(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=innerWidth&&p.y<innerHeight+80&&p.y>-180;}

  function bossTick(s,now){
    const b=state(s),dt=Math.min(.05,Math.max(0,(now-b.lastNow)/1000));b.lastNow=now;b.flash=Math.max(0,b.flash-dt);
    const y=surface(4,X);
    for(const paper of s.papers){
      if(paper.life<=0||paper.julienHit)continue;
      if(Math.abs(paper.x-X)<.58&&Math.abs(paper.y-(y+.78))<.72){
        paper.julienHit=true;paper.life=0;b.hp=Math.max(0,b.hp-1);b.flash=.34;s.score+=250;
        s.floaters.push({x:X,y:y+2.15,text:b.hp>0?'CR VALIDÉ':'JULIEN EN ALIGNEMENT STRATÉGIQUE',life:1.5,color:'#d5f382'});
        if(b.hp<=0){s.gate=2.6;s.hostile=s.hostile.filter(h=>h.julien!==true);}
      }
    }
    if(b.hp>0&&now>=b.nextAttack&&s.phase==='playing'&&s.player.floor>=3){b.nextAttack=now+2100+Math.random()*900;s.hostile.push({x:X-.45,y:y+.82,vx:-3.4,life:5,kind:'kpi',julien:true});}
  }

  function loop(now){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer||s.level!==1||s.phase!=='playing'){bubble.hidden=true;name.hidden=true;requestAnimationFrame(loop);return;}
    bossTick(s,now);
    const b=state(s),y=surface(4,X),head=renderer.project(X,y+2.45,.35),talk=renderer.project(X,y+2.0,.35);
    if(visibleX(head)&&b.hp>0){name.innerHTML='JULIEN<small>DIRECTEUR TECHNOLOGIES SERVICES · PAYS DE LA LOIRE</small>';name.style.left=Math.max(135,Math.min(innerWidth-135,head.x))+'px';name.style.top=Math.max(112,Math.min(innerHeight-35,head.y))+'px';name.hidden=false;}else name.hidden=true;

    if(b.hp>0&&now>=nextLine){bubble.textContent=pick();until=now+8500;nextLine=until+4500+Math.random()*3500;}
    if(b.hp>0&&now<until&&visibleX(talk)){bubble.style.left=Math.max(125,Math.min(innerWidth-125,talk.x))+'px';bubble.style.top=Math.max(120,Math.min(innerHeight-35,talk.y))+'px';bubble.hidden=false;}else bubble.hidden=true;

    if(b.hp>0&&s.player.floor===4&&Math.abs(s.player.x-s.princess.x)<1.8){const banner=document.getElementById('banner');if(banner)banner.textContent='JULIEN BLOQUE CHARLINE · ENVOIE-LUI UN CR';}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
