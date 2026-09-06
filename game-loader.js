'use strict';
// Charge le moteur en supprimant réellement les deux rendus de tonneaux avant exécution.
// La logique physique s.barrels reste inchangée ; seul son rendu devient un objet ESN natif WebGL.
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','game.js?v=33',false);
  xhr.send(null);
  if(xhr.status&&xhr.status!==200)throw new Error('Impossible de charger game.js ('+xhr.status+')');
  let src=xhr.responseText;

  // Le Game Over reste satirique sans viser directement le joueur.
  src=src.replace("'LES NAO ONT EU TA PEAU.'","'MERCI POUR TON ENGAGEMENT.'");

  const rollDef=" function roll(mesh,x,y,z,r,depth,spin,hex='#f0dbaf'){const col=rgb(hex),side=rgb('#d0ae7b');for(let i=0;i<14;i++){const a=i*Math.PI/7+spin,b=(i+1)*Math.PI/7+spin,p=[x+Math.cos(a)*r,y+Math.sin(a)*r,z-depth/2],q=[x+Math.cos(b)*r,y+Math.sin(b)*r,z-depth/2],P=[p[0],p[1],z+depth/2],Q=[q[0],q[1],z+depth/2];mesh.quad(p,q,Q,P,[Math.cos((a+b)/2),Math.sin((a+b)/2),0],i%4===0?rgb('#d27b73'):side);mesh.tri([x,y,z+depth/2],P,Q,[0,0,1],col);}const dx=Math.cos(spin)*r*.65,dy=Math.sin(spin)*r*.65;line(mesh,x-dx,y-dy,x+dx,y+dy,z+depth/2+.012,.08,'#bd7164');}";
  const esnDef=`
 function esnObstacle(mesh,x,y,z,level,movingHazard=true){
   const wheel='#22313a';
   if(level===0){
     // Open space : carton de projet sur roulettes.
     mesh.box(x,y,z,.68,.55,.48,'#c79a63');
     mesh.box(x,y+.04,z+.25,.52,.19,.025,'#f1e2bd');
     mesh.box(x,y,z+.27,.07,.55,.025,'#8f6845');
     mesh.box(x-.22,y-.31,z,.12,.12,.14,wheel);mesh.box(x+.22,y-.31,z,.12,.12,.14,wheel);
   }else if(level===1){
     // Direction : mallette BUDGET.
     mesh.box(x,y,z,.72,.48,.42,'#435864');
     mesh.box(x,y+.02,z+.22,.54,.08,.025,'#d5f382');
     mesh.box(x,y+.31,z,.34,.12,.16,'#263945');
     mesh.box(x-.23,y-.28,z,.11,.11,.13,wheel);mesh.box(x+.23,y-.28,z,.11,.11,.13,wheel);
   }else{
     // Rooftop : flight-case de séminaire POWER UP.
     mesh.box(x,y,z,.75,.55,.5,'#697985');
     mesh.box(x,y+.02,z+.26,.58,.18,.025,'#354853');
     for(const sx of [-.32,.32])for(const sy of [-.22,.22])mesh.box(x+sx,y+sy,z+.27,.08,.08,.03,'#b7c1c5');
     mesh.box(x,y+.36,z,.36,.12,.17,'#303d48');
     mesh.box(x-.24,y-.32,z,.12,.12,.14,wheel);mesh.box(x+.24,y-.32,z,.12,.12,.14,wheel);
   }
 }`;
  if(!src.includes(rollDef))throw new Error('Signature du rendu tonneau introuvable');
  src=src.replace(rollDef,esnDef);

  const decorative="if(!s.boss.active)for(let i=0;i<3;i++)roll(moving,-9.35+i*.38,s.boss.y+.27,-.47,.21,.35,0);";
  const moving="for(const b of s.barrels)roll(moving,b.x,b.y,.65,b.r,.48,b.spin);";
  if(!src.includes(decorative)||!src.includes(moving))throw new Error('Appel de rendu tonneau introuvable');
  src=src.replace(decorative,"if(!s.boss.active)for(let i=0;i<3;i++)esnObstacle(moving,-9.35+i*.55,s.boss.y+.38,-.47,s.level,false);");
  src=src.replace(moving,"for(const b of s.barrels)esnObstacle(moving,b.x,b.y,.65,s.level,true);");

  (0,eval)(src+'\n//# sourceURL=game.js');
})();
