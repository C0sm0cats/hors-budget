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
  await expect(page.locator('#banner')).toContainText(/CHACHA|ÉTAGE/);
  await page.waitForTimeout(350);

  expect(errors,`browser errors in ${testInfo.project.name}`).toEqual([]);
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
