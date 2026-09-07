'use strict';
(()=>{
  // La population suit désormais la zone : l'open space est surtout peuplé de consultants,
  // la direction bascule vers les internes/business, et le séminaire est presque entièrement interne.
  // On ne touche pas aux archétypes de gameplay (junior/senior/union/runner) : seuls le personnage,
  // sa tenue et ses dialogues changent afin de garder la difficulté existante.
  const rosters=[
    ['hugo','nora','hugo','lea'],
    ['nora','basile','lea','basile'],
    ['lea','basile','lea','basile']
  ];

  let lastState=null;
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
    requestAnimationFrame(apply);
  }
  requestAnimationFrame(apply);
})();