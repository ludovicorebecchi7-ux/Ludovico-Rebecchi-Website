/* Local-only observation: no playback commands, retries or remote logging. */
(() => {
  'use strict';
  const started = performance.now();
  const log = [];
  const controllers = [];
  const activation = () => ({active:navigator.userActivation?.isActive,everActive:navigator.userActivation?.hasBeenActive});
  function record(type, detail = {}) {
    log.push({ms:Math.round(performance.now()-started),type,...detail});
    if(log.length>1800)log.shift();
  }
  function state(controller) {
    const iframe = controller.iframeElement;
    const rect = iframe?.getBoundingClientRect();
    return {loading:controller.loading,queued:controller._commandQ?.length,src:iframe?.src,
      visible:rect?{x:Math.round(rect.x),y:Math.round(rect.y),w:Math.round(rect.width),h:Math.round(rect.height)}:null,
      ...activation()};
  }
  function observe(controller, key) {
    controllers.push({controller,key});
    for(const method of ['loadEntity','loadUri','play','pause','resume','togglePlay']) {
      const original = controller[method];
      if(typeof original!=='function')continue;
      controller[method] = function(...args) {
        record('command',{key,method,args,...state(controller)});
        try {
          const result = Reflect.apply(original,this,args);
          record('command-return',{key,method,returnsPromise:!!result?.then,...state(controller)});
          return result;
        } catch(error) {record('command-error',{key,method,message:String(error)});throw error;}
      };
    }
    for(const event of ['ready','playback_started','playback_update','error']) {
      controller.addListener(event, value => record('sdk-event',{key,event,data:value?.data,...state(controller)}));
    }
    controller.iframeElement?.addEventListener('load',()=>record('iframe-load',{key,...state(controller)}));
  }
  let readyCallback;
  Object.defineProperty(window,'onSpotifyIframeApiReady',{
    configurable:true,
    get(){return readyCallback;},
    set(callback){
      readyCallback=function(api){
        record('api-ready');
        const original=api.createController;
        api.createController=function(target,options,callbackOrHandlers){
          const key=target.id;
          if(typeof callbackOrHandlers!=='function')return Reflect.apply(original,this,arguments);
          return Reflect.apply(original,this,[target,options,controller=>{
            observe(controller,key);
            record('controller-created',{key,uri:options?.uri,...state(controller)});
            return callbackOrHandlers(controller);
          }]);
        };
        return callback(api);
      };
    }
  });
  for(const event of ['spotify-carousel-track-preview','spotify-carousel-track-select']) {
    window.addEventListener(event,e=>record(event,{playlist:e.detail?.playlistKey,id:e.detail?.id,...activation()}));
  }
  for(const event of ['pointerdown','pointerup','click']) {
    document.addEventListener(event,e=>{
      if(!e.target.closest?.('.listen-room'))return;
      record(event,{target:e.target.tagName,pointerType:e.pointerType,trusted:e.isTrusted,...activation()});
    },true);
  }
  window.addEventListener('message',e=>{
    const entry=controllers.find(({controller})=>e.source===controller.iframeElement?.contentWindow);
    if(!entry || !/^https:\/\/([a-z0-9-]+\.)*spotify\.com$/.test(e.origin))return;
    if(['ready','playback_started','playback_update','error'].includes(e.data?.type))
      record('iframe-message',{key:entry.key,event:e.data.type,payload:e.data.payload});
  });
  record('environment',{page:location.pathname,userAgent:navigator.userAgent,width:innerWidth,height:innerHeight,dpr:devicePixelRatio});
  document.addEventListener('visibilitychange',()=>record('visibility',{value:document.visibilityState}));
  document.addEventListener('DOMContentLoaded',()=>{
    record('app-version',{script:document.querySelector('script[src*="player-candidate"]')?.src||document.querySelector('script[src*="app.bundle"]')?.src});
    const button=document.createElement('button');
    button.textContent='Log Spotify';
    button.style.cssText='position:fixed;left:8px;top:8px;z-index:2147483646;padding:7px 9px;border:1px solid #888;background:#111;color:#fff;font:12px sans-serif;';
    button.addEventListener('click',()=>{
      const panel=document.createElement('div');
      panel.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#111;color:#fff;padding:20px;overflow:auto;font:14px sans-serif;';
      const text=document.createElement('textarea');
      text.value=JSON.stringify(log,null,2);
      text.readOnly=true;
      text.style.cssText='display:block;width:100%;height:75vh;box-sizing:border-box;margin:16px 0;background:#222;color:#fff;font:11px monospace;';
      const copy=document.createElement('button');copy.textContent='Copia log';
      copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text.value);copy.textContent='Copiato';}catch{text.focus();text.select();copy.textContent='Selezionato: copia il testo';}});
      const close=document.createElement('button');close.textContent='Chiudi';close.style.marginLeft='16px';close.addEventListener('click',()=>panel.remove());
      const label=document.createElement('p');label.textContent='Dopo aver riprodotto il problema, copia questo log. Rimane sul dispositivo: nessun invio automatico.';
      panel.append(label,copy,close,text);document.body.append(panel);
    });
    document.body.append(button);
  });
})();
