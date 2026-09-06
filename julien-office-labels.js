'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .julien-board-overlay{position:fixed;z-index:12;transform:translate(-50%,-50%) rotate(-.25deg);pointer-events:none;overflow:hidden}
    .julien-board-overlay svg{display:block;width:100%;height:100%;overflow:hidden}
    .office-wall-plaque{position:fixed;z-index:18;transform:translate(-50%,-50%);padding:5px 9px 4px;border-radius:2px;background:#263943;color:#f3e3b8;border:2px solid #c7a86a;font:900 9px/1.05 system-ui;white-space:nowrap;pointer-events:none;box-shadow:0 2px 3px #0007,inset 0 0 0 1px #16242a}
    .office-wall-plaque small{display:block;margin-top:2px;color:#b9dce5;font-size:7px;letter-spacing:.035em;text-align:center}
  `;
  document.head.append(style);

  const board=document.createElement('div');
  board.className='julien-board-overlay';
  board.innerHTML=`<svg viewBox="0 0 340 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g font-family="Comic Sans MS, Bradley Hand, cursive" font-weight="700" fill="#29434a" stroke-linecap="round" stroke-linejoin="round">
      <text x="14" y="20" font-size="15" transform="rotate(-1 14 20)">INTERCONTRAT</text>
      <path d="M20 82 L20 34 M20 82 L156 82" fill="none" stroke="#53666c" stroke-width="2.4"/>
      <path d="M29 38 C52 41,74 49,94 58 S128 73,150 78" fill="none" stroke="#c45d61" stroke-width="4.2"/>
      <text x="23" y="33" font-size="10" fill="#8b3f43">12 %</text>
      <text x="54" y="47" font-size="10" fill="#8b3f43">9 %</text>
      <text x="84" y="60" font-size="10" fill="#8b3f43">6 %</text>
      <text x="115" y="72" font-size="10" fill="#8b3f43">3 %</text>
      <text x="147" y="95" font-size="11" fill="#327047">0 %</text>
      <text x="22" y="105" font-size="11" fill="#34754d" transform="rotate(-.6 22 105)">objectif : 0 %</text>

      <text x="184" y="20" font-size="14" fill="#287aa6" transform="rotate(.4 184 20)">MARGE / SALAIRES</text>
      <path d="M184 82 L184 34 M184 82 L326 82" fill="none" stroke="#53666c" stroke-width="2.4"/>
      <path d="M193 74 L221 64 L250 54 L282 43 L320 31" fill="none" stroke="#287aa6" stroke-width="4"/>
      <path d="M193 70 L221 70 L250 71 L282 70 L320 71" fill="none" stroke="#b05b9b" stroke-width="4"/>
      <text x="286" y="29" font-size="10" fill="#287aa6">marge ↑</text>
      <text x="274" y="66" font-size="10" fill="#9b467f">salaires →</text>
      <text x="255" y="105" font-size="14" fill="#287aa6" transform="rotate(-4 255 105)">— Julien</text>

      <text x="18" y="128" font-size="9.5" fill="#53666c" transform="rotate(-.6 18 128)">« capacité immédiatement disponible »</text>
    </g>
  </svg>`;
  board.hidden=true;document.body.append(board);

  const julienPlaque=document.createElement('div');julienPlaque.className='office-wall-plaque';julienPlaque.innerHTML='JULIEN<small>DTS · PAYS DE LA LOIRE</small>';julienPlaque.hidden=true;document.body.append(julienPlaque);
  const kevinPlaque=document.createElement('div');kevinPlaque.className='office-wall-plaque';kevinPlaque.innerHTML='KÉVIN<small>DIRECTEUR DE PROJETS</small>';kevinPlaque.hidden=true;document.body.append(kevinPlaque);

  function visible(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>-110&&p.x<innerWidth+110&&p.y>-100&&p.y<innerHeight+100;}
  function place(el,p){if(visible(p)){el.style.left=p.x+'px';el.style.top=p.y+'px';el.hidden=false;}else el.hidden=true;}

  function loop(){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer){board.hidden=true;julienPlaque.hidden=true;kevinPlaque.hidden=true;requestAnimationFrame(loop);return;}
    if(s.level===1){
      const x=6.05,y=surface(1,x),wy=y+1.54;
      const center=renderer.project(x,wy,-1.02),left=renderer.project(x-1.28,wy,-1.02),right=renderer.project(x+1.28,wy,-1.02),top=renderer.project(x,wy+.49,-1.02),bottom=renderer.project(x,wy-.49,-1.02);
      if(visible(center)&&left&&right&&top&&bottom){
        board.style.left=center.x+'px';board.style.top=center.y+'px';
        board.style.width=Math.max(190,Math.abs(right.x-left.x)*.94)+'px';
        board.style.height=Math.max(86,Math.abs(bottom.y-top.y)*.92)+'px';
        board.hidden=false;
      }else board.hidden=true;
      // Vraiment à côté du tableau, avec un espace visible entre les deux.
      place(julienPlaque,renderer.project(x+2.12,wy+.02,-1.0));
      kevinPlaque.hidden=true;
    }else if(s.level===0){
      board.hidden=true;julienPlaque.hidden=true;
      // Tableau Kévin centré à x=1.05 ; plaque dans l'espace libre à sa droite.
      place(kevinPlaque,renderer.project(2.95,4.72,-1.18));
    }else{board.hidden=true;julienPlaque.hidden=true;kevinPlaque.hidden=true;}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
