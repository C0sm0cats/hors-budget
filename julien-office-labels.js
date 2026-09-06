'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .office-board-overlay{position:fixed;z-index:12;transform:translate(-50%,-50%) rotate(-.18deg);pointer-events:none;overflow:hidden;background:#f4f3e9;box-shadow:0 0 0 3px #8b9ca1,0 2px 3px #0006}
    .office-board-overlay svg{display:block;width:100%;height:100%;overflow:hidden}
    .office-wall-plaque{position:fixed;z-index:18;transform:translate(-50%,-50%);padding:7px 11px 6px;border-radius:2px;background:#213a49;color:#f3e3b8;border:2px solid #c7a86a;font:900 10px/1.05 system-ui;white-space:nowrap;pointer-events:none;box-shadow:0 2px 4px #0008,inset 0 0 0 1px #122630}
    .office-wall-plaque small{display:block;margin-top:3px;color:#b9dce5;font-size:8px;letter-spacing:.045em;text-align:center}
  `;
  document.head.append(style);

  const kevinBoard=document.createElement('div');
  kevinBoard.className='office-board-overlay kevin-board';
  kevinBoard.innerHTML=`<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="300" height="170" fill="#f7f6ee"/>
    <g font-family="Comic Sans MS, Bradley Hand, cursive" stroke-linecap="round" stroke-linejoin="round">
      <text x="24" y="34" font-size="22" font-weight="700" fill="#2f4650" transform="rotate(-1 24 34)">Congés - Tips</text>
      <path d="M24 39 C78 37,122 40,167 38" fill="none" stroke="#2f4650" stroke-width="2"/>
      <g fill="#bd3f49" font-size="18" font-weight="700">
        <text x="30" y="67" transform="rotate(-.7 30 67)">• Poser les CP tôt</text>
        <text x="30" y="91" transform="rotate(.5 30 91)">• Éviter les ponts</text>
        <text x="30" y="115" transform="rotate(-.4 30 115)">• Pas de report après le 31/05</text>
        <text x="30" y="139" transform="rotate(.5 30 139)">• Anticiper avec le manager</text>
      </g>
      <text x="217" y="158" font-size="18" font-weight="700" fill="#bd3f49" transform="rotate(-4 217 158)">— Kévin</text>
    </g>
  </svg>`;
  kevinBoard.hidden=true;document.body.append(kevinBoard);

  const julienBoard=document.createElement('div');
  julienBoard.className='office-board-overlay julien-board';
  julienBoard.innerHTML=`<svg viewBox="0 0 380 165" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="380" height="165" fill="#f7f6ee"/>
    <g font-family="Comic Sans MS, Bradley Hand, cursive" font-weight="700" fill="#29434a" stroke-linecap="round" stroke-linejoin="round">
      <text x="18" y="25" font-size="19" transform="rotate(-1 18 25)">INTERCONTRAT</text>
      <path d="M25 103 L25 43 M25 103 L176 103" fill="none" stroke="#53666c" stroke-width="2.6"/>
      <path d="M36 50 C62 55,88 64,112 75 S150 91,169 97" fill="none" stroke="#c94b55" stroke-width="4.5"/>
      <g font-size="12" fill="#8b3f43"><text x="29" y="45">12 %</text><text x="68" y="62">9 %</text><text x="104" y="78">6 %</text><text x="140" y="93">3 %</text></g>
      <text x="165" y="117" font-size="13" fill="#327047">0 %</text>
      <text x="28" y="133" font-size="14" fill="#34754d" transform="rotate(-.8 28 133)">objectif : 0 %</text>

      <text x="205" y="25" font-size="18" fill="#287aa6" transform="rotate(.4 205 25)">MARGE / SALAIRES</text>
      <path d="M207 103 L207 43 M207 103 L362 103" fill="none" stroke="#53666c" stroke-width="2.6"/>
      <path d="M219 94 L250 82 L282 68 L317 54 L355 39" fill="none" stroke="#287aa6" stroke-width="4.5"/>
      <path d="M219 91 L250 91 L282 92 L317 91 L355 92" fill="none" stroke="#b05b9b" stroke-width="4.5"/>
      <text x="323" y="38" font-size="12" fill="#287aa6">marge ↑</text>
      <text x="309" y="86" font-size="12" fill="#9b467f">salaires →</text>
      <text x="292" y="128" font-size="17" fill="#287aa6" transform="rotate(-4 292 128)">— Julien</text>
      <text x="22" y="155" font-size="11" fill="#53666c" transform="rotate(-.5 22 155)">« capacité immédiatement disponible »</text>
    </g>
  </svg>`;
  julienBoard.hidden=true;document.body.append(julienBoard);

  const julienPlaque=document.createElement('div');julienPlaque.className='office-wall-plaque';julienPlaque.innerHTML='JULIEN<small>DTS · PAYS DE LA LOIRE</small>';julienPlaque.hidden=true;document.body.append(julienPlaque);
  const kevinPlaque=document.createElement('div');kevinPlaque.className='office-wall-plaque';kevinPlaque.innerHTML='KÉVIN<small>DIRECTEUR DE PROJETS</small>';kevinPlaque.hidden=true;document.body.append(kevinPlaque);

  function visible(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>-130&&p.x<innerWidth+130&&p.y>-110&&p.y<innerHeight+110;}
  function place(el,p){if(visible(p)){el.style.left=p.x+'px';el.style.top=p.y+'px';el.hidden=false;}else el.hidden=true;}
  function placeBoard(el,c,l,r,t,b,minW,minH){
    if(visible(c)&&l&&r&&t&&b){el.style.left=c.x+'px';el.style.top=c.y+'px';el.style.width=Math.max(minW,Math.abs(r.x-l.x)*.98)+'px';el.style.height=Math.max(minH,Math.abs(b.y-t.y)*.98)+'px';el.hidden=false;}else el.hidden=true;
  }

  function loop(){
    let s=null;try{s=Arcade?.state;}catch{}
    if(!s||!renderer){kevinBoard.hidden=true;julienBoard.hidden=true;julienPlaque.hidden=true;kevinPlaque.hidden=true;requestAnimationFrame(loop);return;}
    if(s.level===0){
      julienBoard.hidden=true;julienPlaque.hidden=true;
      const x=.8,y=4.65,w=2.7,h=1.7;
      const c=renderer.project(x,y,-1.23),l=renderer.project(x-w/2,y,-1.23),r=renderer.project(x+w/2,y,-1.23),t=renderer.project(x,y+h/2,-1.23),b=renderer.project(x,y-h/2,-1.23);
      placeBoard(kevinBoard,c,l,r,t,b,210,112);
      place(kevinPlaque,renderer.project(3.05,4.72,-1.16));
    }else if(s.level===1){
      kevinBoard.hidden=true;kevinPlaque.hidden=true;
      const deskY=surface(1,6.0),x=5.0,wy=deskY+1.58,w=3.55,h=1.28;
      const c=renderer.project(x,wy,-1.03),l=renderer.project(x-w/2,wy,-1.03),r=renderer.project(x+w/2,wy,-1.03),t=renderer.project(x,wy+h/2,-1.03),b=renderer.project(x,wy-h/2,-1.03);
      placeBoard(julienBoard,c,l,r,t,b,250,112);
      place(julienPlaque,renderer.project(7.75,wy+.02,-1.0));
    }else{
      kevinBoard.hidden=true;julienBoard.hidden=true;julienPlaque.hidden=true;kevinPlaque.hidden=true;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
