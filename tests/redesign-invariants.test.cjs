const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
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

test('CHACHA and RORO are reserved for the final level in production patches',()=>{
  const loader=read('game-loader.js');
  has(loader,"if(s.level===2)person(moving,'charline'");
  has(loader,"if(s.level===2){moving.box(s.boss.x");
  has(loader,"if(!c.delivered&&s.level===2");
  has(loader,"if(s.level===2&&s.charlineIn<=0)");
  has(loader,"if(s.level===2)label('CHACHA'");
  has(loader,"if(s.level===2)label('RORO'");
});

test('JUJU guards rooftop access rather than CHACHA',()=>{
  const juju=read('julien-boss.js');
  has(juju,'JUJU BLOQUE L’ACCÈS AU ROOFTOP');
  has(juju,'Math.abs(s.player.x-X)<2.2');
  lacks(juju,'JUJU BLOQUE CHACHA');
});

test('all twelve generic NPC slots are unique across the three levels',()=>{
  const population=read('population-levels.js');
  const expected=[
    "['hugo','nora','hugo2','lea']",
    "['nora2','basile','basile2','lea2']",
    "['sarah','mehdi','elodie','antoine']"
  ];
  for(const roster of expected)has(population,roster);
  const keys=['hugo','nora','hugo2','lea','nora2','basile','basile2','lea2','sarah','mehdi','elodie','antoine'];
  assert.equal(new Set(keys).size,12);
  has(population,"hud:'OPEN SPACE · LCP7'");
  has(population,"hud:'DIRECTION TS · PAYS DE LA LOIRE'");
  has(population,"hud:'POWER UP TOUR · GRAND OUEST'");
  has(population,"role:'JUJU · DIRECTEUR TECHNOLOGIES SERVICES PAYS DE LA LOIRE'");
  has(population,"role:'RORO · DIRECTEUR RÉGION GRAND OUEST'");
});

test('the final seminar gets four additional unique business characters',()=>{
  const preload=read('unique-cast-preload.js'),html=read('index.html');
  for(const [key,name] of [['sarah','Sarah'],['mehdi','Mehdi'],['elodie','Élodie'],['antoine','Antoine']]){
    has(preload,`CAST.${key}={name:'${name}'`);
  }
  has(preload,"category:'business'");
  has(html,'unique-cast-preload.js?v=1');
  assert.ok(html.indexOf('unique-cast-preload.js?v=1')<html.indexOf('game-loader.js?v=22'),'extra cast must load before game-loader');
});

test('consultants and internal/business NPCs keep distinct visual and dialogue families',()=>{
  const loader=read('game-loader.js'),banter=read('banter-fair.js');
  has(loader,"category:'consultant'");
  has(loader,"category:'business'");
  has(loader,"CAST.hugo2={name:'Mathis'");
  has(loader,"CAST.nora2={name:'Inès'");
  has(loader,"CAST.basile2={name:'Thomas'");
  has(loader,"CAST.lea2={name:'Camille'");
  has(banter,"pools.hugo2=pools.hugo");
  has(banter,"/^(hugo|nora)/.test(e.kind)?'consultant':'internal'");
  has(banter,'Le CRA est validé. Mon existence administrative aussi.');
  has(banter,'Le pipeline est vert. Les signatures sont plus nuancées.');
});

test('office hierarchy exposes the business clue and Grand Ouest seminar structure',()=>{
  const hierarchy=read('office-hierarchy.js');
  has(hierarchy,"name:'CHACHA'");
  has(hierarchy,'PIPELINE');
  has(hierarchy,'PROSPECTS');
  has(hierarchy,'OPPORTUNITÉS');
  has(hierarchy,'CLIENTS');
  has(hierarchy,'POWER UP TOUR');
  has(hierarchy,'DIRECTEUR RÉGION GRAND OUEST');
});

test('corporate signage remains split by operational, direction and seminar contexts',()=>{
  const signage=read('corporate-signage.js');
  for(const label of ['INETUM','LCP7','ORDRE DE MISSION','SWILE','SAP','CONCUR','MyPeopleDoc','CHRONOTIME 2','GLOBAL SERVICE CENTER'])has(signage,label);
  for(const label of ['SUCCESS FACTORS','GCOMP','LEARNING','ACADEMY','POWER UP',"LET'S CONNECT",'FRANCE','DO YOU SPEAK','GEN AI?'])has(signage,label);
  for(const label of ['CHARITY DAY','SUMMER PARTY','LE POWER UP TOUR'])has(signage,label);
});

test('budget language distinguishes project protection from the final budget',()=>{
  const budget=read('budget-semantics.js'),roles=read('roles-polish.js');
  has(budget,'BON DE COMMANDE');
  has(budget,'ARBITRAGE 1 / 3');
  has(budget,'ARBITRAGE 2 / 3');
  has(roles,"const visible=s&&s.level===2");
  has(roles,'DIRECTEUR RÉGION GRAND OUEST');
});

test('legacy polish layer is itself hierarchy-aware',()=>{
  const polish=read('polish.js');
  has(polish,'RORO · DIRECTEUR RÉGION GRAND OUEST');
  has(polish,"['NIVEAU 1','OPEN SPACE · LCP7'");
  has(polish,"['NIVEAU 2','DIRECTION TECHNOLOGIES SERVICES'");
  has(polish,"['NIVEAU 3','POWER UP TOUR · GRAND OUEST'");
  has(polish,"if(s.level===2&&s.boss.hp>0");
  has(polish,"if(s.level===2&&p.floor>=3)");
  has(polish,'DIRECTEUR RÉGION GRAND OUEST · GARDIEN DU BUDGET');
});
