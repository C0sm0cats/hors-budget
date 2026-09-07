const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {join}=require('node:path');

const root=join(__dirname,'..');
const read=file=>readFileSync(join(root,file),'utf8');
const has=(source,text,message)=>assert.ok(source.includes(text),message||`missing: ${text}`);
const lacks=(source,text,message)=>assert.ok(!source.includes(text),message||`unexpected: ${text}`);

test('canonical roles and story are visible in the entry point',()=>{
  const html=read('index.html');
  has(html,'KÉKÉ, Directeur de Projets');
  has(html,'CHACHA, Business Manager');
  has(html,'JUJU, Directeur Technologies Services Pays de la Loire');
  has(html,'RORO, Directeur Région Grand Ouest');
  has(html,'TOUT EST SOUS CONTRÔLE. MÊME LE BUDGET.');
  has(html,'Niveau 1 : retrouve la trace de CHACHA');
  has(html,'Niveau 2 : JUJU garde l’accès au rooftop');
  has(html,'Niveau 3 : affronte RORO');
});

test('CHACHA and RORO are reserved for the final level in the native runtime',()=>{
  const game=read('game.js'),banter=read('banter-fair.js');
  has(game,"if(s.level===2)person(moving,'charline'");
  has(game,"if(s.level===2){moving.box(s.boss.x");
  has(game,"if(s.level===2&&s.charlineIn<=0)");
  has(game,"if(s.level===2)label('CHACHA'");
  has(game,"if(s.level===2)label('RORO'");
  has(banter,"s.level===2&&s.chacha");
  has(banter,"s.level===2&&s.boss");
});

test('legacy RORO massage-chair scene is absent from production runtime',()=>{
  const game=read('game.js'),banter=read('banter-fair.js');
  lacks(game,'deliveryScene');
  lacks(game,'comedy.delivery');
  lacks(game,'.delivered');
  lacks(game,'fauteuils massants');
  lacks(banter,'deliveryScene');
  lacks(banter,'raise-request');
  lacks(banter,'fauteuils');
});

test('JUJU guards rooftop access rather than CHACHA',()=>{
  const juju=read('julien-boss.js');
  has(juju,'JUJU BLOQUE L’ACCÈS AU ROOFTOP');
  has(juju,'Math.abs(s.player.x-X)<2.2');
  lacks(juju,'JUJU BLOQUE CHACHA');
});

test('all twelve generic NPC slots are native and unique across the three levels',()=>{
  const game=read('game.js'),html=read('index.html');
  const expected=["['hugo','nora','hugo2','lea']","['nora2','basile','basile2','lea2']","['sarah','mehdi','elodie','antoine']"];
  for(const roster of expected)has(game,roster);
  has(game,'const LEVEL_ROSTERS=');
  has(game,'const roster=LEVEL_ROSTERS[s.level]');
  assert.equal(new Set(['hugo','nora','hugo2','lea','nora2','basile','basile2','lea2','sarah','mehdi','elodie','antoine']).size,12);
  lacks(html,'population-levels.js');
  assert.equal(existsSync(join(root,'population-levels.js')),false);
});

test('all seminar cast lives natively in game.js',()=>{
  const game=read('game.js'),html=read('index.html');
  for(const [key,name] of [['sarah','Sarah'],['mehdi','Mehdi'],['elodie','Élodie'],['antoine','Antoine']])has(game,`CAST.${key}={name:'${name}'`);
  lacks(html,'unique-cast-preload.js');
  lacks(html,'game-loader.js');
  assert.equal(existsSync(join(root,'unique-cast-preload.js')),false);
  assert.equal(existsSync(join(root,'game-loader.js')),false);
  has(html,'game.js?v=43');
});

test('consultants and internal/business NPCs keep distinct visual and dialogue families',()=>{
  const game=read('game.js'),banter=read('banter-fair.js');
  has(game,"category:'consultant'");
  has(game,"category:'business'");
  has(game,"CAST.hugo2={name:'Mathis'");
  has(game,"CAST.nora2={name:'Inès'");
  has(game,"CAST.basile2={name:'Thomas'");
  has(game,"CAST.lea2={name:'Camille'");
  has(banter,"pools.hugo2=pools.hugo");
  has(banter,"/^(hugo|nora)/.test(e.kind)?'consultant':'internal'");
  has(banter,'Le CRA est validé. Mon existence administrative aussi.');
  has(banter,'Le pipeline est vert. Les signatures sont plus nuancées.');
});

test('game.js is the canonical directly loaded runtime',()=>{
  const game=read('game.js'),html=read('index.html');
  lacks(game,'princess');
  lacks(game,'deliveryScene');
  lacks(game,'comedy.delivery');
  lacks(game,'.delivered');
  has(game,'Object.defineProperties(globalThis,{Arcade:');
  has(game,'globalThis.OfficeDecor.draw(world,sign,level,surface)');
  has(html,'<script src="game.js?v=43"></script>');
  lacks(html,'game-loader.js');
});

