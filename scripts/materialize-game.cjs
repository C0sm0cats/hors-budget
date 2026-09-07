const {readFileSync,writeFileSync}=require('node:fs');
const vm=require('node:vm');

const source=readFileSync('game.js','utf8');
const loader=readFileSync('game-loader.js','utf8');
let transformed='';

class XMLHttpRequestMock{
  open(method,url,async){
    if(method!=='GET'||!url.startsWith('game.js')||async!==false)throw new Error('Unexpected loader request');
  }
  send(){this.status=200;this.responseText=source;}
}

const context={
  console,
  XMLHttpRequest:XMLHttpRequestMock,
  eval(code){transformed=String(code).replace(/\n\/\/# sourceURL=game\.js\s*$/,'');}
};
context.globalThis=context;
vm.runInNewContext(loader,context,{filename:'game-loader.js'});

if(!transformed)throw new Error('game-loader did not produce transformed game.js');
for(const legacy of ['deliveryScene','comedy.delivery','.delivered','princess']){
  if(transformed.includes(legacy))throw new Error(`Legacy runtime remained after materialization: ${legacy}`);
}
if(!transformed.includes('Object.defineProperties(globalThis,{Arcade:'))throw new Error('Global runtime exports are missing');

writeFileSync('game.js',transformed+'\n','utf8');
console.log(`Materialized game.js (${transformed.length} chars)`);
