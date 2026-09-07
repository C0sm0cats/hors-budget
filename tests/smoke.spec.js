const {test,expect}=require('@playwright/test');

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

  await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await expect.poll(async()=>page.locator('body').getAttribute('data-phase'),{timeout:12000}).toBe('playing');
  await expect.poll(()=>page.locator('#levelName').textContent()).toContain('OPEN SPACE · LCP7');
  await expect(page.locator('#banner')).toContainText(/CHACHA|ÉTAGE/);

  expect(errors,`browser errors in ${testInfo.project.name}`).toEqual([]);
});
