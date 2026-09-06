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
  dialog.append(title,picture,close);document.body.append(dialog);
  let readingState=null;
  const board=()=>globalThis.OfficeBoard?.level===Arcade.state.level?globalThis.OfficeBoard:null;
  function open(){
    const data=board();if(!data||Arcade.state.phase!=='playing')return;
    readingState=Arcade.state;Arcade.pause();
    title.textContent='Bureau de '+(data.level===0?'Kévin':'Julien');
    picture.alt=data.level===0?'Conseils de congés signés Kévin':'Graphiques intercontrat, marge et salaires signés Julien';
    picture.src=data.canvas.toDataURL();dialog.showModal();close.focus();
  }
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
    const b=board();if(!b||Arcade.state.phase!=='playing')return;
    const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([dx,dy])=>renderer.project(b.x+dx*b.w/2,b.y+dy*b.h/2,b.z));
    if(e.clientX>=Math.min(...corners.map(p=>p.x))&&e.clientX<=Math.max(...corners.map(p=>p.x))&&e.clientY>=Math.min(...corners.map(p=>p.y))&&e.clientY<=Math.max(...corners.map(p=>p.y)))open();
  });
  function sync(){
    button.hidden=Arcade.state.phase!=='playing'||!board();
    if(dialog.open&&Arcade.state!==readingState)dialog.close();
    requestAnimationFrame(sync);
  }
  requestAnimationFrame(sync);
})();
