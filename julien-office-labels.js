'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .julien-board-overlay{position:fixed;z-index:12;transform:translate(-50%,-50%) rotate(-.6deg);pointer-events:none;overflow:visible}
    .julien-board-overlay svg{display:block;width:100%;height:100%;overflow:visible}
    .office-wall-plaque{position:fixed;z-index:18;transform:translate(-50%,-50%);padding:5px 8px 4px;border-radius:2px;background:#263943;color:#f3e3b8;border:2px solid #c7a86a;font:900 9px/1.05 system-ui;white-space:nowrap;pointer-events:none;box-shadow:0 2px 3px #0007,inset 0 0 0 1px #16242a}
    .office-wall-plaque small{display:block;margin-top:2px;color:#b9dce5;font-size:7px;letter-spacing:.035em;text-align:center}
  `;
  document.head.append(style);

  const board=document.createElement('div');
  board.className='julien-board-overlay';
  board.innerHTML=`<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g font-family="Comic Sans MS, Bradley Hand, cursive" font-weight="700" fill="#29434a" stroke-linecap="round" stroke-linejoin="round">
      <text x="11" y="18" font-size="15" transform="rotate(-1 11 18)">INTERCONTRAT</text>
      <text x="102" y="18" font-size="12" fill="#34754d" transform="rotate(.8 102 18)">objectif : 0 %</text>
      <path d="M18 78 L18 29 M18 78 L150 78" fill="none" stroke="#53666c" stroke-width="2.3"/>
      <path d="M27 34 C50 37,70 45,88 53 S122 69,143 74" fill="none" stroke="#c45d61" stroke-width="4"/>
      <path d="M27 36 C51 40,71 46,89 55 S123 70,143 75" fill="none" stroke="#db7a70" stroke-width="1.4" opacity=".75"/>
      <text x="22" y="29" font-size="10" fill="#8b3f43">12 %</text><text x="53" y="43" font-size="10" fill="#8b3f43">9 %</text><text x="82" y="56" font-size="10" fill="#8b3f43">6 %</text><text x="111" y="68" font-size="10" fill="#8b3f43">3 %</text><text x="140" y="91" font-size="11" fill="#327047">0 %</text>
      <text x="41" y="94" font-size="9" fill="#51676d">intercontrat → zéro</text>
      <text x="169" y="18" font-size="13" fill="#287aa6" transform="rotate(.6 169 18)">MARGE / SALAIRES</text>
      <path d="M171 78 L171 29 M171 78 L307 78" fill="none" stroke="#53666c" stroke-width="2.3"/>
      <path d="M180 71 L205 62 L233 51 L265 40 L300 28" fill="none" stroke="#287aa6" stroke-width="4"/>
      <path d="M180 68 L205 68 L233 69 L265 68 L300 69" fill="none" stroke="#b05b9b" stroke-width="4"/>
      <text x="263" y="27" font-size="10" fill="#287aa6">marge ↑</text><text x="247" y="64" font-size="10" fill="#9b467f">salaires →</text>
      <text x="236" y="99" font-size="14" fill="#287aa6" transform="rotate(-4 236 99)">— Julien</text>
      <text x="14" y="121" font-size="9.5" fill="#53666c" transform="rotate(-.8 14 121)">« capacité immédiatement disponible »</text>
      <path d="M18 126 C76 123,118 130,168 126" fill="none" stroke="#60777c" stroke-width="1.4"/>
    </g>
  </svg>`;
  board.hidden=true;document.body.append(board);

  const julienPlaque=document.createElement('div');julienPlaque.className='office-wall-plaque';julienPlaque.innerHTML='JULIEN<small>DTS · PAYS DE LA LOIRE</small>';julienPlaque.hidden=true;document.body.append(julienPlaque);
  const kevinPlaque=document.createElement('div');kevinPlaque.className='office-wall-plaque';kevinPlaque.innerHTML='KÉVIN<small>DIRECTEUR DE PROJETS</small>';kevinPlaque.hidden=true;document.body.append(kevinPlaque);

  function visible(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>-100&&p.x<innerWidth+100&&p.y>-100&&p.y<innerHeight+100;}
  function place(el,p){if(visible(p)){el.style.left=p.x+'px';el.style.top=p.y+'px';el.hidden=false;}else el.hidden=true;}

  function loop(){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer){board.hidden=true;julienPlaque.hidden=true;kevinPlaque.hidden=true;requestAnimationFrame(loop);return;}
    if(s.level===1){
      const x=6.05,y=surface(1,x),wy=y+1.72;
      const center=renderer.project(x,wy,-1.02),left=renderer.project(x-1.38,wy,-1.02),right=renderer.project(x+1.38,wy,-1.02),top=renderer.project(x,wy+.62,-1.02),bottom=renderer.project(x,wy-.62,-1.02);
      if(visible(center)&&left&&right&&top&&bottom){board.style.left=center.x+'px';board.style.top=center.y+'px';board.style.width=Math.max(215,Math.abs(right.x-left.x)*.98)+'px';board.style.height=Math.max(104,Math.abs(bottom.y-top.y)*.96)+'px';board.hidden=false;}else board.hidden=true;
      // Plaque murale au niveau du tableau, juste à sa droite.
      place(julienPlaque,renderer.project(x+1.9,wy+.05,-1.0));
      kevinPlaque.hidden=true;
    }else if(s.level===0){
      board.hidden=true;julienPlaque.hidden=true;
      // Tableau Kévin raccourci à 2,8 unités : plaque murale dans l'espace dégagé à droite.
      place(kevinPlaque,renderer.project(3.9,4.72,-1.18));
    }else{board.hidden=true;julienPlaque.hidden=true;kevinPlaque.hidden=true;}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
