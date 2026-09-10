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
  // The first game state may already have been observed by DialoguePresentation
  // during the frames needed for the click. Start a fresh state after RAF has
  // stopped so the first explicit update below always resets its schedules.
  await page.evaluate(()=>Arcade.start());
}

async function renderDialogue(page,now){
  await page.evaluate(now=>{
    // Use a non-zero render delta so the renderer settles the camera on the
    // current viewport/player position before actorBounds are measured. A zero
    // delta freezes the previous camera and makes geometry assertions depend on
    // whichever scene happened to render immediately before this one.
    renderer.draw(1);
    DialoguePresentation.update(now);
  },now);
}

const geometryScenes=[
  {name:'desktop',size:{width:1440,height:900}},
  {name:'portrait',size:{width:393,height:851}},
  {name:'landscape',size:{width:667,height:375}}
];

for(const {name,size} of geometryScenes){
  for(const level of [0,1,2]){
    test(`dialogue bodies and tails stay above sprites · ${name} · level ${level+1}`,async({page})=>{
      await page.setViewportSize(size);
      await bootStaticScene(page);
      // Reset DialoguePresentation against the fresh Arcade state, then render
      // exactly one deterministic geometry scene. Keeping each WebGL scene in
      // its own test prevents nine SwiftShader renders from sharing one timeout.
      await renderDialogue(page,0);
      await page.evaluate(level=>{
        const s=Arcade.state;s.level=level;s.player.invulnerable=999;s.comedy.eligible=false;
        s.enemies.forEach((e,i)=>{e.kind=[['hugo','nora','hugo2','lea'],['nora2','basile','basile2','lea2'],['sarah','mehdi','elodie','antoine']][level][i];});
        s.player.floor=2;s.player.x=0;s.player.y=surface(2,0)+(level%2?.8:0);s.player.vx=level%2?3:0;s.player.grounded=level%2===0;
        s.boss.x=5.5;s.boss.y=surface(4,5.5);s.boss.hp=3;s.visual=level*.2;
        s.comedy.lineTime=10;
        s.comedy.line='Une réplique beaucoup plus longue pour vérifier que les bulles sur plusieurs lignes restent au-dessus de la tête, quelle que soit leur hauteur.';
        renderer.rebuild();Arcade.hud();
      },level);
      await renderDialogue(page,3500);
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
      expect(result.failures).toEqual([]);
      // The forced Project Director line is the anchor exercised in every scene.
      expect(result.visible).toContain('projectDirector');
    });
  }
}

test('boss and Business Manager dialogue follows their animated heads',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await bootStaticScene(page);
  const seen=new Set();
  const collect=async now=>{
    await renderDialogue(page,now);
    const items=await page.evaluate(()=>Array.from(document.querySelectorAll('.main-banter:not([hidden])')).map(el=>({kind:el.dataset.actor,bottom:el.getBoundingClientRect().bottom,top:renderer.actorBounds.get(el.dataset.actor)?.top})));
    for(const item of items){expect(item.bottom+8).toBeLessThanOrEqual(item.top-7);seen.add(item.kind);}
  };

  // Give the Tech Services Director an isolated placement opportunity. The
  // player stays away from the top-floor boss so another main bubble cannot
  // compete for the same geometry.
  await page.evaluate(()=>{
    const s=Arcade.state;s.level=1;s.player.floor=0;s.player.x=-8;s.player.y=surface(0,-8);s.player.invulnerable=999;
    s.comedy.eligible=false;s.comedy.lineTime=0;s.boss.hp=3;s.boss.active=false;
    renderer.rebuild();Arcade.hud();
  });
  await collect(0);
  await collect(1500);

  // Start a fresh state so DialoguePresentation resets its schedule. Trigger the
  // Project Director once, let that bubble expire, then trigger the two level-2
  // roles together. updateMain only places two main bubbles at a time, so this
  // avoids the previous three-speaker contention that made the assertion depend
  // on incidental expiry/order details.
  await page.evaluate(()=>Arcade.start());
  await page.evaluate(()=>{
    const s=Arcade.state;s.level=2;s.player.floor=0;s.player.x=0;s.player.y=surface(0,0);s.player.invulnerable=999;
    s.comedy.eligible=false;s.comedy.lineTime=0;
    s.businessManager.x=8.4;s.businessManager.y=surface(4,8.4);
    s.boss.x=-5.5;s.boss.y=surface(4,-5.5);s.boss.hp=3;s.boss.active=true;
    renderer.rebuild();Arcade.hud();
  });
  await collect(0);
  await collect(3500);   // Project Director starts and will expire at 13.5 s
  await collect(13501);  // Business Manager + Regional Director get the two slots

  for(const kind of ['techServicesDirector','regionalDirector','businessManager'])expect(seen.has(kind),kind+' should have a visible dialogue').toBe(true);
});
