const {readFileSync,writeFileSync}=require('node:fs');

let game=readFileSync('game.js','utf8');
const old="else if(e.talk>0)label(QUIPS[e.kind][e.line],e.x,e.y+1.95,'#f5cf99',10,true);";
const replacement="else if(e.talk>0){const lines=QUIPS[e.kind]||(CAST[e.kind]?.category==='consultant'?QUIPS.hugo:QUIPS.lea);label(lines[e.line%lines.length]||lines[0],e.x,e.y+1.95,'#f5cf99',10,true);}";
if(!game.includes(old))throw new Error('unsafe NPC quip renderer not found');
game=game.replace(old,replacement);
game=game.replace("if(s.level===2)if(s.level===2)label('RORO'","if(s.level===2)label('RORO'");
writeFileSync('game.js',game,'utf8');

let html=readFileSync('index.html','utf8');
if(!html.includes('game.js?v=39'))throw new Error('game.js?v=39 not found');
html=html.replace('game.js?v=39','game.js?v=40');
writeFileSync('index.html',html,'utf8');

let smoke=readFileSync('tests/smoke.spec.js','utf8');
const marker="test('final level polish uses CHACHA state without legacy runtime errors'";
if(!smoke.includes(marker))throw new Error('smoke marker not found');
const regression=`test('unique NPC ambient quips never crash the renderer',async({page},testInfo)=>{\n  const errors=[];\n  page.on('pageerror',error=>errors.push(error.message));\n  page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().includes('favicon.ico'))errors.push(msg.text());});\n  await page.goto('/');\n  await startAndDismissIntro(page);\n  await page.evaluate(()=>{\n    const s=Arcade.state;\n    const variants=['hugo2','nora2','basile2','lea2'];\n    s.enemies.forEach((e,i)=>{e.kind=variants[i];e.talk=3;e.line=(i+1)%3;});\n  });\n  await page.waitForTimeout(350);\n  expect(errors,\`unique NPC quip errors in \${testInfo.project.name}\`).toEqual([]);\n});\n\n`;
smoke=smoke.replace(marker,regression+marker);
writeFileSync('tests/smoke.spec.js',smoke,'utf8');

let invariants=readFileSync('tests/redesign-invariants.test.cjs','utf8');
invariants=invariants.replaceAll('game.js?v=39','game.js?v=40');
invariants+=`\ntest('ambient quips have a safe fallback for every unique NPC kind',()=>{\n  const game=read('game.js');\n  has(game,\"QUIPS[e.kind]||(CAST[e.kind]?.category==='consultant'?QUIPS.hugo:QUIPS.lea)\");\n  lacks(game,'QUIPS[e.kind][e.line]');\n});\n`;
writeFileSync('tests/redesign-invariants.test.cjs',invariants,'utf8');
