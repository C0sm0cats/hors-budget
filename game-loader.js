'use strict';
(()=>{
  const xhr=new XMLHttpRequest();xhr.open('GET','game.js?v=33',false);xhr.send(null);if(xhr.status&&xhr.status!==200)throw new Error('Impossible de charger game.js ('+xhr.status+')');let src=xhr.responseText;
  src=src.replace("'LES NAO ONT EU TA PEAU.'","'MERCI POUR TON ENGAGEMENT.'");
  src=src.replace("nora:{name:'Nora',shirt:'#609cbe',hair:'#ebc66d',skin:'#e7b892',female:true,style:'bob'","nora:{name:'Nora',shirt:'#609cbe',hair:'#211a18',skin:'#754b35',female:true,style:'bob'");
  src=src.replace("basile:{name:'Basile',shirt:'#9b79a6',hair:'#573c31',skin:'#bf8d69',beard:true","basile:{name:'Basile',shirt:'#9b79a6',hair:'#1d1715',skin:'#8b5b3e',beard:true");
  src=src.replace("const LEVELS=", "CAST.julien={name:'Julien',shirt:'#365b78',hair:'#49362d',skin:'#dfad86',tie:'#79b9c7'};\nconst LEVELS=");

  src=src.replace(/      \/\/ Petit graphe au feutre bleu : marge en hausse, salaires à plat\.[\s\S]*?      c\.restore\(\);\n/, '');
  src=src.replace("const x=2,y=4.65,w=3.5,h=1.7;","const x=2,y=4.65,w=2.35,h=1.7;");

  const rollDef=" function roll(mesh,x,y,z,r,depth,spin,hex='#f0dbaf'){const col=rgb(hex),side=rgb('#d0ae7b');for(let i=0;i<14;i++){const a=i*Math.PI/7+spin,b=(i+1)*Math.PI/7+spin,p=[x+Math.cos(a)*r,y+Math.sin(a)*r,z-depth/2],q=[x+Math.cos(b)*r,y+Math.sin(b)*r,z-depth/2],P=[p[0],p[1],z+depth/2],Q=[q[0],q[1],z+depth/2];mesh.quad(p,q,Q,P,[Math.cos((a+b)/2),Math.sin((a+b)/2),0],i%4===0?rgb('#d27b73'):side);mesh.tri([x,y,z+depth/2],P,Q,[0,0,1],col);}const dx=Math.cos(spin)*r*.65,dy=Math.sin(spin)*r*.65;line(mesh,x-dx,y-dy,x+dx,y+dy,z+depth/2+.012,.08,'#bd7164');}";
  const esnDef=` function esnObstacle(mesh,x,y,z,level,movingHazard=true){const wheel='#22313a';if(level===0){mesh.box(x,y,z,.68,.55,.48,'#c79a63');mesh.box(x,y+.04,z+.25,.52,.19,.025,'#f1e2bd');mesh.box(x,y,z+.27,.07,.55,.025,'#8f6845');mesh.box(x-.22,y-.31,z,.12,.12,.14,wheel);mesh.box(x+.22,y-.31,z,.12,.12,.14,wheel);}else if(level===1){mesh.box(x,y,z,.72,.48,.42,'#435864');mesh.box(x,y+.02,z+.22,.54,.08,.025,'#d5f382');mesh.box(x,y+.31,z,.34,.12,.16,'#263945');mesh.box(x-.23,y-.28,z,.11,.11,.13,wheel);mesh.box(x+.23,y-.28,z,.11,.11,.13,wheel);}else{mesh.box(x,y,z,.75,.55,.5,'#697985');mesh.box(x,y+.02,z+.26,.58,.18,.025,'#354853');for(const sx of [-.32,.32])for(const sy of [-.22,.22])mesh.box(x+sx,y+sy,z+.27,.08,.08,.03,'#b7c1c5');mesh.box(x,y+.36,z,.36,.12,.17,'#303d48');mesh.box(x-.24,y-.32,z,.12,.12,.14,wheel);mesh.box(x+.24,y-.32,z,.12,.12,.14,wheel);}}`;
  if(!src.includes(rollDef))throw new Error('Signature du rendu tonneau introuvable');src=src.replace(rollDef,esnDef);

  const personAnchor=' function person(mesh,kind,x,y,z,options={})';
  const decorDef=`
 function officePlant(mesh,x,y,z,kind=0,scale=1){const pot=kind===2?'#7c6a58':kind===1?'#9b7657':'#80644f',dark='#31583f',mid='#477b54',light='#5f9462';mesh.cylinder(x,y+.18*scale,z,.22*scale,.36*scale,pot,8,.17*scale);mesh.cylinder(x,y+.37*scale,z,.15*scale,.05*scale,'#2b332a',8);if(kind===0){mesh.box(x,y+.82*scale,z,.055*scale,.95*scale,.055*scale,'#586b45');const leaves=[[-.28,.66,-.02,.5],[-.18,.92,.03,-.55],[.22,.74,.02,-.42],[.3,1.02,-.03,.58],[-.05,1.18,.02,.18]];for(const [dx,dy,dz,a] of leaves)mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.42*scale,.16*scale,.07*scale,dy>1?light:mid,a);}else if(kind===1){const leaves=[[-.28,.55,-.02,-.7],[-.16,.76,.02,-.35],[0,.91,0,.05],[.18,.73,.02,.35],[.3,.56,-.01,.68],[0,1.08,.01,0]];for(const [dx,dy,dz,a] of leaves)mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.18*scale,.55*scale,.055*scale,dy>.9?light:mid,a);}else{mesh.box(x,y+.72*scale,z,.05*scale,.68*scale,.05*scale,'#5e6849');const crowns=[[-.2,.73,.02,.28],[.2,.74,-.02,-.28],[-.12,.98,0,-.6],[.13,1.02,.02,.6],[0,1.18,-.01,0]];for(const [dx,dy,dz,a] of crowns){mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.4*scale,.22*scale,.1*scale,dy>1.1?light:dark,a);mesh.box(x+dx*.55*scale,y+(dy+.05)*scale,z+(dz+.02)*scale,.28*scale,.14*scale,.08*scale,mid,-a*.7);}}}
 function kevinOffice(mesh){const x=2,y=surface(1,x),z=-.72;mesh.box(x,y+.38,z,2.45,.12,1.0,'#6d5140');mesh.box(x-.95,y-.02,z,.12,.8,.72,'#493a32');mesh.box(x+.95,y-.02,z,.12,.8,.72,'#493a32');mesh.box(x+.42,y+.78,z+.48,1.06,.68,.12,'#203540');mesh.box(x+.42,y+.78,z+.55,.86,.48,.03,'#79b8c6');mesh.box(x+.42,y+.47,z+.43,.10,.28,.10,'#344b58');mesh.box(x+.42,y+.32,z+.39,.48,.06,.28,'#344b58');mesh.box(x-.28,y+.45,z+.48,.68,.035,.30,'#d7caa8');}
 function julienOffice(mesh){const x=6.05,y=surface(1,x),z=-.72;mesh.box(x,y+.38,z,2.55,.12,1.0,'#6d5140');mesh.box(x-1.0,y-.02,z,.12,.8,.72,'#493a32');mesh.box(x+1.0,y-.02,z,.12,.8,.72,'#493a32');mesh.box(x+.48,y+.78,z+.48,1.12,.72,.12,'#203540');mesh.box(x+.48,y+.78,z+.55,.92,.52,.03,'#8ed0d7');mesh.box(x+.48,y+.46,z+.43,.10,.30,.10,'#344b58');mesh.box(x+.48,y+.31,z+.39,.50,.06,.30,'#344b58');mesh.box(x-.18,y+.45,z+.48,.72,.035,.32,'#d7caa8');const wy=y+1.54,wz=-1.05;mesh.box(x,wy,wz,2.82,1.10,.07,'#f0f1eb');mesh.box(x,wy+.57,wz+.01,2.96,.055,.1,'#68757b');mesh.box(x,wy-.57,wz+.01,2.96,.055,.1,'#68757b');mesh.box(x-1.45,wy,wz+.01,.055,1.16,.1,'#68757b');mesh.box(x+1.45,wy,wz+.01,.055,1.16,.1,'#68757b');}
 `;
  if(!src.includes(personAnchor))throw new Error('Point insertion décor introuvable');src=src.replace(personAnchor,decorDef+'\n'+personAnchor);
  const plantAnchor='for(const m of Arcade.state.mechanisms){';
  const plantCalls=`const plantLayouts=[[[-8.15,0,0,.92],[7.55,2,1,.82],[-7.85,3,2,.9]],[[-7.05,0,2,.86],[3.8,1,0,.78],[-1.85,3,1,.8]],[[-8.3,0,1,.88],[8.2,1,2,.82],[-7.6,3,0,.9]]];for(const [px,pf,pk,ps] of plantLayouts[level])officePlant(world,px,surface(pf,px),-.72,pk,ps);if(level===0)kevinOffice(world);if(level===1)julienOffice(world);`;
  if(!src.includes(plantAnchor))throw new Error('Point insertion décor végétal introuvable');src=src.replace(plantAnchor,plantCalls+plantAnchor);

  const gateAnchor="if(p.floor===4&&p.grounded&&Math.abs(p.x-s.princess.x)<.85){if(s.level<2){";
  if(!src.includes(gateAnchor))throw new Error('Point de contrôle Charline introuvable');
  src=src.replace(gateAnchor,"if(p.floor===4&&p.grounded&&Math.abs(p.x-s.princess.x)<.85){if(s.level===1&&globalThis.JulienBoss&&!globalThis.JulienBoss.defeated(s)){notice('JULIEN BLOQUE L’ACCÈS · RENVOIE SES KPI AVEC X.',1.5);}else if(s.level<2){");

  const julienDrawAnchor="const celebrating=s.phase==='won'||s.phase==='transition',charlineX=";
  if(!src.includes(julienDrawAnchor))throw new Error('Point de rendu Julien introuvable');
  src=src.replace(julienDrawAnchor,"if(s.level===1&&globalThis.JulienBoss){const jb=globalThis.JulienBoss.state(s),jx=globalThis.JulienBoss.x,jy=surface(4,jx);if(jb.hp>0&&(!jb.flash||Math.floor(s.visual*18)%2===0))person(moving,'julien',jx,jy,.25,{facing:-1,attack:jb.flash>0});}const celebrating=s.phase==='won'||s.phase==='transition',charlineX=");

  src=src.replace("if(h.kind==='boss'&&!h.reflected){h.reflected=true;h.vx=8;h.life=3;", "if((h.kind==='boss'||h.julien)&&!h.reflected){h.reflected=true;h.vx=8;h.life=3;");
  const rodLabel="label('RODOLPHE',s.boss.x,s.boss.y+2.05,'#f0b69e',10);";
  if(src.includes(rodLabel))src=src.replace(rodLabel,rodLabel+"if(s.level===1&&globalThis.JulienBoss&&!globalThis.JulienBoss.defeated(s))label('JULIEN',globalThis.JulienBoss.x,surface(4,globalThis.JulienBoss.x)+2.05,'#bfe8f2',10);");

  const decorative="if(!s.boss.active)for(let i=0;i<3;i++)roll(moving,-9.35+i*.38,s.boss.y+.27,-.47,.21,.35,0);",moving="for(const b of s.barrels)roll(moving,b.x,b.y,.65,b.r,.48,b.spin);";if(!src.includes(decorative)||!src.includes(moving))throw new Error('Appel tonneau introuvable');src=src.replace(decorative,"if(!s.boss.active)for(let i=0;i<3;i++)esnObstacle(moving,-9.35+i*.55,s.boss.y+.38,-.47,s.level,false);");src=src.replace(moving,"for(const b of s.barrels)esnObstacle(moving,b.x,b.y,.65,s.level,true);");
  src+=`\nObject.defineProperties(globalThis,{Arcade:{configurable:true,get:()=>Arcade},renderer:{configurable:true,get:()=>renderer,set:value=>{renderer=value;}},surface:{configurable:true,get:()=>surface},deliveryScene:{configurable:true,get:()=>deliveryScene,set:value=>{deliveryScene=value;}},cap:{configurable:true,get:()=>cap}});`;
  (0,eval)(src+'\n//# sourceURL=game.js');
})();
