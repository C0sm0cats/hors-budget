'use strict';
// Punchlines des trois personnages principaux, visibles pendant toute la partie.
(()=>{
  const pools={
    kevin:['J’ai mis “urgent” dans l’objet. Ça compte comme pilotage.','Le planning est au vert. J’ai masqué les colonnes avec les dates.','J’ai passé le risque rouge en orange. Gouvernance maîtrisée.','Le client veut un chiffrage ferme sur un besoin flou. On est bien.','Le commerce revient vers moi très vite. Depuis le sprint 4.','J’ai ajouté une réunion pour comprendre pourquoi on a trop de réunions.','Le budget est gelé, mais le reporting est en croissance.','Je vais escalader. Littéralement, cette fois.'],
    charline:['J’ai vendu un junior en senior. Il vieillit très vite chez le client.','Le client voulait un expert. J’ai trouvé quelqu’un de disponible.','J’ai augmenté le TJM. Pour le salaire, je n’ai pas les droits.','Il est en intercontrat depuis lundi. Depuis mardi, c’est un expert IA.','Le client demande dix ans d’expérience sur une techno qui en a quatre. J’ai envoyé trois CV.','J’ai promis un profil rare. Kévin cherche encore ce que j’ai vendu.','J’ai dit “forfait”. Kévin ne me parle plus.','Le consultant demande une augmentation. Le client aussi, mais de son équipe.','J’ai vendu deux jours. Kévin vient de m’annoncer trois semaines. Classique.','Le client trouve le TJM élevé. Le consultant trouve son salaire bas. Je suis parfaitement au milieu.','Le CV faisait quatre pages. Après le commerce, il en fait six et maîtrise Kubernetes.','J’appelle ça une opportunité. Kévin appelle ça un projet impossible.'],
    rodolphe:['Une augmentation ? J’ai justement un budget pour un séminaire.','Les caisses sont vides. Le budget mobilier, lui, va très bien.','On ne dit pas non. On dit « à revoir au prochain exercice ».','Votre engagement est notre meilleure enveloppe budgétaire.','J’ai demandé un effort collectif. Surtout au collectif.','Le budget est gelé. Sauf pour les priorités que je viens d’inventer.','La reconnaissance n’est pas imposable. Profitez-en.','On va benchmarker votre augmentation avec zéro.','Je vous écoute. Le budget, beaucoup moins.','Bonne nouvelle : on maintient le baby-foot.','La marge progresse. Merci de ne pas faire le lien.','On reparle salaire après le prochain séminaire. Ou celui d’après.']
  };
  const speakers=['kevin','charline','rodolphe'];
  const labels={kevin:'KÉVIN',charline:'CHARLINE',rodolphe:'RODOLPHE'};
  const last={kevin:-1,charline:-1,rodolphe:-1};
  const style=document.createElement('style');
  style.textContent='.actor-bubble.kevin:not(.core-banter),.actor-bubble.charline:not(.core-banter),.actor-bubble.rodolphe:not(.core-banter){display:none!important}.core-banter{position:fixed!important;left:50%!important;top:auto!important;bottom:72px!important;transform:translateX(-50%)!important;max-width:min(520px,calc(100vw - 40px))!important;z-index:30!important;pointer-events:none}.core-banter::before{content:attr(data-speaker);display:block;font-size:10px;font-weight:900;letter-spacing:.12em;margin-bottom:4px;opacity:.72}';
  document.head.append(style);
  const bubble=document.createElement('div');bubble.className='actor-bubble core-banter kevin';bubble.hidden=true;document.body.append(bubble);
  let speakerIndex=0,nextAt=0;
  const pick=(speaker)=>{const pool=pools[speaker];let i=Math.floor(Math.random()*pool.length);if(pool.length>1&&i===last[speaker])i=(i+1+Math.floor(Math.random()*(pool.length-1)))%pool.length;last[speaker]=i;return pool[i];};
  function update(now){
    let state=null;try{state=Arcade?.state;}catch{}
    const active=state&&state.phase==='playing'&&!(state.comedy?.miracle>0);
    if(!active){bubble.hidden=true;nextAt=0;requestAnimationFrame(update);return;}
    if(!nextAt||now>=nextAt){const speaker=speakers[speakerIndex++%speakers.length];bubble.className='actor-bubble core-banter '+speaker;bubble.dataset.speaker=labels[speaker];bubble.textContent=pick(speaker);bubble.hidden=false;nextAt=now+6500;}
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();
