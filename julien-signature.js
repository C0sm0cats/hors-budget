'use strict';
// Identifie clairement le tableau du niveau 1 comme celui de Kévin.
// L'ancien graphe signé Julien est déplacé vers le bureau de Julien.
(()=>{
  const proto=CanvasRenderingContext2D.prototype;
  const originalFillText=proto.fillText;
  let labelled=false;
  proto.fillText=function(text,x,y,maxWidth){
    if(text==='Il faut privilégier les CP'&&this.canvas&&!labelled){
      labelled=true;
      const H=this.canvas.height;
      this.save();
      this.fillStyle='#244f68';
      this.font='900 '+Math.max(18,H*.05)+'px system-ui';
      this.textAlign='left';
      this.textBaseline='middle';
      originalFillText.call(this,'BUREAU DE KÉVIN',x,y-H*.085);
      this.restore();
    }
    return arguments.length>3
      ? originalFillText.call(this,text,x,y,maxWidth)
      : originalFillText.call(this,text,x,y);
  };
})();
