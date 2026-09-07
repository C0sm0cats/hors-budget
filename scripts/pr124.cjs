const {readFileSync,writeFileSync,rmSync,existsSync}=require('node:fs');
const must=(ok,label)=>{if(!ok)throw new Error(label)};
let polish=readFileSync('polish.js','utf8');
if(!polish.includes("className='rodolphe-safe'")){
  const anchor="  const rodolpheName=document.createElement('div');\n  rodolpheName.className='rodolphe-name-fix';\n  rodolpheName.textContent='RORO';\n  document.body.append(rodolpheName);\n";
  must(polish.includes(anchor),'polish anchor');
  const safe=`${anchor}\n  const safeStyle=document.createElement('style');\n  safeStyle.textContent='.rodolphe-safe{position:fixed;z-index:4;width:62px;height:70px;transform:translate(-50%,-50%);pointer-events:none;border:3px solid #1e2b34;border-radius:7px;background:linear-gradient(145deg,#71818a,#35444d 58%,#202b32);box-shadow:inset 0 0 0 3px #93a2a8,inset 0 0 18px #111a,0 8px 16px #07162588}.rodolphe-safe::before{content:\"\";position:absolute;inset:8px;border:2px solid #aeb8bc;border-radius:4px;box-shadow:inset 0 0 0 2px #28353c}.rodolphe-safe span{position:absolute;left:50%;top:9px;transform:translateX(-50%);font:900 7px/1 system-ui;letter-spacing:1px;color:#d6f382;text-shadow:0 1px 2px #000}.rodolphe-safe i{position:absolute;left:17px;top:31px;width:17px;height:17px;border:3px solid #c6d0d3;border-radius:50%;box-sizing:border-box}.rodolphe-safe i::before,.rodolphe-safe i::after{content:\"\";position:absolute;left:5px;top:-3px;width:2px;height:17px;background:#c6d0d3}.rodolphe-safe i::after{transform:rotate(90deg)}.rodolphe-safe b{position:absolute;right:11px;top:31px;width:4px;height:18px;border-radius:3px;background:#c6d0d3;box-shadow:0 0 0 1px #1c262c}';\n  document.head.append(safeStyle);\n  const rodolpheSafe=document.createElement('div');\n  rodolpheSafe.className='rodolphe-safe';\n  rodolpheSafe.innerHTML='<span>BUDGET</span><i></i><b></b>';\n  rodolpheSafe.hidden=true;\n  document.body.append(rodolpheSafe);\n`;
  polish=polish.replace(anchor,safe);
  const old="    rodolpheGlasses.hidden=!visible;rodolpheName.hidden=!showName;if(!visible)return;";
  const neu="    rodolpheGlasses.hidden=!visible;rodolpheName.hidden=!showName;rodolpheSafe.hidden=!visible;if(!visible)return;";
  must(polish.includes(old),'visible anchor');polish=polish.replace(old,neu);
  const tail="    if(showName){const np=renderer.project(drawX,s.boss.y+.32+bounce+2.12,.45);rodolpheName.style.left=np.x+'px';rodolpheName.style.top=np.y+'px';}\n";
  const safePos=`${tail}    const sx=-7.35,sy=surface(4,sx)+.72,sz=.36,sp=renderer.project(sx,sy,sz),sl=renderer.project(sx-.45,sy,sz),sr=renderer.project(sx+.45,sy,sz);\n    if(sp&&Number.isFinite(sp.x)&&sp.x>=-80&&sp.x<=innerWidth+80&&sp.y>=-80&&sp.y<=innerHeight+80){\n      const safeScale=Math.max(.55,Math.min(1.45,Math.abs(sr.x-sl.x)/55));\n      rodolpheSafe.style.left=sp.x+'px';rodolpheSafe.style.top=sp.y+'px';rodolpheSafe.style.transform='translate(-50%,-50%) scale('+safeScale+')';rodolpheSafe.hidden=false;\n    }else rodolpheSafe.hidden=true;\n`;
  must(polish.includes(tail),'name tail');polish=polish.replace(tail,safePos);
  writeFileSync('polish.js',polish);
}
let html=readFileSync('index.html','utf8');
html=html.replace('polish.js?v=24','polish.js?v=25').replace('  <script src="roles-polish.js?v=7"></script>\n','');
writeFileSync('index.html',html);
let cache=readFileSync('tests/cache-version.test.cjs','utf8');
cache=cache.replace("assert.ok(html.includes('game.js?v=43'));assert.ok(html.includes('polish.js?v=24'));assert.ok(html.includes('roles-polish.js?v=7'));","assert.ok(html.includes('game.js?v=43'));assert.ok(html.includes('polish.js?v=25'));assert.equal(html.includes('roles-polish.js'),false);")
  .replace("assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);","assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);assert.equal(existsSync(join(root,'roles-polish.js')),false);");
writeFileSync('tests/cache-version.test.cjs',cache);
let inv=readFileSync('tests/redesign-invariants.test.cjs','utf8');
inv=inv.replace("const game=read('game.js'),banter=read('banter-fair.js'),roles=read('roles-polish.js');","const game=read('game.js'),banter=read('banter-fair.js');")
  .replace("  lacks(roles,'disableLegacyDelivery');\n  lacks(roles,'deliveryScene');\n",'')
  .replace("  const polish=read('polish.js'),roles=read('roles-polish.js'),game=read('game.js'),html=read('index.html');","  const polish=read('polish.js'),game=read('game.js'),html=read('index.html');")
  .replace("  lacks(roles,'polishBubble');lacks(roles,'originalFillText');\n",'')
  .replace("  assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);","  assert.equal(existsSync(join(root,'cleanup.js')),false);assert.equal(existsSync(join(root,'main-dialogue-cleanup.js')),false);assert.equal(existsSync(join(root,'roles-polish.js')),false);");
if(!inv.includes("rodolpheSafe.hidden=!visible")){
  inv += "\ntest('RORO budget safe is owned by polish and dies with the boss',()=>{const polish=read('polish.js'),html=read('index.html');has(polish,\"className='rodolphe-safe'\");has(polish,'s.boss.hp>0');has(polish,'rodolpheSafe.hidden=!visible');lacks(html,'roles-polish.js');assert.equal(existsSync(join(root,'roles-polish.js')),false);});\n";
}
writeFileSync('tests/redesign-invariants.test.cjs',inv);
if(existsSync('roles-polish.js'))rmSync('roles-polish.js');
