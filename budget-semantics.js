'use strict';
(()=>{
  // Le budget final appartient à RORO. Le bonus défensif du parcours est donc un bon de commande,
  // et les deux premiers impacts sur le boss représentent des arbitrages, pas un budget déjà débloqué.
  const decor=globalThis.OfficeDecor;
  if(!decor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=decor.draw;

  decor.draw=(mesh,sign,level,surface)=>{
    originalDraw(mesh,sign,level,surface);
    if(level!==0)return;
    const x=4.65,y=4.43,w=1.05,h=1.24;
    mesh.box(x,y,-1.17,w+.14,h+.14,.08,'#586a70');
    sign(x,y,-1.10,w,h,(c,W,H)=>{
      c.fillStyle='#f5f1e4';c.fillRect(0,0,W,H);
      c.fillStyle='#294b5c';c.fillRect(0,0,W,H*.18);
      c.fillStyle='#fff7df';c.textAlign='center';c.textBaseline='middle';c.font='900 '+H*.075+'px system-ui';
      c.fillText('BON DE',W/2,H*.075,W*.88);c.fillText('COMMANDE',W/2,H*.145,W*.88);
      c.fillStyle='#53666c';c.textAlign='left';c.font='800 '+H*.038+'px system-ui';
      ['PROJET  __________________','FOURNISSEUR  _____________','MONTANT  _________________'].forEach((t,i)=>c.fillText(t,W*.08,H*(.31+i*.11),W*.84));
      c.strokeStyle='#5f9b65';c.lineWidth=Math.max(5,H*.018);c.strokeRect(W*.18,H*.62,W*.64,H*.22);
      c.fillStyle='#5f9b65';c.textAlign='center';c.font='900 '+H*.085+'px system-ui';c.fillText('APPROUVÉ',W/2,H*.705,W*.58);
      c.font='800 '+H*.035+'px system-ui';c.fillText('PROTECTION PROJET',W/2,H*.79,W*.7);
      c.strokeStyle='#5f9b65';c.lineWidth=Math.max(5,H*.02);c.beginPath();c.moveTo(W*.27,H*.91);c.lineTo(W*.39,H*.97);c.lineTo(W*.72,H*.86);c.stroke();
    });
  };

  const proto=globalThis.CanvasRenderingContext2D?.prototype;
  if(proto&&!proto.__budgetSemanticsPatched){
    const rewrite=value=>{
      const text=String(value);
      if(text==='BUDGET VALIDÉ')return 'BON DE COMMANDE';
      if(text==='BUDGET DÉBLOQUÉ !'){
        const hp=globalThis.Arcade?.state?.boss?.hp;
        if(hp===2)return 'ARBITRAGE 1 / 3';
        if(hp===1)return 'ARBITRAGE 2 / 3';
      }
      return text;
    };
    const fill=proto.fillText,stroke=proto.strokeText;
    proto.fillText=function(text,...args){return fill.call(this,rewrite(text),...args);};
    proto.strokeText=function(text,...args){return stroke.call(this,rewrite(text),...args);};
    Object.defineProperty(proto,'__budgetSemanticsPatched',{value:true});
  }

  function syncHud(){
    const status=document.getElementById('powerStatus');
    if(status?.textContent.includes('BUDGET VALIDÉ'))status.textContent=status.textContent.replaceAll('BUDGET VALIDÉ','BON DE COMMANDE');
    requestAnimationFrame(syncHud);
  }
  requestAnimationFrame(syncHud);
})();
