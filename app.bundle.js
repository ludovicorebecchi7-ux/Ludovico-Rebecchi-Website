/* Safari-safe classic bundle. Generated from sequence.js, content.js and app.js. */
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
function smooth(a,b,x){const t=clamp((x-a)/(b-a));return t*t*(3-2*t);}
const pageEase=t=>t*t*t*(t*(t*6-15)+10);
function sceneState(progress,reduced=false){
  const p=clamp(progress,0,4);
  const mixAB=smooth(.39,.64,p);
  const mixBC=smooth(1.39,1.64,p);
  const mixCD=smooth(2.39,2.64,p);
  const mixDE=smooth(3.39,3.64,p);
  const blurPulse=[0,1,2,3].reduce((sum,i)=>sum+smooth(i+.22,i+.47,p)*(1-smooth(i+.55,i+.79,p)),0);
  const nameOut=1-smooth(.09,.27,p);
  const notesIn=smooth(.73,.96,p)*(1-smooth(1.08,1.26,p));
  const foldPhase=p<1?smooth(0,1,p):smooth(1,2,p);
  const foldX=p<1?49.65+(50.65-49.65)*foldPhase:50.65+(49.2-50.65)*foldPhase;
  const foldSpread=p<1?23+(29-23)*foldPhase:29+(20-29)*foldPhase;
  const foldSkew=p<1?-.16+.28*foldPhase:.12-.34*foldPhase;
  return {
    mix:mixAB,
    mixAB,mixBC,mixCD,mixDE,
    opacityA:1-mixAB,
    opacityB:mixAB*(1-mixBC),
    opacityC:mixBC*(1-mixCD),
    opacityD:mixCD*(1-mixDE),
    opacityE:mixDE,
    blur:reduced?0:blurPulse*19,
    scaleA:reduced?1:1.04+.15*smooth(0,.60,p),
    scaleB:reduced?1:1.025+.045*smooth(.38,1,p),
    scaleC:reduced?1:1.035+.045*smooth(1.38,2,p),
    scaleD:reduced?1:1.025+.045*smooth(2.38,3,p),
    scaleE:reduced?1:1.025+.045*smooth(3.38,4,p),
    driftA:reduced?0:-1.3*smooth(0,.7,p),
    driftB:reduced?0:1.5*(1-smooth(.45,1.8,p)),
    driftC:reduced?0:1.2*(1-smooth(1.45,2,p)),
    driftD:reduced?0:1.2*(1-smooth(2.45,3,p)),
    driftE:reduced?0:1.2*(1-smooth(3.45,4,p)),
    nameOpacity:nameOut,
    nameBlur:reduced?0:(1-nameOut)*7,
    nameOffset:reduced?0:-18*smooth(0,.3,p),
    notesOpacity:notesIn,
    thirdNotesOpacity:smooth(1.68,1.93,p)*(1-smooth(2.08,2.26,p)),
    creditsOpacity:smooth(2.68,2.93,p)*(1-smooth(3.08,3.26,p)),
    closingOpacity:smooth(3.70,3.96,p),
    foldX,foldSpread,foldSkew,
    notesBlur:reduced?0:(1-smooth(.68,.96,p))*5,
    hintOpacity:1-smooth(0,.085,p)
  };
}
// A gesture chooses an endpoint; its distance never controls transition length.
class ScenePager {
  constructor(duration=1500,pages=2){
    this.duration=duration;this.pages=pages;this.page=0;this.target=0;this.from=0;
    this.started=0;this.active=false;this.progress=0;
  }
  sample(now){
    if(!this.active)return this.progress;
    const t=this.duration===0?1:clamp((now-this.started)/this.duration);
    this.progress=this.from+(this.target-this.from)*pageEase(t);
    if(t===1){this.page=this.target;this.progress=this.target;this.active=false;}
    return this.progress;
  }
  go(next,now){
    this.sample(now);
    if(this.active)return false;
    next=clamp(next,0,this.pages-1);
    if(next===this.page)return false;
    this.from=this.page;this.target=next;this.started=now;this.active=true;
    return true;
  }
  step(direction,now){return this.go(this.page+Math.sign(direction),now);}
}
// Continuous red print curve. Every source tone remains distinct; no threshold
// bands or flat intervals that erase photographic modelling and fine texture.
const palette=[[34,4,14],[82,6,23],[148,12,35],[204,37,48],[235,102,68]];
function printColor(luminance){
  const l=clamp(luminance);
  const u=1-l;
  const weights=[u**4,4*u**3*l,6*u*u*l*l,4*u*l**3,l**4];
  return [0,1,2].map(channel=>palette.reduce((sum,color,i)=>sum+color[channel]*weights[i],0));
}
// Match the surrounding spreads with clear red midtones, restrained shadow
// blue and a little amber in the highlights. Preserve continuous modelling.
function roomPrintColor(luminance){
  const l=clamp(luminance),u=1-l;
  const tones=[[27,7,10],[89,10,18],[177,27,30],[217,61,44],[236,136,88]];
  const weights=[u**4,4*u**3*l,6*u*u*l*l,4*u*l**3,l**4];
  return [0,1,2].map(c=>tones.reduce((sum,t,i)=>sum+t[c]*weights[i],0));
}
// Preserve the previously approved print treatment for the opening two scenes.
function originalPrintColor(luminance){
  const l=clamp(luminance);
  const levels=[smooth(.12,.27,l),smooth(.30,.47,l),smooth(.55,.71,l),smooth(.81,.97,l)];
  return [0,1,2].map(channel=>{
    let value=palette[0][channel];
    levels.forEach((t,i)=>value+=(palette[i+1][channel]-palette[i][channel])*t);
    return value;
  });
}

// Local editorial draft. Add only verified playlist URLs, credits and contact.
const content={
  playlists:{
    produzioni:{description:'Dalle prime idee alla forma di un brano.',url:null},
    mix:{description:'Ogni elemento al suo posto. La stessa emozione, più vicina.',url:null}
  },
  credits:{
    producedUrl:'https://open.spotify.com/playlist/3JOXfMWSclsNA9mn9IRZWc',
    mixedUrl:'https://open.spotify.com/playlist/0G2Q2mCSgjcvSFwIdfVSZI'
  },
  socials:{
    instagramUrl:'https://www.instagram.com/ludovico_rebecchi/',
    tiktokUrl:'https://www.tiktok.com/@ludovicorebecchi?is_from_webapp=1&sender_device=pc',
    musicPlaylistUrl:'https://open.spotify.com/playlist/0fgWDzV1cAL7dUNOg1ffSN'
  },
  projects:[], // {title, credit, url}
  contactEmail:'ludovicorebecchi7@gmail.com'
};

// Track metadata is taken from the three public Spotify playlists. The site
// renders the rows itself; Spotify remains the playback source.
const spotifyCollections={
  artist:{
    playlistId:'0fgWDzV1cAL7dUNOg1ffSN',
    listId:'artist-profile-tracklist',metaId:'artist-profile-list-meta',playerId:'artist-profile-player',cardId:'artist-profile-card',
    tracks:[
      ['2QYgQz0jUjftF6S7uHjPs6','About Me |feat. Sigmund B. & Allan','Ludovico Rebecchi','2:16'],
      ['6Zw8KLL3zB7449JFwTzuLN',"A Feeling I Don't Wanna Name | feat.Sigmund B",'Ludovico Rebecchi','2:08']
    ]
  },
  produced:{
    playlistId:'3JOXfMWSclsNA9mn9IRZWc',
    listId:'credits-produced-tracklist',metaId:'credits-produced-list-meta',playerId:'credits-produced-player',cardId:'credits-produced-card',
    tracks:[
      ['55MIJgkQ475oMSTBA7wrxo','intro','VIOLABACIATUTTI','1:31'],
      ['1xdLfbIPQnpuntv9SxYm33','Non me ne frega niente (Per Mario)','VIOLABACIATUTTI','3:20'],
      ['3UmbuASxvUQRjYbPZfjpXy','Parole che dici a tutti (per Alessandro)','VIOLABACIATUTTI','3:30'],
      ['4VvGr5PKTaqeSsZRmhSMEg','Mi riparerò (per Asia)','VIOLABACIATUTTI','3:39'],
      ['5lhm6U2Nw6ic3qQplqE9pt','Tu continua a parlarmi (per Leonardo)','VIOLABACIATUTTI','4:01'],
      ['5YBgWnnURUvwfQXQfsJmOg','Outro','VIOLABACIATUTTI','1:07'],
      ['3rFm0tDE3XxL2CJBKUONqK','cimiteri','VIOLABACIATUTTI','2:59'],
      ['5xI0USRRvtEXcvTjjhekYz','Cucirmi le mani','VIOLABACIATUTTI','2:37'],
      ['3fXiiUq1YOb3aFQauVOvtJ','Something To Feel Alive','Alexander Mills','3:33'],
      ['4bPELDWJ0h4U6kAt8ZzQai','My Best Years','Alexander Mills','3:15'],
      ['4UAPF0VqtHYvLmgPzH7OmK','Save You','Alexander Mills','3:05'],
      ['3dZFzolHK5yGj4S34cBDMn','Midas Touch','Alexander Mills','2:34'],
      ['6bcOlPmZa1Tldg1unx4Nu2','Taking Turns','Sven Falk','3:28'],
      ['04PXzj0KtAFL1345tXOQvn','Few More Minutes','Sven Falk','3:31'],
      ['13XK1nYPylUfYF0FtxCvVB','Rain','Zoe Tedeschi','3:03'],
      ['4Bk6NlU4xWjIXh37Q1u52T','Wait For Me','Alexander Mills','3:33'],
      ['36AqWnXO9RIrUwLOq8aWrB','Good Man','Alexander Mills','3:12'],
      ['283ibnUBhd2rzpDI03V3kE','Bloom','Sven Falk','2:57'],
      ['5TAFZJZ43XsPqm4v6oRl1u','One Thing','Sven Falk','2:33'],
      ['2yMwaruAn2RZA8Dp00Ypit','Brand New Light','Alexander Mills','3:35']
    ]
  },
  mixed:{
    playlistId:'0G2Q2mCSgjcvSFwIdfVSZI',
    listId:'credits-mixed-tracklist',metaId:'credits-mixed-list-meta',playerId:'credits-mixed-player',cardId:'credits-mixed-card',
    tracks:[
      ['5kNoBBQ28ZhhIT9wpYgtBS','Cosa te ne fai','Willie Peyote','3:20'],
      ['1rD1pFLiFgcEwt76EPi0o5','Sulla riva del fiume','Willie Peyote','3:15'],
      ['59nMy9QpdjBsGjttOJDJPr','Narciso','Willie Peyote','3:06'],
      ['3kewvwxC01BZmJ2QytkoJG','Piani','Willie Peyote','3:48'],
      ['2NOePskW50JG528GcOOry1','Giorgia nel Paese che si meraviglia','Willie Peyote','2:48'],
      ['2fn2KT47Tt9kaPeHvQvUHQ','Buon auspicio','Willie Peyote','3:27'],
      ['0QQgM0bkR3myEAEE7QNOaS','The Brown Eyed Driver','Flora Rose','4:39'],
      ['4OPmy7VHedY9FsPPteHcXU','Sauna','Flora Rose','3:38'],
      ['43vL1IuaOErpT8U5uCNCnR','Tea Bags','Flora Rose','2:55'],
      ['4vVcHuQ7jm21iTn8aNlg88','Falling Through The Drops Of Time','Flora Rose','3:10'],
      ['5BHe2oEfAlaiq3p9EkVNA5','Every Hour Is After Midnight','Flora Rose','4:15'],
      ['3PAIlRek6OlwiU7n4y6TBo','Fontana','Gio Evan','3:18'],
      ['1lskGR29Af9a5nq7rIFxuq','Gioco del contrario','Adriano Moretti','3:06'],
      ['4vIeOBb4MJNFtxqnTVLhzc','Spina dorsale (feat. Giorgio Moretti)','Adriano Moretti, Giorgio Moretti','2:43'],
      ['49M07aEb3qLwyOHD60oOJb','Vuoi farmi del male?','Adriano Moretti','3:23'],
      ['4zCzKkVQUFnAF3qNzCNqZq','Corridoi','Adriano Moretti','2:58'],
      ['1r3q19RAfk1Ee4Wo5iyBWB','Femme fatale','Adriano Moretti','3:12'],
      ['5h5lhPajwgxvHaxxI4b0Dh',"All'alba",'Adriano Moretti','2:01'],
      ['737yWQNyR1kBu5oVPiwpvS','La stella di noi due','Adriano Moretti','2:57'],
      ['2cPdAKMHBi8zj6UsKcBEhj','Down under','Alessio Nelli','4:15'],
      ['1QaJcIHGqTh3Ml08quS3fA','Berceuse pour Thelma','Alessio Nelli','1:50'],
      ['28VUAQmzAW9pnayp6peiYn','Morning birds','Alessio Nelli','3:38'],
      ['0zyv2BtFwmIg4HGLhxcu6u','Under the leaves','Alessio Nelli','5:18'],
      ['3PlRBMovssqfRBlzAlhtqv','FALLO CON ME','Luca Re','2:26'],
      ['0orRAn062uWoXijZZhsrac','vita','Luca Re','2:19'],
      ['0VmdKZCuVJ8LVQBwKrgfuQ','TRA LA GENTE','Luca Re','3:21'],
      ['29uE9cGEKvPST1mgNeEfDv','BASTA','Luca Re','2:39'],
      ['6YgkpEt3Md54yMx79Zajo5','cose che non capisco','Luca Re, Chryverde','2:41'],
      ['5b2aM29MJD6sS13yHKrQcg','BLU','Luca Re, Chryverde','2:41'],
      ['36AqWnXO9RIrUwLOq8aWrB','Good Man','Alexander Mills','3:12'],
      ['4Bk6NlU4xWjIXh37Q1u52T','Wait For Me','Alexander Mills','3:33'],
      ['11bnJbmTAgIdBblOUChD17','caos','Luca Re','2:35'],
      ['31FieNBJupbKsWKW76SM9t','ancora','Luca Re','2:45'],
      ['5OkNpAGC1pTGWxbwqWxrwM','stavo per perdermi','Luca Re','3:49'],
      ['0ZrhjwZSivh2jPtTwLRHET','UMORE','Luca Re','3:16'],
      ['7F9wHMg29A3gBwoqgRsGtb','DOMENICA','Luca Re','3:01'],
      ['4C3iohBPgxbBDeb9ACSB3M','SPECCHIO','Luca Re','2:36'],
      ['4DLyxfp4C1kIMTWW0YgaW1','7 7mbre (intro)','Luca Re','2:09']
    ]
  }
};