test('office hierarchy exposes a handwritten CHACHA clue and Grand Ouest seminar structure',()=>{
  const hierarchy=read('office-hierarchy.js');
  has(hierarchy,"name:'CHACHA'");
  has(hierarchy,"pen(c,'Business & Développement'");
  has(hierarchy,"title:'PROSPECTS'");
  has(hierarchy,"title:'OPPORTUNITÉS'");
  has(hierarchy,"title:'CLIENTS'");
  has(hierarchy,"pen(c,'Au Power UP Tour'");
  has(hierarchy,"pen(c,'retour après le séminaire'");
  has(hierarchy,"pen(c,'— CHACHA'");
  lacks(hierarchy,"fillText('ABSENTE'");
  lacks(hierarchy,"fillText('BUSINESS MANAGER'");
  has(hierarchy,'DIRECTION RÉGION GRAND OUEST');
});

test('corporate signage remains split by operational, direction and seminar contexts',()=>{
  const signage=read('corporate-signage.js');
  for(const label of ['INETUM','LCP7','ORDRE DE MISSION','COOPTATION','SWILE','SAP','CONCUR','MyPeopleDoc','CHRONOTIME 2','GLOBAL SERVICE CENTER'])has(signage,label);
  for(const label of ['SUCCESS FACTORS','GCOMP','LEARNING','ACADEMY','POWER UP',"LET'S CONNECT",'FRANCE','DO YOU SPEAK','GEN AI?'])has(signage,label);
  for(const label of ['CHARITY DAY','SUMMER PARTY','LE POWER UP TOUR'])has(signage,label);
});

test('budget language is native and distinguishes project protection from the final budget',()=>{
  const game=read('game.js'),signage=read('corporate-signage.js'),html=read('index.html'),polish=read('polish.js');
  has(game,'BON DE COMMANDE');
  has(game,'ARBITRAGE 1 / 3');
  has(game,'ARBITRAGE 2 / 3');
  lacks(game,'BUDGET VALIDÉ');
  has(signage,'function purchaseOrder');
  has(signage,'BON DE COMMANDE');
  lacks(html,'budget-semantics.js');
  assert.equal(existsSync(join(root,'budget-semantics.js')),false);
  has(polish,'DIRECTEUR RÉGION GRAND OUEST');
});

test('polish owns presentation only and has no legacy CHACHA or delivery runtime',()=>{
  const polish=read('polish.js');
  has(polish,'RORO · DIRECTEUR RÉGION GRAND OUEST');
  has(polish,"['NIVEAU 1','OPEN SPACE · LCP7'");
  has(polish,"['NIVEAU 2','DIRECTION TECHNOLOGIES SERVICES'");
  has(polish,"['NIVEAU 3','POWER UP TOUR · GRAND OUEST'");
  has(polish,"s.level===2&&s.boss.active&&s.boss.hp>0");
  has(polish,'DIRECTEUR RÉGION GRAND OUEST · GARDIEN DU BUDGET');
  lacks(polish,'s.princess');
  lacks(polish,'deliveryScene');
  lacks(polish,'comedy.delivery');
  lacks(polish,'updateBanter');
  lacks(polish,'const banter=');
});

test('ambient quips have a safe fallback for every unique NPC kind',()=>{
  const game=read('game.js');
  has(game,"QUIPS[e.kind]||(CAST[e.kind]?.category==='consultant'?QUIPS.hugo:QUIPS.lea)");
  lacks(game,'QUIPS[e.kind][e.line]');
});

test('legacy generic signage is absent from the canonical renderer',()=>{
  const game=read('game.js'),signage=read('corporate-signage.js');
  lacks(game,'INETUM_DECOR');
  lacks(game,'cardRows=');
  lacks(game,'Inetum decor is actual textured geometry');
  lacks(game,"title:'SUCCESS FACTORS'");
  lacks(game,"title:'GLOBAL SERVICE CENTER'");
  lacks(game,"title:'SUMMER PARTY'");
  has(signage,'function cooptation');
  has(signage,'COOPTATION');
});

test('final presentation has a single RORO owner and no per-frame dialogue cleanup layer',()=>{
  const polish=read('polish.js'),game=read('game.js'),html=read('index.html');
  has(polish,'projectedEyeGap');has(polish,'glassesScale');
  lacks(game,'charlineTalk');lacks(game,'charlineLine');lacks(game,'CHARLINE_LINES');
  has(game,'LA MARGE EST AU VERT. C’EST L’ESSENTIEL.');
  has(game,'REFUSÉ. MAIS MERCI POUR L’ENGAGEMENT.');
  lacks(html,'cleanup.js');lacks(html,'main-dialogue-cleanup.js');
  assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);assert.equal(existsSync(join(root,'roles-polish.js')),false);
});

test('RORO budget safe is owned by polish and dies with the boss',()=>{const polish=read('polish.js'),html=read('index.html');has(polish,"className='rodolphe-safe'");has(polish,'s.boss.hp>0');has(polish,'rodolpheSafe.hidden=!visible');lacks(html,'roles-polish.js');assert.equal(existsSync(join(root,'roles-polish.js')),false);});
