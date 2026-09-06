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
  const el=document.createElement('div');el.className='actor-bubble julien';el.hidden=true;document.body.append(el);
  const name=document.createElement('div');name.className='rodolphe-name-fix';name.textContent='JULIEN · DIRECTEUR TECHNOLOGIES SERVICES PAYS DE LA LOIRE';name.hidden=true;document.body.append(name);
  let next=performance.now()+1800,until=0,last=-1;
  function pick(){let i=Math.floor(Math.random()*lines.length);if(i===last)i=(i+1)%lines.length;last=i;return lines[i];}
  function loop(now){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer||s.level!==1||s.phase!=='playing'){el.hidden=true;name.hidden=true;requestAnimationFrame(loop);return;}
    const x=4.72,y=surface(3,x),pos=renderer.project(x,y+2.35,.4),label=renderer.project(x,y+2.85,.4);
    if(label&&label.x>=0&&label.x<=innerWidth){name.style.left=label.x+'px';name.style.top=label.y+'px';name.hidden=false;}else name.hidden=true;
    if(now>=next){el.textContent=pick();until=now+8500;next=until+4500+Math.random()*3500;}
    if(now<until&&pos&&pos.x>=0&&pos.x<=innerWidth&&pos.y>=-100&&pos.y<=innerHeight){el.style.left=Math.max(125,Math.min(innerWidth-125,pos.x))+'px';el.style.top=Math.max(120,Math.min(innerHeight-35,pos.y))+'px';el.hidden=false;}else el.hidden=true;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
