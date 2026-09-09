const {test,expect}=require('@playwright/test');
test('reading CHACHA clue triggers one reaction per run without an extra pause',async({page})=>{
  await page.goto('/');await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');await page.keyboard.press('Enter');
  const read=page.getByRole('button',{name:'Lire le tableau du bureau'});
  await read.click();
  await page.getByRole('combobox',{name:'Choisir un bureau'}).selectOption({label:'CHACHA'});
  await expect(page.locator('.office-reading h2')).toHaveText('Bureau de CHACHA');
  expect(await page.evaluate(()=>Arcade.state.comedy.line)).toContain('Au Power UP Tour');
  await page.locator('.office-reading button').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  await page.evaluate(()=>{Arcade.state.comedy.lineTime=0;Arcade.state.comedy.line='';});
  await read.click();await page.getByRole('combobox').selectOption({label:'CHACHA'});
  expect(await page.evaluate(()=>Arcade.state.comedy.line)).toBe('');
});
test('visible board cue opens its own board with a forgiving touch target',async({page,isMobile})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');await page.keyboard.press('Enter');
  for(const name of ['KÉKÉ','CHACHA']){
    await page.evaluate(name=>{const b=OfficeBoards.find(b=>b.name===name),s=Arcade.state;s.player.floor=b.floor;s.player.x=b.x;s.player.y=surface(b.floor,b.x);s.player.invulnerable=999;s.comedy.eligible=false;},name);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const point=await page.evaluate(name=>{const b=OfficeBoards.find(b=>b.name===name);return renderer.project(b.x+b.w/2+.16,b.y,b.z+.1);},name);
    // Click outside the board itself, but inside the cue's 48px target.
    if(isMobile)await page.touchscreen.tap(point.x+18,point.y);
    else await page.mouse.click(point.x+18,point.y);
    await expect(page.locator('.office-reading h2')).toHaveText('Bureau de '+name);
    await expect(page.locator('body')).toHaveAttribute('data-phase','paused');
    await page.locator('.office-reading button').click();
    await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  }
});
