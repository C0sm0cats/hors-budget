'use strict';
// Rend la signature du mini-graphe bien visible, façon feutre bleu.
(()=>{
  const proto=CanvasRenderingContext2D.prototype;
  const originalFillText=proto.fillText;
  proto.fillText=function(text,x,y,maxWidth){
    const result=arguments.length>3
      ? originalFillText.call(this,text,x,y,maxWidth)
      : originalFillText.call(this,text,x,y);
    if(text==='SALAIRES'&&this.canvas){
      const W=this.canvas.width,H=this.canvas.height;
      this.save();
      // Plus haut et plus gros pour éviter le décor/HUD qui masquait l'ancienne version.
      this.translate(x+W*.015,y+H*.045);
      this.rotate(-.055);
      this.fillStyle='#287aa6';
      this.font='800 '+Math.max(22,H*.058)+'px system-ui';
      this.textAlign='left';
      this.textBaseline='middle';
      originalFillText.call(this,'— Julien',0,0);
      this.restore();
    }
    return result;
  };
})();
