const {test,expect}=require('@playwright/test');

test('roles appear once in introductions and never as floating character labels',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');await page.evaluate(()=>OfficeWhiteboards.ready);
  await page.locator('#startButton').click();
  const introductions=[
    'DIRECTEUR DE PROJETS · BUSINESS MANAGER',
    'DIRECTEUR TECHNOLOGIES SERVICES PAYS DE LA LOIRE',
    'DIRECTEUR RÉGION GRAND OUEST'
  ];
  for(let level=0;level<3;level++){
    if(level)await page.evaluate(level=>{const s=Arcade.state;s.level=level;s.player.floor=1;s.player.x=0;s.player.y=surface(1,0);s.player.invulnerable=999;s.comedy.eligible=false;renderer.rebuild();},level);
    await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
    await expect(page.locator('.cinematic-copy em')).toHaveText(introductions[level]);
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
    const labels=await page.evaluate(async()=>{
      const context=document.getElementById('overlay').getContext('2d');
      const original=context.fillText,labels=[];
      context.fillText=function(text,...args){labels.push(String(text));return original.call(this,text,...args);};
      try{await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));}
      finally{context.fillText=original;}
      return labels;
    });
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.filter(text=>/^(DIRECTEUR|BUSINESS MANAGER)/.test(text))).toEqual([]);
    await expect(page.locator('.regionalDirector-name-fix')).toHaveCount(0);
    const headings=await page.locator('.main-banter').evaluateAll(elements=>elements.map(el=>getComputedStyle(el,'::before').content));
    expect(headings.every(content=>content==='none'||content==='normal'||content==='""')).toBe(true);
  }
  expect(errors).toEqual([]);
});
