'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .julien-board-overlay{position:fixed;z-index:12;transform:translate(-50%,-50%) rotate(-.8deg);pointer-events:none;overflow:visible}
    .julien-board-overlay svg{display:block;width:100%;height:100%;overflow:visible}
    .julien-office-plaque{position:fixed;z-index:14;transform:translate(-50%,-50%) rotate(-1deg);padding:3px 7px;border-radius:3px;background:#efe6c8dd;color:#3b4850;border:1px solid #8c765c;font:800 9px/1.1 system-ui;white-space:nowrap;pointer-events:none;box-shadow:0 1px 2px #0004}
  `;
  document.head.append(style);

  const board=document.createElement('div');
  board.className='julien-board-overlay';
  board.innerHTML=`<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g font-family="Comic Sans MS, Bradley Hand, cursive" font-weight="700" fill="#29434a" stroke-linecap="round" stroke-linejoin="round">
      <text x="12" y="17" font-size="13" transform="rotate(-1 12 17)">INTERCONTRAT</text>
      <text x="110" y="17" font-size="10" fill="#3e7d54" transform="rotate(1 110 17)">objectif : 0 %</text>

      <path d="M18 67 L18 27 M18 67 L145 67" fill="none" stroke="#53666c" stroke-width="2"/>
      <path d="M25 31 C48 35,67 41,84 47 S117 59,139 64" fill="none" stroke="#c45d61" stroke-width="3"/>
      <path d="M25 33 C48 37,68 42,85 49 S118 60,139 65" fill="none" stroke="#d5776f" stroke-width="1.2" opacity=".7"/>
      <text x="22" y="26" font-size="8" fill="#8b3f43">12 %</text>
      <text x="53" y="38" font-size="8" fill="#8b3f43">9</text>
      <text x="82" y="49" font-size="8" fill="#8b3f43">6</text>
      <text x="109" y="59" font-size="8" fill="#8b3f43">3</text>
      <text x="136" y="76" font-size="9" fill="#327047">0</text>
      <text x="53" y="78" font-size="8" fill="#51676d">→ vers zéro</text>

      <text x="174" y="17" font-size="11" fill="#287aa6" transform="rotate(.8 174 17)">marge / salaires</text>
      <path d="M174 67 L174 28 M174 67 L305 67" fill="none" stroke="#53666c" stroke-width="2"/>
      <path d="M181 62 L207 55 L235 47 L266 38 L298 29" fill="none" stroke="#3d8798" stroke-width="3"/>
      <path d="M181 59 L207 58 L235 59 L266 58 L298 59" fill="none" stroke="#a6528f" stroke-width="3"/>
      <text x="274" y="26" font-size="8" fill="#287aa6">marge ↑</text>
      <text x="249" y="55" font-size="8" fill="#9b467f">salaires →</text>
      <text x="235" y="85" font-size="11" fill="#287aa6" transform="rotate(-4 235 85)">— Julien</text>

      <text x="14" y="108" font-size="9" fill="#53666c" transform="rotate(-1 14 108)">« capacité immédiatement disponible »</text>
      <path d="M18 113 C74 111,116 116,162 113" fill="none" stroke="#60777c" stroke-width="1.2"/>
    </g>
  </svg>`;
  board.hidden=true;
  document.body.append(board);

  const plaque=document.createElement('div');
  plaque.className='julien-office-plaque';
  plaque.textContent='BUREAU DE JULIEN · DTS PAYS DE LA LOIRE';
  plaque.hidden=true;
  document.body.append(plaque);

  function visible(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>-80&&p.x<innerWidth+80&&p.y>-80&&p.y<innerHeight+80;}
  function loop(){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer||s.level!==1){board.hidden=true;plaque.hidden=true;requestAnimationFrame(loop);return;}
    const x=6.05,y=surface(1,x),wy=y+1.72;
    const center=renderer.project(x,wy,-1.02),left=renderer.project(x-1.28,wy,-1.02),right=renderer.project(x+1.28,wy,-1.02),top=renderer.project(x,wy+.55,-1.02),bottom=renderer.project(x,wy-.55,-1.02);
    if(visible(center)&&left&&right&&top&&bottom){
      board.style.left=center.x+'px';board.style.top=center.y+'px';
      board.style.width=Math.max(150,Math.abs(right.x-left.x)*.92)+'px';
      board.style.height=Math.max(78,Math.abs(bottom.y-top.y)*.88)+'px';
      board.hidden=false;
    }else board.hidden=true;
    const pp=renderer.project(x,y+.55,.12);
    if(visible(pp)){plaque.style.left=pp.x+'px';plaque.style.top=pp.y+'px';plaque.hidden=false;}else plaque.hidden=true;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
