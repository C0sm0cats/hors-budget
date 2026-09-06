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
  let next=0,until=0,last=-1;
  function pick(){let i=Math.floor(Math.random()*lines.length);if(i===last)i=(i+1)%lines.length;last=i;return lines[i];}
  function drawOffice(s){
    if(s.level!==1||!renderer)return;
    const mesh=renderer.world;
    if(!mesh)return;
    // Bureau de Julien : étage 3, côté droit, en retrait de la circulation principale.
    const x=6.15,y=surface(3,x),z=-.72;
    mesh.box(x,y+.38,z,2.7,.12,1.05,'#6d5140');
    mesh.box(x-1.05,y-.02,z,.12,.8,.72,'#493a32');mesh.box(x+1.05,y-.02,z,.12,.8,.72,'#493a32');
    mesh.box(x+.55,y+.58,z,.72,.46,.08,'#253846');mesh.box(x+.55,y+.58,z+.06,.58,.32,.025,'#6fa6b6');
    // Tableau blanc dédié à l'intercontrat, derrière le bureau.
    const wy=y+1.72,wz=-1.05;
    mesh.box(x,wy,wz,3.25,1.45,.07,'#e9ece6');
    mesh.box(x,wy+1.47/2,wz+.01,3.4,.06,.1,'#68757b');mesh.box(x,wy-1.47/2,wz+.01,3.4,.06,.1,'#68757b');
    mesh.box(x-1.65,wy,wz+.01,.06,1.5,.1,'#68757b');mesh.box(x+1.65,wy,wz+.01,.06,1.5,.1,'#68757b');
    // Axes + quatre séries colorées, volontairement très lisibles à l'échelle du jeu.
    mesh.box(x-.08,wy-.43,wz+.06,2.55,.035,.035,'#49555b');mesh.box(x-1.33,wy,wz+.06,.035,1.0,.035,'#49555b');
    const series=[['#d85d62',[-.36,-.18,.04,.18,.32]],['#4c8bc4',[.24,.12,.03,-.08,-.22]],['#68a95b',[-.12,.02,.14,.08,.27]],['#e3a642',[.34,.22,.28,.06,-.02]]];
    for(const [color,ys] of series)for(let i=0;i<ys.length;i++)mesh.box(x-1.05+i*.52,wy+ys[i],wz+.08,.34,.055,.04,color);
    // Julien devant son bureau.
    if(typeof person==='function')person(mesh,'julien',x-1.45,y,z+.18,{shirt:'#365b78',hair:'#49362d',skin:'#dfad86',tie:'#79b9c7'});
  }
  let patched=false;
  function patchRenderer(){
    if(patched||typeof renderer==='undefined'||!renderer)return;
    const original=renderer.rebuild?.bind(renderer);if(!original)return;
    renderer.rebuild=function(){const r=original();try{drawOffice(Arcade.state);}catch{}return r;};patched=true;
    try{renderer.rebuild();}catch{}
  }
  function loop(now){
    patchRenderer();
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer||s.level!==1||s.phase!=='playing'){el.hidden=true;requestAnimationFrame(loop);return;}
    const x=4.7,y=surface(3,4.7),pos=renderer.project(x,y+2.35,.4);
    if(now>=next){el.textContent=pick();until=now+8500;next=until+5000+Math.random()*3500;}
    if(now<until&&pos&&pos.x>=0&&pos.x<=innerWidth&&pos.y>=-100&&pos.y<=innerHeight){el.style.left=Math.max(125,Math.min(innerWidth-125,pos.x))+'px';el.style.top=Math.max(120,Math.min(innerHeight-35,pos.y))+'px';el.hidden=false;}else el.hidden=true;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
