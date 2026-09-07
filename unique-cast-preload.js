'use strict';
(()=>{
  // game-loader.js synchronously fetches game.js before evaluating it. Intercept that one
  // request so the engine knows four additional cast entries used only on the seminar level.
  // The native XMLHttpRequest constructor is restored immediately afterwards.
  const NativeXHR=window.XMLHttpRequest;
  const marker='const LEVELS=';
  const extraCast=[
    "CAST.sarah={name:'Sarah',shirt:'#6a4e72',hair:'#2f2420',skin:'#d9a17c',female:true,style:'long',internal:true,category:'business',pants:'#3f3444',shoes:'#211b24',blouse:'#f4ecea'};",
    "CAST.mehdi={name:'Mehdi',shirt:'#415c6b',hair:'#171412',skin:'#a66e4a',beard:true,style:'short',internal:true,category:'business',pants:'#293b45',shoes:'#171f24',blouse:'#e9eef0',tie:'#8b6b55'};",
    "CAST.elodie={name:'Élodie',shirt:'#7a5d52',hair:'#b06a3c',skin:'#efc29f',female:true,style:'bun',internal:true,category:'business',pants:'#4d413d',shoes:'#2c2421',blouse:'#f6efe7'};",
    "CAST.antoine={name:'Antoine',shirt:'#4d627b',hair:'#5a4638',skin:'#d3a27c',style:'short',internal:true,category:'business',pants:'#344252',shoes:'#1d252d',blouse:'#eef0e8',tie:'#77624b'};"
  ].join('\n')+'\n';

  class CastXHR{
    constructor(){this._xhr=new NativeXHR();this._url='';this._patched=null;}
    open(method,url,...rest){this._url=String(url||'');return this._xhr.open(method,url,...rest);}
    send(body){
      const result=this._xhr.send(body);
      if(/(?:^|\/)game\.js(?:\?|$)/.test(this._url)){
        try{
          const source=this._xhr.responseText;
          if(!source.includes(marker))throw new Error('Point insertion CAST introuvable');
          this._patched=source.replace(marker,extraCast+marker);
        }finally{
          window.XMLHttpRequest=NativeXHR;
        }
      }
      return result;
    }
    abort(){return this._xhr.abort();}
    setRequestHeader(...args){return this._xhr.setRequestHeader(...args);}
    getResponseHeader(...args){return this._xhr.getResponseHeader(...args);}
    getAllResponseHeaders(){return this._xhr.getAllResponseHeaders();}
    get status(){return this._xhr.status;}
    get statusText(){return this._xhr.statusText;}
    get readyState(){return this._xhr.readyState;}
    get responseText(){return this._patched??this._xhr.responseText;}
    get response(){return this._patched??this._xhr.response;}
  }

  window.XMLHttpRequest=CastXHR;
})();
