const {test,expect}=require('@playwright/test');

async function startAndDismissIntro(page){
  await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
}

async function dismissLevelIntro(page){
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
}

async function completeCurrentLevelAtChacha(page){
  await page.evaluate(()=>{
    const s=Arcade.state;
    s.player.floor=4;s.player.x=s.chacha.x;s.player.y=surface(4,s.chacha.x);s.player.grounded=true;s.player.climbing=null;s.player.invulnerable=2;
    Arcade.physics(1/90);
    if(s.phase==='transition'){s.transition=.001;Arcade.update(.02);}
  });
}

test('game boots without runtime errors and uses the canonical final-state model',async({page},testInfo)=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});

  await page.goto('/');
  await expect(page).toHaveTitle(/Hors Budget/);
  await expect(page.locator('#startButton')).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-phase','title');

  await expect.poll(async()=>page.evaluate(()=>({
    arcade:typeof Arcade!=='undefined',
    renderer:typeof renderer!=='undefined',
    state:typeof Arcade!=='undefined'&&!!Arcade.state,
    chacha:typeof Arcade!=='undefined'&&!!Arcade.state?.chacha,
    princess:typeof Arcade!=='undefined'&&Object.prototype.hasOwnProperty.call(Arcade.state||{},'princess'),
    delivery:typeof Arcade!=='undefined'&&Object.prototype.hasOwnProperty.call(Arcade.state?.comedy||{},'delivery')
  }))).toEqual({arcade:true,renderer:true,state:true,chacha:true,princess:false,delivery:false});

  await startAndDismissIntro(page);
  await expect.poll(()=>page.locator('#levelName').textContent()).toContain('OPEN SPACE · LCP7');
  await expect(page.locator('#banner')).toContainText(/OPEN SPACE|CHACHA|ÉTAGE/);
  await page.waitForTimeout(350);

  expect(errors,`browser errors in ${testInfo.project.name}`).toEqual([]);
});

test('all unique NPC ambient quips stay renderer-safe',async({page},testInfo)=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.goto('/');
  await startAndDismissIntro(page);

  const groups=[
    ['hugo','nora','hugo2','lea'],
    ['nora2','basile','basile2','lea2'],
    ['sarah','mehdi','elodie','antoine']
  ];
  for(const group of groups){
    await page.evaluate(group=>{
      Arcade.state.enemies.forEach((e,i)=>{e.kind=group[i];e.talk=3;e.line=(i+1)%3;});
    },group);
    await page.waitForTimeout(300);
  }

  expect(errors,`unique NPC quip errors in ${testInfo.project.name}`).toEqual([]);
});

test('Bon de commande is native and the runtime stays error-free',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('/');await startAndDismissIntro(page);
  const status=await page.evaluate(()=>{Arcade.state.shield=5;Arcade.hud();return document.getElementById('powerStatus').textContent;});
  expect(status).toContain('BON DE COMMANDE');
  expect(errors,`budget runtime errors in ${testInfo.project.name}`).toEqual([]);
});

test('final level polish uses CHACHA state without legacy runtime errors',async({page},testInfo)=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});

  await page.goto('/');
  await startAndDismissIntro(page);

  await page.evaluate(()=>{
    const s=Arcade.state;
    s.level=2;
    s.player.floor=3;
    s.player.y=surface(3,s.player.x);
    s.phase='playing';
    document.body.dataset.phase='playing';
    document.body.dataset.level='2';
    renderer.rebuild();
    Arcade.hud();
  });

  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  await page.waitForTimeout(600);

  const runtime=await page.evaluate(()=>({
    level:Arcade.state.level,
    chacha:!!Arcade.state.chacha,
    princess:Object.prototype.hasOwnProperty.call(Arcade.state,'princess'),
    delivery:Object.prototype.hasOwnProperty.call(Arcade.state.comedy||{},'delivery')
  }));
  expect(runtime).toEqual({level:2,chacha:true,princess:false,delivery:false});
  expect(errors,`final-level browser errors in ${testInfo.project.name}`).toEqual([]);
});

test('canonical journey reaches CHACHA through JUJU and RORO without runtime errors',async({page},testInfo)=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('/');
  await startAndDismissIntro(page);

  await completeCurrentLevelAtChacha(page);
  await expect.poll(()=>page.evaluate(()=>Arcade.state.level)).toBe(1);
  await dismissLevelIntro(page);
  await expect.poll(()=>page.locator('#levelName').textContent()).toContain('DIRECTION TS · PAYS DE LA LOIRE');

  await page.evaluate(()=>{
    const s=Arcade.state,b=JulienBoss.state(s);
    b.hp=1;
    s.player.floor=4;s.player.x=JulienBoss.x-1.6;s.player.y=surface(4,s.player.x);s.player.grounded=true;
    s.hostile.push({x:JulienBoss.x,y:surface(4,JulienBoss.x)+.82,vx:0,life:2,kind:'kpi',julien:true,reflected:true});
  });
  await expect.poll(()=>page.evaluate(()=>JulienBoss.state(Arcade.state).hp)).toBe(0);
  await completeCurrentLevelAtChacha(page);
  await expect.poll(()=>page.evaluate(()=>Arcade.state.level)).toBe(2);
  await dismissLevelIntro(page);
  await expect.poll(()=>page.locator('#levelName').textContent()).toContain('POWER UP TOUR · GRAND OUEST');

  await page.evaluate(()=>{
    const s=Arcade.state;
    s.player.floor=4;s.player.x=0;s.player.y=surface(4,0);s.player.grounded=true;
    Arcade.physics(1/90);
  });
  await expect.poll(()=>page.evaluate(()=>Arcade.state.boss.active)).toBe(true);
  await page.evaluate(()=>{
    const s=Arcade.state;
    s.boss.hp=0;
    s.player.floor=4;s.player.x=s.chacha.x;s.player.y=surface(4,s.chacha.x);s.player.grounded=true;
    Arcade.physics(1/90);
  });
  await expect(page.locator('body')).toHaveAttribute('data-phase','won');
  await expect(page.locator('#endTitle')).toContainText('CHACHA EST LIBÉRÉE');
  await expect(page.locator('#endEyebrow')).toContainText('BUDGET DÉBLOQUÉ');
  expect(errors,`journey errors in ${testInfo.project.name}`).toEqual([]);
});

test('pause, office reading and touch controls remain interactive',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('/');await startAndDismissIntro(page);
  await page.locator('#pauseButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','paused');
  await page.locator('#resumeButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  const boardButton=page.getByRole('button',{name:'Lire le tableau du bureau'});
  await expect(boardButton).toBeVisible();
  await boardButton.click();
  await expect(page.locator('dialog.office-reading')).toBeVisible();
  await page.locator('dialog.office-reading .primary').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  if(testInfo.project.name.includes('mobile')){
    const right=page.locator('.touch button[data-key="right"]');
    await right.dispatchEvent('pointerdown');
    await expect.poll(()=>page.evaluate(()=>Arcade.keys.has('right'))).toBe(true);
    await right.dispatchEvent('pointerup');
    await expect.poll(()=>page.evaluate(()=>Arcade.keys.has('right'))).toBe(false);
  }
  expect(errors,`interaction errors in ${testInfo.project.name}`).toEqual([]);
});
