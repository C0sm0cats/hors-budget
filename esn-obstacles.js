'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .esn-hazard{position:fixed;z-index:6;pointer-events:none;transform:translate(-50%,-50%);box-sizing:border-box;font:900 7px/1 system-ui;text-align:center;letter-spacing:.04em;color:#26333a;text-shadow:none;filter:drop-shadow(0 3px 2px #07162566)}
    .esn-hazard.open-space{width:43px;height:34px;border:2px solid #765536;background:#c79a63;box-shadow:inset 0 0 0 2px #ddb67e}
    .esn-hazard.open-space::before{content:'PROJET';position:absolute;left:4px;right:4px;top:8px;padding:3px 0;background:#f1e2bd;border:1px solid #9b7650}
    .esn-hazard.open-space::after{content:'';position:absolute;left:18px;top:-2px;width:4px;height:34px;background:#9b765088}
    .esn-hazard.direction{width:45px;height:31px;border:2px solid #263945;border-radius:3px;background:#435864;color:#eef0d2;box-shadow:inset 0 0 0 2px #71838b}
    .esn-hazard.direction::before{content:'BUDGET';position:absolute;left:5px;right:5px;top:9px;padding:2px 0;border-top:1px solid #d5f382;border-bottom:1px solid #d5f382;color:#d5f382}
    .esn-hazard.direction::after{content:'';position:absolute;left:13px;right:13px;top:-7px;height:7px;border:2px solid #263945;border-bottom:0;border-radius:4px 4px 0 0}
    .esn-hazard.seminar{width:46px;height:35px;border:2px solid #303d48;border-radius:5px;background:#697985;color:#f5e6b8;box-shadow:inset 0 0 0 2px #9aa6ab}
    .esn-hazard.seminar::before{content:'POWER UP';position:absolute;left:4px;right:4px;top:9px;padding:3px 0;background:#354853;color:#d5f382}
    .esn-hazard.seminar::after{content:'';position:absolute;left:14px;right:14px;top:-7px;height:7px;border:2px solid #303d48;border-bottom:0;border-radius:5px 5px 0 0}
    .esn-hazard .wheel{position:absolute;bottom:-6px;width:8px;height:8px;border-radius:50%;background:#202d35;border:1px solid #9aa6ab}.esn-hazard .wheel.a{left:6px}.esn-hazard .wheel.b{right:6px}
  `;
  document.head.append(style);
  const nodes=new Map();
  function nodeFor(b,level){
    let el=nodes.get(b.id);
    const cls=level===0?'open-space':level===1?'direction':'seminar';
    if(!el){el=document.createElement('div');el.innerHTML='<i class="wheel a"></i><i class="wheel b"></i>';document.body.append(el);nodes.set(b.id,el);}
    el.className='esn-hazard '+cls;
    return el;
  }
  function sync(){
    let s=null;try{s=Arcade?.state;}catch{}
    const alive=new Set();
    if(s&&renderer&&s.phase==='playing')for(const b of s.barrels){
      alive.add(b.id);const el=nodeFor(b,s.level),p=renderer.project(b.x,b.y,.92);
      if(!p||!Number.isFinite(p.x)||p.x<-60||p.x>innerWidth+60||p.y<-60||p.y>innerHeight+60){el.hidden=true;continue;}
      el.style.left=p.x+'px';el.style.top=p.y+'px';el.hidden=false;
    }
    for(const [id,el] of nodes)if(!alive.has(id)){el.remove();nodes.delete(id);}
    requestAnimationFrame(sync);
  }
  requestAnimationFrame(sync);
})();
