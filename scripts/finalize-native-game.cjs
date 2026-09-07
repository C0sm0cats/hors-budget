const {readFileSync,writeFileSync}=require('node:fs');

let source=readFileSync('game.js','utf8');
const replaceRequired=(from,to,label)=>{
  if(!source.includes(from))throw new Error(`${label} not found`);
  source=source.replace(from,to);
};

replaceRequired('if(c.delivery<=0&&c.eligible','if(c.eligible','legacy delivery gate');
replaceRequired("name:'OPEN SPACE'","name:'OPEN SPACE · LCP7'",'level 1 canonical name');
replaceRequired("name:'LA DIRECTION'","name:'DIRECTION TS · PAYS DE LA LOIRE'",'level 2 canonical name');
replaceRequired("name:'ROOFTOP DU SÉMINAIRE'","name:'POWER UP TOUR · GRAND OUEST'",'level 3 canonical name');

for(const legacy of ['princess','deliveryScene','comedy.delivery','.delivered','c.delivery']){
  if(source.includes(legacy))throw new Error(`legacy runtime remains: ${legacy}`);
}
writeFileSync('game.js',source,'utf8');
