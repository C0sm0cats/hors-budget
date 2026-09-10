const {test,expect}=require('@playwright/test');

test('boss gauges fit between the scoreboard and grounded hero after resize and jump',async({page,isMobile})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');await page.keyboard.press('Enter');
  for(const level of [1,2]){
    await page.evaluate(level=>{const s=Arcade.state;s.level=level;s.player.floor=4;s.player.x=3;s.player.y=surface(4,3);s.player.grounded=true;s.player.invulnerable=999;s.comedy.eligible=false;s.noticeTime=0;s.boss.active=level===2;s.boss.x=5.5;s.boss.y=surface(4,5.5);s.boss.hp=3;renderer.rebuild();},level);
    await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');await page.keyboard.press('Enter');
    if(level===2){await expect(page.locator('body')).toHaveAttribute('data-phase','bossIntro');await page.keyboard.press('Enter');}
    await expect(page.locator('.boss-hud')).toBeVisible();
    const sizes=isMobile?[{width:393,height:851},{width:667,height:375}]:[{width:1440,height:900},{width:1280,height:720}];
    for(const size of sizes){
      await page.setViewportSize(size);
      await expect.poll(()=>page.evaluate(()=>{
        const hud=document.querySelector('.hud').getBoundingClientRect(),boss=document.querySelector('.boss-hud').getBoundingClientRect(),s=Arcade.state;
        const head=renderer.project(s.player.x,surface(4,s.player.x)+1.85,.9);
        return boss.top>=hud.bottom+10&&boss.bottom+12<=head.y&&boss.left>=8&&boss.right<=innerWidth-8;
      })).toBe(true);
      const before=await page.locator('.boss-hud').boundingBox();
      await page.keyboard.down('Space');
      await expect.poll(()=>page.evaluate(()=>Arcade.state.player.grounded)).toBe(false);
      const during=await page.locator('.boss-hud').boundingBox();
      expect(during.y).toBeCloseTo(before.y,0);
      await page.keyboard.up('Space');
      await expect.poll(()=>page.evaluate(()=>Arcade.state.player.grounded)).toBe(true);
    }
  }
});

test('onboarding separates the three levels and remains usable on small screens',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Aide',exact:true}).click();
  const levels=page.locator('#helpScreen .help-levels li');
  await expect(levels).toHaveCount(3);
  await expect(levels.locator('strong')).toHaveText(['Niveau 1 · Open Space — LCP7','Niveau 2 · Direction TS — Pays de la Loire','Niveau 3 · Power UP Tour — Grand Ouest']);
  await expect(levels.nth(0)).toContainText('premiers indices sur le budget');
  await expect(levels.nth(1)).toContainText('KPI');
  await expect(levels.nth(2)).toContainText('débloque le budget');
  await page.getByRole('button',{name:'COMPRIS !'}).click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','title');
});
