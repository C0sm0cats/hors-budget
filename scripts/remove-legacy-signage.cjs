const {readFileSync,writeFileSync}=require('node:fs');
const must=(ok,label)=>{if(!ok)throw new Error(label);};

let game=readFileSync('game.js','utf8');
const decorRe=/const INETUM_DECOR=\[[\s\S]*?\n\];\nconst Arcade=/;
must(decorRe.test(game),'INETUM_DECOR block not found');
game=game.replace(decorRe,'const Arcade=');
const renderRe=/  \/\/ Inetum decor is actual textured geometry in the 3D world so actors naturally occlude it\.[\s\S]*?(?=  world\.upload\(\);\})/;
must(renderRe.test(game),'legacy signage renderer block not found');
game=game.replace(renderRe,'');
if(game.includes('INETUM_DECOR')){const i=game.indexOf('INETUM_DECOR');console.error(game.slice(Math.max(0,i-600),i+1400));throw new Error('remaining INETUM_DECOR reference');}
writeFileSync('game.js',game,'utf8');

let signage=readFileSync('corporate-signage.js','utf8');
const coop=`  function cooptation(c,W,H){\n    c.fillStyle='#24384a';c.fillRect(0,0,W,H);\n    c.fillStyle='#f1c75b';for(const [x,y] of [[.2,.3],[.5,.22],[.78,.35],[.34,.7],[.68,.72]]){c.beginPath();c.arc(W*x,H*y,H*.065,0,Math.PI*2);c.fill();}\n    c.strokeStyle='#f1c75b';c.lineWidth=4;c.beginPath();c.moveTo(W*.2,H*.3);c.lineTo(W*.5,H*.22);c.lineTo(W*.78,H*.35);c.moveTo(W*.5,H*.22);c.lineTo(W*.34,H*.7);c.lineTo(W*.68,H*.72);c.stroke();\n    text(c,'COOPTATION',W*.5,H*.48,H*.13,'#fff1d8',W*.82,900,'center');text(c,'RECOMMANDEZ UN TALENT',W*.5,H*.83,H*.065,'#f1c75b',W*.82,800,'center');\n  }\n`;
if(!signage.includes('function cooptation(')){
  const marker='  function purchaseOrder(c,W,H){';must(signage.includes(marker),'purchaseOrder marker not found');signage=signage.replace(marker,coop+'\n'+marker);
}
const place="    panel(mesh,sign,4.65,4.43,1.05,1.24,purchaseOrder,'#586a70');";
must(signage.includes(place),'purchase order placement not found');
signage=signage.replace(place,"    panel(mesh,sign,-2.4,4.65,2.5,.68,cooptation,'#3d4d5d');\n"+place);
writeFileSync('corporate-signage.js',signage,'utf8');

let html=readFileSync('index.html','utf8');
must(html.includes('corporate-signage.js?v=2'),'signage version missing');must(html.includes('game.js?v=41'),'game version missing');
html=html.replace('corporate-signage.js?v=2','corporate-signage.js?v=3').replace('game.js?v=41','game.js?v=42');
writeFileSync('index.html',html,'utf8');

let tests=readFileSync('tests/redesign-invariants.test.cjs','utf8');
tests=tests.replaceAll('game.js?v=41','game.js?v=42');
tests=tests.replace("for(const label of ['INETUM','LCP7','ORDRE DE MISSION','SWILE','SAP','CONCUR','MyPeopleDoc','CHRONOTIME 2','GLOBAL SERVICE CENTER'])has(signage,label);","for(const label of ['INETUM','LCP7','ORDRE DE MISSION','COOPTATION','SWILE','SAP','CONCUR','MyPeopleDoc','CHRONOTIME 2','GLOBAL SERVICE CENTER'])has(signage,label);");
const insert=`\ntest('legacy generic signage is absent from the canonical renderer',()=>{\n  const game=read('game.js'),signage=read('corporate-signage.js');\n  lacks(game,'INETUM_DECOR');\n  lacks(game,'Inetum decor is actual textured geometry');\n  lacks(game,\"title:'SUCCESS FACTORS'\");\n  lacks(game,\"title:'GLOBAL SERVICE CENTER'\");\n  lacks(game,\"title:'SUMMER PARTY'\");\n  has(signage,'function cooptation');\n  has(signage,'COOPTATION');\n});\n`;
if(!tests.includes("test('legacy generic signage is absent"))tests+=insert;
writeFileSync('tests/redesign-invariants.test.cjs',tests,'utf8');
