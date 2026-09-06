'use strict';
(()=>{
  // Keep character roles explicit in the presentation without touching gameplay state.
  const roleCopy={
    rodolphe:'DIRECTEUR RÉGION GRAND OUEST',
    kevin:'DIRECTEUR DE PROJETS',
    charline:'BUSINESS MANAGER'
  };
  const apply=()=>{
    const bossTitle=document.querySelector('.boss-hud-title span');
    if(bossTitle)bossTitle.textContent='RODOLPHE · '+roleCopy.rodolphe;
  };
  apply();
  new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});
})();