const field=document.getElementById('photographic-field');
const canvasA=document.getElementById('photograph-a');
const canvasB=document.getElementById('photograph-b');
const canvasC=document.getElementById('photograph-c');
const canvasD=document.getElementById('photograph-d');
const canvasE=document.getElementById('photograph-e');
const identity=document.getElementById('identity');
const invitation=document.getElementById('invitation');
const paper=document.getElementById('paper');
const paperLayer=paper.parentElement??paper;
const notes=document.getElementById('editorial-notes');
const thirdNotes=document.getElementById('third-notes');
const creditsNotes=document.getElementById('credits-notes');
const closingNotes=document.getElementById('closing-notes');
const previousPage=document.getElementById('previous-page');
const nextPage=document.getElementById('next-page');
const announcement=document.getElementById('scene-announcement');
const fold=document.getElementById('book-fold');
const coverMeta=document.getElementById('cover-meta');
const soundToggle=document.getElementById('sound-toggle');
const soundDock=document.getElementById('sound-dock');
const soundState=document.getElementById('sound-state');
const audioLoop=document.getElementById('site-audio-loop');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pager=new ScenePager(reduced.matches?0:1500,5);
let ready=false,resizeTimer;
let compactPhotoLayout=matchMedia('(max-width: 699px)').matches;
const sources=[
  {src:'assets/hero-studio-guitar-red-'+(compactPhotoLayout?'mobile':'desktop')+'-v9.png',coverArtwork:true,focusY:.5,baked:true,nativeResolution:true},
  {src:'assets/reference-print-page2-desktop-v2.webp',coverArtwork:true,focusX:.34,focusY:.78,scannerEndY:.43,baked:true,nativeResolution:true},
  {src:'assets/reference-print-page3-'+(compactPhotoLayout?'mobile':'desktop')+'-v2.webp',coverArtwork:true,focusY:.65,notesRatio:4/3,baked:true,nativeResolution:true},
  {src:'assets/reference-print-page4-'+(compactPhotoLayout?'mobile':'desktop')+'-v2.webp',coverArtwork:true,focusY:.65,notesRatio:4/3,baked:true,nativeResolution:true},
  {src:'assets/reference-print-page5-'+(compactPhotoLayout?'mobile':'desktop')+'-v1.webp',coverArtwork:true,focusY:.55,baked:true,nativeResolution:true}
];
function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});}
function newCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function prepare(image,spec,targetCanvas){
  targetCanvas.style.filter='none';
  targetCanvas.style.webkitFilter='none';
  const w=spec.nativeResolution
    ?Math.min(image.width,3840,Math.max(800,Math.round(innerWidth*Math.min(devicePixelRatio||1,2)*1.12)))
    :Math.min(1400,Math.max(800,Math.round(innerWidth)));
  const h=Math.round(w*innerHeight/innerWidth);
  targetCanvas.width=w;targetCanvas.height=h;
  if(spec.blank)return;
  const raw=newCanvas(w,h),ctx=raw.getContext('2d');
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  let artworkBounds;
  let [sx,sy,sw,sh]=(innerWidth<700?spec.mobileCrop:null)??spec.crop??[0,0,1,1];
  if(spec.coverArtwork){
    // Fill every viewport by cropping the photograph proportionally. Never
    // stretch edge pixels: the scanner treatment remains only where it was
    // baked into the top of pages 2 and 4.
    const scale=Math.max(w/image.width,h/image.height);
    const dw=image.width*scale,dh=image.height*scale;
    const left=(w-dw)*(spec.focusX??.5),top=(h-dh)*(spec.focusY??.5);
    artworkBounds={left,top,width:dw,height:dh};
    ctx.drawImage(image,left,top,dw,dh);
  }else if(spec.fixedArtwork){
    // Contain the entire photograph: resizing never crops or stretches a face.
    const frameW=Math.min(w,h*spec.artworkRatio),frameH=frameW/spec.artworkRatio;
    const scale=Math.min(frameW/image.width,frameH/image.height);
    const dw=image.width*scale,dh=image.height*scale,left=(w-dw)/2,top=spec.bottomAnchored?h-dh:(h-dh)/2;
    artworkBounds={left,top,width:dw,height:dh};
    const edge=Math.max(1,Math.round(image.width*.004));
    if(left>0){
      ctx.drawImage(image,0,0,edge,image.height,0,top,left+1,dh);
      ctx.drawImage(image,image.width-edge,0,edge,image.height,left+dw-1,top,w-left-dw+1,dh);
    }
    if(top>0){
      ctx.drawImage(image,0,0,image.width,edge,0,0,w,top+1);
      ctx.drawImage(image,0,image.height-edge,image.width,edge,0,top+dh-1,w,h-top-dh+1);
    }
    ctx.drawImage(image,left,top,dw,dh);
  }else if(spec.referenceSpread){
    // One immutable editorial composition, fitted without changing subject
    // proportions. Extra viewport space continues the outer photographic edges.
    const ratio=1.176,frameW=Math.min(w,h*ratio),frameH=frameW/ratio;
    const left=(w-frameW)/2,top=(h-frameH)/2;
    const spread=newCanvas(Math.round(frameW),Math.round(frameH));
    const sc=spread.getContext('2d'),sw=spread.width,sh=spread.height;
    const photoH=sw*image.height/image.width,photoTop=sh*.284;
    sc.drawImage(image,0,0,image.width,Math.max(1,image.height*.008),0,0,sw,photoTop+1);
    sc.drawImage(image,0,image.height-2,image.width,2,0,photoTop+photoH-1,sw,Math.max(1,sh-photoTop-photoH+1));
    sc.drawImage(image,0,photoTop,sw,photoH);
    if(left>0){
      ctx.drawImage(spread,0,0,2,sh,0,top,left+1,frameH);
      ctx.drawImage(spread,sw-2,0,2,sh,left+frameW-1,top,left+1,frameH);
    }
    if(top>0){
      ctx.drawImage(spread,0,0,sw,2,0,0,w,top+1);
      ctx.drawImage(spread,0,sh-2,sw,2,0,top+frameH-1,w,top+1);
    }
    ctx.drawImage(spread,left,top,frameW,frameH);
  }else if(spec.keepSpread&&w/h<image.width/image.height){
    // Preserve both halves of the wide scene on taller viewports. Continue the
    // existing wall/floor edges instead of cropping the person across the fold.
    const dh=w*image.height/image.width,top=(h-dh)*.84;
    const edge=Math.max(1,Math.round(image.height*.008));
    ctx.drawImage(image,0,0,image.width,edge,0,0,w,top+1);
    ctx.drawImage(image,0,image.height-edge,image.width,edge,0,top+dh-1,w,h-top-dh+1);
    ctx.drawImage(image,0,top,w,dh);
  }else if(spec.fit==='contain'){
    const maxW=w*.90,maxH=h*.84,scale=Math.min(maxW/image.width,maxH/image.height);
    const dw=image.width*scale,dh=image.height*scale;
    const top=(h-dh)/2;
    // Continue the photograph itself into the upper margin instead of painting
    // a separate band: stretch a thin slice of its pale top edge.
    ctx.drawImage(image,0,0,image.width,Math.max(1,image.height*.06),0,0,w,Math.max(0,top+8));
    ctx.fillStyle='#0a123f';ctx.fillRect(0,Math.max(0,top+8),w,h-Math.max(0,top+8));
    ctx.drawImage(image,(w-dw)/2,(h-dh)/2,dw,dh);
  }else{
    sx*=image.width;sy*=image.height;sw*=image.width;sh*=image.height;
    const ratio=w/h;
    if(sw/sh>ratio){const nw=sh*ratio;sx+=(sw-nw)*spec.focus[0];sw=nw;}
    else{const nh=sw/ratio;sy+=(sh-nh)*spec.focus[1];sh=nh;}
    ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h);
  }
  if(spec.baked){
    targetCanvas.getContext('2d').drawImage(raw,0,0);
    return;
  }
  // Keep optical softness separate from the continuous print-color treatment.
  const blurred=newCanvas(w,h),bc=blurred.getContext('2d',{willReadFrequently:true});
  const softWidth=spec.referenceSpread?Math.min(w,h*1.176):spec.fixedArtwork?Math.min(w,h*spec.artworkRatio):w;
  const radius=spec.nativeResolution&&spec.blur===0?0:Math.max(1,Math.round(softWidth*(spec.blur??.0045)));
  bc.filter=radius?'blur('+radius+'px)':'none';
  if(spec.referenceSpread||spec.fixedArtwork){
    bc.drawImage(raw,0,0);
  }else bc.drawImage(raw,-radius*3,-radius*3,w+radius*6,h+radius*6);
  bc.filter='none';
  const pixels=bc.getImageData(0,0,w,h),data=pixels.data;
  if(spec.preserveColor){
    // The new editorial portrait already carries its own photographic grade.
    // Preserve skin/cloth differences instead of applying the red curve twice.
    let grainSeed=4317;
    for(let i=0;i<data.length;i+=4){
      grainSeed^=grainSeed<<13;grainSeed^=grainSeed>>>17;grainSeed^=grainSeed<<5;
      const grain=((grainSeed>>>0)%256/255-.5)*5;
      for(let c=0;c<3;c++)data[i+c]+=grain;
      data[i+3]=255;
    }
    targetCanvas.getContext('2d').putImageData(pixels,0,0);
    return;
  }
  if(spec.roomGrade){
    // Clouds soften more than the seated figure. Grain is applied afterwards,
    // so softness never blurs the physical texture of the print.
    const atmospheric=newCanvas(w,h),ac=atmospheric.getContext('2d',{willReadFrequently:true});
    ac.filter='blur('+Math.max(2,softWidth*.005).toFixed(2)+'px)';
    ac.drawImage(raw,0,0);
    const soft=ac.getImageData(0,0,w,h).data;
    const frameH=Math.min(w/1.176,h),frameTop=(h-frameH)/2;
    for(let y=0;y<h;y++){
      const v=(y-frameTop)/frameH;
      const amount=.50*smooth(.20,.34,v)*(1-smooth(.62,.76,v));
      for(let x=0;x<w;x++){
        const i=(y*w+x)*4;
        for(let c=0;c<3;c++)data[i+c]+=amount*(soft[i+c]-data[i+c]);
      }
    }
  }
  const lut=Array.from({length:4097},(_,i)=>(spec.roomGrade?roomPrintColor:printColor)(i/4096));
  const originalLut=spec.originalPrint?Array.from({length:256},(_,i)=>originalPrintColor(i/255)):null;
  // Anchor the studio's vignette to the actual monitor in the source photo,
  // so the lit area follows the crop on both narrow and wide windows.
  let spotX,spotY;
  if(spec.spotlight){
    const [cx,cy,rx,ry]=spec.spotlight;
    spotX=Float32Array.from({length:w},(_,x)=>{
      const u=(x+.5+radius*3)/(w+radius*6);
      return Math.exp(-1.5*(((sx+u*sw)/image.width-cx)/rx)**2);
    });
    spotY=Float32Array.from({length:h},(_,y)=>{
      const v=(y+.5+radius*3)/(h+radius*6);
      return Math.exp(-1.5*(((sy+v*sh)/image.height-cy)/ry)**2);
    });
  }
  let protectX,protectY;
  if(spec.backgroundLift&&artworkBounds){
    const b=artworkBounds;
    protectX=Float32Array.from({length:w},(_,x)=>Math.exp(-2*((((x-b.left)/b.width)-.5)/.22)**2));
    protectY=Float32Array.from({length:h},(_,y)=>Math.exp(-2*((((y-b.top)/b.height)-.83)/.27)**2));
  }
  let seed=8301;
  for(let i=0;i<data.length;i+=4){
    if(originalLut){
      if(spec.matte){
        for(let channel=0;channel<3;channel++){
          data[i+channel]=Math.max(0,Math.min(255,(data[i+channel]-128)*(spec.contrast??.58)+(spec.brightness??82)));
        }
      }
      const rgb=originalLut[Math.round(data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722)];
      seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
      const grain=((seed>>>0)%256/255-.5)*(spec.matte?3.8:3.1);
      data[i]=rgb[0]+grain*1.13;data[i+1]=rgb[1]+grain;data[i+2]=rgb[2]+grain*.8;data[i+3]=255;
      continue;
    }
    const light=data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722;
    // Adjust exposure in floating point instead of repeatedly quantizing RGB.
    // The fourth source is already red-lit: its red channel retains the scene's
    // tonal detail without darkening it a second time through RGB luminance.
    const spot=spotX?spotX[(i/4)%w]*spotY[Math.floor(i/4/w)]:1;
    const sourceLight=spec.redExposure?data[i]*.80+light*.20:light;
    const exposureLight=spotX?sourceLight*(.40+.55*spot)+24*spot:sourceLight;
    const backgroundWeight=protectX?1-protectX[(i/4)%w]*protectY[Math.floor(i/4/w)]:0;
    const exposed=(spec.matte?(exposureLight-128)*(spec.contrast??.58)+(spec.brightness??82):exposureLight)+(spec.backgroundLift??0)*backgroundWeight;
    const position=Math.max(0,Math.min(4096,exposed/255*4096));
    const lower=Math.floor(position),upper=Math.min(4096,lower+1),fraction=position-lower;
    seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    const grain=((seed>>>0)%256/255-.5)*(spec.roomGrade?8:spec.matte?3.8:3.1);
    for(let channel=0;channel<3;channel++){
      const tone=lut[lower][channel]+(lut[upper][channel]-lut[lower][channel])*fraction;
      // A trace of source chroma retains natural material/color differences.
      const originalChroma=(data[i+channel]-light)*(spec.sourceChroma??(spec.roomGrade?.20:.12));
      const shadowDepth=spotX?.72+.28*spot:1;
      data[i+channel]=(tone+originalChroma)*shadowDepth+grain*(channel===0?1.13:channel===1?1:.8);
    }
    data[i+3]=255;
  }
  targetCanvas.getContext('2d').putImageData(pixels,0,0);
}
function preparePaper(){
  paper.width=Math.min(1800,innerWidth);paper.height=Math.round(paper.width*innerHeight/innerWidth);
  const ctx=paper.getContext('2d'),pixels=ctx.createImageData(paper.width,paper.height);
  let seed=7811;
  for(let i=0;i<pixels.data.length;i+=4){
    seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    const value=(seed>>>0)%256;
    pixels.data[i]=value;pixels.data[i+1]=value;pixels.data[i+2]=value;pixels.data[i+3]=255;
  }
  ctx.putImageData(pixels,0,0);
}
let requestedFrame=0;
let announcedPage=0;
let entranceStarted=0;
let soundDockSettled=false,soundDockTransitionTimer=0;
const entranceDuration=3300;
function render(now=performance.now()){
  requestedFrame=0;
  const wasTransitioning=pager.active;
  let progress=pager.sample(now);
  if(wasTransitioning&&!pager.active){
    if(queuedScrollDirection){
      const direction=queuedScrollDirection;
      queuedScrollDirection=0;
      if(pager.step(direction,now))progress=pager.sample(now);
    }else{
      // A long trackpad/mouse stream can outlive the page transition. Treat
      // its next movement as a fresh gesture so navigation never gets stuck.
      lastWheel=-Infinity;
      lastDirection=0;
    }
  }
  const s=sceneState(progress,reduced.matches);
  const entrance=entranceStarted?Math.max(0,Math.min(1,(now-entranceStarted)/entranceDuration)):1;
  // The cover follows the same order as the reference entrance: empty black,
  // title first, then the photograph and its physical fold behind it.
  const titleReveal=smooth(.08,.36,entrance);
  const titleMotion=smooth(.12,.62,entrance);
  const imageReveal=smooth(.56,.98,entrance);
  const coverReveal=smooth(.66,1,entrance);
  const inviteReveal=smooth(.78,1,entrance);
  const titleLift=(1-titleMotion)*13;
  const swayPhase=Math.max(0,Math.min(1,entrance/.82));
  const titleSway=Math.sin(swayPhase*Math.PI*1.35)*4.5*smooth(.08,.25,entrance)*(1-smooth(.60,.82,entrance));
  const entranceBlur=(1-imageReveal)*5.5;
  const transitionBlur=s.blur+entranceBlur;
  field.style.filter=transitionBlur>.01?'blur('+transitionBlur.toFixed(2)+'px)':'none';
  field.style.webkitFilter=field.style.filter;
  paperLayer.style.opacity='0';
  canvasA.style.transform='translateY('+s.driftA.toFixed(3)+'%) scale('+s.scaleA.toFixed(4)+')';
  canvasB.style.transform='scale('+(reduced.matches?1:s.scaleB/1.07).toFixed(4)+')';
  canvasC.style.transform='scale('+(reduced.matches?1:s.scaleC/1.08).toFixed(4)+')';
  canvasD.style.transform='scale('+(reduced.matches?1:s.scaleD/1.07).toFixed(4)+')';
  canvasE.style.transform='translateY('+s.driftE.toFixed(3)+'%) scale('+s.scaleE.toFixed(4)+')';
  canvasA.style.opacity=(s.opacityA*imageReveal).toFixed(4);
  canvasB.style.opacity=(s.opacityB*imageReveal).toFixed(4);
  canvasC.style.opacity=(s.opacityC*imageReveal).toFixed(4);
  canvasD.style.opacity=(s.opacityD*imageReveal).toFixed(4);
  canvasE.style.opacity=(s.opacityE*imageReveal).toFixed(4);
  // A slight crimson bias keeps the opening image from reading orange; the
  // closing cloud image gets a small baked-looking softness at display time.
  canvasA.style.filter='none';
  canvasA.style.webkitFilter=canvasA.style.filter;
  canvasE.style.filter='blur(1.2px)';
  canvasE.style.webkitFilter=canvasE.style.filter;
  // The opening name crosses the center, so reveal the paper fold only after it leaves.
  fold.style.opacity=((.38+.62*Math.max(s.mixAB,s.mixBC))*imageReveal).toFixed(4);
  fold.style.setProperty('--fold-x',s.foldX.toFixed(3)+'%');
  fold.style.setProperty('--fold-spread',s.foldSpread.toFixed(2)+'px');
  fold.style.setProperty('--fold-skew',s.foldSkew.toFixed(3)+'deg');
  fold.style.filter='blur('+(s.blur+entranceBlur).toFixed(2)+'px)';
  identity.style.opacity=(s.nameOpacity*titleReveal).toFixed(4);
  identity.style.filter='blur('+(s.nameBlur+(1-titleReveal)*22).toFixed(2)+'px)';
  identity.style.transform='translate(calc(-50% + '+titleSway.toFixed(2)+'px),calc(-50% + '+(s.nameOffset+titleLift).toFixed(2)+'px))';
  identity.setAttribute('aria-hidden',String(s.nameOpacity*titleReveal<.05));
  const coverVisibility=s.nameOpacity*coverReveal;
  coverMeta.style.opacity=coverVisibility.toFixed(4);
  const coverInactive=pager.active||coverVisibility<.5;
  coverMeta.inert=coverInactive;
  coverMeta.toggleAttribute('inert',coverInactive);
  coverMeta.setAttribute('aria-hidden',String(coverVisibility<.5));
  notes.style.opacity=s.notesOpacity.toFixed(4);
  notes.style.filter='blur('+s.notesBlur.toFixed(2)+'px)';
  notes.style.visibility=s.notesOpacity>.001?'visible':'hidden';
  notes.setAttribute('aria-hidden',String(s.notesOpacity<.5));
  thirdNotes.style.opacity=s.thirdNotesOpacity.toFixed(4);
  thirdNotes.style.visibility=s.thirdNotesOpacity>.001?'visible':'hidden';
  thirdNotes.setAttribute('aria-hidden',String(s.thirdNotesOpacity<.5));
  creditsNotes.style.opacity=s.creditsOpacity.toFixed(4);
  creditsNotes.style.visibility=s.creditsOpacity>.001?'visible':'hidden';
  creditsNotes.setAttribute('aria-hidden',String(s.creditsOpacity<.5));
  closingNotes.style.opacity=s.closingOpacity.toFixed(4);
  closingNotes.style.visibility=s.closingOpacity>.001?'visible':'hidden';
  closingNotes.setAttribute('aria-hidden',String(s.closingOpacity<.5));
  for(const [section,opacity] of [[notes,s.notesOpacity],[thirdNotes,s.thirdNotesOpacity],[creditsNotes,s.creditsOpacity],[closingNotes,s.closingOpacity]]){
    const inactive=pager.active||opacity<.5;
    if(inactive&&section.contains(document.activeElement))document.activeElement.blur();
    section.inert=inactive;
    section.toggleAttribute('inert',inactive);
  }
  previousPage.disabled=pager.active||pager.page===0;
  nextPage.disabled=pager.active||pager.page===pager.pages-1;
  invitation.style.opacity=(s.hintOpacity*inviteReveal).toFixed(4);
  invitation.style.visibility=s.hintOpacity*inviteReveal<.01?'hidden':'visible';
  const dockVisibility=smooth(.35,.85,progress)*imageReveal;
  soundDock.style.opacity=(dockVisibility*(soundDockSettled?.38:1)).toFixed(4);
  soundDock.style.pointerEvents=dockVisibility<.5?'none':'auto';
  if(!soundDockSettled&&!pager.active&&pager.page===1){
    soundDockSettled=true;
    soundDock.style.transitionDuration=reduced.matches?'0s':'5s';
    soundDock.style.opacity='.38';
    clearTimeout(soundDockTransitionTimer);
    soundDockTransitionTimer=setTimeout(()=>{soundDock.style.transitionDuration='.25s';},5000);
  }
  if(pager.active||entrance<1)requestedFrame=requestAnimationFrame(render);
  else if(announcedPage!==pager.page){
    announcedPage=pager.page;
    announcement.textContent=['Cover','World building','My world, my mind','Credits','Define how you want your idea to feel'][pager.page];
  }
}
function step(direction){
  if(ready&&pager.step(direction,performance.now())&&!requestedFrame)requestedFrame=requestAnimationFrame(render);
}
let queuedScrollDirection=0;
function requestScrollStep(direction){
  if(!ready)return;
  if(pager.active){queuedScrollDirection=Math.sign(direction);return;}
  step(direction);
}
previousPage.addEventListener('click',()=>step(-1));
nextPage.addEventListener('click',()=>step(1));
let soundEnabled=false;
let loopContext=null,loopBuffer=null,loopSource=null,loopGain=null,loopLoad=null,loopStartOffset=0;
const playingSpotifyCards=new Set();
const pendingSpotifyCards=new Set();
let localArtistAudio=null;
const LoopAudioContext=window.AudioContext??window.webkitAudioContext;
const spotifyOwnsAudio=()=>playingSpotifyCards.size>0||pendingSpotifyCards.size>0||!!(localArtistAudio&&!localArtistAudio.paused);
function updateSoundPresentation(){
  const audible=soundEnabled&&!spotifyOwnsAudio();
  for(const control of [soundToggle,soundDock]){
    control.setAttribute('aria-pressed',String(audible));
    control.setAttribute('aria-label',audible?'sound on':'sound off');
  }
  soundState.textContent=audible?'on':'off';
}
function rampLoopGain(target,duration){
  if(!loopContext||!loopGain)return;
  const now=loopContext.currentTime;
  loopGain.gain.cancelScheduledValues(now);
  loopGain.gain.setValueAtTime(loopGain.gain.value,now);
  loopGain.gain.linearRampToValueAtTime(target,now+duration);
}
function prepareGaplessBuffer(decoded){
  const rate=decoded.sampleRate;
  let start=0,end=decoded.length;
  // This MP3 reports 528 priming and 2509 remainder frames. Some browser
  // decoders keep them, while others trim them automatically.
  if(decoded.duration>34.96){
    start=Math.min(end-1,Math.round(rate*(528/44100)));
    end=Math.max(start+1,end-Math.round(rate*(2509/44100)));
  }
  // Remove any real low-level padding left inside the valid MP3 frames.
  const windowSize=Math.max(64,Math.round(rate*.006));
  const maxScan=Math.round(rate*.45),silenceThreshold=.0032;
  const windowRms=index=>{
    let sum=0,count=0;
    for(let i=index;i<Math.min(end,index+windowSize);i++){
      let sample=0;
      for(let channel=0;channel<decoded.numberOfChannels;channel++)sample=Math.max(sample,Math.abs(decoded.getChannelData(channel)[i]));
      sum+=sample*sample;count++;
    }
    return count?Math.sqrt(sum/count):0;
  };
  const scanStartLimit=Math.min(end-windowSize,start+maxScan);
  while(start<scanStartLimit&&windowRms(start)<silenceThreshold)start+=windowSize;
  const scanEndLimit=Math.max(start+windowSize,end-maxScan);
  while(end-windowSize>scanEndLimit&&windowRms(end-windowSize)<silenceThreshold)end-=windowSize;
  const length=end-start,fade=Math.min(Math.round(rate*.036),Math.floor(length/4));
  const clean=loopContext.createBuffer(decoded.numberOfChannels,length,rate);
  for(let channel=0;channel<decoded.numberOfChannels;channel++){
    const source=decoded.getChannelData(channel),target=clean.getChannelData(channel);
    target.set(source.subarray(start,end));
    for(let i=0;i<fade;i++){
      const mix=(i+1)/fade,index=length-fade+i;
      target[index]=target[index]*(1-mix)+target[i]*mix;
    }
  }
  return {buffer:clean,loopStart:fade/rate};
}
function stopLoopPlayback(){
  if(loopSource){
    try{loopSource.stop();}catch{}
    loopSource.disconnect();
    loopSource=null;
  }
  audioLoop.pause?.();
  if('currentTime' in audioLoop)audioLoop.currentTime=0;
}
async function startLoopPlayback(){
  if(LoopAudioContext){
    loopContext??=new LoopAudioContext();
    if(loopContext.state==='suspended')await loopContext.resume();
    loopLoad??=fetch(audioLoop.currentSrc||audioLoop.src)
      .then(response=>{if(!response.ok)throw new Error('audio');return response.arrayBuffer();})
      .then(bytes=>loopContext.decodeAudioData(bytes))
      .then(prepareGaplessBuffer);
    const prepared=await loopLoad;
    loopBuffer??=prepared.buffer;
    loopStartOffset=prepared.loopStart;
    if(!soundEnabled)return;
    if(loopSource){try{loopSource.stop();}catch{}loopSource.disconnect();}
    if(!loopGain){loopGain=loopContext.createGain();loopGain.gain.value=0;loopGain.connect(loopContext.destination);}
    loopSource=loopContext.createBufferSource();
    loopSource.buffer=loopBuffer;
    loopSource.loop=true;
    loopSource.loopStart=loopStartOffset;
    loopSource.loopEnd=loopBuffer.duration;
    loopSource.connect(loopGain);
    loopSource.start(0);
    rampLoopGain(spotifyOwnsAudio()?0:.72,2);
    return;
  }
  const playback=audioLoop.play?.();
  await playback;
}
function setSoundEnabled(enabled,controlAudio=true){
  soundEnabled=enabled;
  updateSoundPresentation();
  if(!controlAudio)return;
  if(soundEnabled){
    startLoopPlayback().catch(()=>{
      if(!soundEnabled)return;
      const fallback=audioLoop.play?.();
      fallback?.catch?.(()=>setSoundEnabled(false,false));
    });
  }else stopLoopPlayback();
}
audioLoop.volume=.72;
setSoundEnabled(false,false);
const spotifyControllers=new Map();
const spotifyControllerReady=new Set();
const spotifyPreviewUris=new Map();
const spotifyPreviewLoads=new Map();
const spotifyQueuedPreviewUris=new Map();
const spotifyPendingTimers=new Map();
const spotifyPlaybackTargets=new Map();
let spotifySelectionEpoch=0;
let spotifyActiveSelection=null;
let spotifyQueuedSelection=null;
function requestSpotifyPlay(selection,controller){
  if(spotifyActiveSelection!==selection||!pendingSpotifyCards.has(selection.card))return;
  if(selection.playSent)return;
  selection.playSent=true;
  // Spotify's iframe API queues play() while loadEntity is navigating and
  // flushes it on ready. Sending it again on ready can race the new track.
  try{controller.play?.()?.catch?.(()=>{});}catch{}
}
// Both credits rows share one Spotify embed. Rapidly alternating two embeds
// can leave Chromium's inactive frame reporting Play without advancing audio.
function spotifyGroupForKey(key){return key==='mixed'?'produced':key;}
function spotifyKeyForCard(card){
  const key=Object.entries(spotifyCollections).find(([,collection])=>document.getElementById(collection.cardId)===card)?.[0];
  return key?spotifyGroupForKey(key):null;
}
function pauseOtherSpotifyPlayers(activeCard){
  const activeKey=spotifyKeyForCard(activeCard);
  for(const [key,collection] of Object.entries(spotifyCollections)){
    const card=document.getElementById(collection.cardId);
    if(card===activeCard)continue;
    const wasPlaying=!!card&&(playingSpotifyCards.has(card)||pendingSpotifyCards.has(card));
    clearTimeout(spotifyPendingTimers.get(card));
    pendingSpotifyCards.delete(card);
    playingSpotifyCards.delete(card);
    if(card)delete card.dataset.expectedUri;
    if(card)card.dataset.playing='false';
    const playerKey=spotifyGroupForKey(key);
    if(playerKey!==activeKey&&wasPlaying){
      try{spotifyControllers.get(playerKey)?.pause?.()?.catch?.(()=>{});}catch{}
    }
  }
  updateSoundPresentation();
}
function stopAllSpotifyPlayers(){
  // Cancel a track still loading when the room closes or sound changes.
  spotifySelectionEpoch++;
  spotifyActiveSelection=null;
  spotifyQueuedSelection=null;
  const activeKeys=new Set();
  for(const [key,collection] of Object.entries(spotifyCollections)){
    const card=document.getElementById(collection.cardId);
    if(card&&(playingSpotifyCards.has(card)||pendingSpotifyCards.has(card))){
      if(key)activeKeys.add(key);
    }
    clearTimeout(spotifyPendingTimers.get(card));
    pendingSpotifyCards.delete(card);
    playingSpotifyCards.delete(card);
    if(card)card.dataset.playing='false';
  }
  for(const key of activeKeys)try{spotifyControllers.get(key)?.pause?.()?.catch?.(()=>{});}catch{}
  updateSoundPresentation();
}
function toggleSiteSound(){
  if(localArtistAudio&&!localArtistAudio.paused)localArtistAudio.pause();
  if(spotifyOwnsAudio()){
    stopAllSpotifyPlayers();
    setSoundEnabled(true);
    return;
  }
  setSoundEnabled(!soundEnabled);
}
soundToggle.addEventListener('click',toggleSiteSound);
soundDock.addEventListener('click',toggleSiteSound);
// Safari requires a user gesture before audio can start. Prime the existing
// audio context on the listening-room button without starting the site loop.
// This is deliberately separate from soundEnabled and the page-three player.
let spotifyAudioPrimed=false;
function primeSpotifyAudioGesture(){
  if(spotifyAudioPrimed||!LoopAudioContext)return;
  try{
    loopContext??=new LoopAudioContext();
    if(loopContext.state==='suspended')loopContext.resume()?.catch?.(()=>{});
    const silent=loopContext.createBufferSource();
    silent.buffer=loopContext.createBuffer(1,1,loopContext.sampleRate);
    const muted=loopContext.createGain();
    muted.gain.value=0;
    silent.connect(muted);
    muted.connect(loopContext.destination);
    silent.onended=()=>{silent.disconnect();muted.disconnect();};
    silent.start();
    spotifyAudioPrimed=true;
  }catch{}
}
function setSpotifyPending(card){
  if(!card)return;
  pendingSpotifyCards.add(card);
  card.dataset.playing='pending';
  rampLoopGain(0,1);
  updateSoundPresentation();
  clearTimeout(spotifyPendingTimers.get(card));
  spotifyPendingTimers.set(card,setTimeout(()=>{
    if(!playingSpotifyCards.has(card))pendingSpotifyCards.delete(card);
    delete card.dataset.expectedUri;
    if(!spotifyOwnsAudio()&&soundEnabled)rampLoopGain(.72,1);
    updateSoundPresentation();
    if(!playingSpotifyCards.has(card)){
      const hint=document.querySelector('.listen-room-hint');
      if(hint)hint.textContent='track loaded · press play in the Spotify player';
    }
  },12000));
}
function setSpotifyPlaying(card,playing){
  if(!card)return;
  if(playing){
    const key=spotifyKeyForCard(card);
    clearTimeout(spotifyPendingTimers.get(card));
    pendingSpotifyCards.delete(card);
    // Keep the loop muted while old embeds are being paused in response.
    playingSpotifyCards.add(card);
    pauseOtherSpotifyPlayers(card);
    for(const other of playingSpotifyCards)if(other!==card){
      playingSpotifyCards.delete(other);
      other.dataset.playing='false';
    }
    card.dataset.playing='true';
    rampLoopGain(0,1);
    const hint=document.querySelector('.listen-room-hint');
    if(hint)hint.textContent=`now playing · ${card.dataset.trackTitle||'Spotify'}`;
  }else{
    // Switching a selected track can emit playback_paused before the new
    // item starts. Keep the pending state through that gap.
    if(pendingSpotifyCards.has(card)){
      card.dataset.playing='pending';
      updateSoundPresentation();
      return;
    }
    clearTimeout(spotifyPendingTimers.get(card));
    pendingSpotifyCards.delete(card);
    playingSpotifyCards.delete(card);
    card.dataset.playing='false';
    if(!spotifyOwnsAudio()&&soundEnabled)rampLoopGain(.72,1);
    if(!spotifyOwnsAudio()){
      const hint=document.querySelector('.listen-room-hint');
      if(hint)hint.textContent='track loaded · press play in the Spotify player';
    }
  }
  updateSoundPresentation();
}
function loadSpotifyUri(controller,uri){
  if(typeof controller.loadEntity==='function')return controller.loadEntity(uri);
  return controller.loadUri(uri,false,0,'dark');
}
function spotifyFrameMatchesUri(card,uri){
  const [,kind,id]=uri.split(':');
  const frame=card?.querySelector('iframe');
  if(!frame||!id)return false;
  try{return new URL(frame.src).pathname===`/embed/${kind}/${id}`;}catch{return false;}
}
function previewSpotifyUri(key,uri){
  if(!uri)return;
  const card=document.getElementById(spotifyCollections[key]?.cardId);
  // Loading into the player already making sound would interrupt that track.
  // The other playlist's idle player can be prepared while music is playing.
  if(card&&(playingSpotifyCards.has(card)||pendingSpotifyCards.has(card)))return;
  const controller=spotifyControllers.get(key);
  if(!controller||!spotifyControllerReady.has(key)){
    spotifyQueuedPreviewUris.set(key,uri);
    return;
  }
  if(spotifyPreviewUris.get(key)===uri||spotifyPreviewLoads.get(key)?.uri===uri)return;
  try{
    const loading=loadSpotifyUri(controller,uri);
    const request={uri,promise:Promise.resolve(loading)};
    spotifyPreviewLoads.set(key,request);
    request.promise.then(()=>{
      if(spotifyPreviewLoads.get(key)!==request)return;
      spotifyPreviewLoads.delete(key);
      spotifyPreviewUris.set(key,uri);
    }).catch(()=>{if(spotifyPreviewLoads.get(key)===request)spotifyPreviewLoads.delete(key);});
  }catch{spotifyPreviewLoads.delete(key);spotifyPreviewUris.delete(key);}
}
function spotifyPlaybackMatchesExpected(key,event){
  const selected=spotifyActiveSelection;
  if(!selected||selected.key!==key)return false;
  const expected=selected.uri;
  const actual=event?.data?.playingURI;
  if(!actual)return false;
  if(expected.startsWith('spotify:playlist:'))return actual.startsWith('spotify:track:');
  return actual===expected;
}
function startSpotifyEntity(key,collection,card,uri){
  if(key==='mixed')card=document.getElementById(spotifyCollections.produced.cardId)??card;
  const playerKey=spotifyGroupForKey(key),controller=spotifyControllers.get(playerKey);
  const selection={epoch:++spotifySelectionEpoch,key:playerKey,uri,card};
  spotifyActiveSelection=selection;
  spotifyQueuedSelection=null;
  if(localArtistAudio&&!localArtistAudio.paused)localArtistAudio.pause();
  if(key==='produced'||key==='mixed'){
    const stage=document.getElementById('listen-player-stage');
    stage?.classList.add('has-selection');
    card.setAttribute('aria-label',`Spotify player for songs I ${key==='mixed'?'mixed':'produced'}`);
    stage?.querySelectorAll('.listen-playback-card').forEach(player=>player.classList.toggle('is-active',player===card));
    // Flush the visibility change before messaging the cross-origin Spotify
    // iframe. Safari can discard play commands sent while that frame is still
    // effectively display:none for the current rendering pass.
    stage?.getBoundingClientRect();
    card.getBoundingClientRect();
    card.querySelector('iframe')?.getBoundingClientRect();
    const selectedTitle=card.dataset.trackTitle||'playlist';
    const label=document.getElementById('listen-player-label');
    if(label)label.textContent=`selected · ${selectedTitle}`;
    const hint=document.querySelector('.listen-room-hint');
    if(hint)hint.textContent=`loading · ${selectedTitle}`;
    document.querySelectorAll('.listen-track-group').forEach(group=>group.classList.toggle('is-active',group.dataset.listenRow===key));
    // On short viewports the player lives below the two cover rows. Bring it
    // into view within this click so the selected track and fallback control
    // are immediately visible without covering any artwork.
    if(window.innerHeight<=600)stage?.scrollIntoView({block:'center',behavior:'auto'});
  }
  clearTimeout(spotifyPendingTimers.get(card));
  pendingSpotifyCards.delete(card);
  playingSpotifyCards.delete(card);
  card.dataset.playing='false';
  card.dataset.expectedUri=uri;
  spotifyPlaybackTargets.set(playerKey,card);
  pauseOtherSpotifyPlayers(card);
  setSpotifyPending(card);
  // A cover can become interactive before Spotify finishes creating its
  // iframe controller. Preserve that exact selection until the player is ready.
  if(!controller){
    spotifyQueuedSelection={selection,key:playerKey,sourceKey:key,collection,card,uri};
    return true;
  }
  // Send one play request inside the click gesture. Spotify queues it until
  // the new embed is ready when loadEntity has started a navigation.
  try{
    if(!spotifyFrameMatchesUri(card,uri)){
      loadSpotifyUri(controller,uri);
      spotifyPreviewUris.set(key,uri);
    }
    requestSpotifyPlay(selection,controller);
  }catch{
    pendingSpotifyCards.delete(card);
    setSpotifyPlaying(card,false);
  }
  return true;
}
function renderSpotifyCollection(key,collection){
  const list=document.getElementById(collection.listId);
  const meta=document.getElementById(collection.metaId);
  const card=document.getElementById(spotifyCollections[spotifyGroupForKey(key)]?.cardId??collection.cardId);
  if(!list||!meta||!card)return;
  meta.hidden=key==='artist';
  meta.textContent=key==='artist'?'':`${collection.tracks.length} tracks`;
  if(key==='produced'||key==='mixed'){
    list.dataset.trackCount=String(collection.tracks.length);
    list.classList.add('liquid-carousel-rail');
    list.dataset.carouselKey=key;
    list.replaceChildren();
    return;
  }else{
    list.innerHTML=collection.tracks.map(([id,title,artist,duration],index)=>
      `<a class="spotify-track-row" data-track-id="${id}" href="https://open.spotify.com/track/${id}" target="_blank" rel="noopener noreferrer" aria-label="Play ${title} by ${artist} on Spotify"><span class="spotify-track-index">${String(index+1).padStart(2,'0')}</span><span class="spotify-track-copy"><b>${title}</b><small>${artist}</small></span><time>${duration}</time><span class="spotify-track-play" aria-hidden="true">▶</span></a>`
    ).join('');
  }
  list.addEventListener('click',event=>{
    const row=event.target.closest('.spotify-track-row');
    if(!row)return;
    const controller=spotifyControllers.get(spotifyGroupForKey(key));
    if(!controller)return; // Keep the real Spotify track link as a Safari-safe fallback.
    event.preventDefault();
    if(row.dataset.trackTitle)card.dataset.trackTitle=row.dataset.trackTitle;
    document.querySelectorAll('.listen-track-tile.is-selected').forEach(tile=>tile.classList.remove('is-selected'));
    list.querySelectorAll(`[data-track-id="${row.dataset.trackId}"]`).forEach(tile=>tile.classList.add('is-selected'));
    startSpotifyEntity(key,collection,card,`spotify:track:${row.dataset.trackId}`);
  });
  document.querySelector(`[data-spotify-playlist="${key}"]`)?.addEventListener('click',event=>{
    const controller=spotifyControllers.get(spotifyGroupForKey(key));
    if(!controller)return; // If the embedded player is unavailable, open Spotify normally.
    event.preventDefault();
    card.dataset.trackTitle=key==='produced'?'Songs I produced':'Songs I mixed';
    document.getElementById('listen-player-stage')?.classList.add('has-selection');
    startSpotifyEntity(key,collection,card,`spotify:playlist:${collection.playlistId}`);
  });
}
const trackCoverObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  for(const entry of entries){if(!entry.isIntersecting)continue;trackCoverObserver.unobserve(entry.target);loadTrackCover(entry.target);}
},{rootMargin:'220px 720px',threshold:.01}):null;
const trackCoverCache=new Map();
function spotifyCoverUrl(id){
  let request=trackCoverCache.get(id);
  if(!request){
    // The credits covers are bundled with the site, so rendering never waits
    // for a manifest request or Spotify's cross-origin metadata endpoint.
    if(id==='2QYgQz0jUjftF6S7uHjPs6'){
      const url=`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${id}`)}`;
      request=fetch(url).then(response=>response.ok?response.json():Promise.reject()).then(data=>data.thumbnail_url||'').catch(()=>'');
    }else request=Promise.resolve(`assets/spotify-covers/${id}.jpg`);
    trackCoverCache.set(id,request);
  }
  return request;
}
function loadTrackCover(image){
  const id=image?.dataset.trackCover;
  if(!id||image.dataset.coverRequested)return;
  image.dataset.coverRequested='true';
  const request=spotifyCoverUrl(id);
  request.then(src=>{if(src){image.decoding='async';image.src=src;image.closest('.listen-track-art')?.classList.add('has-cover');}});
}
function observeTrackCovers(list){
  const images=list.querySelectorAll('[data-track-cover]');
  if(trackCoverObserver)images.forEach(image=>trackCoverObserver.observe(image));
  else images.forEach((image,index)=>{const count=Number(list.dataset.trackCount)||0;if(index>=count&&index<count+8)loadTrackCover(image);});
}
function addSpotifyFallback(collection){
  const mount=document.getElementById(collection.playerId);
  if(!mount||mount.querySelector('iframe'))return;
  const frame=document.createElement('iframe');
  if(!collection.playlistId)return;
  frame.title='Spotify playlist player';
  frame.src=`https://open.spotify.com/embed/playlist/${collection.playlistId}?utm_source=generator&theme=dark`;
  frame.loading='lazy';
  frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  frame.referrerPolicy='strict-origin-when-cross-origin';
  mount.replaceChildren(frame);
}
for(const [key,collection] of Object.entries(spotifyCollections))renderSpotifyCollection(key,collection);
let liquidCarouselModulePromise=null;
function mountListeningRoomCarousels(){
  const rows=['produced','mixed'].map(async key=>{
    const collection=spotifyCollections[key],rail=document.getElementById(collection.listId);
    if(!rail||rail.dataset.carouselMounted==='true'||rail.dataset.carouselLoading==='true')return;
    rail.dataset.carouselLoading='true';
    const host=document.createElement('div');host.className='liquid-carousel-host';
    const loading=document.createElement('span');loading.className='liquid-carousel-loading';loading.textContent='loading covers';
    host.append(loading);rail.replaceChildren(host);
    try{
      const items=await Promise.all(collection.tracks.map(async([id,title,artist])=>({id,title,artist,src:await spotifyCoverUrl(id),aspect:1})));
      if(!liquidCarouselModulePromise)liquidCarouselModulePromise=import('./assets/liquid-glass-carousel.js?v=quasi2-cover-click-v4');
      const module=await liquidCarouselModulePromise;
      if(!rail.isConnected)return;
      delete rail.dataset.carouselLoading;
      if(!listenRoom.classList.contains('is-open'))return;
      rail.dataset.carouselMounted='true';
      module.mountSpotifyCarousel(host,key,items);
    }catch{
      delete rail.dataset.carouselLoading;
      loading.textContent='covers unavailable';
    }
  });
  return Promise.all(rows);
}
window.addEventListener('spotify-carousel-track-select',event=>{
  const {playlistKey,id,title}=event.detail||{};
  const collection=spotifyCollections[playlistKey],card=collection&&document.getElementById(spotifyCollections[spotifyGroupForKey(playlistKey)].cardId);
  if(!collection||!card)return;
  card.dataset.trackTitle=title;
  startSpotifyEntity(playlistKey,collection,card,`spotify:track:${id}`);
});
window.addEventListener('spotify-carousel-track-preview',event=>{
  const {playlistKey,id}=event.detail||{};
  if(playlistKey==='produced'||playlistKey==='mixed')previewSpotifyUri(playlistKey,`spotify:track:${id}`);
});
const artistAudio=document.getElementById('artist-local-audio');
localArtistAudio=artistAudio;
const artistAudioToggle=document.getElementById('artist-audio-toggle');
const artistAudioTitle=document.getElementById('artist-audio-title');
const artistAudioTime=document.getElementById('artist-audio-time');
const artistAudioProgress=document.getElementById('artist-audio-progress');
const artistAudioRows=[...document.querySelectorAll('.artist-mini-track')];
let activeArtistTrack=null;
const clockText=seconds=>{
  if(!Number.isFinite(seconds)||seconds<0)return'0:00';
  const minutes=Math.floor(seconds/60),remainder=Math.floor(seconds%60);
  return`${minutes}:${String(remainder).padStart(2,'0')}`;
};
function updateArtistAudioUI(){
  if(!artistAudio)return;
  const playing=!artistAudio.paused&&!artistAudio.ended;
  artistAudioRows.forEach(row=>{
    const active=row===activeArtistTrack;
    row.classList.toggle('is-active',active);
    row.setAttribute('aria-pressed',String(active&&playing));
    const icon=row.querySelector('.artist-mini-play');
    if(icon)icon.classList.toggle('is-playing',active&&playing);
  });
  if(artistAudioToggle){
    artistAudioToggle.classList.toggle('is-playing',playing);
    artistAudioToggle.setAttribute('aria-label',playing?'Pause selected track':'Play selected track');
  }
  if(artistAudioTitle)artistAudioTitle.textContent=activeArtistTrack?.dataset.trackTitle||'select a track';
  const duration=artistAudio.duration||0,current=artistAudio.currentTime||0;
  if(artistAudioTime)artistAudioTime.textContent=`${clockText(current)} / ${clockText(duration)}`;
  if(artistAudioProgress){
    artistAudioProgress.max=String(Math.max(1,Math.round(duration*1000)));
    if(!artistAudioProgress.matches(':active'))artistAudioProgress.value=String(Math.round(current*1000));
    artistAudioProgress.disabled=!duration;
  }
}
function playArtistTrack(row){
  if(!artistAudio||!row)return;
  if(activeArtistTrack===row&&artistAudio.src&& !artistAudio.paused){artistAudio.pause();return;}
  if(activeArtistTrack!==row||!artistAudio.src.endsWith(row.dataset.audioSrc)){
    activeArtistTrack=row;
    artistAudio.src=row.dataset.audioSrc;
    artistAudio.load();
  }
  // Calling play directly inside the click keeps the browser's user-gesture
  // authorization for the local audio file on the very first press.
  const request=artistAudio.play();
  request?.catch?.(()=>updateArtistAudioUI());
  updateArtistAudioUI();
}
artistAudioRows.forEach(row=>row.addEventListener('click',()=>playArtistTrack(row)));
artistAudioToggle?.addEventListener('click',()=>{
  if(!activeArtistTrack){playArtistTrack(artistAudioRows[0]);return;}
  if(artistAudio?.paused){const request=artistAudio.play();request?.catch?.(()=>updateArtistAudioUI());}
  else artistAudio?.pause();
});
artistAudio?.addEventListener('timeupdate',updateArtistAudioUI);
artistAudio?.addEventListener('loadedmetadata',updateArtistAudioUI);
artistAudio?.addEventListener('play',()=>{rampLoopGain(0,1);updateArtistAudioUI();updateSoundPresentation();});
artistAudio?.addEventListener('pause',()=>{if(!spotifyOwnsAudio()&&soundEnabled)rampLoopGain(.72,1);updateArtistAudioUI();updateSoundPresentation();});
artistAudio?.addEventListener('ended',()=>{if(!spotifyOwnsAudio()&&soundEnabled)rampLoopGain(.72,1);updateArtistAudioUI();updateSoundPresentation();});
artistAudioProgress?.addEventListener('input',()=>{
  if(artistAudio?.duration)artistAudio.currentTime=Number(artistAudioProgress.value)/1000;
  updateArtistAudioUI();
});
updateArtistAudioUI();
function mountSpotifyPlayers(api){
  const players=[
    {key:'produced',collection:spotifyCollections.produced,mountId:'credits-produced-player',cardId:'credits-produced-card'}
  ];
  for(const {key,collection,mountId,cardId} of players){
    const mount=document.getElementById(mountId);
    const defaultCard=document.getElementById(cardId);
    if(!mount||!defaultCard)continue;
    try{
      if(!collection.playlistId)continue;
      api.createController(mount,{uri:`spotify:track:${collection.tracks[0][0]}`,width:'100%',height:152},controller=>{
        spotifyControllers.set(key,controller);
        controller.addListener('ready',()=>{
          spotifyControllerReady.add(key);
          const queuedSelection=spotifyQueuedSelection;
          if(queuedSelection?.key===key&&spotifyActiveSelection===queuedSelection.selection){
            spotifyQueuedSelection=null;
            startSpotifyEntity(queuedSelection.sourceKey,queuedSelection.collection,queuedSelection.card,queuedSelection.uri);
            return;
          }
          const queued=spotifyQueuedPreviewUris.get(key);
          if(queued){spotifyQueuedPreviewUris.delete(key);previewSpotifyUri(key,queued);}
        });
        controller.addListener('playback_started',event=>{
          const card=spotifyPlaybackTargets.get(key)??defaultCard;
          if(!spotifyPlaybackMatchesExpected(key,event)){
            if(spotifyActiveSelection?.key!==key)try{controller.pause?.();}catch{}
            return;
          }
          delete card.dataset.expectedUri;
          setSpotifyPlaying(card,true);
        });
        controller.addListener('playback_update',event=>{
          const card=spotifyPlaybackTargets.get(key)??defaultCard;
          if(!pendingSpotifyCards.has(card)||!spotifyPlaybackMatchesExpected(key,event))return;
          if(event?.data?.isPaused===false&&event?.data?.isBuffering===false){
            delete card.dataset.expectedUri;
            setSpotifyPlaying(card,true);
          }
        });
        controller.addListener('playback_paused',()=>setSpotifyPlaying(spotifyPlaybackTargets.get(key)??defaultCard,false));
        controller.addListener('playback_ended',()=>setSpotifyPlaying(spotifyPlaybackTargets.get(key)??defaultCard,false));
        controller.addListener('error',()=>setSpotifyPlaying(spotifyPlaybackTargets.get(key)??defaultCard,false));
      });
    }catch{addSpotifyFallback(collection);}
  }
}
let spotifyApiTimeout=setTimeout(()=>{
  if(!spotifyControllers.has('produced'))addSpotifyFallback(spotifyCollections.produced);
},9000);
window.onSpotifyIframeApiReady=api=>{
  clearTimeout(spotifyApiTimeout);
  mountSpotifyPlayers(api);
};
const spotifyApiScript=document.createElement('script');
spotifyApiScript.src='https://open.spotify.com/embed/iframe-api/v1';
spotifyApiScript.async=true;
spotifyApiScript.onerror=()=>{
  clearTimeout(spotifyApiTimeout);
  addSpotifyFallback(spotifyCollections.produced);
};
document.head.appendChild(spotifyApiScript);
for(const [key,id] of [['instagramUrl','instagram-link'],['tiktokUrl','tiktok-link']]){
  const link=document.getElementById(id),url=content.socials?.[key];
  const available=typeof url==='string'&&/^https:\/\//.test(url);
  link.setAttribute('aria-disabled',String(!available));
  if(available)link.href=url;else link.removeAttribute('href');
}
let lastWheel=-Infinity,lastDirection=0;
let lastTrackWheel=null;
let lastPointerX=NaN,lastPointerY=NaN;
let hoveredListenRail=null;
const listenWheelRemainders=new WeakMap();
window.addEventListener('pointermove',event=>{lastPointerX=event.clientX;lastPointerY=event.clientY;},{passive:true});
document.addEventListener('pointerover',event=>{
  const rail=event.target.closest?.('#listen-room .listen-track-rail');
  if(rail)hoveredListenRail=rail;
},{passive:true});
document.addEventListener('pointerout',event=>{
  if(hoveredListenRail&&!event.relatedTarget?.closest?.('#listen-room .listen-track-rail'))hoveredListenRail=null;
},{passive:true});
const trackListAt=(target,x,y)=>target?.closest?.('.spotify-track-scroll')??document.elementFromPoint(x,y)?.closest?.('.spotify-track-scroll')??null;
const scrollableTrackListAt=(target,x,y)=>{
  const list=trackListAt(target,x,y);
  return list&&list.scrollHeight>list.clientHeight+1?list:null;
};
document.querySelectorAll('.spotify-track-scroll').forEach(list=>{
  // Keep list gestures inside the list even at the first/last track. This
  // stops the site-level page-turn listener without cancelling native scroll.
  list.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
  list.addEventListener('touchmove',event=>event.stopPropagation(),{passive:true});
});
document.querySelectorAll('.listen-track-rail').forEach(rail=>{
  if(rail.classList.contains('liquid-carousel-rail'))return;
  let drag=null;
  rail.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    clearTimeout(listenRailSnapTimers.get(rail));
    clearTimeout(listenRailSnapFinishTimers.get(rail));
    rail.classList.remove('is-snapping');
    drag={id:event.pointerId,startX:event.clientX,startLeft:rail.scrollLeft,moved:false};
  });
  rail.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const delta=event.clientX-drag.startX;
    const threshold=event.pointerType==='mouse'?14:16;
    if(!drag.moved&&Math.abs(delta)>threshold){drag.moved=true;rail.classList.add('is-dragging');rail.setPointerCapture(event.pointerId);}
    if(drag.moved){event.preventDefault();rail.scrollLeft=drag.startLeft-delta;}
  });
  const endDrag=event=>{
    if(!drag||event.pointerId!==drag.id)return;
    rail.classList.remove('is-dragging');
    if(drag.moved)scheduleListenRailSnap(rail,80);
    drag=null;
  };
  rail.addEventListener('pointerup',endDrag);
  rail.addEventListener('pointercancel',endDrag);
});
window.addEventListener('wheel',event=>{
  if(event.ctrlKey||event.metaKey)return;
  // Handle the carousel at the window capture point, before the page-turn
  // wheel handler can cancel Safari's native horizontal gesture. Resolve the
  // hovered row itself so the upper and lower playlists never cross-scroll.
  const pointerX=Number.isFinite(event.clientX)?event.clientX:lastPointerX;
  const pointerY=Number.isFinite(event.clientY)?event.clientY:lastPointerY;
  const listenRail=event.composedPath().find(node=>node instanceof Element&&node.matches?.('#listen-room .listen-track-rail'))
    ??document.elementFromPoint(pointerX,pointerY)?.closest?.('#listen-room .listen-track-rail')
    ??[...document.querySelectorAll('#listen-room .listen-track-rail')].find(rail=>rail.matches(':hover'))
    ??hoveredListenRail;
  if(listenRail){
    // The WebGL carousel owns its own wheel and touch motion. Let that event
    // reach its canvas instead of scrolling the now-hidden legacy DOM rail.
    if(listenRail.classList.contains('liquid-carousel-rail'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(listenRail.classList.contains('is-snapping')){
      clearTimeout(listenRailSnapFinishTimers.get(listenRail));
      listenRail.classList.remove('is-snapping');
    }
    let delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
    if(event.deltaMode===1)delta*=16;
    else if(event.deltaMode===2)delta*=listenRail.clientWidth;
    const accumulated=(listenWheelRemainders.get(listenRail)||0)+delta;
    const wholePixels=Math.trunc(accumulated);
    listenWheelRemainders.set(listenRail,accumulated-wholePixels);
    if(wholePixels)listenRail.scrollLeft+=wholePixels;
    return;
  }
  const trackList=scrollableTrackListAt(event.target,event.clientX??lastPointerX,event.clientY??lastPointerY);
  const hoveredList=[...document.querySelectorAll('.spotify-track-scroll')].find(list=>list.matches(':hover')&&list.scrollHeight>list.clientHeight+1);
  const activeList=trackList||hoveredList;
  // A gesture that reaches a playlist edge stays with the list. A new gesture
  // at that edge can leave the page, so track browsing never traps navigation.
  if(activeList){
    const atTop=activeList.scrollTop<=0;
    const atBottom=activeList.scrollTop+activeList.clientHeight>=activeList.scrollHeight-1;
    if(Math.abs(event.deltaX)>Math.abs(event.deltaY)){event.preventDefault();return;}
    const direction=Math.sign(event.deltaY);
    if(!direction)return;
    const atEdge=direction>0?atBottom:atTop;
    const now=performance.now();
    const sameGesture=lastTrackWheel?.list===activeList&&lastTrackWheel.direction===direction&&now-lastTrackWheel.time<320;
    lastTrackWheel={list:activeList,direction,time:now};
    if(atEdge){
      event.preventDefault();
      if(!sameGesture)requestScrollStep(direction);
    }
    return;
  }
  if(event.target.closest?.('#listen-room')){
    // Let the room itself scroll on short screens; cover rails keep their
    // existing horizontal gestures and Spotify stays interactive.
    if(listenRoom.scrollHeight>listenRoom.clientHeight+1)return;
    event.preventDefault();return;
  }
  // The photographic viewport can have off-canvas content. Prevent native
  // horizontal/vertical overflow so the canvas itself never drifts.
  event.preventDefault();
  if(event.deltaY===0||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  const now=performance.now(),direction=Math.sign(event.deltaY);
  const newGesture=now-lastWheel>180||direction!==lastDirection;
  lastWheel=now;lastDirection=direction;
  if(newGesture)requestScrollStep(direction);
},{passive:false,capture:true});
let touchStart=null,touchUsed=false;
window.addEventListener('touchstart',event=>{
  const touch=event.touches[0];
  const trackList=event.touches.length===1?scrollableTrackListAt(event.target,touch.clientX,touch.clientY):null;
  touchStart=event.touches.length===1?{x:touch.clientX,y:touch.clientY,trackList,trackScrollTop:trackList?.scrollTop??0}:null;
  touchUsed=false;
},{passive:true});
window.addEventListener('touchmove',event=>{
  if(event.target.closest?.('#listen-room'))return;
  if(!touchStart?.trackList||event.touches.length!==1)return;
  const list=touchStart.trackList,dy=touchStart.y-event.touches[0].clientY;
  const atTop=list.scrollTop<=0,atBottom=list.scrollTop+list.clientHeight>=list.scrollHeight-1;
  if((atTop&&dy<0)||(atBottom&&dy>0))event.preventDefault();
},{passive:false,capture:true});
window.addEventListener('touchmove',event=>{
  if(event.target.closest?.('#listen-room'))return;
  if(!touchStart||event.touches.length!==1||touchUsed)return;
  const dx=touchStart.x-event.touches[0].clientX,dy=touchStart.y-event.touches[0].clientY;
  if(Math.abs(dy)<6||Math.abs(dx)>Math.abs(dy))return;
  const trackList=touchStart.trackList;
  if(trackList){
    const atTop=touchStart.trackScrollTop<=0;
    const atBottom=touchStart.trackScrollTop+trackList.clientHeight>=trackList.scrollHeight-1;
    if((atTop&&dy<0)||(atBottom&&dy>0)){event.preventDefault();touchUsed=true;requestScrollStep(dy);}
    return;
  }
  event.preventDefault();touchUsed=true;requestScrollStep(dy);
},{passive:false});
window.addEventListener('touchend',()=>{touchStart=null;},{passive:true});
window.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
window.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.target.closest('button,a,input,textarea,select,[role="tab"],[role="tabpanel"],.spotify-track-scroll'))return;
  const direction=['ArrowDown','PageDown','End'].includes(event.key)?1:['ArrowUp','PageUp','Home'].includes(event.key)?-1:event.key===' '?(event.shiftKey?-1:1):0;
  if(direction){event.preventDefault();step(direction);}
});
reduced.addEventListener('change',()=>{
  pager.duration=reduced.matches?0:1500;
  if(ready&&!requestedFrame)requestedFrame=requestAnimationFrame(render);
});
Promise.all(sources.map(s=>loadImage(s.src))).then(images=>{
  function resize(){
    if(requestedFrame){cancelAnimationFrame(requestedFrame);requestedFrame=0;}
    images.forEach((image,i)=>prepare(image,sources[i],[canvasA,canvasB,canvasC,canvasD,canvasE][i]));
    const spreadWidth=Math.min(innerWidth,innerHeight*1.176),spreadHeight=spreadWidth/1.176;
    notes.style.width=spreadWidth+'px';notes.style.height=spreadHeight+'px';
    notes.style.left=(innerWidth-spreadWidth)/2+'px';notes.style.top=(innerHeight-spreadHeight)/2+'px';
    // Anchor the title above the clouds even when the text spread is centered
    // inside a tall viewport. Keep the paragraph's existing placement.
    // Center the title in the visible scanner band. The scanner/photo boundary
    // is measured in the baked image, then mapped through the same cover crop
    // used by prepare(), so the title tracks it across viewport aspect ratios.
    const scannerImage=images[1],scannerSpec=sources[1];
    const scannerScale=Math.max(innerWidth/scannerImage.width,innerHeight/scannerImage.height);
    const scannerImageHeight=scannerImage.height*scannerScale;
    const scannerImageTop=(innerHeight-scannerImageHeight)*scannerSpec.focusY;
    const scannerEnd=clamp(scannerImageTop+scannerImageHeight*scannerSpec.scannerEndY,0,innerHeight);
    const scannerMidpoint=scannerEnd/2;
    notes.style.setProperty('--world-title-y',(scannerMidpoint-(innerHeight-spreadHeight)/2)+'px');
    const thirdRatio=sources[2].notesRatio??sources[2].artworkRatio;
    const thirdWidth=Math.min(innerWidth,innerHeight*thirdRatio),thirdHeight=thirdWidth/thirdRatio;
    thirdNotes.style.width=thirdWidth+'px';thirdNotes.style.height=thirdHeight+'px';
    thirdNotes.style.left=(innerWidth-thirdWidth)/2+'px';thirdNotes.style.top=(innerHeight-thirdHeight)/2+'px';
    const creditsRatio=sources[3].notesRatio??sources[3].artworkRatio;
    const creditsWidth=Math.min(innerWidth,innerHeight*creditsRatio),creditsHeight=creditsWidth/creditsRatio;
    creditsNotes.style.width=creditsWidth+'px';creditsNotes.style.height=creditsHeight+'px';
    creditsNotes.style.left=(innerWidth-creditsWidth)/2+'px';creditsNotes.style.top=(innerHeight-creditsHeight)/2+'px';
    if(ready)render();
  }
  resize();ready=true;entranceStarted=performance.now();document.body.classList.add('ready');render();
  let variantRequest=0;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      // Keep the current frame visible while orientation changes load the
      // appropriate tall or wide photographs at their original proportions.
      const compact=innerWidth<700;
      if(compact===compactPhotoLayout){resize();return;}
      compactPhotoLayout=compact;
      resize();
      const request=++variantRequest;
      const variant=compact?'mobile':'desktop';
      const replacements=[
        [0,'assets/hero-studio-guitar-red-'+variant+'-v9.png'],
        [2,'assets/reference-print-page3-'+variant+'-v2.webp'],
        [3,'assets/reference-print-page4-'+variant+'-v2.webp'],
        [4,'assets/reference-print-page5-'+variant+'-v1.webp']
      ];
      Promise.all(replacements.map(([,src])=>loadImage(src))).then(nextImages=>{
        if(request!==variantRequest||compact!==(innerWidth<700))return;
        replacements.forEach(([index,src],i)=>{sources[index].src=src;images[index]=nextImages[i];});
        resize();
      }).catch(()=>{if(request===variantRequest)compactPhotoLayout=!compact;resize();});
    },180);
  });
}).catch(()=>{document.getElementById('load-error').hidden=false;invitation.hidden=true;});

