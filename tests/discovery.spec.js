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
