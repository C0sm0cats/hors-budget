const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
for(const protocol of ['file:','https:'])test(`poster source is valid for ${protocol} and preserves the PNG`,()=>{
  let image;
  const ctx=vm.createContext({Image:class{constructor(){image=this;}},OfficeDecor:{draw(){}},
    location:{protocol},document:{baseURI:`${protocol}//example.test/index.html`},URL});
  vm.runInContext(readFileSync('celine-poster.js','utf8'),ctx);
  if(protocol==='file:'){
    assert.ok(image.src.startsWith('data:image/png;base64,'));
    assert.deepEqual(Buffer.from(image.src.split(',')[1],'base64'),readFileSync('celine-dion-poster.png'));
  }else assert.equal(image.src,'https://example.test/celine-dion-poster.png?v=4');
});
