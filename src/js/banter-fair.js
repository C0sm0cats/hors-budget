'use strict';
(()=>{
  document.body.classList.add('fair-banter-v4');
  const style=document.createElement('style');
  style.textContent='.fair-banter-v4 .actor-bubble:not(.fair-bubble){display:none!important}.main-banter{z-index:30!important;max-width:min(300px,58vw)!important}.fair-bubble::after{left:var(--tail-x,50%)!important}.fair-bubble.consultant{box-shadow:inset 0 0 0 1px #8bb0c788}.fair-bubble.internal{box-shadow:inset 0 0 0 1px #c59b7288}';document.head.append(style);
  const pools={
    techServicesDirector:["Le bench est à zéro. Sur la slide.", "Bench supprimé. Colonne renommée.", "La marge monte. Les salaires attendront.", "Objectif : zéro intercontrat. Arrondi inclus.", "Le staffing est prêt. Il manque les missions.", "Le plan de charge est plein de plans de charge."],
    hugo:["Vendu senior. Embauché lundi.", "Mon TJM a pris 12 %. Mon salaire attend.", "Expert depuis la réécriture de mon CV.", "Trois managers. Toujours pas de mission claire."],
    nora:["Référente chez le client. Junior sur la paie.", "Nouvelle mission. Même salaire.", "Mon augmentation attend un comité disponible.", "Facturée senior. Payée comme avant."],
    hugo2:["Trois ans d’expérience. Cinq sur le CV.", "Mon onboarding a survécu à ma mission.", "J’ai les accès. On migre demain.", "Au moins, le CRA sait où je travaille."],
    nora2:["Venue renforcer une équipe déjà partie.", "Indispensable au client. Jusqu’à vendredi.", "Deux certifications. Toujours pas le bon VPN.", "Mission stratégique. Formation à mes frais ?"],
    basile:["TJM en baisse. Valeur ajoutée en gras.", "Trois CV pour midi. Disponibles en septembre.", "Pipeline vert. Toujours aucune signature.", "Profil parfait. Déjà en mission."],
    basile2:["Forecast précis. Sauf dates et montants.", "Profil disponible. Besoin suspendu.", "Expert rare demandé. Budget junior.", "« On verra » fait moins CRM."],
    lea:["Démarrage demain. On cherche encore le profil.", "J’ai vendu une régie. On attend un forfait.", "Le client négocie le TJM. Toujours à la baisse.", "Pipeline brûlant. Contrats tièdes."],
    lea2:["Besoin urgent depuis six mois.", "CV validé. Reste à trouver la personne.", "Démarrage lundi. L’année se négocie.", "Staffing aligné : tout le monde attend."],
    sarah:["Potentiel libéré. Agenda détenu.", "L’atelier court dure deux heures.", "Petits fours en vue. Networking activé.", "Badge VIP. Augmentation standard : zéro."],
    mehdi:["Un atelier pour préparer les prochains.", "Réveil à 7 h. Enthousiasme facultatif.", "Trois photos. Deux tote bags. Zéro décision.", "Plan d’action valable jusqu’à lundi."],
    elodie:["« Accélérer », jusqu’à 22 h 30.", "Un tote bag. Toujours pas d’augmentation.", "Pensée libre. Template obligatoire.", "Buffet libre. Enfin un budget accessible."],
    antoine:["Belle vue. La sortie est où ?", "J’ai réseauté avec mes collègues habituels.", "Des questions ? Tout le monde tient à son poste.", "Le PowerPoint marche. Séminaire réussi."],
    projectDirector:["Planning au vert. Dates réelles masquées.", "Besoin flou. Chiffrage à deux décimales.", "Risque rouge passé orange. Ça avance.", "Vendu vendredi. Découvert lundi.", "Un COPIL pour supprimer les COPIL.", "Le projet a trois semaines de retard. Le reporting, lui, est parfaitement à l’heure.", "Le client demande une date. J’ai répondu « trajectoire ».", "Staffing validé. Il manque juste les gens."],
    businessManager:["Junior placé. Tarif senior négocié.", "Expert demandé. Profil disponible proposé.", "TJM augmenté. Salaire transmis aux RH.", "Lundi sur le bench. Mardi expert IA.", "Profil rare promis. Recherche en cours.", "Trois personnes lundi. J’ai trouvé le lundi.", "Besoin flou ? Opportunité flexible.", "Contrat signé. À toi de trouver l’équipe."],
    regionalDirector:["Une augmentation ? Parlons engagement.", "Pas d’enveloppe. Un séminaire, en revanche…", "C’est un oui pour un prochain exercice.", "Votre engagement reste notre meilleur placement.", "L’effort sera collectif. Merci à vous.", "Budget gelé. Exceptions sur invitation.", "Négociations ouvertes. Enveloppe fermée.", "Faites plus avec moins. On reparle du reste."]
  };
  const labels={techServicesDirector:'DIRECTEUR TECHNOLOGIES SERVICES',projectDirector:'DIRECTEUR DE PROJETS',businessManager:'BUSINESS MANAGER',regionalDirector:'DIRECTEUR RÉGION GRAND OUEST'},main={};
  for(const [i,speaker] of ['techServicesDirector','projectDirector','businessManager','regionalDirector'].entries()){const el=document.createElement('div');el.className='actor-bubble fair-bubble main-banter '+speaker;el.dataset.speaker=labels[speaker];el.hidden=true;document.body.append(el);main[speaker]={el,last:-1,until:0,next:performance.now()+1400+i*2200,shownAt:0,dx:0,dy:0};}
  const bubbles=new Map(),make=(id,cls)=>{if(bubbles.has(id)){const b=bubbles.get(id);b.el.className='actor-bubble fair-bubble '+cls;return b;}const el=document.createElement('div');el.className='actor-bubble fair-bubble '+cls;el.hidden=true;document.body.append(el);const b={el,until:0,next:performance.now()+1800+Math.random()*3500,last:-1,lastShown:-Math.random()*5000,shownAt:0,dx:0,dy:0};bubbles.set(id,b);return b;};
  const pick=(pool,last)=>{let i=Math.floor(Math.random()*pool.length);if(pool.length>1&&i===last)i=(i+1+Math.floor(Math.random()*(pool.length-1)))%pool.length;return i;},clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v)),onscreen=pos=>pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&pos.x>=0&&pos.x<=innerWidth&&pos.y>=0&&pos.y<=innerHeight,overlaps=(a,b,pad=8)=>a.left<b.right+pad&&a.right>b.left-pad&&a.top<b.bottom+pad&&a.bottom>b.top-pad,hideAll=()=>{for(const b of bubbles.values())b.el.hidden=true;};let lastState=null;
  function resetLayout(b){b.dx=0;b.dy=0;b.el.style.removeProperty('--tail-x');}
  const headPosition=kind=>{const r=renderer.actorBounds.get(kind);return r?{x:(r.left+r.right)/2,y:r.top,kind}:null;};
  function placeNearCharacter(b,pos,occupied){
    if(!onscreen(pos)){b.el.hidden=true;return false;}
    const el=b.el,margin=8,gap=16;
    el.hidden=false;el.dataset.actor=pos.kind;el.style.transform='translate(-50%,-100%)';
    el.style.width=el.classList.contains('main-banter')?Math.min(300,innerWidth*.58,innerWidth-16)+'px':'';
    // Measure at a neutral position, then freeze width so edge clamping cannot rewrap text.
    el.style.left='0px';el.style.top='0px';
    const {width:w,height:h}=el.getBoundingClientRect();
    if(!w||!h){el.hidden=true;return false;}
    el.style.width=w+'px';
    const reserved=Array.from(document.querySelectorAll?.('.hud > *,.boss-hud')||[]).filter(e=>!e.hidden).map(e=>e.getBoundingClientRect());
    const actors=Array.from(renderer.actorBounds.values());
    const side=Math.max(0,w/2-18),lift=h+12;
    // Keep the entire bubble and its tail above the head. Never clamp down
    // into a sprite when the HUD or viewport leaves insufficient room.
    for(const dy of [0,...occupied.map(r=>Math.min(0,r.top-pos.y-1)),-16,-32,-lift])for(const dx of [0,-side,side]){
      const x=clamp(pos.x+dx,margin+w/2,innerWidth-margin-w/2),y=pos.y-gap+dy;
      const r={left:x-w/2,right:x+w/2,top:y-h,bottom:y,width:w,height:h},withTail={...r,bottom:r.bottom+8};
      if(r.top<margin||withTail.bottom>innerHeight-margin)continue;
      if([...occupied,...reserved,...actors].some(o=>overlaps(withTail,o)))continue;
      el.style.left=x+'px';el.style.top=y+'px';
      el.style.setProperty('--tail-x',clamp(pos.x-r.left,18,w-18)+'px');
      occupied.push(withTail);return true;
    }
    el.hidden=true;return false;
  }

  function reset(now){for(const b of bubbles.values()){b.el.hidden=true;b.until=0;b.next=now+1800+Math.random()*3500;b.lastShown=-Math.random()*5000;b.shownAt=0;resetLayout(b);}['techServicesDirector','projectDirector','businessManager','regionalDirector'].forEach((speaker,i)=>{const b=main[speaker];b.el.hidden=true;b.until=0;b.next=now+1200+i*2200;b.last=-1;b.shownAt=0;resetLayout(b);});}
  function showForced(id,cls,text,pos,now,visible){const b=make(id,cls);if(b.el.textContent!==text){b.el.textContent=text;b.shownAt=now;resetLayout(b);}b.until=now+250;b.next=now+12000;b.lastShown=now;return placeNearCharacter(b,pos,visible);}
  function mainPos(s,speaker){
    if(speaker==='techServicesDirector'&&(s.level!==1||!globalThis.TechServicesBoss||globalThis.TechServicesBoss.defeated(s)))return null;
    if(speaker==='businessManager'&&(s.level!==2||!s.businessManager))return null;
    if(speaker==='regionalDirector'&&(s.level!==2||!s.boss||s.boss.hp<=0))return null;
    return headPosition(speaker);
  }
  function updateMain(now,s,occupied,reacting){const active=[];for(const speaker of ['techServicesDirector','projectDirector','businessManager','regionalDirector']){const b=main[speaker],pos=mainPos(s,speaker);if(!s||s.phase!=='playing'||!onscreen(pos)||(reacting&&speaker==='projectDirector')||(s.bossReaction?.speaker===speaker&&s.levelTime<s.bossReaction.until)){b.el.hidden=true;continue;}if(now>=b.next){const pool=pools[speaker];b.last=pick(pool,b.last);b.el.textContent=pool[b.last];b.shownAt=now;b.until=now+10000;b.next=b.until+4500+Math.random()*3500;resetLayout(b);}b.el.hidden=now>=b.until;if(!b.el.hidden)active.push({b,pos});}active.sort((a,b)=>a.b.shownAt-b.b.shownAt);for(const item of active){item.b.el.hidden=true;if(occupied.length<2)placeNearCharacter(item.b,item.pos,occupied);}return occupied;}
  function loop(now){const s=typeof Arcade!=='undefined'?Arcade.state:null;if(!s||typeof renderer==='undefined'){return;}if(s!==lastState){lastState=s;reset(now);}hideAll();if(s.phase!=='playing'){for(const speaker of ['techServicesDirector','projectDirector','businessManager','regionalDirector'])main[speaker].el.hidden=true;return;}const visible=[],reaction=s.bossReaction;if(reaction&&s.levelTime<reaction.until&&!showForced('boss-reaction',reaction.speaker,reaction.text,headPosition(reaction.speaker),now,visible)){
    const regional=reaction.speaker==='regionalDirector',hp=regional?s.boss.hp:globalThis.TechServicesBoss.state(s).hp;
    const hint=hp<=0?'ACCÈS OUVERT →':regional&&!s.boss.open?'ATTENDS « BÉNÉFICES RECORDS »':'X : RENVOIE '+(regional?'LE DOSSIER':'LES KPI');
    const banner=document.getElementById('banner');if(banner)banner.textContent=reaction.text+' · '+hint;
  }const p=s.player,limit=2,reacting=s.comedy?.lineTime>0&&!!s.comedy.line;if(reacting)showForced('projectDirector-script','projectDirector',s.comedy.line,headPosition('projectDirector'),now,visible);updateMain(now,s,visible,reacting);const candidates=[];for(let i=0;i<s.enemies.length;i++){const e=s.enemies[i];if(e.stun>0||Math.abs(e.floor-p.floor)>1)continue;const pos=headPosition(e.kind);if(!onscreen(pos))continue;const category=/^(hugo|nora)/.test(e.kind)?'consultant':'internal';candidates.push({id:'emp-'+i,cls:'employee '+category,pool:pools[e.kind]||pools.lea,pos});}candidates.sort((a,b)=>{const ba=make(a.id,a.cls),bb=make(b.id,b.cls),aa=now<ba.until,ab=now<bb.until;if(aa!==ab)return aa?-1:1;return ba.lastShown-bb.lastShown;});for(const c of candidates){if(visible.length>=limit)break;const b=make(c.id,c.cls);if(now>=b.until&&now<b.next)continue;if(now>=b.next){b.last=pick(c.pool,b.last);b.el.textContent=c.pool[b.last];b.shownAt=now;b.until=now+10000+Math.random()*2000;b.next=b.until+8500+Math.random()*4500;b.lastShown=now;resetLayout(b);}if(now>=b.until)continue;placeNearCharacter(b,c.pos,visible);}}globalThis.DialoguePresentation={update:loop};
})();