const {readFileSync,writeFileSync,rmSync}=require('node:fs');

const mustReplace=(source,from,to,label)=>{
  if(!source.includes(from))throw new Error(`missing ${label}`);
  return source.replace(from,to);
};

let game=readFileSync('game.js','utf8');
game=game.replaceAll('BUDGET VALIDÉ','BON DE COMMANDE');
const bossOld="points(500,s.boss.x,s.boss.y+2,'BUDGET DÉBLOQUÉ !');";
const bossNew="const budgetHit=s.boss.hp===2?'ARBITRAGE 1 / 3':s.boss.hp===1?'ARBITRAGE 2 / 3':'BUDGET DÉBLOQUÉ !';points(500,s.boss.x,s.boss.y+2,budgetHit);";
game=mustReplace(game,bossOld,bossNew,'native boss budget feedback');
const rosterConst="const LEVEL_ROSTERS=[['hugo','nora','hugo2','lea'],['nora2','basile','basile2','lea2'],['sarah','mehdi','elodie','antoine']];\n";
if(!game.includes('const LEVEL_ROSTERS='))game=mustReplace(game,'const QUIPS=',rosterConst+'const QUIPS=','roster insertion point');
game=mustReplace(game,'function seedLevel(){','function seedLevel(){const roster=LEVEL_ROSTERS[s.level]||LEVEL_ROSTERS[0];s.enemies.forEach((enemy,i)=>{enemy.kind=roster[i%roster.length];});','native roster application');
writeFileSync('game.js',game,'utf8');

let signage=readFileSync('corporate-signage.js','utf8');
const orderFn=`  function purchaseOrder(c,W,H){\n    c.fillStyle='#f5f1e4';c.fillRect(0,0,W,H);c.fillStyle='#294b5c';c.fillRect(0,0,W,H*.18);\n    text(c,'BON DE COMMANDE',W*.5,H*.1,H*.065,'#fff7df',W*.9,900,'center');\n    [['PROJET',.32],['FOURNISSEUR',.44],['MONTANT',.56]].forEach(([label,y])=>{text(c,label,W*.08,H*y,H*.038,'#53666c',W*.3,800);c.strokeStyle='#93a2a8';c.lineWidth=3;c.beginPath();c.moveTo(W*.38,H*y);c.lineTo(W*.9,H*y);c.stroke();});\n    c.strokeStyle='#5f9b65';c.lineWidth=Math.max(5,H*.018);c.strokeRect(W*.18,H*.65,W*.64,H*.2);\n    text(c,'APPROUVÉ',W*.5,H*.73,H*.078,'#5f9b65',W*.58,900,'center');text(c,'PROTECTION PROJET',W*.5,H*.82,H*.03,'#5f9b65',W*.7,800,'center');\n  }\n`;
if(!signage.includes('function purchaseOrder('))signage=mustReplace(signage,'  function drawLevel0(mesh,sign){',orderFn+'\n  function drawLevel0(mesh,sign){','purchase order function insertion');
signage=mustReplace(signage,"    panel(mesh,sign,-6.6,1.45,4.8,.9,site);panel(mesh,sign,-1.25,1.45,3.6,.9,mission,'#465b62');panel(mesh,sign,4.45,1.45,2.8,.9,swile,'#7b4f69');","    panel(mesh,sign,-6.6,1.45,4.8,.9,site);panel(mesh,sign,-1.25,1.45,3.6,.9,mission,'#465b62');panel(mesh,sign,4.45,1.45,2.8,.9,swile,'#7b4f69');\n    panel(mesh,sign,4.65,4.43,1.05,1.24,purchaseOrder,'#586a70');",'purchase order placement');
writeFileSync('corporate-signage.js',signage,'utf8');

let html=readFileSync('index.html','utf8');
html=mustReplace(html,'<script src="budget-semantics.js?v=1"></script>\n','','budget semantics script');
html=mustReplace(html,'<script src="population-levels.js?v=4"></script>\n','','population script');
html=mustReplace(html,'corporate-signage.js?v=1','corporate-signage.js?v=2','signage cache version');
html=mustReplace(html,'game.js?v=40','game.js?v=41','game cache version');
writeFileSync('index.html',html,'utf8');

let tests=readFileSync('tests/redesign-invariants.test.cjs','utf8');
tests=tests.replaceAll('game.js?v=40','game.js?v=41');
const populationRe=/test\('all twelve generic NPC slots are unique across the three levels',[\s\S]*?\n\}\);\n\n(?=test\('all seminar cast lives natively in game\.js')/;
if(!populationRe.test(tests))throw new Error('population invariant block not found');
tests=tests.replace(populationRe,`test('all twelve generic NPC slots are native and unique across the three levels',()=>{\n  const game=read('game.js'),html=read('index.html');\n  const expected=[\"['hugo','nora','hugo2','lea']\",\"['nora2','basile','basile2','lea2']\",\"['sarah','mehdi','elodie','antoine']\"];\n  for(const roster of expected)has(game,roster);\n  has(game,'const LEVEL_ROSTERS=');\n  has(game,'const roster=LEVEL_ROSTERS[s.level]');\n  assert.equal(new Set(['hugo','nora','hugo2','lea','nora2','basile','basile2','lea2','sarah','mehdi','elodie','antoine']).size,12);\n  lacks(html,'population-levels.js');\n  assert.equal(existsSync(join(root,'population-levels.js')),false);\n});\n\n`);
const budgetRe=/test\('budget language distinguishes project protection from the final budget',[\s\S]*?\n\}\);\n\n(?=test\('polish owns presentation only)/;
if(!budgetRe.test(tests))throw new Error('budget invariant block not found');
tests=tests.replace(budgetRe,`test('budget language is native and distinguishes project protection from the final budget',()=>{\n  const game=read('game.js'),signage=read('corporate-signage.js'),html=read('index.html'),roles=read('roles-polish.js');\n  has(game,'BON DE COMMANDE');\n  has(game,'ARBITRAGE 1 / 3');\n  has(game,'ARBITRAGE 2 / 3');\n  lacks(game,'BUDGET VALIDÉ');\n  has(signage,'function purchaseOrder');\n  has(signage,'BON DE COMMANDE');\n  lacks(html,'budget-semantics.js');\n  assert.equal(existsSync(join(root,'budget-semantics.js')),false);\n  has(roles,'DIRECTEUR RÉGION GRAND OUEST');\n});\n\n`);
writeFileSync('tests/redesign-invariants.test.cjs',tests,'utf8');

for(const file of ['budget-semantics.js','population-levels.js'])rmSync(file);
