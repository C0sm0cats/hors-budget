'use strict';
(()=>{
  const states=new WeakMap();
  const X=5.35;
  function state(s){let b=states.get(s);if(!b){b={hp:3,flash:0,preparing:false,nextAttack:(s.levelTime||0)+1.8,lastNow:s.levelTime||0};states.set(s,b);}return b;}
  const defeated=s=>state(s).hp<=0;
  globalThis.TechServicesBoss={x:X,state,defeated};

  function hitBoss(s,b){
    if(b.hp<=0)return;
    b.hp=Math.max(0,b.hp-1);b.flash=.34;s.score+=500;
    s.floaters.push({x:X,y:surface(4,X)+2.15,text:b.hp>0?'KPI RETOURNÉ':'ACCÈS AU ROOFTOP DÉBLOQUÉ',life:1.5,color:'#d5f382'});
    if(b.hp<=0){s.gate=2.6;s.hostile=s.hostile.filter(h=>h.techServicesDirector!==true);}
  }

  function bossTick(s){
    const now=s.levelTime||0;
    const b=state(s),dt=Math.min(.05,Math.max(0,now-b.lastNow));b.lastNow=now;b.flash=Math.max(0,b.flash-dt);
    const y=surface(4,X);
    for(const h of s.hostile){
      if(h.techServicesDirector&&h.reflected&&h.life>0&&h.x>=X-.45){h.life=0;hitBoss(s,b);}
    }
    if(s.player.floor<3)b.nextAttack=Math.max(b.nextAttack,now+.6);
    b.preparing=b.hp>0&&s.player.floor>=3&&now>=b.nextAttack-.6&&now<b.nextAttack;
    if(b.hp>0&&now>=b.nextAttack&&s.phase==='playing'&&s.player.floor>=3){
      b.nextAttack=now+1.9+Math.random()*.85;
      s.hostile.push({x:X-.48,y:y+.82,vx:-3.5,life:5,kind:'kpi',techServicesDirector:true,reflected:false});
    }
  }

  function loop(){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer||s.level!==1||s.phase!=='playing'||s.comedy?.miracle>0||s.hitStop>0){requestAnimationFrame(loop);return;}
    bossTick(s);
    const b=state(s);

    if(b.hp>0&&s.player.floor===4&&Math.abs(s.player.x-X)<2.2){
      const banner=document.getElementById('banner');
      if(banner)banner.textContent='ACCÈS AU ROOFTOP VERROUILLÉ · RENVOIE LES KPI AVEC X';
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
