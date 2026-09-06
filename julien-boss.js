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
  const X=5.35;
  function state(s){let b=states.get(s);if(!b){b={hp:3,flash:0,nextAttack:performance.now()+1800,lastNow:performance.now()};states.set(s,b);}return b;}
  const defeated=s=>state(s).hp<=0;
  globalThis.JulienBoss={x:X,state,defeated};

  const bubble=document.createElement('div');
  bubble.className='actor-bubble julien';
  bubble.hidden=true;
  bubble.style.zIndex='58';
  document.body.append(bubble);

  let nextLine=performance.now()+250,until=0,last=-1;
  function pick(){let i=Math.floor(Math.random()*lines.length);if(i===last)i=(i+1)%lines.length;last=i;return lines[i];}
  function validPoint(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y);}

  function hitBoss(s,b){
    if(b.hp<=0)return;
    b.hp=Math.max(0,b.hp-1);b.flash=.34;s.score+=500;
    s.floaters.push({x:X,y:surface(4,X)+2.15,text:b.hp>0?'KPI RETOURNÉ':'JULIEN EN ALIGNEMENT STRATÉGIQUE',life:1.5,color:'#d5f382'});
    if(b.hp<=0){s.gate=2.6;s.hostile=s.hostile.filter(h=>h.julien!==true);bubble.hidden=true;}
  }

  function bossTick(s,now){
    const b=state(s),dt=Math.min(.05,Math.max(0,(now-b.lastNow)/1000));b.lastNow=now;b.flash=Math.max(0,b.flash-dt);
    const y=surface(4,X);
    for(const h of s.hostile){
      if(h.julien&&h.reflected&&h.life>0&&h.x>=X-.45){h.life=0;hitBoss(s,b);}
    }
    if(b.hp>0&&now>=b.nextAttack&&s.phase==='playing'&&s.player.floor>=3){
      b.nextAttack=now+1900+Math.random()*850;
      s.hostile.push({x:X-.48,y:y+.82,vx:-3.5,life:5,kind:'kpi',julien:true,reflected:false});
    }
  }

  function loop(now){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer||s.level!==1||s.phase!=='playing'){bubble.hidden=true;requestAnimationFrame(loop);return;}
    bossTick(s,now);
    const b=state(s),y=surface(4,X),talk=renderer.project(X,y+2.0,.35);

    if(b.hp>0&&now>=nextLine){
      bubble.textContent=pick();
      until=now+9000;
      nextLine=until+3200+Math.random()*2400;
    }

    // Contrairement à l'ancienne version, on ne rejette plus la bulle quand Julien est
    // légèrement au-dessus de la caméra : on la borne à l'écran comme pour les autres rôles principaux.
    if(b.hp>0&&now<until&&validPoint(talk)){
      bubble.style.left=Math.max(130,Math.min(innerWidth-130,talk.x))+'px';
      bubble.style.top=Math.max(132,Math.min(innerHeight-42,talk.y))+'px';
      bubble.hidden=false;
    }else bubble.hidden=true;

    if(b.hp>0&&s.player.floor===4&&Math.abs(s.player.x-s.princess.x)<2.2){
      const banner=document.getElementById('banner');
      if(banner)banner.textContent='JULIEN BLOQUE CHARLINE · RENVOIE SES KPI AVEC X';
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
