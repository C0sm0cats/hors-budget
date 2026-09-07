'use strict';
(()=>{
  document.body.classList.add('fair-banter-v4');
  const style=document.createElement('style');
  style.textContent='.fair-banter-v4 .actor-bubble:not(.fair-bubble){display:none!important}.main-banter{z-index:30!important;max-width:min(300px,58vw)!important}.main-banter::before{content:attr(data-speaker);display:block;font-size:10px;font-weight:900;letter-spacing:.12em;margin-bottom:4px;opacity:.72}.fair-bubble::after{left:var(--tail-x,50%)!important}.fair-bubble.consultant{box-shadow:inset 0 0 0 1px #8bb0c788}.fair-bubble.internal{box-shadow:inset 0 0 0 1px #c59b7288}';
  document.head.append(style);

  const pools={
    julien:[
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
    ],
    hugo:['Le client voulait un senior. Le commercial a dit oui, puis il m’a appelé.','Mon TJM a pris 12 %. Mon salaire a pris connaissance de l’information.','Je suis “expert” depuis que le commercial a modifié mon CV.','J’ai trois managers. Aucun ne sait sur quel projet je suis.','On m’a vendu autonome. Je cherche encore les accès.','La mission est “longue durée”. Mon badge expire vendredi.','Le CRA est validé. Mon existence administrative aussi.','J’ai demandé deux jours de télétravail. Le client demande cinq jours sur site.'],
    nora:['Le client m’appelle référente. Ma fiche de paie reste plus modeste.','J’ai changé de mission. Mon salaire, lui, est très fidèle.','La revalorisation arrive après le prochain comité. Le comité aussi, apparemment.','Le client me facture senior. Ma fiche de paie n’a pas reçu le mémo.','On m’a proposé de devenir manager. J’ai demandé combien. Fin de la discussion.','Mon variable est tellement motivant que personne ne sait comment il se calcule.','J’ai la certification. Il me manque juste le droit d’utiliser l’outil chez le client.','Mon badge client expire avant mon ordre de mission. Je suis donc agile.'],
    basile:['Le client veut baisser le TJM. J’ai proposé d’augmenter la valeur.','J’ai trois CV à envoyer avant midi. Aucun n’est disponible.','Le pipeline est vert. Les signatures sont plus nuancées.','J’ai trouvé le profil parfait. Il est déjà en mission.','On a une opportunité urgente. Le besoin date de février.','Le client demande un expert. J’ai commencé par chercher quelqu’un de disponible.','Le taux de transformation est excellent si on retire les opportunités perdues.','J’ai promis une date de démarrage. Le staffing va maintenant découvrir laquelle.'],
    lea:['Le client veut quelqu’un demain. J’ai demandé si lundi comptait.','J’ai vendu une régie. KÉKÉ a entendu forfait.','Le TJM est négociable. Enfin surtout dans un sens.','J’ai ajouté “expert” sur le CV. Ça prend moins de temps qu’une certification.','Le pipeline est plein de “très chaud” depuis trois mois.','Le staffing est simple : il faut juste que le besoin et le consultant existent en même temps.','J’ai relancé le prospect. Il m’a répondu qu’il était devenu client ailleurs.','Le CV est parti au client. Le consultant sera prévenu dans la prochaine version.'],
    kevin:['Le planning est au vert. J’ai masqué les colonnes avec les dates.','Le client veut un chiffrage ferme sur un besoin flou. J’ai mis deux décimales.','J’ai passé le risque rouge en orange. Gouvernance maîtrisée.','Le commerce a vendu vendredi. Moi, j’ai découvert le projet lundi.','J’ai ajouté une réunion pour comprendre pourquoi on a trop de réunions.','Le projet a trois semaines de retard. Le PowerPoint, lui, est parfaitement à l’heure.','J’ai demandé les prérequis. On m’a envoyé une invitation Teams.','Le client veut une date. L’équipe veut un besoin. Moi, je veux rentrer chez moi.','J’ai escaladé le sujet. Il est maintenant bloqué un étage plus haut.','Le budget est gelé, mais le reporting est en croissance.','J’ai mis “urgent” dans l’objet. Le délai vient officiellement de diminuer.','Le COPIL s’est bien passé. Personne n’a posé la question qui fâche.','CHACHA a vendu deux jours. J’ai ouvert le planning : trois semaines.','Le client demande qui est responsable. J’ai ouvert la matrice RACI.','On n’a pas de solution, mais on a déjà réservé le point de suivi.'],
    charline:['J’ai vendu un junior en senior. Il vieillit très vite chez le client.','Le client voulait un expert. J’ai trouvé quelqu’un de disponible.','J’ai augmenté le TJM. Pour le salaire, je n’ai pas les droits.','Il est en intercontrat depuis lundi. Depuis mardi, c’est un expert IA.','Le client demande dix ans d’expérience sur une techno qui en a quatre. J’ai envoyé trois CV.','J’ai promis un profil rare. KÉKÉ cherche encore ce que j’ai vendu.','J’ai dit “forfait”. KÉKÉ ne me parle plus.','Le consultant demande une augmentation. Le client aussi, mais de son équipe.','J’ai vendu deux jours. KÉKÉ vient de m’annoncer trois semaines. Classique.','Le client trouve le TJM élevé. Le consultant trouve son salaire bas. Je suis parfaitement au milieu.','Le CV faisait quatre pages. Après mon passage, il en fait six et maîtrise Kubernetes.','J’appelle ça une opportunité. KÉKÉ appelle ça un projet impossible.'],
    rodolphe:['Une augmentation ? J’ai justement un budget pour un séminaire.','Les caisses sont vides. Le budget mobilier, lui, va très bien.','On ne dit pas non. On dit « à revoir au prochain exercice ».','Votre engagement est notre meilleure enveloppe budgétaire.','J’ai demandé un effort collectif. Surtout au collectif.','Le budget est gelé. Sauf pour les priorités que je viens d’inventer.','La reconnaissance n’est pas imposable. Profitez-en.','On va benchmarker votre augmentation avec zéro.','Je vous écoute. Le budget, beaucoup moins.','Bonne nouvelle : on maintient le baby-foot.','La marge progresse. Merci de ne pas faire le lien.','On reparle salaire après le prochain séminaire. Ou celui d’après.']
  };

  const labels={julien:'JUJU',kevin:'KÉKÉ',charline:'CHACHA',rodolphe:'RORO'};
  const main={};
  for(const [i,speaker] of ['julien','kevin','charline','rodolphe'].entries()){
    const el=document.createElement('div');
    el.className='actor-bubble fair-bubble main-banter '+speaker;
    el.dataset.speaker=labels[speaker];
    el.hidden=true;
    document.body.append(el);
    main[speaker]={el,last:-1,until:0,next:performance.now()+1400+i*2200,shownAt:0,dx:0,dy:0};
  }

  const bubbles=new Map();
  const make=(id,cls)=>{
    if(bubbles.has(id))return bubbles.get(id);
    const el=document.createElement('div');el.className='actor-bubble fair-bubble '+cls;el.hidden=true;document.body.append(el);
    const b={el,until:0,next:performance.now()+1800+Math.random()*3500,last:-1,lastShown:-Math.random()*5000,shownAt:0,dx:0,dy:0};bubbles.set(id,b);return b;
  };
  const pick=(pool,last)=>{let i=Math.floor(Math.random()*pool.length);if(pool.length>1&&i===last)i=(i+1+Math.floor(Math.random()*(pool.length-1)))%pool.length;return i;};
  const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  const onscreen=pos=>pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&pos.x>=0&&pos.x<=innerWidth&&pos.y>=0&&pos.y<=innerHeight;
  const overlaps=(a,b,pad=8)=>a.left<b.right+pad&&a.right>b.left-pad&&a.top<b.bottom+pad&&a.bottom>b.top-pad;
  const hideAll=()=>{for(const b of bubbles.values())b.el.hidden=true;};
  let lastState=null;

  function resetLayout(b){b.dx=0;b.dy=0;b.el.style.removeProperty('--tail-x');}

  function placeNearCharacter(b,pos,occupied){
    if(!onscreen(pos)){b.el.hidden=true;return false;}
    const el=b.el,mainBubble=el.classList.contains('main-banter'),margin=8;
    el.hidden=false;
    el.style.transform='translate(-50%,-115%)';
    el.style.width=mainBubble?Math.min(300,innerWidth*.58,innerWidth-16)+'px':'';
    el.style.left=pos.x+'px';el.style.top=pos.y+'px';
    let initial=el.getBoundingClientRect(),w=initial.width,h=initial.height;
    if(!w||!h){el.hidden=true;return false;}

    const side=Math.min(112,Math.max(54,w*.36));
    const lift=Math.min(92,Math.max(44,h+12));
    const previous=[b.dx||0,b.dy||0];
    const raw=[previous,[0,0],[-side,0],[side,0],[0,-lift],[-side*.62,-lift*.52],[side*.62,-lift*.52],[-side,-lift],[side,-lift]];
    const candidates=[];
    for(const c of raw)if(!candidates.some(v=>Math.abs(v[0]-c[0])<1&&Math.abs(v[1]-c[1])<1))candidates.push(c);

    let best=null;
    for(const [dx,dy] of candidates){
      let x=clamp(pos.x+dx,margin+w/2,innerWidth-margin-w/2),y=pos.y+dy;
      el.style.left=x+'px';el.style.top=y+'px';
      let r=el.getBoundingClientRect();
      if(r.top<margin){y+=margin-r.top;el.style.top=y+'px';r=el.getBoundingClientRect();}
      if(r.bottom>innerHeight-16){y-=r.bottom-(innerHeight-16);el.style.top=y+'px';r=el.getBoundingClientRect();}
      const hits=occupied.filter(o=>overlaps(r,o));
      const distance=Math.abs(x-pos.x)+Math.abs(y-pos.y)*1.15;
      const score=hits.length*10000+distance;
      if(!best||score<best.score)best={x,y,r,score};
      if(!hits.length){best={x,y,r,score};break;}
    }

    el.style.left=best.x+'px';el.style.top=best.y+'px';
    b.dx=best.x-pos.x;b.dy=best.y-pos.y;
    const tail=clamp(pos.x-best.r.left,18,best.r.width-18);
    el.style.setProperty('--tail-x',tail+'px');
    el.hidden=false;occupied.push(best.r);return true;
  }

  function reset(now){
    for(const b of bubbles.values()){b.el.hidden=true;b.until=0;b.next=now+1800+Math.random()*3500;b.lastShown=-Math.random()*5000;b.shownAt=0;resetLayout(b);}
    ['julien','kevin','charline','rodolphe'].forEach((speaker,i)=>{const b=main[speaker];b.el.hidden=true;b.until=0;b.next=now+1200+i*2200;b.last=-1;b.shownAt=0;resetLayout(b);});
  }

  function showForced(id,cls,text,pos,now,visible){
    const b=make(id,cls);
    if(b.el.textContent!==text){b.el.textContent=text;b.shownAt=now;resetLayout(b);}
    b.until=now+250;b.next=now+12000;b.lastShown=now;
    return placeNearCharacter(b,pos,visible);
  }

  function mainPos(s,speaker){
    if(speaker==='julien'){const boss=globalThis.JulienBoss;return s.level===1&&boss&&!boss.defeated(s)?renderer.project(boss.x,surface(4,boss.x)+2,.35):null;}
    if(speaker==='kevin')return renderer.project(s.player.x,s.player.y+2.25,.9);
    if(speaker==='charline'&&s.princess)return renderer.project(s.princess.x,s.princess.y+2.35,.4);
    if(speaker==='rodolphe'&&s.boss)return renderer.project(s.boss.x,s.boss.y+2.75,.55);
    return null;
  }

  function updateMain(now,s){
    const occupied=[],active=[];
    for(const speaker of ['julien','kevin','charline','rodolphe']){
      const b=main[speaker],pos=mainPos(s,speaker);
      if(speaker==='rodolphe'&&s?.comedy?.delivery>0){b.el.hidden=true;b.until=0;b.next=Math.max(b.next,now+1800);continue;}
      if(!s||s.phase!=='playing'||!onscreen(pos)){b.el.hidden=true;continue;}
      if(now>=b.next){
        const pool=pools[speaker];b.last=pick(pool,b.last);b.el.textContent=pool[b.last];
        b.shownAt=now;b.until=now+10000;b.next=b.until+4500+Math.random()*3500;resetLayout(b);
      }
      b.el.hidden=now>=b.until;
      if(!b.el.hidden)active.push({speaker,b,pos});
    }

    // Generic rule: the oldest visible line keeps its natural place; every newer nearby
    // character gets only a small local shift around its own head. Timers stay independent.
    active.sort((a,b)=>a.b.shownAt-b.b.shownAt);
    for(const item of active)placeNearCharacter(item.b,item.pos,occupied);
    return occupied;
  }

  function loop(now){
    const s=typeof Arcade!=='undefined'?Arcade.state:null;
    if(!s||typeof renderer==='undefined'){requestAnimationFrame(loop);return;}
    if(s!==lastState){lastState=s;reset(now);}
    hideAll();
    if(s.phase!=='playing'){
      for(const speaker of ['julien','kevin','charline','rodolphe'])main[speaker].el.hidden=true;
      requestAnimationFrame(loop);return;
    }

    const visible=updateMain(now,s),p=s.player,limit=visible.length+(s.comedy?.delivery>0?1:2);
    if(s.comedy?.delivery>0&&typeof deliveryScene==='function'){
      const scene=deliveryScene(s.comedy.delivery),t=scene.t;
      const visitorX=s.boss.x+4.6-Math.max(0,Math.min(1,t/1.5))*2.2+(scene.stage==='delivery'?Math.max(0,Math.min(1,(t-8)/1.2))*1.8:0);
      const visitorPos=renderer.project(visitorX,s.boss.y+2.05,.45);
      if(scene.stage==='request')showForced('raise-request','employee internal','Chef, j’ai une demande d’augmentation pour un de mes salariés.',visitorPos,now,visible);
      else if(scene.stage==='refusal'||scene.stage==='order')showForced('rodolphe-scene','rodolphe',scene.text.replace(/^RORO\s*:\s*/,''),renderer.project(s.boss.x,s.boss.y+2.75,.55),now,visible);
      else if(scene.stage==='delivery'&&t>=10.1)showForced('raise-after','employee internal','Ils sont beaux vos fauteuils, chef. Presque 3 % chacun ?',visitorPos,now,visible);
    }
    if(visible.length<limit&&s.comedy?.lineTime>0&&s.comedy.line)showForced('kevin-script','kevin',s.comedy.line,renderer.project(p.x,p.y+2.25,.9),now,visible);

    const candidates=[];
    for(let i=0;i<s.enemies.length;i++){
      const e=s.enemies[i];if(e.stun>0||Math.abs(e.floor-p.floor)>1)continue;
      const pos=renderer.project(e.x,e.y+2.05,.45);if(!onscreen(pos))continue;
      const category=e.kind==='hugo'||e.kind==='nora'?'consultant':'internal';
      candidates.push({id:'emp-'+i,cls:'employee '+category,pool:pools[e.kind]||pools.lea,pos});
    }
    candidates.sort((a,b)=>{const ba=make(a.id,a.cls),bb=make(b.id,b.cls),aa=now<ba.until,ab=now<bb.until;if(aa!==ab)return aa?-1:1;return ba.lastShown-bb.lastShown;});
    for(const c of candidates){
      if(visible.length>=limit)break;
      const b=make(c.id,c.cls);
      if(now>=b.until&&now<b.next)continue;
      if(now>=b.next){
        b.last=pick(c.pool,b.last);b.el.textContent=c.pool[b.last];b.shownAt=now;
        b.until=now+10000+Math.random()*2000;b.next=b.until+8500+Math.random()*4500;b.lastShown=now;resetLayout(b);
      }
      if(now>=b.until)continue;
      placeNearCharacter(b,c.pos,visible);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();