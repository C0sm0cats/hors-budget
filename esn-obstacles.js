'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .esn-hazard{position:fixed;z-index:6;pointer-events:none;transform:translate(-50%,-50%);box-sizing:border-box;font:900 7px/1 system-ui;text-align:center;letter-spacing:.04em;color:#26333a;text-shadow:none;filter:drop-shadow(0 3px 2px #07162566)}
    .esn-hazard.open-space{width:52px;height:42px;border:2px solid #765536;background:#c79a63;box-shadow:inset 0 0 0 2px #ddb67e}
    .esn-hazard.open-space::before{content:'PROJET';position:absolute;left:5px;right:5px;top:11px;padding:3px 0;background:#f1e2bd;border:1px solid #9b7650}
    .esn-hazard.open-space::after{content:'';position:absolute;left:22px;top:-2px;width:4px;height:42px;background:#9b765088}
    .esn-hazard.direction{width:54px;height:40px;border:2px solid #263945;border-radius:3px;background:#435864;color:#eef0d2;box-shadow:inset 0 0 0 2px #71838b}
    .esn-hazard.direction::before{content:'BUDGET';position:absolute;left:6px;right:6px;top:12px;padding:2px 0;border-top:1px solid #d5f382;border-bottom:1px solid #d5f382;color:#d5f382}
    .esn-hazard.direction::after{content:'';position:absolute;left:16px;right:16px;top:-8px;height:8px;border:2px solid #263945;border-bottom:0;border-radius:4px 4px 0 0;background:#435864}
    .esn-hazard.seminar{width:56px;height:43px;border:2px solid #303d48;border-radius:5px;background:#697985;color:#f5e6b8;box-shadow:inset 0 0 0 2px #9aa6ab}
    .esn-hazard.seminar::before{content:'POWER UP';position:absolute;left:5px;right:5px;top:12px;padding:3px 0;background:#354853;color:#d5f382}
    .esn-hazard.seminar::after{content:'';position:absolute;left:17px;right:17px;top:-8px;height:8px;border:2px solid #303d48;border-bottom:0;border-radius:5px 5px 0 0;background:#697985}
    .esn-hazard .wheel{position:absolute;bottom:-6px;width:9px;height:9px;border-radius:50%;background:#202d35;border:1px solid #9aa6ab}.esn-hazard .wheel.a{left:7px}.esn-hazard .wheel.b{right:7px}
    .esn-hazard.decorative{transform:translate(-50%,-50%) scale(.72);transform-origin:center;z-index:5}
  `;
  document.head.append(style);

  const nodes=new Map();
  const clsFor=level=>level===0?'open-space':level===1?'direction':'seminar';
  function nodeFor(key,level,decorative=false){
    let el=nodes.get(key);
    if(!el){
      el=document.createElement('div');
      el.innerHTML='<i class="wheel a"></i><i class="wheel b"></i>';
      document.body.append(el);
      nodes.set(key,el);
    }
    el.className='esn-hazard '+clsFor(level)+(decorative?' decorative':'');
    return el;
  }
  function place(el,x,y,z){
    const p=renderer.project(x,y,z);
    if(!p||!Number.isFinite(p.x)||p.x<-80||p.x>innerWidth+80||p.y<-80||p.y>innerHeight+80){el.hidden=true;return false;}
    el.style.left=p.x+'px';
    el.style.top=p.y+'px';
    el.hidden=false;
    return true;
  }
  function sync(){
    let s=null;try{s=Arcade?.state;}catch{}
    const alive=new Set();
    if(s&&renderer){
      if(s.phase==='playing'){
        for(const b of s.barrels){
          const key='moving-'+b.id;
          alive.add(key);
          // Le tonneau WebGL est centré en z=.65 : utiliser exactement le même plan évite qu'il dépasse derrière le nouvel obstacle.
          place(nodeFor(key,s.level),b.x,b.y,.65);
        }
      }

      // game.js dessine aussi trois tonneaux décoratifs près de Rodolphe tant que le boss n'est pas actif,
      // y compris sur l'écran titre. On les recouvre eux aussi avec le décor ESN du niveau.
      if(!s.boss?.active&&!['help','records','paused','won','lost'].includes(s.phase)){
        for(let i=0;i<3;i++){
          const key='decor-'+i;
          alive.add(key);
          place(nodeFor(key,s.level,true),-9.35+i*.38,s.boss.y+.27,-.47);
        }
      }
    }
    for(const [id,el] of nodes)if(!alive.has(id)){el.remove();nodes.delete(id);}
    requestAnimationFrame(sync);
  }
  requestAnimationFrame(sync);
})();