// The credits listening room borrows the movement of a liquid-glass carousel,
// while keeping Spotify's own playlist/player as the source of playback.
const listenRoom=document.getElementById('listen-room');
const listenOpen=document.getElementById('credits-listen-open');
const listenClose=document.getElementById('listen-room-close');
const listenRailFrames=new WeakMap();
const listenRailMetrics=new WeakMap();
const listenRailActiveTiles=new WeakMap();
const listenRailSnapTimers=new WeakMap();
const listenRailSnapFinishTimers=new WeakMap();
let listenRoomTransitionTimer=0;
function positionListenShelf(rail){
  const group=rail.closest('.listen-track-group'),art=rail.querySelector('.listen-track-art'),shelf=group?.querySelector('.listen-shelf');
  if(!group||!art||!shelf)return;
  const groupRect=group.getBoundingClientRect(),artRect=art.getBoundingClientRect();
  if(artRect.width>0&&groupRect.height>0)shelf.style.top=`${Math.round(artRect.bottom-groupRect.top-25)}px`;
}
function measureListenRail(rail){
  const sets=[...rail.querySelectorAll('.listen-track-set')];
  const starts=sets.map(set=>set.offsetLeft);
  const data={sets,tiles:[...rail.querySelectorAll('.listen-track-tile')].map(tile=>({tile,left:tile.offsetLeft,width:tile.offsetWidth})),middleStart:starts[1]||0,setWidth:starts.length===3?starts[2]-starts[1]:0};
  listenRailMetrics.set(rail,data);
  positionListenShelf(rail);
  return data;
}
function snapListenRail(rail){
  if(!rail||rail.clientWidth<=0)return;
  const data=listenRailMetrics.get(rail)||measureListenRail(rail);
  const center=rail.scrollLeft+rail.clientWidth/2;
  let nearest=null,nearestDistance=Infinity;
  for(const item of data.tiles){
    const distance=Math.abs(item.left+item.width/2-center);
    if(distance<nearestDistance){nearest=item;nearestDistance=distance;}
  }
  if(!nearest)return;
  const target=Math.max(0,Math.min(rail.scrollWidth-rail.clientWidth,nearest.left+nearest.width/2-rail.clientWidth/2));
  rail.classList.add('is-snapping');
  clearTimeout(listenRailSnapFinishTimers.get(rail));
  rail.scrollTo({left:target,behavior:'smooth'});
  listenRailSnapFinishTimers.set(rail,setTimeout(()=>{
    rail.classList.remove('is-snapping');
    updateListenRail(rail);
  },520));
}
function scheduleListenRailSnap(rail,delay=160){
  if(!rail||rail.classList.contains('is-snapping')||rail.classList.contains('is-dragging'))return;
  clearTimeout(listenRailSnapTimers.get(rail));
  listenRailSnapTimers.set(rail,setTimeout(()=>snapListenRail(rail),delay));
}
function updateListenRail(rail){
  if(!rail)return;
  if(listenRailFrames.has(rail))return;
  listenRailFrames.set(rail,requestAnimationFrame(()=>{
    listenRailFrames.delete(rail);
    const data=listenRailMetrics.get(rail)||measureListenRail(rail);
    const {middleStart,setWidth}=data;
    if(data.sets.length===3&&rail.clientWidth>0&&!rail.classList.contains('is-snapping')){
      if(setWidth>rail.clientWidth){
        if(rail.scrollLeft<middleStart-.5)rail.scrollLeft+=setWidth;
        else if(rail.scrollLeft>=middleStart+setWidth)rail.scrollLeft-=setWidth;
      }
    }
    const width=rail.clientWidth,center=width/2,half=Math.max(1,width/2),scrollLeft=rail.scrollLeft;
    const overscan=width*.12;
    // Card geometry is cached once; on scroll only a handful of visible cards
    // get new transforms instead of measuring every repeated cover each frame.
    const nearby=[];
    for(const item of data.tiles){
      const left=item.left-scrollLeft,right=left+item.width;
      if(right>-overscan&&left<width+overscan)nearby.push({item,left});
    }
    const active=new Set();
    nearby.forEach(({item,left})=>{
      const {tile,width:tileWidth}=item;
      active.add(tile);
      const offset=Math.max(-1,Math.min(1,(left+tileWidth/2-center)/half)),edge=Math.abs(offset);
      const art=tile.querySelector('.listen-track-art');
      if(!art)return;
      art.style.setProperty('--tile-y',`${(-offset*56).toFixed(2)}deg`);
      art.style.setProperty('--tile-scale',(1-edge*.1).toFixed(3));
      art.style.setProperty('--tile-compress',(1-edge*.38).toFixed(3));
      art.style.setProperty('--tile-lift',`${(-edge*12).toFixed(1)}px`);
      art.style.setProperty('--tile-blur',`${(edge*4.8).toFixed(2)}px`);
      const focusStrength=innerWidth<=700||innerHeight<=800 ? 0.12 : 0.22;
      const sideFalloff=innerWidth<=700||innerHeight<=800 ? 0.28 : 0.46;
      tile.style.setProperty('--tile-card-scale',(1+focusStrength-edge*sideFalloff).toFixed(3));
      tile.style.setProperty('--tile-card-lift',`${(-5*(1-edge)).toFixed(1)}px`);
      tile.classList.add('is-warp-active');
    });
    const previous=listenRailActiveTiles.get(rail)||new Set();
    for(const tile of previous){
      if(active.has(tile))continue;
      tile.classList.remove('is-warp-active');
      tile.style.removeProperty('--tile-card-scale');tile.style.removeProperty('--tile-card-lift');
      const art=tile.querySelector('.listen-track-art');
      art?.style.removeProperty('--tile-y');art?.style.removeProperty('--tile-scale');
      art?.style.removeProperty('--tile-compress');art?.style.removeProperty('--tile-lift');art?.style.removeProperty('--tile-blur');
    }
    listenRailActiveTiles.set(rail,active);
  }));
}
document.querySelectorAll('.listen-track-rail').forEach(rail=>{
  rail.addEventListener('scroll',()=>{
    updateListenRail(rail);
    scheduleListenRailSnap(rail);
  },{passive:true});
  rail.addEventListener('focusin',()=>updateListenRail(rail));
  const data=measureListenRail(rail);
  const middle=rail.querySelector('.listen-track-set[data-copy="1"]');
  if(middle)rail.scrollLeft=data.middleStart;
  updateListenRail(rail);
});
window.addEventListener('resize',()=>document.querySelectorAll('.listen-track-rail').forEach(rail=>{measureListenRail(rail);updateListenRail(rail);}),{passive:true});
function clearListenRoomTransition(){
  clearTimeout(listenRoomTransitionTimer);
  listenRoomTransitionTimer=setTimeout(()=>creditsNotes.classList.remove('room-opening','room-returning'),1120);
}
function setListenRoom(open){
  if(!listenRoom)return;
  clearTimeout(listenRoomTransitionTimer);
  creditsNotes.classList.remove('room-opening','room-returning');
  creditsNotes.classList.remove('room-scrolled');
  if(open){
    listenRoom.scrollTop=0;
    creditsNotes.classList.add('room-open','room-opening');
    listenRoom.classList.remove('is-open');
    listenRoom.classList.add('is-preparing');
    listenRoom.setAttribute('aria-hidden','true');
    listenRoom.inert=true;
    listenRoom.toggleAttribute('inert',true);
    listenRoom.getBoundingClientRect();
    document.querySelectorAll('.listen-track-rail').forEach(rail=>{measureListenRail(rail);updateListenRail(rail);});
    requestAnimationFrame(()=>{
      listenRoom.classList.remove('is-preparing');
      listenRoom.classList.add('is-open');
      listenRoom.setAttribute('aria-hidden','false');
      listenRoom.inert=false;
      listenRoom.toggleAttribute('inert',false);
      listenRoom.getBoundingClientRect();
      mountListeningRoomCarousels();
      listenClose?.focus({preventScroll:true});
    });
  }
  else{
    creditsNotes.classList.remove('room-open');
    creditsNotes.classList.add('room-returning');
    listenRoom.classList.remove('is-open','is-preparing');
    listenRoom.setAttribute('aria-hidden','true');
    listenRoom.inert=false;
    listenRoom.toggleAttribute('inert',false);
    stopAllSpotifyPlayers();
    document.getElementById('listen-player-stage')?.classList.remove('has-selection');
    document.querySelectorAll('.listen-playback-card.is-active').forEach(card=>card.classList.remove('is-active'));
    document.querySelectorAll('.listen-track-tile.is-selected').forEach(tile=>tile.classList.remove('is-selected'));
    const label=document.getElementById('listen-player-label');if(label)label.textContent='choose a track to listen';
    const hint=document.querySelector('.listen-room-hint');if(hint)hint.textContent='select a cover to play';
    listenOpen?.focus({preventScroll:true});
  }
  clearListenRoomTransition();
}
listenRoom?.addEventListener('scroll',()=>{
  creditsNotes.classList.toggle('room-scrolled',listenRoom.scrollTop>20);
},{passive:true});
listenOpen?.addEventListener('click',()=>{
  primeSpotifyAudioGesture();
  setListenRoom(true);
});
listenClose?.addEventListener('click',()=>setListenRoom(false));
let listenCoversPrimed=false;
function primeListenCovers(){
  if(listenCoversPrimed)return;
  listenCoversPrimed=true;
  for(const key of ['produced','mixed'])for(const [id] of spotifyCollections[key].tracks)spotifyCoverUrl(id);
}
listenOpen?.addEventListener('pointerenter',primeListenCovers,{once:true});
listenOpen?.addEventListener('focus',primeListenCovers,{once:true});
listenRoom?.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setListenRoom(false);return;}
  if(event.target.closest('.liquid-glass-carousel'))return;
  if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&event.target.closest('.listen-track-rail')){
    event.preventDefault();event.stopPropagation();
    const rail=event.target.closest('.listen-track-rail');
    rail.scrollBy({left:(event.key==='ArrowRight'?1:-1)*Math.max(180,rail.clientWidth*.72),behavior:'smooth'});
  }
});
listenRoom?.addEventListener('transitionend',event=>{
  if(event.target===listenRoom&&!listenRoom.classList.contains('is-open')){
    listenRoom.inert=true;
    listenRoom.toggleAttribute('inert',true);
  }
});
