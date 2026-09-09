const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const levels=[['inetum-lcp7','ordre-mission','swile','bon-commande','sap-concur','mypeopledoc','chronotime-2','global-service-center'],['success-factors','gcomp','learning-academy','power-up','lets-connect-france','gen-ai'],['charity-day','summer-party']];
function scene(level){
  const panels=[],boxes=[];
  class Image{addEventListener(){} set src(src){this.path=src.split('?')[0];const png=readFileSync(this.path);this.naturalWidth=png.readUInt32BE(16);this.naturalHeight=png.readUInt32BE(20);this.complete=true;}}
  const context=vm.createContext({Image,location:{protocol:'https:'},OfficeDecor:{draw(){}}});
  vm.runInContext(readFileSync('corporate-signage.js','utf8'),context);
  const mesh={box(...args){boxes.push(args);}};
  context.OfficeDecor.draw(mesh,(x,y,z,w,h,paint)=>{
    const panel={x,y,z,w,h};panels.push(panel);
    const update=()=>paint({fillRect(){},drawImage(image,dx,dy,dw,dh){Object.assign(panel,{image,dx,dy,dw,dh});}},1024,1024*h/w);
    update();return {update,move(x,y,z){Object.assign(panel,{x,y,z});}};
  },level,()=>0);
  return {context,panels,mesh};
}
for(let level=0;level<3;level++)test(`level ${level+1} retains its PNGs with undistorted, uncropped proportions`,()=>{
  const {panels}=scene(level);
  assert.deepEqual(panels.map(p=>p.image.path.slice(8,-4)),levels[level]);
  for(const p of panels){
    assert.ok(Math.abs(p.w/p.h-p.image.naturalWidth/p.image.naturalHeight)<1e-6,p.image.path);
    assert.ok(Math.abs(p.dw/p.dh-p.image.naturalWidth/p.image.naturalHeight)<1e-6);
    assert.ok(p.dx>=0&&p.dy>=0);assert.ok(p.dx+p.dw<=1024+1e-6);
  }
});
test('GCOMP stays beside the shaft and clear of the cabin throughout its travel',()=>{
  const {panels}=scene(1),panel=panels.find(p=>p.image.path.includes('gcomp'));
  assert.ok(panel.x+panel.w/2+.07<-.95);
  assert.ok(panel.y+panel.h/2+.07<3);
});
