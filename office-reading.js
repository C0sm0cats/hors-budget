'use strict';
// Inspect the actual scene texture without changing its depth or covering nearby signs.
(()=>{
  const button=document.createElement('button');
  button.className='tool';button.textContent='Tableau';button.hidden=true;
  button.setAttribute('aria-label','Lire le tableau du bureau');
  document.querySelector('.hud-tools').append(button);
  const dialog=document.createElement('dialog');dialog.className='office-reading';
  const title=document.createElement('h2'),picture=document.createElement('img'),close=document.createElement('button');
  title.id='office-reading-title';dialog.setAttribute('aria-labelledby',title.id);
  close.className='primary';close.textContent='REPRENDRE';
  const choose=document.createElement('select');choose.setAttribute('aria-label','Choisir un bureau');
  dialog.append(title,choose,picture,close);document.body.append(dialog);
  let readingState=null;
  const discovered=new WeakSet();
  const boards=()=> (globalThis.OfficeBoards||[]).filter(b=>b.level===Arcade.state.level);
  function show(data){
    title.textContent='Bureau de '+data.name;
    picture.alt='Tableau du bureau de '+data.name;
    picture.src=data.canvas.toDataURL();
    const s=Arcade.state;
    if(data.level===0&&data.name==='CHACHA'&&!discovered.has(s)){
      discovered.add(s);
      s.comedy.line='Au Power UP Tour… Bien sûr. Il faut passer par la direction pour la rejoindre.';
      s.comedy.lineTime=6;s.comedy.cooldown=8;
    }
  }
  function open(data){
    const available=boards();
    if(!available.length||Arcade.state.phase!=='playing')return;
    if(!available.includes(data))data=available.reduce((best,b)=>Math.abs(b.floor-Arcade.state.player.floor)<Math.abs(best.floor-Arcade.state.player.floor)?b:best);
    readingState=Arcade.state;Arcade.pause();
    choose.replaceChildren();available.forEach((b,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=b.name;choose.append(option);});
    choose.hidden=available.length<2;choose.value=String(available.indexOf(data));
    show(data);dialog.showModal();close.focus();
  }
  choose.addEventListener('change',()=>{const data=boards()[Number(choose.value)];if(data)show(data);});
  button.addEventListener('click',open);close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{
    if(Arcade.state===readingState&&readingState.phase==='paused')Arcade.pause();
    readingState=null;document.getElementById('world').focus();
  });
  document.addEventListener('keydown',e=>{
    if(!dialog.open)return;
    e.stopImmediatePropagation();
    if(e.key==='Escape'){e.preventDefault();dialog.close();}
  },true);
  document.getElementById('world').addEventListener('click',e=>{
    if(Arcade.state.phase!=='playing')return;
    const player=Arcade.state.player;
    const cues=boards().filter(b=>b.floor===player.floor&&Math.abs(player.x-b.x)<3).map(b=>({
      board:b,point:renderer.project(b.x+b.w/2+.16,b.y,b.z+.1)
    })).filter(({point:p})=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=innerWidth&&p.y>=0&&p.y<=innerHeight);
    // A 48 CSS-pixel target around the visible cue also accommodates touch input.
    const hit=cues.filter(({point:p})=>Math.abs(e.clientX-p.x)<=24&&Math.abs(e.clientY-p.y)<=24)
      .sort((a,b)=>Math.hypot(e.clientX-a.point.x,e.clientY-a.point.y)-Math.hypot(e.clientX-b.point.x,e.clientY-b.point.y))[0];
    if(hit){open(hit.board);return;}
    for(const b of boards()){
      const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([dx,dy])=>renderer.project(b.x+dx*b.w/2,b.y+dy*b.h/2,b.z));
      if(e.clientX>=Math.min(...corners.map(p=>p.x))&&e.clientX<=Math.max(...corners.map(p=>p.x))&&e.clientY>=Math.min(...corners.map(p=>p.y))&&e.clientY<=Math.max(...corners.map(p=>p.y))){open(b);break;}
    }
  });
  function sync(){
    button.hidden=Arcade.state.phase!=='playing'||!boards().length;
    button.textContent=boards().length>1?'Tableaux':'Tableau';
    if(dialog.open&&Arcade.state!==readingState)dialog.close();
    requestAnimationFrame(sync);
  }
  requestAnimationFrame(sync);
})();
