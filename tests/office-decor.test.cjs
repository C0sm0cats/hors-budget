const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

test('base office decor owns only KÉKÉ and JUJU boards',()=>{
  const noop=()=>{},boxes=[];
  const mesh=new Proxy({box(...args){boxes.push(args);}},{get:(t,k)=>t[k]||noop});
  const canvas=new Proxy({createLinearGradient:()=>({addColorStop:noop})},{get:(t,k)=>k in t?t[k]:noop,set:(t,k,v)=>(t[k]=v,true)});
  const source=readFileSync(join(__dirname,'../office-decor.js'),'utf8');
  const ctx=vm.createContext({OfficePlaques:{draw(){}},Path2D:class{constructor(path){assert.equal(typeof path,'string','missing handwritten character');assert.ok(path.length);}}});
  vm.runInContext(source,ctx);

  for(const [level,expected] of [[0,'KÉKÉ'],[1,'JUJU']]){
    boxes.length=0;
    ctx.OfficeDecor.draw(mesh,(x,y,z,w,h,paint)=>{paint(canvas,1024,1024*h/w);return {surface:{}};},level,(f,x)=>f*3+x*.024);
    assert.equal(ctx.OfficeBoards.length,1);
    assert.equal(ctx.OfficeBoards[0].name,expected);
    const b=ctx.OfficeBoards[0];
    const covering=boxes.some(([x,y,z,w,h,d])=>z+d/2>b.z&&x-w/2<=b.x-b.w/2&&x+w/2>=b.x+b.w/2&&y-h/2<=b.y-b.h/2&&y+h/2>=b.y+b.h/2);
    assert.equal(covering,false,b.name+' board hidden by its backing');
  }

  ctx.OfficeDecor.draw(mesh,noop,2,(f,x)=>f*3+x*.024);
  assert.equal(ctx.OfficeBoards.length,0,'level 3 is owned by office-hierarchy.js');
  assert.equal(ctx.OfficeBoard,null);
  for(const legacy of ['charlineBoard','rodolpheBoard','executiveOffice(','function heart('])assert.equal(source.includes(legacy),false,legacy+' should be removed');
});
