'use strict';
(()=>{
  if(!globalThis.OfficeDecor?.draw)throw new Error('OfficeDecor indisponible');
  const originalDraw=globalThis.OfficeDecor.draw;
  function poster(mesh,sign){
    const x=3.18,y=4.55,z=-1.20,w=1.16,h=1.48;
    mesh.box(x,y,z-.06,w+.15,h+.15,.08,'#46565f');
    mesh.box(x,y,z-.025,w+.05,h+.05,.035,'#e6dec4');
    sign(x,y,z,w,h,(c,W,H)=>{
      const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#29485d');g.addColorStop(1,'#183142');
      c.fillStyle=g;c.fillRect(0,0,W,H);
      c.strokeStyle='#e8ddbd';c.lineWidth=Math.max(3,H*.018);c.strokeRect(W*.055,H*.045,W*.89,H*.91);
      c.fillStyle='#eadbb8';c.textAlign='center';c.textBaseline='middle';c.font='900 '+Math.max(13,H*.105)+'px system-ui';c.fillText('CÉLINE DION',W*.5,H*.13,W*.82);
      const star=(sx,sy,r)=>{c.fillStyle='#e7dbb8';c.beginPath();c.moveTo(sx,sy-r);c.lineTo(sx+r*.25,sy-r*.25);c.lineTo(sx+r,sy);c.lineTo(sx+r*.25,sy+r*.25);c.lineTo(sx,sy+r);c.lineTo(sx-r*.25,sy+r*.25);c.lineTo(sx-r,sy);c.lineTo(sx-r*.25,sy-r*.25);c.closePath();c.fill();};
      star(W*.20,H*.31,H*.034);star(W*.80,H*.29,H*.043);star(W*.81,H*.68,H*.032);
      // Stylised blonde singer silhouette matching the reference poster style.
      c.fillStyle='#b88b50';c.beginPath();c.ellipse(W*.5,H*.50,W*.25,H*.27,0,0,7);c.fill();
      c.fillStyle='#e3ae7d';c.beginPath();c.ellipse(W*.5,H*.48,W*.15,H*.18,0,0,7);c.fill();
      c.fillRect(W*.465,H*.60,W*.07,H*.11);
      c.fillStyle='#263947';c.beginPath();c.moveTo(W*.24,H*.91);c.quadraticCurveTo(W*.32,H*.67,W*.47,H*.68);c.lineTo(W*.55,H*.75);c.quadraticCurveTo(W*.67,H*.66,W*.76,H*.90);c.closePath();c.fill();
      c.strokeStyle='#d4a868';c.lineWidth=H*.035;c.lineCap='round';c.beginPath();c.moveTo(W*.36,H*.39);c.quadraticCurveTo(W*.5,H*.27,W*.65,H*.40);c.moveTo(W*.34,H*.43);c.quadraticCurveTo(W*.28,H*.57,W*.38,H*.70);c.moveTo(W*.66,H*.43);c.quadraticCurveTo(W*.72,H*.57,W*.62,H*.70);c.stroke();
      c.strokeStyle='#5b4336';c.lineWidth=H*.009;c.beginPath();c.moveTo(W*.43,H*.48);c.lineTo(W*.47,H*.48);c.moveTo(W*.54,H*.48);c.lineTo(W*.58,H*.48);c.stroke();
      c.strokeStyle='#9e5f63';c.lineWidth=H*.009;c.beginPath();c.arc(W*.505,H*.555,W*.055,.15,2.9);c.stroke();
      c.fillStyle='#f1e5cc';c.beginPath();c.ellipse(W*.35,H*.56,W*.012,H*.025,0,0,7);c.ellipse(W*.65,H*.56,W*.012,H*.025,0,0,7);c.fill();
    });
  }
  globalThis.OfficeDecor.draw=(mesh,sign,level,surface)=>{originalDraw(mesh,sign,level,surface);if(level===0)poster(mesh,sign);};
})();
