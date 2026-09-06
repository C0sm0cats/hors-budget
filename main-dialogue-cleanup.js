'use strict';
// Kévin et Charline utilisent uniquement leurs punchlines récurrentes.
// Les scènes réellement scénarisées (notamment Rodolphe et les fauteuils) restent intactes.
(()=>{
  function clean(){
    let s=null;
    try{s=Arcade?.state;}catch{}
    if(s){
      if(s.comedy){s.comedy.line='';s.comedy.lineTime=0;}
      s.charlineTalk=0;
    }
    requestAnimationFrame(clean);
  }
  requestAnimationFrame(clean);
})();
