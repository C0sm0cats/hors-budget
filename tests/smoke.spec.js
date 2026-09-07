const {test,expect}=require('@playwright/test');

async function startAndDismissIntro(page){
  await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
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
