'use strict';
(()=>{
  // Keep the exact management role visible without observing our own DOM writes.
  const bossTitle=document.querySelector('.boss-hud-title span');
  if(bossTitle)bossTitle.textContent='RODOLPHE · DIRECTEUR RÉGION GRAND OUEST';
})();
