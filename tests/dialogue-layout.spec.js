const {test,expect}=require('@playwright/test');

async function bootStaticScene(page){
  await page.addInitScript(()=>{Math.random=()=>.5;});
  await page.goto('/');
  await page.locator('#startButton').click();
  // Keep RAF available while Playwright performs the click: its actionability
  // checks need animation frames. Once the game is running, stop scheduling
  // new game frames and drive rendering explicitly below.
  await page.evaluate(()=>{globalThis.requestAnimationFrame=()=>0;});
  await page.waitForTimeout(25);
}

async function renderDialogue(page,now){
  await page.evaluate(now=>{
    renderer.draw(0);
    DialoguePresentation.update(now);
  },now);
}

test('dialogue bodies and tails stay above animated actors and clear every sprite',async({page})=>{
  await bootStaticScene(page);
  const seen=new Set();
  let now=10000;
  for(const size of [{width:1440,height:900},{width:393,height:851},{width:667,height:375}]){
    await page.setViewportSize(size);
    for(const level of [0,1,2]){
      await page.evaluate(level=>{
        const s=Arcade.state;s.level=level;s.player.invulnerable=999;s.comedy.eligible=false;
        s.enemies.forEach((e,i)=>{e.kind=[['hugo','nora','hugo2','lea'],['nora2','basile','basile2','lea2'],['sarah','mehdi','elodie','antoine']][level][i];});
        s.player.floor=2;s.player.x=0;s.player.y=surface(2,0);s.boss.x=5.5;s.boss.y=surface(4,5.5);s.boss.hp=3;
        renderer.rebuild();Arcade.hud();
      },level);
      for(let sample=0;sample<3;sample++){
        await page.evaluate(sample=>{
          const s=Arcade.state;s.comedy.lineTime=10;
          s.comedy.line=sample%2?'Une courte réplique.':'Une réplique beaucoup plus longue pour vérifier que les bulles sur plusieurs lignes restent au-dessus de la tête, quelle que soit leur hauteur.';
          s.player.vx=sample%2?3:0;s.player.grounded=sample%2===0;s.player.y=surface(2,s.player.x)+(sample%2?.8:0);s.visual=sample*.2;
        },sample);
        await renderDialogue(page,now+=100);
        const result=await page.evaluate(()=>{
          const rects=Array.from(renderer.actorBounds.values()),failures=[],visible=[];
          for(const el of document.querySelectorAll('.fair-bubble:not([hidden])')){
            const r=el.getBoundingClientRect(),actor=renderer.actorBounds.get(el.dataset.actor);
            visible.push(el.dataset.actor);
            if(!actor||r.bottom+8>actor.top-7)failures.push('head clearance: '+el.dataset.actor);
            for(const other of rects)if(r.left<other.right&&r.right>other.left&&r.top<other.bottom&&r.bottom+8>other.top)failures.push('sprite overlap');
            if(r.top<7||r.left<7||r.right>innerWidth-7)failures.push('viewport overflow');
          }
          return {failures,visible};
        });
        expect(result.failures).toEqual([]);result.visible.forEach(kind=>seen.add(kind));
      }
    }
  }
  expect(seen.has('projectDirector')).toBe(true);
});

test('boss and Business Manager dialogue follows their animated heads',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await bootStaticScene(page);
  const seen=new Set();
  const collect=async now=>{
    await renderDialogue(page,now);
    const items=await page.evaluate(()=>Array.from(document.querySelectorAll('.main-banter:not([hidden])')).map(el=>({kind:el.dataset.actor,bottom:el.getBoundingClientRect().bottom,top:renderer.actorBounds.get(el.dataset.actor)?.top})));
    for(const item of items){expect(item.bottom+8).toBeLessThanOrEqual(item.top-7);seen.add(item.kind);}
  };

  await page.evaluate(()=>{
    const s=Arcade.state;s.level=1;s.player.floor=4;s.player.x=3;s.player.y=surface(4,3);s.player.invulnerable=999;
    s.comedy.eligible=false;s.comedy.lineTime=0;s.boss.x=5.5;s.boss.y=surface(4,5.5);s.boss.hp=3;s.boss.active=false;
    renderer.rebuild();Arcade.hud();
  });
  await collect(0);      // reset deterministic dialogue schedules
  await collect(1500);   // Tech Services Director

  await page.evaluate(()=>{
    const s=Arcade.state;s.level=2;s.player.floor=4;s.player.x=3;s.player.y=surface(4,3);s.player.invulnerable=999;
    s.comedy.eligible=false;s.comedy.lineTime=0;s.boss.x=5.5;s.boss.y=surface(4,5.5);s.boss.hp=3;s.boss.active=true;
    renderer.rebuild();Arcade.hud();
  });
  await collect(5900);   // Business Manager enters her scheduled window
  await collect(8100);   // Regional Director starts his window
  await collect(16000);  // Earlier bubbles expire, leaving Regional Director visible

  for(const kind of ['techServicesDirector','regionalDirector','businessManager'])expect(seen.has(kind),kind+' should have a visible dialogue').toBe(true);
});
