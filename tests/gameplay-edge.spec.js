const {test,expect}=require('@playwright/test');

async function start(page){
  await page.goto('/');
  await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
}

function collectErrors(page){
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  return errors;
}

test('invulnerability and simultaneous bonuses tick coherently',async({page},testInfo)=>{
  const errors=collectErrors(page);await start(page);
  const result=await page.evaluate(()=>{
    const s=Arcade.state;
    s.lives=3;s.player.invulnerable=2;s.shield=3;s.coffee=4;s.slideTime=4;
    const before={lives:s.lives,invulnerable:s.player.invulnerable,shield:s.shield,coffee:s.coffee,slides:s.slideTime};
    Arcade.update(1/60);
    return {before,after:{lives:s.lives,invulnerable:s.player.invulnerable,shield:s.shield,coffee:s.coffee,slides:s.slideTime}};
  });
  expect(result.after.lives).toBe(3);
  expect(result.after.invulnerable).toBeLessThan(result.before.invulnerable);
  expect(result.after.shield).toBeLessThan(result.before.shield);
  expect(result.after.coffee).toBeLessThan(result.before.coffee);
  expect(result.after.slides).toBeLessThan(result.before.slides);
  expect(errors,`rare-state errors in ${testInfo.project.name}`).toEqual([]);
});

test('restart creates a clean run from every level-derived state',async({page},testInfo)=>{
  const errors=collectErrors(page);await start(page);
  for(const level of [0,1,2]){
    const snapshot=await page.evaluate(level=>{
      const s=Arcade.state;s.level=level;s.score=9999;s.lives=1;s.shield=8;s.coffee=8;s.slideTime=8;
      Arcade.start();
      return {level:Arcade.state.level,score:Arcade.state.score,lives:Arcade.state.lives,shield:Arcade.state.shield,coffee:Arcade.state.coffee,slides:Arcade.state.slideTime};
    },level);
    expect(snapshot).toEqual({level:0,score:0,lives:3,shield:0,coffee:0,slides:0});
    await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
    await page.keyboard.press('Enter');
  }
  expect(errors,`restart errors in ${testInfo.project.name}`).toEqual([]);
});

test('pause and resume preserve an active transition safely',async({page},testInfo)=>{
  const errors=collectErrors(page);await start(page);
  await page.evaluate(()=>{Arcade.state.transition=.8;Arcade.state.phase='transition';document.body.dataset.phase='transition';});
  await page.keyboard.press('p');
  await expect(page.locator('body')).toHaveAttribute('data-phase','paused');
  await page.keyboard.press('p');
  await expect(page.locator('body')).toHaveAttribute('data-phase','transition');
  expect(await page.evaluate(()=>Arcade.state.transition)).toBeGreaterThan(0);
  expect(errors,`transition pause errors in ${testInfo.project.name}`).toEqual([]);
});

test('final victory stays coherent from a stressed final-level state',async({page},testInfo)=>{
  const errors=collectErrors(page);await start(page);
  await page.evaluate(()=>{
    const s=Arcade.state;s.level=2;s.phase='playing';document.body.dataset.phase='playing';document.body.dataset.level='2';
    s.lives=1;s.shield=2;s.coffee=2;s.slideTime=2;s.boss.active=true;s.boss.hp=0;
    s.player.floor=4;s.player.x=s.chacha.x;s.player.y=surface(4,s.chacha.x);s.player.grounded=true;
    renderer.rebuild();Arcade.physics(1/90);
  });
  await expect(page.locator('body')).toHaveAttribute('data-phase','won');
  await expect(page.locator('#endScreen')).toBeVisible();
  await expect(page.locator('#endTitle')).toContainText('CHACHA EST LIBÉRÉE');
  await expect(page.locator('#endEyebrow')).toContainText('BUDGET DÉBLOQUÉ');
  expect(errors,`end-state errors in ${testInfo.project.name}`).toEqual([]);
});
