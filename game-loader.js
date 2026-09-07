'use strict';
(()=>{
  const xhr=new XMLHttpRequest();
  xhr.open('GET','game.js?v=38',false);
  xhr.send(null);
  if(xhr.status&&xhr.status!==200)throw new Error('Impossible de charger game.js ('+xhr.status+')');
  let src=xhr.responseText;

  const patchRequired=(from,to,label)=>{
    if(!src.includes(from))throw new Error(label+' introuvable');
    src=src.replace(from,to);
  };

  src=src.replace("'LES NAO ONT EU TA PEAU.'","'MERCI POUR TON ENGAGEMENT.'");
  src=src.replace("nora:{name:'Nora',shirt:'#609cbe',hair:'#ebc66d',skin:'#e7b892',female:true,style:'bob'","nora:{name:'Nora',shirt:'#609cbe',hair:'#211a18',skin:'#754b35',female:true,style:'bob'");
  src=src.replace("basile:{name:'Basile',shirt:'#9b79a6',hair:'#573c31',skin:'#bf8d69',beard:true","basile:{name:'Basile',shirt:'#9b79a6',hair:'#1d1715',skin:'#8b5b3e',beard:true");
  src=src.replace("const LEVELS=", "CAST.julien={name:'JUJU',shirt:'#2d506a',hair:'#49362d',skin:'#dfad86',tie:'#78aebb',internal:true,role:'techDirector',pants:'#273440',shoes:'#171f26',blouse:'#f1ede4'};\nCAST.hugo2={name:'Mathis',shirt:'#5f8068',hair:'#5a4436',skin:'#c9906c',style:'short',category:'consultant',pants:'#495d72',shoes:'#e7e1d7',blouse:'#5f8068'};\nCAST.nora2={name:'Inès',shirt:'#9a6f5d',hair:'#3d2e29',skin:'#d59a73',female:true,style:'bun',category:'consultant',pants:'#465262',shoes:'#f1ece3',blouse:'#9a6f5d'};\nCAST.basile2={name:'Thomas',shirt:'#3f5964',hair:'#332620',skin:'#dfb08c',internal:true,category:'business',pants:'#283740',shoes:'#182229',blouse:'#e8edf0',tie:'#7b5e79'};\nCAST.lea2={name:'Camille',shirt:'#5e6c8c',hair:'#4e3027',skin:'#b97958',female:true,style:'bob',internal:true,category:'business',pants:'#40475d',shoes:'#242936',blouse:'#f2ede5'};\nCAST.sarah={name:'Sarah',shirt:'#6a4e72',hair:'#2f2420',skin:'#d9a17c',female:true,style:'long',internal:true,category:'business',pants:'#3f3444',shoes:'#211b24',blouse:'#f4ecea'};\nCAST.mehdi={name:'Mehdi',shirt:'#415c6b',hair:'#171412',skin:'#a66e4a',beard:true,style:'short',internal:true,category:'business',pants:'#293b45',shoes:'#171f24',blouse:'#e9eef0',tie:'#8b6b55'};\nCAST.elodie={name:'Élodie',shirt:'#7a5d52',hair:'#b06a3c',skin:'#efc29f',female:true,style:'bun',internal:true,category:'business',pants:'#4d413d',shoes:'#2c2421',blouse:'#f6efe7'};\nCAST.antoine={name:'Antoine',shirt:'#4d627b',hair:'#5a4638',skin:'#d3a27c',style:'short',internal:true,category:'business',pants:'#344252',shoes:'#1d252d',blouse:'#eef0e8',tie:'#77624b'};\nconst LEVELS=");

  patchRequired(
    "kevin:{name:'KÉKÉ',shirt:'#397cbd',hair:'#4b352c',skin:'#e6b88f',tie:'#fb536b'}",
    "kevin:{name:'KÉKÉ',shirt:'#355d78',hair:'#4b352c',skin:'#e6b88f',tie:'#b94d61',internal:true,role:'projectDirector',pants:'#2e4051',shoes:'#19262f',blouse:'#f1eee6'}",
    'Tenue KÉKÉ'
  );
  patchRequired(
    "hugo:{name:'Hugo',shirt:'#d6aa58',hair:'#dfbe6c',skin:'#e9bd97',style:'quiff',demand:'Et mon variable ?'}",
    "hugo:{name:'Hugo',shirt:'#c58f4f',hair:'#dfbe6c',skin:'#e9bd97',style:'quiff',category:'consultant',pants:'#3f5872',shoes:'#eeeae1',blouse:'#c58f4f',demand:'Et mon variable ?'}",
    'Tenue consultant Hugo'
  );
  patchRequired(
    "nora:{name:'Nora',shirt:'#609cbe',hair:'#211a18',skin:'#754b35',female:true,style:'bob',demand:'3 000 € par an !'}",
    "nora:{name:'Nora',shirt:'#5c91aa',hair:'#211a18',skin:'#754b35',female:true,style:'bob',category:'consultant',pants:'#394f66',shoes:'#f0ede7',blouse:'#5c91aa',demand:'3 000 € par an !'}",
    'Tenue consultante Nora'
  );
  patchRequired(
    "basile:{name:'Basile',shirt:'#9b79a6',hair:'#1d1715',skin:'#8b5b3e',beard:true,demand:'Juste l’inflation !'}",
    "basile:{name:'Basile',shirt:'#596879',hair:'#1d1715',skin:'#8b5b3e',beard:true,internal:true,category:'business',pants:'#303b46',shoes:'#1b232a',blouse:'#eee8df',tie:'#b9785e',demand:'Juste l’inflation !'}",
    'Tenue interne Basile'
  );
  patchRequired(
    "lea:{name:'Léa',shirt:'#77a389',hair:'#c96c36',skin:'#f0c49d',female:true,style:'bun',demand:'On en reparle quand ?'}",
    "lea:{name:'Léa',shirt:'#765d79',hair:'#c96c36',skin:'#f0c49d',female:true,style:'bun',internal:true,category:'business',pants:'#4a3d4b',shoes:'#29252c',blouse:'#f2e9ed',demand:'On en reparle quand ?'}",
    'Tenue interne Léa'
  );
  patchRequired(
    "rodolphe:{name:'RORO',shirt:'#cb8864',hair:'#ba5d2f',skin:'#dfac84',beard:true,style:'curly',demand:'LES NAO COMMENCENT !'}",
    "rodolphe:{name:'RORO',shirt:'#4a505a',hair:'#ba5d2f',skin:'#dfac84',beard:true,style:'curly',internal:true,role:'regionalDirector',pants:'#292e35',shoes:'#17191d',blouse:'#f0ebe1',tie:'#a45f53',demand:'LES NAO COMMENCENT !'}",
    'Tenue RORO'
  );
  patchRequired(
    "charline:{name:'CHACHA',shirt:'#e789b5',hair:'#674433',skin:'#efc39e',female:true,style:'long',princess:true}",
    "charline:{name:'CHACHA',shirt:'#8d4f72',hair:'#674433',skin:'#efc39e',female:true,style:'long',internal:true,role:'businessManager',pants:'#e3b48f',shoes:'#2b1e2a',blouse:'#f8e9ef',skirt:'#59364f'}",
    'Tailleur CHACHA'
  );

  patchRequired(
    "scale=kind==='rodolphe'?1.27:kind==='kevin'?1.18:1.1;const part=",
    "scale=kind==='rodolphe'?1.27:kind==='julien'?1.21:kind==='kevin'?1.18:kind==='charline'?1.12:1.1;const pants=p.pants||(p.internal?'#303d48':'#3d536b'),shoes=p.shoes||(p.internal?'#19242c':'#ede9df');const part=",
    'Proportions et palette vestimentaire'
  );
  patchRequired("part(-.115,.21,stun?.25:.085*move,.16,.35,.18,'#284255');","part(-.115,.21,stun?.25:.085*move,.16,.35,.18,pants);",'Pantalon jambe gauche');
  patchRequired("part(.115,.21,stun?.25:-.085*move,.16,.35,.18,'#284255');","part(.115,.21,stun?.25:-.085*move,.16,.35,.18,pants);",'Pantalon jambe droite');
  patchRequired("part(-.115,.06,.055+.1*move,.2,.12,.28,'#1c3440');","part(-.115,.06,.055+.1*move,.2,.12,.28,shoes);",'Chaussure gauche');
  patchRequired(
    "part(.115,.06,.055-.1*move,.2,.12,.28,'#1c3440');",
    "part(.115,.06,.055-.1*move,.2,.12,.28,shoes);if(kind==='charline'){for(const side of [-1,1]){part(side*.115,.035,.14,.18,.07,.25,shoes);part(side*.17,.03,-.035,.045,.12,.045,shoes);}}else if(!p.internal){for(const side of [-1,1])part(side*.115,.025,.10,.22,.045,.30,'#f4f0e8');}",
    'Chaussures métier'
  );
  patchRequired("if(p.princess)mesh.cylinder(x,base+.47,z,.4,.53,p.shirt,10,.19);","if(kind==='charline')mesh.cylinder(x,base+.43,z,.30,.38,p.skirt||'#59364f',10,.22);",'Suppression robe de princesse');
  patchRequired(
    "part(0,.67,.15,.16,.35,.02,'#f6e8c9');",
    "part(0,.67,.15,p.internal?.18:.12,p.internal?.36:.22,.025,p.blouse||p.shirt);if(p.internal){part(-.115,.72,.17,.075,.28,.022,p.shirt);part(.115,.72,.17,.075,.28,.022,p.shirt);}",
    'Chemise et revers de veste'
  );
  patchRequired(
    "part(kind==='kevin'?Math.sin(time*18)*Math.min(.14,Math.abs(Arcade.state.player.vx)*.025):0,.68,.167,.10,kind==='kevin'?.39:.22,.035,p.tie||'#ddba7c');",
    "if(p.tie)part(kind==='kevin'?Math.sin(time*18)*Math.min(.14,Math.abs(Arcade.state.player.vx)*.025):0,.68,.167,.10,kind==='kevin'?.39:.22,.035,p.tie);",
    'Cravates réservées aux tenues concernées'
  );
  patchRequired(
    "if(p.style==='long'){part(0,.96,-.22,.45,.72,.1,p.hair);part(-.22,1.03,-.025,.085,.57,.27,p.hair);part(.22,1.03,-.025,.085,.57,.27,p.hair);}",
    "if(p.style==='long'){part(0,.96,-.22,.45,.72,.1,p.hair);part(-.22,1.03,-.025,.085,.57,.27,p.hair);part(.22,1.03,-.025,.085,.57,.27,p.hair);}if(kind==='charline'){part(-.225,1.08,.19,.045,.075,.04,'#d5b26d');part(.225,1.08,.19,.045,.075,.04,'#d5b26d');part(0,.79,.175,.075,.09,.025,'#d5b26d');}",
    'Finition CHACHA'
  );
  src=src.replaceAll('princess','chacha');

  const orderDecor="{x:-6.4,y:4.45,w:3.2,h:.68,title:'ORDRE DE MISSION'";
  const swileDecor="{x:5.1,y:4.45,w:2.7,h:.68,title:'SWILE'";
  if(!src.includes(orderDecor)||!src.includes(swileDecor))throw new Error('Décors Ordre de mission / Swile introuvables');
  src=src.replace(orderDecor,"{x:-2.45,y:1.45,w:3.2,h:.68,title:'ORDRE DE MISSION'");
  src=src.replace(swileDecor,"{x:3.15,y:1.45,w:2.7,h:.68,title:'SWILE'");
  src=src.replace("for(let floor=0;floor<4;floor++)for(const x of [-5,2,6]){const y=surface(floor,x);","for(let floor=0;floor<4;floor++)for(const x of [-5,2,6]){const y=surface(floor,x);if((floor===1&&level<2)||(level===2&&(floor===1||floor===2)))continue;");
  src=src.replace("world.box(x,5.9,-.8,.22,12,.25,'#bd9b59');","if(Math.abs(x)===3.8){world.box(x,1.4,-.8,.22,3,.25,'#bd9b59');world.box(x,9,-.8,.22,6,.25,'#bd9b59');}else world.box(x,5.9,-.8,.22,12,.25,'#bd9b59');");

  const rollDef=" function roll(mesh,x,y,z,r,depth,spin,hex='#f0dbaf'){const col=rgb(hex),side=rgb('#d0ae7b');for(let i=0;i<14;i++){const a=i*Math.PI/7+spin,b=(i+1)*Math.PI/7+spin,p=[x+Math.cos(a)*r,y+Math.sin(a)*r,z-depth/2],q=[x+Math.cos(b)*r,y+Math.sin(b)*r,z-depth/2],P=[p[0],p[1],z+depth/2],Q=[q[0],q[1],z+depth/2];mesh.quad(p,q,Q,P,[Math.cos((a+b)/2),Math.sin((a+b)/2),0],i%4===0?rgb('#d27b73'):side);mesh.tri([x,y,z+depth/2],P,Q,[0,0,1],col);}const dx=Math.cos(spin)*r*.65,dy=Math.sin(spin)*r*.65;line(mesh,x-dx,y-dy,x+dx,y+dy,z+depth/2+.012,.08,'#bd7164');}";
  const esnDef=` function esnObstacle(mesh,x,y,z,level,movingHazard=true){const wheel='#22313a';if(level===0){mesh.box(x,y,z,.68,.55,.48,'#c79a63');mesh.box(x,y+.04,z+.25,.52,.19,.025,'#f1e2bd');mesh.box(x,y,z+.27,.07,.55,.025,'#8f6845');mesh.box(x-.22,y-.31,z,.12,.12,.14,wheel);mesh.box(x+.22,y-.31,z,.12,.12,.14,wheel);}else if(level===1){mesh.box(x,y,z,.72,.48,.42,'#435864');mesh.box(x,y+.02,z+.22,.54,.08,.025,'#d5f382');mesh.box(x,y+.31,z,.34,.12,.16,'#263945');mesh.box(x-.23,y-.28,z,.11,.11,.13,wheel);mesh.box(x+.23,y-.28,z,.11,.11,.13,wheel);}else{mesh.box(x,y,z,.75,.55,.5,'#697985');mesh.box(x,y+.02,z+.26,.58,.18,.025,'#354853');for(const sx of [-.32,.32])for(const sy of [-.22,.22])mesh.box(x+sx,y+sy,z+.27,.08,.08,.03,'#b7c1c5');mesh.box(x,y+.36,z,.36,.12,.17,'#303d48');mesh.box(x-.24,y-.32,z,.12,.12,.14,wheel);mesh.box(x+.24,y-.32,z,.12,.12,.14,wheel);}}`;
  if(!src.includes(rollDef))throw new Error('Signature du rendu tonneau introuvable');
  src=src.replace(rollDef,esnDef);

  const personAnchor=' function person(mesh,kind,x,y,z,options={})';
  const decorDef=`
 function officePlant(mesh,x,y,z,kind=0,scale=1){const pot=kind===2?'#7c6a58':kind===1?'#9b7657':'#80644f',dark='#31583f',mid='#477b54',light='#5f9462';mesh.cylinder(x,y+.18*scale,z,.22*scale,.36*scale,pot,8,.17*scale);mesh.cylinder(x,y+.37*scale,z,.15*scale,.05*scale,'#2b332a',8);if(kind===0){mesh.box(x,y+.82*scale,z,.055*scale,.95*scale,.055*scale,'#586b45');const leaves=[[-.28,.66,-.02,.5],[-.18,.92,.03,-.55],[.22,.74,.02,-.42],[.3,1.02,-.03,.58],[-.05,1.18,.02,.18]];for(const [dx,dy,dz,a] of leaves)mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.42*scale,.16*scale,.07*scale,dy>1?light:mid,a);}else if(kind===1){const leaves=[[-.28,.55,-.02,-.7],[-.16,.76,.02,-.35],[0,.91,0,.05],[.18,.73,.02,.35],[.3,.56,-.01,.68],[0,1.08,.01,0]];for(const [dx,dy,dz,a] of leaves)mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.18*scale,.55*scale,.055*scale,dy>.9?light:mid,a);}else{mesh.box(x,y+.72*scale,z,.05*scale,.68*scale,.05*scale,'#5e6849');const crowns=[[-.2,.73,.02,.28],[.2,.74,-.02,-.28],[-.12,.98,0,-.6],[.13,1.02,.02,.6],[0,1.18,-.01,0]];for(const [dx,dy,dz,a] of crowns){mesh.box(x+dx*scale,y+dy*scale,z+dz*scale,.4*scale,.22*scale,.1*scale,dy>1.1?light:dark,a);mesh.box(x+dx*.55*scale,y+(dy+.05)*scale,z+(dz+.02)*scale,.28*scale,.14*scale,.08*scale,mid,-a*.7);}}}

 `;
  if(!src.includes(personAnchor))throw new Error('Point insertion décor introuvable');
  src=src.replace(personAnchor,decorDef+'\n'+personAnchor);
  const plantAnchor='for(const m of Arcade.state.mechanisms){';
  const plantCalls=`
  const plantLayouts=[[[-8.15,0,0,.92],[7.55,2,1,.82],[-7.85,3,2,.9]],[[-7.05,0,2,.86],[-1.85,3,1,.8]],[[-8.3,0,1,.88],[-7.6,3,0,.9]]];
  for(const [px,pf,pk,ps] of plantLayouts[level])officePlant(world,px,surface(pf,px),-.72,pk,ps);
  globalThis.OfficeDecor.draw(world,sign,level,surface);
  `;
  if(!src.includes(plantAnchor))throw new Error('Point insertion décor végétal introuvable');
  src=src.replace(plantAnchor,plantCalls+plantAnchor);

  // Retire complètement l'ancienne scène secondaire de RORO avant évaluation du moteur.
  src=src.replace(/\/\/ One shared timeline drives the actors, stamp, dialogue and delivery\.\nfunction deliveryScene\(remaining\)\{[\s\S]*?\n\}\n/,'');
  src=src.replace('delivery:0,delivered:false,','');
  src=src.replace("   if(!c.delivered&&s.level<2&&s.player.floor>=3&&Math.abs(s.player.x-s.boss.x)<6){c.delivery=12;c.delivered=true;}\n   const previous=c.delivery;c.delivery=Math.max(0,c.delivery-dt);\n   if((previous>9.5&&c.delivery<=9.5)||(previous>6.5&&c.delivery<=6.5))soundFX('stamp');\n",'');
  src=src.replaceAll('s.comedy.delivery<=0&&','').replaceAll('&&s.comedy.delivery<=0','');
  src=src.replace('else if(s.comedy.delivery<=0){','else{');
  src=src.replace(/,stamp:s\.comedy\.delivery>0\?deliveryScene\(s\.comedy\.delivery\)\.stamp:undefined/g,'');
  src=src.replace(/\n  if\(s\.comedy\.delivery>0\)\{[\s\S]*?\n  \}\n  if\(s\.comedy\.miracle>0\)\{/,'\n  if(s.comedy.miracle>0){');
  src=src.replace(/if\(s\.comedy\.delivery>0&&s\.comedy\.miracle<=0\)label\(deliveryScene\(s\.comedy\.delivery\)\.text,[^;]+;?/,'');

  patchRequired(
    "s.charlineIn-=dt;if(s.charlineIn<=0){s.charlineIn=rnd(12,17);",
    "s.charlineIn-=dt;if(s.level===2&&s.charlineIn<=0){s.charlineIn=rnd(12,17);",
    'Aide café de CHACHA'
  );
  patchRequired(
    "notice('NIVEAU VALIDÉ · CHACHA LIBÉRÉE · '+LEVELS[s.level+1].name+' EN VUE !',3);",
    "notice(s.level===0?'CHACHA EST AU POWER UP TOUR · DIRECTION EN VUE !':'JUJU EN ALIGNEMENT STRATÉGIQUE · ACCÈS AU ROOFTOP DÉBLOQUÉ !',3);",
    'Message de transition de niveau'
  );
  patchRequired(
    "function hud(){document.body.classList.toggle('top-floor',s.player.floor===4&&s.phase!=='title');",
    "function hud(){document.body.dataset.level=String(s.level);document.body.classList.toggle('top-floor',s.player.floor===4&&s.phase!=='title');",
    'Synchronisation du niveau dans le DOM'
  );
  patchRequired(
    "s.phase==='transition'?'CHACHA LIBÉRÉE · ON CONTINUE !'",
    "s.phase==='transition'?(s.level===0?'CHACHA EST AU POWER UP TOUR · DIRECTION EN VUE !':'ACCÈS AU ROOFTOP DÉBLOQUÉ !')",
    'Bandeau de transition'
  );
  patchRequired(
    "'DERNIER ÉTAGE · REJOINS CHACHA →'",
    "(s.level===0?'DERNIER ÉTAGE · RETROUVE LA TRACE DE CHACHA →':s.level===1?'DERNIER ÉTAGE · PASSE JUJU · ACCÈS ROOFTOP →':'DERNIER ÉTAGE · REJOINS CHACHA →')",
    'Objectif du dernier étage'
  );

  const gateAnchor="if(p.floor===4&&p.grounded&&Math.abs(p.x-s.chacha.x)<.85){if(s.level<2){";
  if(!src.includes(gateAnchor))throw new Error('Point de contrôle CHACHA introuvable');
  src=src.replace(gateAnchor,"if(p.floor===4&&p.grounded&&Math.abs(p.x-s.chacha.x)<.85){if(s.level===1&&globalThis.JulienBoss&&!globalThis.JulienBoss.defeated(s)){notice('JUJU BLOQUE L’ACCÈS · RENVOIE SES KPI AVEC X.',1.5);}else if(s.level<2){");

  const julienDrawAnchor="const celebrating=s.phase==='won'||s.phase==='transition',charlineX=";
  if(!src.includes(julienDrawAnchor))throw new Error('Point de rendu JUJU introuvable');
  src=src.replace(julienDrawAnchor,"if(s.level===1&&globalThis.JulienBoss){const jb=globalThis.JulienBoss.state(s),jx=globalThis.JulienBoss.x,jy=surface(4,jx);if(jb.hp>0&&(!jb.flash||Math.floor(s.visual*18)%2===0))person(moving,'julien',jx,jy,.25,{facing:-1,attack:jb.flash>0});}const celebrating=s.phase==='won',charlineX=");
  patchRequired("person(moving,'charline',charlineX,s.chacha.y,.25,{win:celebrating,attack:s.charlineTalk>0&&!celebrating});","if(s.level===2)person(moving,'charline',charlineX,s.chacha.y,.25,{win:celebrating,attack:s.charlineTalk>0&&!celebrating});",'Rendu de CHACHA');
  patchRequired("moving.box(s.boss.x,s.boss.y+.24,-.1,1.9,.16,.8,'#a57862');","if(s.level===2){moving.box(s.boss.x,s.boss.y+.24,-.1,1.9,.16,.8,'#a57862');",'Début du rendu de RORO');
  patchRequired("}if(!s.boss.active)for(let i=0;i<3;i++)esnObstacle(moving,-9.35+i*.55,s.boss.y+.38,-.47,s.level,false);","}}if(!s.boss.active)for(let i=0;i<3;i++)esnObstacle(moving,-9.35+i*.55,s.boss.y+.38,-.47,s.level,false);",'Fin du rendu de RORO');
  patchRequired("const py=s.chacha.y;for(let i=0;i<5;i++)moving.box(7.48+i*.46,py+.91+s.gate,.7,.055,1.83,.055,'#d9b879');moving.box(8.4,py+1.83+s.gate,.7,2.15,.075,.075,'#ebd39b');","const py=s.chacha.y;if(s.level===2){for(let i=0;i<5;i++)moving.box(7.48+i*.46,py+.91+s.gate,.7,.055,1.83,.055,'#d9b879');moving.box(8.4,py+1.83+s.gate,.7,2.15,.075,.075,'#ebd39b');}",'Grille finale CHACHA');
  patchRequired("label('CHACHA ♛',s.chacha.x,py+2.15,'#f2b2cf',11);label('RORO',s.boss.x,s.boss.y+2.05,'#f0b69e',10);","if(s.level===2)label('CHACHA',s.chacha.x,py+2.15,'#f2b2cf',11);if(s.level===2)label('RORO',s.boss.x,s.boss.y+2.05,'#f0b69e',10);",'Labels CHACHA / RORO');
  patchRequired("if(!s.boss.active&&s.comedy.miracle<=0&&(s.boss.throwTime>0||rowing))label(rowing?'JE PILOTE LA TRANSFORMATION !':'REFUSÉ. MAIS BRAVO !',s.boss.x,s.boss.y+2.72,'#f0b69e',10,true);","if(s.level===2&&!s.boss.active&&s.comedy.miracle<=0&&(s.boss.throwTime>0||rowing))label(rowing?'JE PILOTE LA TRANSFORMATION !':'REFUSÉ. MAIS BRAVO !',s.boss.x,s.boss.y+2.72,'#f0b69e',10,true);",'Bulle canvas de RORO');
  patchRequired("if(s.gagTime>0&&!s.boss.active&&s.comedy.miracle<=0)label(s.gag,s.boss.x,s.boss.y+2.78,'#dfc3f0',10,true);","if(s.level===2&&s.gagTime>0&&!s.boss.active&&s.comedy.miracle<=0)label(s.gag,s.boss.x,s.boss.y+2.78,'#dfc3f0',10,true);",'Gag visuel de RORO');
  patchRequired("if(s.charlineTalk>0)label('CHACHA : '+CHARLINE_LINES[s.charlineLine],s.player.x,s.player.y+2.7,'#f4b9d9',11,true);","if(s.level===2&&s.charlineTalk>0)label('CHACHA : '+CHARLINE_LINES[s.charlineLine],s.player.x,s.player.y+2.7,'#f4b9d9',11,true);",'Dialogue canvas de CHACHA');

  src=src.replace("if(h.kind==='boss'&&!h.reflected){h.reflected=true;h.vx=8;h.life=3;","if((h.kind==='boss'||h.julien)&&!h.reflected){h.reflected=true;h.vx=8;h.life=3;");
  const rodLabel="label('RORO',s.boss.x,s.boss.y+2.05,'#f0b69e',10);";
  if(src.includes(rodLabel))src=src.replace(rodLabel,"if(s.level===2)"+rodLabel+"if(s.level===1&&globalThis.JulienBoss&&!globalThis.JulienBoss.defeated(s))label('JUJU',globalThis.JulienBoss.x,surface(4,globalThis.JulienBoss.x)+2.05,'#bfe8f2',10);");
  const decorative="if(!s.boss.active)for(let i=0;i<3;i++)esnObstacle(moving,-9.35+i*.55,s.boss.y+.38,-.47,s.level,false);",moving="for(const b of s.barrels)roll(moving,b.x,b.y,.65,b.r,.48,b.spin);";
  if(!src.includes(decorative)||!src.includes(moving))throw new Error('Appel obstacle introuvable');
  src=src.replace(moving,"for(const b of s.barrels)esnObstacle(moving,b.x,b.y,.65,s.level,true);");

  if(src.includes('princess'))throw new Error('Ancien état princess encore présent');
  if(src.includes('deliveryScene')||src.includes('comedy.delivery')||src.includes('.delivered'))throw new Error('Ancienne scène RORO encore présente');

  src+=`\nObject.defineProperties(globalThis,{Arcade:{configurable:true,get:()=>Arcade},renderer:{configurable:true,get:()=>renderer,set:value=>{renderer=value;}},surface:{configurable:true,get:()=>surface},cap:{configurable:true,get:()=>cap}});`;
  (0,eval)(src+'\n//# sourceURL=game.js');
})();
