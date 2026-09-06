'use strict';
// Signe discrètement le mini-graphe du tableau blanc sans toucher au rendu du jeu.
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
      this.translate(x+W*.05,y+H*.075);
      this.rotate(-.035);
      this.fillStyle='#287aa6';
      this.font='700 '+Math.max(15,H*.038)+'px system-ui';
      this.textAlign='left';
      this.textBaseline='middle';
      originalFillText.call(this,'— Julien',0,0);
      this.restore();
    }
    return result;
  };
})();
