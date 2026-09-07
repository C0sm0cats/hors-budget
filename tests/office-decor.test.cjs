const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

test('all office boards have complete pen strokes and sit in front of their backing',()=>{
  const noop=()=>{},boxes=[];
  const mesh=new Proxy({box(...args){boxes.push(args);}},{get:(t,k)=>t[k]||noop});
  const canvas=new Proxy({createLinearGradient:()=>({addColorStop:noop})},{get:(t,k)=>k in t?t[k]:noop,set:(t,k,v)=>(t[k]=v,true)});
  const ctx=vm.createContext({Path2D:class{constructor(path){assert.equal(typeof path,'string','missing handwritten character');assert.ok(path.length);}}});
  vm.runInContext(readFileSync(join(__dirname,'../office-decor.js'),'utf8'),ctx);
  for(let level=0;level<3;level++){
    boxes.length=0;
    ctx.OfficeDecor.draw(mesh,(x,y,z,w,h,paint)=>{paint(canvas,1024,1024*h/w);return {surface:{}};},level,(f,x)=>f*3+x*.024);
    assert.equal(ctx.OfficeBoards.length,level===2?2:1);
    for(const b of ctx.OfficeBoards){
      assert.ok(b.name&&b.canvas);
      const covering=boxes.some(([x,y,z,w,h,d])=>z+d/2>b.z&&x-w/2<=b.x-b.w/2&&x+w/2>=b.x+b.w/2&&y-h/2<=b.y-b.h/2&&y+h/2>=b.y+b.h/2);
      assert.equal(covering,false,b.name+' board hidden by its backing');
    }
  }
  assert.deepEqual(Array.from(ctx.OfficeBoards,b=>b.name),['Rodolphe','Charline']);
});
