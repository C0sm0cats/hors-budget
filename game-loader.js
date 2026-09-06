'use strict';
// Charge le moteur en supprimant réellement les deux rendus de tonneaux avant exécution.
// La logique physique s.barrels reste inchangée ; seul son rendu devient un objet ESN natif WebGL.
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','game.js?v=33',false);
  xhr.send(null);
  if(xhr.status&&xhr.status!==200)throw new Error('Impossible de charger game.js ('+xhr.status+')');
  let src=xhr.responseText;

  src=src.replace("'LES NAO ONT EU TA PEAU.'","'MERCI POUR TON ENGAGEMENT.'");
  src=src.replace("nora:{name:'Nora',shirt:'#609cbe',hair:'#ebc66d',skin:'#e7b892',female:true,style:'bob'","nora:{name:'Nora',shirt:'#609cbe',hair:'#211a18',skin:'#754b35',female:true,style:'bob'");
  src=src.replace("basile:{name:'Basile',shirt:'#9b79a6',hair:'#573c31',skin:'#bf8d69',beard:true","basile:{name:'Basile',shirt:'#9b79a6',hair:'#1d1715',skin:'#8b5b3e',beard:true");
  src=src.replace("charline:{name:'Charline'","julien:{name:'Julien',shirt:'#486f8f',hair:'#49372f',skin:'#e2b58f',style:'short'},charline:{name:'Charline'");

  const rollDef=" function roll(mesh,x,y,z,r,depth,spin,hex='#f0dbaf'){const col=rgb(hex),side=rgb('#d0ae7b');for(let i=0;i<14;i++){const a=i*Math.PI/7+spin,b=(i+1)*Math.PI/7+spin,p=[x+Math.cos(a)*r,y+Math.sin(a)*r,z-depth/2],q=[x+Math.cos(b)*r,y+Math.sin(b)*r,z-depth/2],P=[p[0],p[1],z+depth/2],Q=[q[0],q[1],z+depth/2];mesh.quad(p,q,Q,P,[Math.cos((a+b)/2),Math.sin((a+b)/2),0],i%4===0?rgb('#d27b73'):side);mesh.tri([x,y,z+depth/2],P,Q,[0,0,1],col);}const dx=Math.cos(spin)*r*.65,dy=Math.sin(spin)*r*.65;line(mesh,x-dx,y-dy,x+dx,y+dy,z+depth/2+.012,.08,'#bd7164');}";
  const esnDef=`
 function esnObstacle(mesh,x,y,z,level,movingHazard=true){
   const wheel='#22313a';
   if(level===0){mesh.box(x,y,z,.68,.55,.48,'#c79a63');mesh.box(x,y+.04,z+.25,.52,.19,.025,'#f1e2bd');mesh.box(x,y,z+.27,.07,.55,.025,'#8f6845');mesh.box(x-.22,y-.31,z,.12,.12,.14,wheel);mesh.box(x+.22,y-.31,z,.12,.12,.14,wheel);
   }else if(level===1){mesh.box(x,y,z,.72,.48,.42,'#435864');mesh.box(x,y+.02,z+.22,.54,.08,.025,'#d5f382');mesh.box(x,y+.31,z,.34,.12,.16,'#263945');mesh.box(x-.23,y-.28,z,.11,.11,.13,wheel);mesh.box(x+.23,y-.28,z,.11,.11,.13,wheel);
   }else{mesh.box(x,y,z,.75,.55,.5,'#697985');mesh.box(x,y+.02,z+.26,.58,.18,.025,'#354853');for(const sx of [-.32,.32])for(const sy of [-.22,.22])mesh.box(x+sx,y+sy,z+.27,.08,.08,.03,'#b7c1c5');mesh.box(x,y+.36,z,.36,.12,.17,'#303d48');mesh.box(x-.24,y-.32,z,.12,.12,.14,wheel);mesh.box(x+.24,y-.32,z,.12,.12,.14,wheel);}
 }
 function julienOffice(mesh){
   const x=6.55,y=surface(3,x);
   // Bureau vitré / meuble de direction, placé à droite du 4e plateau pour ne pas gêner l'échelle ni le passage.
   mesh.box(x,y+.28,-.72,2.75,.12,.82,'#6e5847');mesh.box(x-1.12,y-.18,-.72,.12,.92,.72,'#4e4036');mesh.box(x+1.12,y-.18,-.72,.12,.92,.72,'#4e4036');
   mesh.box(x-.55,y+.48,-.25,.7,.07,.42,'#263b49');mesh.box(x-.55,y+.82,-.25,.07,.65,.42,'#263b49');
   // Tableau blanc dédié à l'intercontrat, derrière Julien.
   mesh.box(x,y+2.25,-1.15,3.65,1.55,.08,'#e8ece7');mesh.box(x,y+2.25,-1.19,3.85,1.75,.06,'#596b70');
   // Axes et courbes : DISPONIBLES monte, MISSIONS stagne, objectif en pointillé.
   mesh.box(x-1.38,y+2.2,-1.08,.055,1.05,.035,'#344a54');mesh.box(x-.15,y+1.7,-1.08,2.5,.055,.035,'#344a54');
   const avail=[[-1.2,1.88],[-.75,2.02],[-.3,2.18],[.15,2.42],[.6,2.62],[1.05,2.92]];
   const mission=[[-1.2,1.92],[-.75,1.98],[-.3,1.95],[.15,2.03],[.6,2.0],[1.05,2.08]];
   for(let i=1;i<avail.length;i++){const a=avail[i-1],b=avail[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);mesh.box(x+(a[0]+b[0])/2,y+(a[1]+b[1])/2,-1.03,len,.055,.035,'#d15d5d',Math.atan2(dy,dx));}
   for(let i=1;i<mission.length;i++){const a=mission[i-1],b=mission[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);mesh.box(x+(a[0]+b[0])/2,y+(a[1]+b[1])/2,-1.02,len,.05,.035,'#4d8ba8',Math.atan2(dy,dx));}
   // Julien devant son bureau.
   person(mesh,'julien',x,y,-.38,{facing:-1});
 }
`;
  if(!src.includes(rollDef))throw new Error('Signature du rendu tonneau introuvable');
  src=src.replace(rollDef,esnDef);

  const personAnchor=' function person(mesh,kind,x,y,z,options={})';
  const plantDef=`
 function officePlant(mesh,x,y,z,kind=0,scale=1){
   const pot=kind===2?'#7c6a58':kind===1?'#9b7657':'#80644f',dark='#31583f',mid='#477b54',light='#5f9462';mesh.cylinder(x,y+.18*scale,z,.22*scale,.36*scale,pot,8,.17*scale);mesh.cylinder(x,y+.37*scale,z,.15*scale,.05*scale,'#2b332a',8);
   if(kind===0){mesh.box(x,y+.82*scale,z,.055*scale,.95*scale,.055*scale,'#586b45');const leaves=[[-.28,.66,-.02,.5],[-.18,.92,.03,-.55],[.22,.74,.02,-.42],[.3,1.02,-.03,.58],[-.05,1.18,.02,.18]];for(const [dx,dy,dz,a] of leaves)mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.42*scale,.16*scale,.07*scale,dy>1?light:mid,a);
   }else if(kind===1){const leaves=[[-.28,.55,-.02,-.7],[-.16,.76,.02,-.35],[0,.91,0,.05],[.18,.73,.02,.35],[.3,.56,-.01,.68],[0,1.08,.01,0]];for(const [dx,dy,dz,a] of leaves)mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.18*scale,.55*scale,.055*scale,dy>.9?light:mid,a);
   }else{mesh.box(x,y+.72*scale,z,.05*scale,.68*scale,.05*scale,'#5e6849');const crowns=[[-.2,.73,.02,.28],[.2,.74,-.02,-.28],[-.12,.98,0,-.6],[.13,1.02,.02,.6],[0,1.18,-.01,0]];for(const [dx,dy,dz,a] of crowns){mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.4*scale,.22*scale,.1*scale,dy>1.1?light:dark,a);mesh.box(x+dx*.55*scale,y+(dy+.05)*scale,z+(dz+.02)*scale,.28*scale,.14*scale,.08*scale,mid,-a*.7);}}
 }`;
  if(!src.includes(personAnchor))throw new Error('Point d’insertion des plantes introuvable');
  src=src.replace(personAnchor,plantDef+'\n'+personAnchor);

  const plantAnchor='for(const m of Arcade.state.mechanisms){';
  const plantCalls=`
  const plantLayouts=[[[ -8.15,0,0,.92],[7.55,2,1,.82],[-7.85,3,2,.9]],[[-7.05,0,2,.86],[7.85,1,0,.9],[-1.85,3,1,.8]],[[-8.3,0,1,.88],[8.2,1,2,.82],[-7.6,3,0,.9]]];
  for(const [px,pf,pk,ps] of plantLayouts[level])officePlant(world,px,surface(pf,px),-.72,pk,ps);
  if(level===1)julienOffice(world);
  `;
  if(!src.includes(plantAnchor))throw new Error('Point d’insertion du décor introuvable');
  src=src.replace(plantAnchor,plantCalls+plantAnchor);

  const decorative="if(!s.boss.active)for(let i=0;i<3;i++)roll(moving,-9.35+i*.38,s.boss.y+.27,-.47,.21,.35,0);";
  const moving="for(const b of s.barrels)roll(moving,b.x,b.y,.65,b.r,.48,b.spin);";
  if(!src.includes(decorative)||!src.includes(moving))throw new Error('Appel de rendu tonneau introuvable');
  src=src.replace(decorative,"if(!s.boss.active)for(let i=0;i<3;i++)esnObstacle(moving,-9.35+i*.55,s.boss.y+.38,-.47,s.level,false);");
  src=src.replace(moving,"for(const b of s.barrels)esnObstacle(moving,b.x,b.y,.65,b.r,.48,b.spin);");
  // Corrige l'appel ci-dessus pour conserver la signature native des obstacles ESN.
  src=src.replace("esnObstacle(moving,b.x,b.y,.65,b.r,.48,b.spin)","esnObstacle(moving,b.x,b.y,.65,s.level,true)");

  src+=`\nObject.defineProperties(globalThis,{Arcade:{configurable:true,get:()=>Arcade},renderer:{configurable:true,get:()=>renderer,set:value=>{renderer=value;}},surface:{configurable:true,get:()=>surface},deliveryScene:{configurable:true,get:()=>deliveryScene,set:value=>{deliveryScene=value;}},cap:{configurable:true,get:()=>cap}});`;
  (0,eval)(src+'\n//# sourceURL=game.js');
})();
