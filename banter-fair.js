'use strict';
(()=>{
  document.body.classList.add('fair-banter-v4');
  const style=document.createElement('style');
  style.textContent='.fair-banter-v4 .actor-bubble:not(.fair-bubble){display:none!important}.main-banter{z-index:30!important;max-width:min(300px,58vw)!important}.main-banter::before{content:attr(data-speaker);display:block;font-size:10px;font-weight:900;letter-spacing:.12em;margin-bottom:4px;opacity:.72}';
  document.head.append(style);

  const pools={
    hugo:['Le client voulait un senior. Le commercial a dit oui, puis il m’a appelé.','Mon TJM a pris 12 %. Mon salaire a pris connaissance de l’information.','Je suis “expert” depuis que le commercial a modifié mon CV.','J’ai trois managers. Aucun ne sait sur quel projet je suis.','On m’a vendu autonome. Je cherche encore les accès.','La mission est “longue durée”. Mon badge expire vendredi.'],
    nora:['Le client m’appelle référente. Ma fiche de paie reste plus modeste.','J’ai changé de mission. Mon salaire, lui, est très fidèle.','La revalorisation arrive après le prochain comité. Le comité aussi, apparemment.','Le client me facture senior. Ma fiche de paie n’a pas reçu le mémo.','On m’a proposé de devenir manager. J’ai demandé combien. Fin de la discussion.','Mon variable est tellement motivant que personne ne sait comment il se calcule.'],
    basile:['Le variable est surtout variable au moment de le verser.','On est une grande famille. Une famille qui facture mes heures au client.','La NAO commence dès qu’on retrouve le budget. Le budget est porté disparu.','Ils ont remplacé l’augmentation par un webinar bien-être.','Bonne nouvelle : le panier repas a gagné 14 centimes. Mon loyer est rassuré.','J’ai demandé l’inflation. On m’a proposé une formation LinkedIn.'],
    lea:['Le commerce a vendu deux jours. J’en suis à ma troisième semaine.','J’ai livré vendredi. Ils ont découvert le besoin lundi.','La mission est stratégique. Personne n’a retrouvé le cahier des charges.','On m’a dit “quick win”. J’ai ouvert mon CV.','Le staffing m’a appelée pour une urgence prévue depuis mars.','Le client veut quelqu’un demain. Le commercial demande si je connais Kubernetes.'],
    kevin:['J’ai mis “urgent” dans l’objet. Ça compte comme pilotage.','Le planning est au vert. J’ai masqué les colonnes avec les dates.','J’ai passé le risque rouge en orange. Gouvernance maîtrisée.','Le client veut un chiffrage ferme sur un besoin flou. On est bien.','Le commerce revient vers moi très vite. Depuis le sprint 4.','J’ai ajouté une réunion pour comprendre pourquoi on a trop de réunions.','Le budget est gelé, mais le reporting est en croissance.','Je vais escalader. Littéralement, cette fois.'],
    charline:['J’ai vendu un junior en senior. Il vieillit très vite chez le client.','Le client voulait un expert. J’ai trouvé quelqu’un de disponible.','J’ai augmenté le TJM. Pour le salaire, je n’ai pas les droits.','Il est en intercontrat depuis lundi. Depuis mardi, c’est un expert IA.','Le client demande dix ans d’expérience sur une techno qui en a quatre. J’ai envoyé trois CV.','J’ai promis un profil rare. Kévin cherche encore ce que j’ai vendu.','J’ai dit “forfait”. Kévin ne me parle plus.','Le consultant demande une augmentation. Le client aussi, mais de son équipe.','J’ai vendu deux jours. Kévin vient de m’annoncer trois semaines. Classique.','Le client trouve le TJM élevé. Le consultant trouve son salaire bas. Je suis parfaitement au milieu.','Le CV faisait quatre pages. Après le commerce, il en fait six et maîtrise Kubernetes.','J’appelle ça une opportunité. Kévin appelle ça un projet impossible.'],
    rodolphe:['Une augmentation ? J’ai justement un budget pour un séminaire.','Les caisses sont vides. Le budget mobilier, lui, va très bien.','On ne dit pas non. On dit « à revoir au prochain exercice ».','Votre engagement est notre meilleure enveloppe budgétaire.','J’ai demandé un effort collectif. Surtout au collectif.','Le budget est gelé. Sauf pour les priorités que je viens d’inventer.','La reconnaissance n’est pas imposable. Profitez-en.','On va benchmarker votre augmentation avec zéro.','Je vous écoute. Le budget, beaucoup moins.','Bonne nouvelle : on maintient le baby-foot.','La marge progresse. Merci de ne pas faire le lien.','On reparle salaire après le prochain séminaire. Ou celui d’après.']
  };

  const labels={kevin:'KÉVIN',charline:'CHARLINE',rodolphe:'RODOLPHE'};
  const main={};
  for(const [i,speaker] of ['kevin','charline','rodolphe'].entries()){
    const el=document.createElement('div');
    el.className='actor-bubble fair-bubble main-banter '+speaker;
    el.dataset.speaker=labels[speaker];
    el.hidden=true;
    document.body.append(el);
    main[speaker]={el,last:-1,until:0,next:performance.now()+1400+i*2200};
  }

  const bubbles=new Map();
  const make=(id,cls)=>{
    if(bubbles.has(id))return bubbles.get(id);
    const el=document.createElement('div');el.className='actor-bubble fair-bubble '+cls;el.hidden=true;document.body.append(el);
    const b={el,until:0,next:performance.now()+1800+Math.random()*3500,last:-1,lastShown:-Math.random()*5000};bubbles.set(id,b);return b;
  };
  const pick=(pool,last)=>{let i=Math.floor(Math.random()*pool.length);if(pool.length>1&&i===last)i=(i+1+Math.floor(Math.random()*(pool.length-1)))%pool.length;return i;};
  const onscreen=pos=>pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&pos.x>=0&&pos.x<=innerWidth&&pos.y>=0&&pos.y<=innerHeight;
  const place=(b,pos)=>{if(!onscreen(pos)){b.el.hidden=true;return false;}b.el.style.left=Math.max(125,Math.min(innerWidth-125,pos.x))+'px';b.el.style.top=Math.max(120,Math.min(innerHeight-35,pos.y))+'px';b.el.hidden=false;return true;};
  const hideAll=()=>{for(const b of bubbles.values())b.el.hidden=true;};
  let lastState=null;

  function reset(now){
    for(const b of bubbles.values()){b.el.hidden=true;b.until=0;b.next=now+1800+Math.random()*3500;b.lastShown=-Math.random()*5000;}
    ['kevin','charline','rodolphe'].forEach((speaker,i)=>{const b=main[speaker];b.el.hidden=true;b.until=0;b.next=now+1200+i*2200;b.last=-1;});
  }

  function showForced(id,cls,text,pos,now,visible){const b=make(id,cls);b.el.textContent=text;b.until=now+250;b.next=now+12000;b.lastShown=now;if(!place(b,pos))return false;const r=b.el.getBoundingClientRect();if(visible.some(v=>r.left<v.right+8&&r.right>v.left-8&&r.top<v.bottom+8&&r.bottom>v.top-8)){b.el.hidden=true;return false;}visible.push(r);return true;}

  function mainPos(s,speaker){
    if(speaker==='kevin')return renderer.project(s.player.x,s.player.y+2.25,.9);
    if(speaker==='charline'&&s.princess)return renderer.project(s.princess.x,s.princess.y+2.35,.4);
    if(speaker==='rodolphe'&&s.boss)return renderer.project(s.boss.x,s.boss.y+2.75,.55);
    return null;
  }

  function updateMain(now,s){
    for(const speaker of ['kevin','charline','rodolphe']){
      const b=main[speaker],pos=mainPos(s,speaker);
      if(!s||s.phase!=='playing'||!onscreen(pos)){b.el.hidden=true;continue;}
      if(now>=b.next){const pool=pools[speaker];b.last=pick(pool,b.last);b.el.textContent=pool[b.last];b.until=now+8500;b.next=b.until+4500+Math.random()*3500;}
      if(now<b.until){
        b.el.style.left=Math.max(125,Math.min(innerWidth-125,pos.x))+'px';
        b.el.style.top=Math.max(120,Math.min(innerHeight-35,pos.y))+'px';
        b.el.hidden=false;
      }else b.el.hidden=true;
    }
  }

  function loop(now){
    const s=typeof Arcade!=='undefined'?Arcade.state:null;
    if(!s||typeof renderer==='undefined'){requestAnimationFrame(loop);return;}
    if(s!==lastState){lastState=s;reset(now);}
    hideAll();
    if(s.phase!=='playing'){
      for(const speaker of ['kevin','charline','rodolphe'])main[speaker].el.hidden=true;
      requestAnimationFrame(loop);return;
    }

    updateMain(now,s);

    const p=s.player,visible=[],limit=s.comedy?.delivery>0?1:2;
    if(s.comedy?.delivery>0&&typeof deliveryScene==='function'){
      const scene=deliveryScene(s.comedy.delivery),t=scene.t;
      const visitorX=s.boss.x+4.6-Math.max(0,Math.min(1,t/1.5))*2.2+(scene.stage==='delivery'?Math.max(0,Math.min(1,(t-8)/1.2))*1.8:0);
      const visitorPos=renderer.project(visitorX,s.boss.y+2.05,.45);
      if(scene.stage==='request')showForced('raise-request','employee','Chef, j’ai une demande d’augmentation pour un de mes salariés.',visitorPos,now,visible);
      else if(scene.stage==='refusal'||scene.stage==='order')showForced('rodolphe-scene','rodolphe',scene.text.replace(/^RODOLPHE\s*:\s*/,''),renderer.project(s.boss.x,s.boss.y+2.75,.55),now,visible);
      else if(scene.stage==='delivery'&&t>=10.1)showForced('raise-after','employee','Ils sont beaux vos fauteuils, chef. Presque 3 % chacun ?',visitorPos,now,visible);
    }
    if(visible.length<limit&&s.comedy?.lineTime>0&&s.comedy.line)showForced('kevin-script','kevin',s.comedy.line,renderer.project(p.x,p.y+2.25,.9),now,visible);

    const candidates=[];
    for(let i=0;i<s.enemies.length;i++){
      const e=s.enemies[i];if(e.stun>0||Math.abs(e.floor-p.floor)>1)continue;const pos=renderer.project(e.x,e.y+2.05,.45);if(!onscreen(pos))continue;candidates.push({id:'emp-'+i,cls:'employee',pool:pools[e.kind]||pools.lea,pos});
    }
    candidates.sort((a,b)=>{const ba=make(a.id,a.cls),bb=make(b.id,b.cls),aa=now<ba.until,ab=now<bb.until;if(aa!==ab)return aa?-1:1;return ba.lastShown-bb.lastShown;});
    for(const c of candidates){if(visible.length>=limit)break;const b=make(c.id,c.cls);if(now>=b.until&&now<b.next)continue;if(now>=b.next){b.last=pick(c.pool,b.last);b.el.textContent=c.pool[b.last];b.until=now+10000+Math.random()*2000;b.next=b.until+8500+Math.random()*4500;b.lastShown=now;}if(now>=b.until)continue;if(!place(b,c.pos))continue;const r=b.el.getBoundingClientRect();if(visible.some(v=>r.left<v.right+8&&r.right>v.left-8&&r.top<v.bottom+8&&r.bottom>v.top-8)){b.el.hidden=true;continue;}visible.push(r);}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
