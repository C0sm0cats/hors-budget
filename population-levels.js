'use strict';
(()=>{
  // La population suit désormais la zone avec douze personnes distinctes sur toute la partie :
  // aucun nom ni modèle générique ne réapparaît dans un autre niveau.
  // Open space : surtout consultants. Direction : surtout internes/business. Séminaire : internes.
  // On ne touche pas aux archétypes de gameplay (junior/senior/union/runner) : seuls le personnage,
  // sa tenue et ses dialogues changent afin de garder la difficulté existante.
  const rosters=[
    ['hugo','nora','hugo2','lea'],
    ['nora2','basile','basile2','lea2'],
    ['sarah','mehdi','elodie','antoine']
  ];
  const identities=[
    {
      hud:'OPEN SPACE · LCP7',
      intro:'OPEN SPACE · LCP7',
      role:'KÉKÉ · DIRECTEUR DE PROJETS · CHACHA · BUSINESS MANAGER'
    },
    {
      hud:'DIRECTION TS · PAYS DE LA LOIRE',
      intro:'DIRECTION TECHNOLOGIES SERVICES',
      role:'JUJU · DIRECTEUR TECHNOLOGIES SERVICES PAYS DE LA LOIRE'
    },
    {
      hud:'POWER UP TOUR · GRAND OUEST',
      intro:'POWER UP TOUR · GRAND OUEST',
      role:'RORO · DIRECTEUR RÉGION GRAND OUEST'
    }
  ];

  let lastState=null;
  function syncIdentity(state){
    const identity=identities[state.level]||identities[0];
    const levelName=document.getElementById('levelName');
    if(levelName&&levelName.textContent!==identity.hud)levelName.textContent=identity.hud;

    const cinema=document.querySelector('.cinematic-card');
    if(cinema&&!cinema.hidden){
      const strong=cinema.querySelector('strong'),em=cinema.querySelector('em');
      if(cinema.classList.contains('level-intro')){
        if(strong&&strong.textContent!==identity.intro)strong.textContent=identity.intro;
        if(em&&em.textContent!==identity.role)em.textContent=identity.role;
      }else if(state.level===2&&cinema.classList.contains('boss-intro')){
        if(strong)strong.textContent='RORO';
        if(em)em.textContent='DIRECTEUR RÉGION GRAND OUEST · GARDIEN DU BUDGET';
      }
    }
  }

  function apply(){
    const arcade=globalThis.Arcade;
    const state=arcade?.state;
    if(!state){requestAnimationFrame(apply);return;}
    if(state!==lastState){
      lastState=state;
      const roster=rosters[state.level]||rosters[0];
      state.enemies.forEach((enemy,i)=>{
        const kind=roster[i%roster.length];
        if(kind)enemy.kind=kind;
      });
      document.body.dataset.population=state.level===0?'consultants':state.level===1?'direction':'seminaire';
    }
    syncIdentity(state);
    requestAnimationFrame(apply);
  }
  requestAnimationFrame(apply);
})();
