'use strict';
(()=>{
  const lines=[
    'L’intercontrat n’est pas un problème. C’est une capacité disponible.',
    'J’ai demandé un plan de staffing. On m’a envoyé un tableau avec beaucoup de couleurs.',
    'Le taux d’activité remonte. J’ai changé l’échelle du graphique.',
    'Un consultant sans mission ? C’est une opportunité commerciale qui médite.',
    'Le pipe est bon. Il est juste très loin du staffing.',
    'J’ai un plan pour l’intercontrat. Il tient sur douze slides.',
    'On ne dit plus intercontrat. On dit disponibilité stratégique.',
    'Le client veut un expert demain. Parfait, j’en ai trois disponibles depuis avril.',
    'Le taux d’occupation est sous contrôle. Le contrôle est mensuel.',
    'J’ai rapproché le commerce et la production. Ils ont maintenant une réunion commune.',
    'Le bench baisse. Enfin, dans la colonne prévisionnelle.',
    'Chaque consultant disponible a désormais un plan d’action. Le mien est de suivre les plans d’action.'
  ];
  const bubble=document.createElement('div');bubble.className='actor-bubble julien';bubble.hidden=true;document.body.append(bubble);
  const name=document.createElement('div');name.className='julien-name';name.textContent='JULIEN · DTS PAYS DE LA LOIRE';name.hidden=true;document.body.append(name);
  let next=performance.now()+2500,until=0,last=-1;
  const pick=()=>{let i=Math.floor(Math.random()*lines.length);if(i===last)i=(i+1)%lines.length;last=i;return lines[i];};
  function loop(now){
    let s=null;try{s=Arcade.state;}catch{}
    if(!s||typeof renderer==='undefined'||typeof surface==='undefined'||s.level!==1||s.phase!=='playing'){
      bubble.hidden=true;name.hidden=true;requestAnimationFrame(loop);return;
    }
    // Bureau de Julien : niveau Direction, dernier étage avant la sortie vers le rooftop.
    const x=6.55,y=surface(3,x),pos=renderer.project(x,y+2.45,.35),tag=renderer.project(x,y+2.95,.4);
    const visible=Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&pos.x>-80&&pos.x<innerWidth+80&&pos.y>-120&&pos.y<innerHeight+80;
    name.hidden=!visible;
    if(visible){name.style.left=tag.x+'px';name.style.top=tag.y+'px';}
    if(visible&&now>=next){bubble.textContent=pick();until=now+8500;next=until+5000+Math.random()*4000;}
    if(visible&&now<until){bubble.style.left=Math.max(125,Math.min(innerWidth-125,pos.x))+'px';bubble.style.top=Math.max(120,Math.min(innerHeight-35,pos.y))+'px';bubble.hidden=false;}else bubble.hidden=true;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
