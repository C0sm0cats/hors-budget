const {readFileSync,writeFileSync,rmSync}=require('node:fs');
const must=(ok,label)=>{if(!ok)throw new Error(label);};
const rep=(s,a,b,label)=>{must(s.includes(a),`missing ${label}`);return s.replace(a,b);};

let game=readFileSync('game.js','utf8');
game=game.replace(/const CHARLINE_LINES=\[[^\n]*\];\n/,'');
game=rep(game,'charlineIn:8,charlineLine:0,charlineTalk:0,','charlineIn:8,','legacy CHACHA state');
game=game.replace(/s\.charlineTalk=[^;]+;/g,'').replace(/s\.charlineLine=[^;]+;/g,'');
game=game.replace(/,'charlineTalk'/g,'');
game=game.replace(/if\(s\.level===2&&s\.charlineTalk>0\)label\([^;]+;/g,'');
game=game.replaceAll("'JE PILOTE LA TRANSFORMATION !'","'LA MARGE EST AU VERT. C’EST L’ESSENTIEL.'");
game=game.replaceAll("'REFUSÉ. MAIS BRAVO !'","'REFUSÉ. MAIS MERCI POUR L’ENGAGEMENT.'");
if(game.includes('charlineTalk')||game.includes('charlineLine')||game.includes('CHARLINE_LINES')){
  for(const term of ['charlineTalk','charlineLine','CHARLINE_LINES']){const i=game.indexOf(term);if(i>=0)console.error(term,game.slice(Math.max(0,i-180),i+400));}
  throw new Error('remaining legacy CHACHA chatter');
}
writeFileSync('game.js',game,'utf8');

let polish=readFileSync('polish.js','utf8');
const positionRe=/  function positionRodolphe\(s\)\{[\s\S]*?\n  \}\n\n  function resetPresentation/;
must(positionRe.test(polish),'positionRodolphe block');
const position=`  function positionRodolphe(s){\n    const visible=s.level===2&&s.boss.hp>0&&!['help','records','paused','won','lost'].includes(s.phase),showName=visible&&s.phase!=='title';\n    rodolpheGlasses.hidden=!visible;rodolpheName.hidden=!showName;if(!visible)return;\n    const rowing=!(s.comedy?.miracle>0)&&!s.boss.active&&Math.floor(s.visual/6)%2===1;\n    const bossX=s.boss.x-(s.boss.recoil>0?.24*(s.boss.recoil/.28):0),drawX=bossX+(rowing?Math.sin(s.visual*6)*.18:0),bounce=rowing&&!reduced?Math.abs(Math.sin(s.visual*7))*.48:0;\n    const scale=1.27,eyeY=s.boss.y+.32+bounce+1.16*scale,eyeZ=.15+.19*scale,eyeHalf=.105*scale;\n    const face=renderer.project(drawX,eyeY,eyeZ),leftEye=renderer.project(drawX-eyeHalf,eyeY,eyeZ),rightEye=renderer.project(drawX+eyeHalf,eyeY,eyeZ);\n    const projectedEyeGap=Math.hypot(rightEye.x-leftEye.x,rightEye.y-leftEye.y),glassesScale=Math.max(.28,Math.min(2.4,projectedEyeGap/19));\n    rodolpheGlasses.style.left=face.x+'px';rodolpheGlasses.style.top=face.y+'px';rodolpheGlasses.style.setProperty('transform','translate(-50%,-50%) scale('+glassesScale+')','important');\n    if(showName){const np=renderer.project(drawX,s.boss.y+.32+bounce+2.12,.45);rodolpheName.style.left=np.x+'px';rodolpheName.style.top=np.y+'px';}\n    const overlay=document.getElementById('overlay');if(overlay){const ctx=overlay.getContext('2d'),ratio=Math.min(devicePixelRatio||1,1.5),legacy=renderer.project(s.boss.x,s.boss.y+2.05,.65);ctx.save();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(legacy.x-64,legacy.y-16,128,32);ctx.restore();}\n  }\n\n  function resetPresentation`;
polish=polish.replace(positionRe,position);
writeFileSync('polish.js',polish,'utf8');

let roles=readFileSync('roles-polish.js','utf8');
roles=roles.replace(/  const bossTitle=[\s\S]*?bossTitle\.textContent='RORO · DIRECTEUR RÉGION GRAND OUEST';\n\n/,'');
roles=roles.replace(/  const rodolpheLines=\[[\s\S]*?requestAnimationFrame\(polishBubble\);\n\n/,'');
roles=roles.replace(/  const proto=CanvasRenderingContext2D\.prototype[\s\S]*?\n  \};\n\n(?=  const style=)/,'');
must(!roles.includes('polishBubble'),'remaining RORO bubble rewriter');
must(!roles.includes('originalFillText'),'remaining canvas text monkeypatch');
writeFileSync('roles-polish.js',roles,'utf8');

let html=readFileSync('index.html','utf8');
html=rep(html,'<title>Hors Budget — INETUM Arcade</title>','<title>Hors Budget — INETUM Arcade</title>\n<link rel="icon" href="data:,">','favicon');
html=rep(html,'game.js?v=42','game.js?v=43','game cache');
html=rep(html,'polish.js?v=23','polish.js?v=24','polish cache');
html=rep(html,'roles-polish.js?v=6','roles-polish.js?v=7','roles cache');
html=rep(html,'<script src="main-dialogue-cleanup.js?v=2"></script>\n','','main dialogue cleanup script');
html=rep(html,'<script src="cleanup.js?v=10"></script>\n','','cleanup script');
writeFileSync('index.html',html,'utf8');

let smoke=readFileSync('tests/smoke.spec.js','utf8');
smoke=smoke.replace("const variants=['hugo2','nora2','basile2','lea2'];\n    s.enemies.forEach((e,i)=>{e.kind=variants[i];e.talk=3;e.line=(i+1)%3;});","const variants=['hugo','nora','hugo2','lea','nora2','basile','basile2','lea2','sarah','mehdi','elodie','antoine'];\n    s.enemies.forEach((e,i)=>{e.kind=variants[i];e.talk=3;e.line=(i+1)%3;});");
const marker="test('final level polish uses CHACHA state without legacy runtime errors'";
must(smoke.includes(marker),'smoke marker');
if(!smoke.includes("Bon de commande is native")){
  const extra=`test('Bon de commande is native and the runtime stays error-free',async({page},testInfo)=>{\n  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});\n  await page.goto('/');await startAndDismissIntro(page);\n  const status=await page.evaluate(()=>{Arcade.state.shield=5;Arcade.hud();return document.getElementById('powerStatus').textContent;});\n  expect(status).toContain('BON DE COMMANDE');\n  expect(errors,\`budget runtime errors in \${testInfo.project.name}\`).toEqual([]);\n});\n\n`;
  smoke=smoke.replace(marker,extra+marker);
}
writeFileSync('tests/smoke.spec.js',smoke,'utf8');

writeFileSync('tests/cache-version.test.cjs',`const {test}=require('node:test');\nconst assert=require('node:assert/strict');\nconst {readFileSync,existsSync}=require('node:fs');\nconst {join}=require('node:path');\ntest('legacy runtime patch layers are gone and canonical assets are cache-busted',()=>{\n  const root=join(__dirname,'..'),html=readFileSync(join(root,'index.html'),'utf8');\n  assert.ok(html.includes('game.js?v=43'));assert.ok(html.includes('polish.js?v=24'));assert.ok(html.includes('roles-polish.js?v=7'));\n  assert.ok(html.includes('<link rel="icon" href="data:,">'));\n  assert.equal(html.includes('cleanup.js'),false);assert.equal(html.includes('main-dialogue-cleanup.js'),false);\n  assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);\n});\n`,'utf8');

let inv=readFileSync('tests/redesign-invariants.test.cjs','utf8');
inv=inv.replaceAll('game.js?v=42','game.js?v=43');
if(!inv.includes("test('final presentation has a single RORO owner"))inv += `\ntest('final presentation has a single RORO owner and no per-frame dialogue cleanup layer',()=>{\n  const polish=read('polish.js'),roles=read('roles-polish.js'),game=read('game.js'),html=read('index.html');\n  has(polish,'projectedEyeGap');has(polish,'glassesScale');\n  lacks(roles,'polishBubble');lacks(roles,'originalFillText');\n  lacks(game,'charlineTalk');lacks(game,'charlineLine');lacks(game,'CHARLINE_LINES');\n  has(game,'LA MARGE EST AU VERT. C’EST L’ESSENTIEL.');\n  has(game,'REFUSÉ. MAIS MERCI POUR L’ENGAGEMENT.');\n  lacks(html,'cleanup.js');lacks(html,'main-dialogue-cleanup.js');\n  assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);\n});\n`;
writeFileSync('tests/redesign-invariants.test.cjs',inv,'utf8');

rmSync('cleanup.js');rmSync('main-dialogue-cleanup.js');
