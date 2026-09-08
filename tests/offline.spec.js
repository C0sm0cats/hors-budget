const {test,expect}=require('@playwright/test');
const {resolve}=require('node:path');
const {pathToFileURL}=require('node:url');

test('double-click offline launch loads the poster and starts without WebGL errors',async({page})=>{
  const errors=[],network=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
  await page.goto(pathToFileURL(resolve(__dirname,'../index.html')).href);
  await page.waitForFunction(()=>renderer?.frames>5);
  await page.locator('#startButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase','levelIntro');
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-phase','playing');
  await page.waitForFunction(()=>renderer.frames>20);
  expect(errors).toEqual([]);
  expect(network).toEqual([]);
});
