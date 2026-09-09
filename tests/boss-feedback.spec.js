const {test,expect}=require('@playwright/test');
async function start(page){
  await page.goto('/');await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await page.keyboard.press('Enter');
  await page.evaluate(()=>{const s=Arcade.state;s.level=1;s.player.floor=4;s.player.x=4;s.player.y=surface(4,4);s.player.invulnerable=999;s.comedy.eligible=false;renderer.rebuild();});
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');await page.keyboard.press('Enter');
}
test('DIRECTEUR TECHNOLOGIES SERVICES blocks the rooftop until three returned KPI, with visible progress',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);
  await expect(page.locator('#bossHpText')).toHaveText('3 / 3 KPI');
  for(const airborne of [false,true]){
    const x=await page.evaluate(airborne=>{const s=Arcade.state;s.player.x=5.34;s.player.floor=4;s.player.grounded=!airborne;s.player.y=surface(4,5.34)+(airborne?1:0);s.player.vx=4;s.player.vy=0;Arcade.physics(1/90);return s.player.x;},airborne);
    expect(x).toBeLessThanOrEqual(4.5);
  }
  for(const hp of [2,1,0]){
    await page.evaluate(()=>{const s=Arcade.state;s.hitStop=0;s.hostile.push({techServicesDirector:true,reflected:true,life:2,x:5.35,y:13,vx:0});});
    await expect(page.locator('#bossHpText')).toHaveText(`${hp} / 3 KPI`);
  }
  await expect(page.locator('.boss-hud-title')).toContainText('ACCÈS ROOFTOP OUVERT');
  const x=await page.evaluate(()=>{const s=Arcade.state;s.player.x=5.4;s.player.floor=4;s.player.y=surface(4,5.4);s.player.grounded=true;Arcade.physics(1/90);return s.player.x;});
  expect(x).toBeGreaterThan(5.35);
  expect(errors).toEqual([]);
});
test('dialogues keep two non-overlapping bubbles and prioritize player reactions',async({page})=>{
  await start(page);
  await page.evaluate(()=>{const s=Arcade.state;s.comedy.line='RÉACTION PRIORITAIRE';s.comedy.lineTime=999;});
  await expect(page.locator('.fair-bubble:visible').filter({hasText:'RÉACTION PRIORITAIRE'})).toHaveCount(1);
  for(let i=0;i<8;i++){
    await page.waitForTimeout(1000);
    const boxes=await page.locator('.fair-bubble:visible').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,text:e.textContent};}));
    expect(boxes.length).toBeLessThanOrEqual(2);
    const hud=await page.locator('.boss-hud').boundingBox();
    for(const a of boxes)expect(a.left<hud.x+hud.width&&a.right>hud.x&&a.top<hud.y+hud.height&&a.bottom>hud.y).toBe(false);
    expect(boxes.some(b=>b.text==='RÉACTION PRIORITAIRE')).toBe(true);
    if(boxes.length===2){const [a,b]=boxes;expect(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top).toBe(false);}
    await expect(page.locator('.main-banter.projectDirector:visible')).toHaveCount(0);
  }
});
