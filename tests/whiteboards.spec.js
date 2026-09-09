const {test,expect}=require('@playwright/test');

test('each character keeps the supplied whiteboard and can read the original PNG at full size',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');await page.evaluate(()=>OfficeWhiteboards.ready);
  await page.locator('#startButton').click();await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  const expected=[
    [{name:'DIRECTEUR DE PROJETS',file:'Whiteboard02.png',floor:1},{name:'BUSINESS MANAGER',file:'Whiteboard01.png',floor:2}],
    [{name:'DIRECTEUR TECHNOLOGIES SERVICES',file:'Whiteboard03.png',floor:1}],
    [{name:'DIRECTEUR RÉGION GRAND OUEST',file:'Whiteboard04.png',floor:3}]
  ];
  for(let level=0;level<3;level++){
    await page.evaluate(level=>{Arcade.state.level=level;Arcade.state.player.floor=1;renderer.rebuild();},level);
    if(level>0){await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');await page.keyboard.press('Enter');await expect(page.locator('body')).toHaveAttribute('data-phase','playing');}
    const boards=await page.evaluate(()=>OfficeBoards.map(b=>({name:b.name,file:b.file,floor:b.floor,ratio:b.w/b.h,imageRatio:b.image.naturalWidth/b.image.naturalHeight})));
    expect(boards.map(({name,file,floor})=>({name,file,floor}))).toEqual(expected[level]);
    for(const board of boards)expect(board.ratio).toBeCloseTo(board.imageRatio,8);
    await page.getByRole('button',{name:'Lire le tableau du bureau'}).click();
    for(let i=0;i<expected[level].length;i++){
      if(expected[level].length>1)await page.getByRole('combobox',{name:'Choisir un bureau'}).selectOption(String(i));
      const board=expected[level][i],image=page.locator('.office-reading img');
      const titles=[['Bureau du Directeur de Projets','Bureau de la Business Manager'],['Bureau du Directeur Technologies Services Pays de la Loire'],['Bureau du Directeur Région Grand Ouest']];
      await expect(page.locator('.office-reading h2')).toHaveText(titles[level][i]);
      await expect(image).toHaveAttribute('alt','Tableau — '+titles[level][i]);
      await expect(image).toHaveAttribute('src',new RegExp('signage/'+board.file+'$'));
      await expect.poll(()=>image.evaluate(img=>img.naturalWidth)).toBe(1448);
      await page.getByRole('button',{name:'AGRANDIR',exact:true}).click();
      expect(await page.locator('.office-reading-image').evaluate(e=>e.scrollWidth>e.clientWidth)).toBe(true);
      await page.getByRole('button',{name:'AJUSTER',exact:true}).click();
      if(board.name==='BUSINESS MANAGER')expect(await page.evaluate(()=>Arcade.state.comedy.line)).toContain('Au Power UP Tour');
    }
    await page.getByRole('button',{name:'REPRENDRE',exact:true}).click();
    await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  }
  expect(errors).toEqual([]);
});
