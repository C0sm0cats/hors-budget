const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const blocked=[[107, 101, 118, 105, 110], [107, 101, 107, 101], [99, 104, 97, 114, 108, 105, 110, 101], [99, 104, 97, 99, 104, 97], [106, 117, 108, 105, 101, 110], [106, 117, 106, 117], [114, 111, 100, 111, 108, 112, 104, 101], [114, 111, 114, 111]].map(code=>String.fromCodePoint(...code));
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const textExt=new Set(['.js','.cjs','.mjs','.html','.css','.md','.json','.yml','.yaml','.txt','.xml']);
function inspect(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name==='.git'||entry.name==='node_modules')continue;
    const full=path.join(dir,entry.name),rel=path.relative(root,full),pathText=normalize(rel);
    for(const word of blocked)assert.equal(pathText.includes(word),false,'forbidden cast identity '+word+' in path: '+rel);
    if(entry.isDirectory())inspect(full);
    else if(textExt.has(path.extname(entry.name).toLowerCase())){
      const content=normalize(fs.readFileSync(full,'utf8'));
      for(const word of blocked)assert.equal(content.includes(word),false,'forbidden cast identity '+word+' in file: '+rel);
    }
  }
}
test('repository contains no personal cast identities in paths or text',()=>inspect(root));
