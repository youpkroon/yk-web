document.getElementById('year').textContent=new Date().getFullYear();
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero=document.querySelector('.hero');
  const textTargets=[...document.querySelectorAll('.hero h1'),...document.querySelectorAll('.eyebrow,.section-title,.skill h3,.work-card strong,.contact h2,.contact-link')];
  function wrapHorizontal(el,targetIndex){
    if(el.dataset.buildReady)return;
    const parts=el.innerHTML.split(/<br\s*\/?>/i);
    const baseDir=targetIndex%2===0?-1:1;
    el.innerHTML=parts.map((part,lineIndex)=>{
      const dir=baseDir*(lineIndex%2===0?1:-1);
      const from=dir<0?'-112%':'112%';
      return `<span class="slide-clip"><span class="slide-piece" style="--slide-from:${from};transition-delay:${lineIndex*.085}s">${part}</span></span>`;
    }).join('');
    el.classList.add('slide-text');el.dataset.buildReady='1';
  }
  textTargets.forEach(wrapHorizontal);
  const vectors=[
    {x:'-48vw',y:'-14vh',mx:'-34px',my:'-10px',r:'-7deg',mr:'-.8deg',s:'.86',ms:'1.012',d:'2.15s'},
    {x:'46vw',y:'8vh',mx:'38px',my:'6px',r:'5deg',mr:'.6deg',s:'.88',ms:'1.01',d:'2.0s'},
    {x:'-18vw',y:'42vh',mx:'-18px',my:'28px',r:'6deg',mr:'.7deg',s:'.84',ms:'1.018',d:'2.25s'},
    {x:'32vw',y:'-36vh',mx:'28px',my:'-26px',r:'-6deg',mr:'-.7deg',s:'.87',ms:'1.014',d:'2.3s'},
    {x:'-54vw',y:'18vh',mx:'-42px',my:'15px',r:'4deg',mr:'.5deg',s:'.9',ms:'1.008',d:'1.95s'},
    {x:'24vw',y:'48vh',mx:'20px',my:'34px',r:'7deg',mr:'.9deg',s:'.83',ms:'1.02',d:'2.4s'},
    {x:'52vw',y:'-22vh',mx:'44px',my:'-16px',r:'-5deg',mr:'-.6deg',s:'.89',ms:'1.01',d:'2.1s'},
    {x:'-30vw',y:'-44vh',mx:'-24px',my:'-30px',r:'8deg',mr:'1deg',s:'.85',ms:'1.016',d:'2.35s'}
  ];
  function makeFly(el,index,extraDelay=0){
    const v=vectors[index%vectors.length];el.classList.add('fly-build');
    el.style.setProperty('--fx',v.x);el.style.setProperty('--fy',v.y);el.style.setProperty('--mx',v.mx);el.style.setProperty('--my',v.my);
    el.style.setProperty('--fr',v.r);el.style.setProperty('--mr',v.mr);el.style.setProperty('--fs',v.s);el.style.setProperty('--ms',v.ms);
    el.style.setProperty('--fly-dur',v.d);el.style.setProperty('--fly-delay',`${extraDelay}s`);
  }
  const aboutVisual=document.querySelector('.about-visual');
  if(aboutVisual){aboutVisual.classList.add('fly-build');aboutVisual.style.setProperty('--fx','36vw');aboutVisual.style.setProperty('--fy','-16vh');aboutVisual.style.setProperty('--fr','5deg');aboutVisual.style.setProperty('--mr','.5deg');aboutVisual.style.setProperty('--fs','.86');aboutVisual.style.setProperty('--ms','1.015');aboutVisual.style.setProperty('--mx','34px');aboutVisual.style.setProperty('--my','-12px');aboutVisual.style.setProperty('--fly-dur','2.35s');}
  document.querySelectorAll('.skill').forEach((el,i)=>makeFly(el,i,.035*(i%4)));
  document.querySelectorAll('.work-card').forEach((el,i)=>makeFly(el,i+2,.07*i));
  document.querySelectorAll('.pill').forEach((el,i)=>{el.classList.add('fly-build');const v=vectors[(i+4)%vectors.length];el.style.setProperty('--fx',v.x);el.style.setProperty('--fy',v.y);el.style.setProperty('--fr',v.r);el.style.setProperty('--mr',v.mr);el.style.setProperty('--fs','.80');el.style.setProperty('--ms','1.018');el.style.setProperty('--mx',v.mx);el.style.setProperty('--my',v.my);el.style.setProperty('--fly-dur',v.d);el.style.setProperty('--fly-delay',`${.055*i}s`);});
  document.querySelectorAll('.section-brand,.intro,.about-placeholder,.hero-meta,.skill p,.skill-tags,.image-note,.skill-num,.skill-dot,.work-card small,.foot').forEach((el,i)=>{el.classList.add('soft-build');el.style.setProperty('--soft-x',i%2?'42px':'-42px');el.style.setProperty('--soft-y',i%3===0?'18px':'0px');el.style.transitionDelay=`${(i%4)*.045}s`;});
  const buildTargets=document.querySelectorAll('.slide-text,.soft-build,.fly-build');
  if(reduce){buildTargets.forEach(el=>el.classList.add('is-built'));hero?.classList.add('hero-ready');return;}

  // Trigger motion from stable section/grid wrappers rather than the transformed tiles themselves.
  // This prevents tiles that start outside the viewport from staying invisible forever.
  const groupedTriggers=[
    document.querySelector('#about .about-card'),
    document.querySelector('#capabilities .cap-head'),
    document.querySelector('#capabilities .skill-grid'),
    document.querySelector('#workshop .workshop-head'),
    document.querySelector('#workshop .workshop-grid'),
    document.querySelector('.contact > .wrap')
  ].filter(Boolean);

  const buildGroup=(root)=>{
    const targets=[...root.querySelectorAll('.slide-text,.soft-build,.fly-build')];
    if(root.matches?.('.slide-text,.soft-build,.fly-build')) targets.unshift(root);
    targets.forEach((el,i)=>setTimeout(()=>el.classList.add('is-built'),Math.min(i*22,180)));
  };

  const groupObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        buildGroup(entry.target);
        groupObserver.unobserve(entry.target);
      }
    });
  },{threshold:.06,rootMargin:'0px 0px -8% 0px'});
  groupedTriggers.forEach(el=>groupObserver.observe(el));

  // Fallback for any standalone animated element not inside one of the groups.
  const groupedSet=new Set();
  groupedTriggers.forEach(root=>root.querySelectorAll('.slide-text,.soft-build,.fly-build').forEach(el=>groupedSet.add(el)));
  const singleObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-built');singleObserver.unobserve(entry.target);}
    });
  },{threshold:.08,rootMargin:'0px 0px -10% 0px'});
  buildTargets.forEach(el=>{if(!el.closest('.hero')&&!groupedSet.has(el))singleObserver.observe(el)});

  requestAnimationFrame(()=>{hero?.classList.add('hero-ready');const title=hero?.querySelector('h1.slide-text');if(title)setTimeout(()=>title.classList.add('is-built'),130);const meta=hero?.querySelector('.hero-meta.soft-build');if(meta)setTimeout(()=>meta.classList.add('is-built'),520);});
})();

(()=>{
  const syncHeader=()=>document.body.classList.toggle('is-scrolled',window.scrollY>36);
  syncHeader();
  window.addEventListener('scroll',syncHeader,{passive:true});
})();


(async function loadHeroVideo(){
  const video=document.querySelector('.hero video');
  const source=video?.querySelector('source[data-video-parts]');
  if(!video||!source) return;
  const count=Number(source.dataset.videoParts||0);
  try{
    const files=Array.from({length:count},(_,i)=>'assets/media/hero-video-'+String(i+1).padStart(2,'0')+'.b64');
    const parts=await Promise.all(files.map(path=>fetch(path,{cache:'force-cache'}).then(r=>{if(!r.ok) throw new Error(path); return r.text();})));
    const binary=atob(parts.join(''));
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    const url=URL.createObjectURL(new Blob([bytes],{type:'video/mp4'}));
    source.src=url;
    source.removeAttribute('data-video-parts');
    video.load();
    video.play().catch(()=>{});
    addEventListener('pagehide',()=>URL.revokeObjectURL(url),{once:true});
  }catch(error){console.warn('Hero video could not be loaded.',error);}
})();



/* Unified navigation state: home logo is active throughout the hero, then section accents take over. */
(()=>{
  const home=document.querySelector('.brand-home');
  const hero=document.getElementById('top');
  const links=[...document.querySelectorAll('.hero .nav .nav-item')];
  const sections=links
    .map(link=>({link,section:document.querySelector(link.getAttribute('href'))}))
    .filter(item=>item.section);
  if(!home||!hero)return;

  let ticking=false;
  const sync=()=>{
    ticking=false;
    const heroRect=hero.getBoundingClientRect();
    const homeActive=heroRect.bottom>window.innerHeight*.42;

    home.classList.toggle('is-active',homeActive);
    links.forEach(link=>link.classList.remove('is-active'));
    if(homeActive)return;

    const probe=window.innerHeight*.36;
    let current=null;
    for(const item of sections){
      const r=item.section.getBoundingClientRect();
      if(r.top<=probe&&r.bottom>probe) current=item;
    }
    if(!current&&window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-8){
      current=sections[sections.length-1]||null;
    }
    current?.link.classList.add('is-active');
  };

  const requestSync=()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(sync);
  };

  home.addEventListener('click',()=>{
    home.classList.add('is-active');
    links.forEach(link=>link.classList.remove('is-active'));
  });
  links.forEach(link=>link.addEventListener('click',()=>{
    home.classList.remove('is-active');
    links.forEach(other=>other.classList.toggle('is-active',other===link));
  }));

  sync();
  window.addEventListener('scroll',requestSync,{passive:true});
  window.addEventListener('resize',requestSync,{passive:true});
})();

/* Project gallery: three independent lanes with smooth edge steering and user-triggered spring alignment. */
(()=>{
  const section=document.querySelector('.project-streams-section');
  const gallery=section?.querySelector('[data-project-gallery]');
  const viewport=gallery?.querySelector('.project-gallery-lanes');
  const laneEls=[...(gallery?.querySelectorAll('[data-gallery-lane]')||[])];
  if(!section||!gallery||!viewport||laneEls.length!==3)return;

  const left=gallery.querySelector('.gallery-control--left');
  const right=gallery.querySelector('.gallery-control--right');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveal=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
      section.classList.add('is-built');
      reveal.disconnect();
    }
  },{threshold:.08});
  reveal.observe(section);

  const states=laneEls.map((lane,index)=>{
    const strip=lane.querySelector('.project-gallery-strip');
    const originals=[...strip.children];
    originals.forEach(item=>{
      const clone=item.cloneNode(true);
      clone.setAttribute('aria-hidden','true');
      strip.appendChild(clone);
    });
    return {
      lane,
      strip,
      originals,
      items:[...strip.children],
      speed:reduce?0:Number(lane.dataset.speed||[42,18,30][index]||18),
      x:0,
      loop:1,
      impulse:0,
      packTarget:null,
      packV:0,
      initialized:false,
      dragFactor:[1,.86,1.08][index]||1
    };
  });

  const normalize=state=>{
    if(state.loop<=1)return;
    while(state.x<=-state.loop)state.x+=state.loop;
    while(state.x>0)state.x-=state.loop;
  };

  const measure=()=>{
    states.forEach((state,index)=>{
      const style=getComputedStyle(state.strip);
      const gap=parseFloat(style.columnGap||style.gap)||0;
      let width=0;
      state.originals.forEach((item,i)=>{
        width+=item.getBoundingClientRect().width;
        if(i<state.originals.length-1)width+=gap;
      });
      width+=gap;
      state.loop=Math.max(1,width);
      if(!state.initialized){
        state.x=-state.loop*([.16,.39,.27][index]||.2);
        state.initialized=true;
      }
      normalize(state);
      state.strip.__ykLaneX=state.x;
      state.strip.style.transform='translate3d('+state.x.toFixed(2)+'px,0,0)';
    });
  };

  requestAnimationFrame(measure);
  new ResizeObserver(measure).observe(viewport);

  let drag=false;
  let dragPointer=null;
  let dragStartX=0;
  let dragStarts=[];
  let steerTarget=0;
  let steer=0;
  let last=performance.now();
  let requestedPackAt=0;
  let packing=false;
  let packEnd=0;

  const requestPack=(delay=500)=>{
    requestedPackAt=performance.now()+delay;
  };

  const magneticTarget=(state,anchor)=>{
    let best=null;
    state.items.forEach(item=>{
      const currentLeft=state.x+item.offsetLeft;
      const distance=Math.abs(currentLeft-anchor);
      if(!best||distance<best.distance){
        best={offset:item.offsetLeft,distance};
      }
    });
    if(!best)return state.x;
    let target=anchor-best.offset;
    while(target-state.x>state.loop/2)target-=state.loop;
    while(target-state.x<-state.loop/2)target+=state.loop;
    return target;
  };

  const startPack=()=>{
    if(drag||Math.abs(steerTarget)>.03||gallery.classList.contains('has-crossrow-active')){
      requestedPackAt=performance.now()+650;
      return;
    }
    const anchor=Math.max(54,Math.min(viewport.clientWidth*.105,150));
    states.forEach(state=>{
      state.packTarget=magneticTarget(state,anchor);
      state.packV=0;
      state.impulse=0;
    });
    packing=true;
    packEnd=performance.now()+720;
    requestedPackAt=0;

  };

  const updateSteering=e=>{
    if(drag)return;
    const rect=gallery.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const zone=Math.max(220,Math.min(390,rect.width*.25));
    let target=0;
    if(x<zone){
      const p=(zone-x)/zone;
      target=Math.min(1,p*p*(3-2*p));
    }else if(x>rect.width-zone){
      const p=(x-(rect.width-zone))/zone;
      target=-Math.min(1,p*p*(3-2*p));
    }
    if(Math.abs(target-steerTarget)>.025){
      steerTarget=target;
      requestedPackAt=0;
    }
    gallery.classList.toggle('is-steering-left',target>.04);
    gallery.classList.toggle('is-steering-right',target<-.04);
  };

  gallery.addEventListener('pointermove',updateSteering);
  gallery.addEventListener('pointerleave',()=>{
    if(drag)return;
    const wasSteering=Math.abs(steerTarget)>.04;
    steerTarget=0;
    gallery.classList.remove('is-steering-left','is-steering-right');
    if(wasSteering)requestPack(420);
  });

  viewport.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('.gallery-control'))return;
    drag=true;
    steerTarget=0;
    steer=0;
    packing=false;
    states.forEach(state=>{state.packTarget=null;state.packV=0;});
    dragPointer=e.pointerId;
    dragStartX=e.clientX;
    dragStarts=states.map(state=>state.x);
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });

  viewport.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==dragPointer)return;
    const dx=e.clientX-dragStartX;
    states.forEach((state,index)=>{
      state.x=dragStarts[index]+dx*state.dragFactor;
      normalize(state);
    });
  });

  const endDrag=e=>{
    if(!drag)return;
    drag=false;
    viewport.classList.remove('is-dragging');
    try{viewport.releasePointerCapture?.(dragPointer);}catch{}
    dragPointer=null;
    requestPack(360);
  };
  viewport.addEventListener('pointerup',endDrag);
  viewport.addEventListener('pointercancel',endDrag);
  viewport.addEventListener('lostpointercapture',()=>{if(drag)endDrag({});});

  const kick=direction=>{
    packing=false;
    requestedPackAt=0;
    states.forEach((state,index)=>{
      state.packTarget=null;
      state.packV=0;
      state.impulse+=direction*([245,165,210][index]||190);
    });
    requestPack(520);
  };

  /* Left control reveals earlier work by pushing the rails right; right does the opposite. */
  left?.addEventListener('click',()=>kick(1));
  right?.addEventListener('click',()=>kick(-1));

  viewport.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){kick(1);e.preventDefault();}
    if(e.key==='ArrowRight'){kick(-1);e.preventDefault();}
  });

  const tick=now=>{
    const dt=Math.min(.04,(now-last)/1000||.016);
    last=now;

    const steerEase=1-Math.exp(-dt*7.5);
    steer+=(steerTarget-steer)*steerEase;

    if(!drag&&!packing){
      if(requestedPackAt&&now>=requestedPackAt&&Math.abs(steer)<.035)startPack();
    }

    let allPacked=true;
    states.forEach((state,index)=>{
      if(state.packTarget!==null){
        let delta=state.packTarget-state.x;
        const stiffness=88;
        const damping=20;
        const acceleration=delta*stiffness-state.packV*damping;
        state.packV+=acceleration*dt;
        state.x+=state.packV*dt;
        if(Math.abs(delta)<.35&&Math.abs(state.packV)<1.6){
          state.x=state.packTarget;
          state.packTarget=null;
          state.packV=0;
        }else{
          allPacked=false;
        }
      }else if(!drag&&!packing){
        /* Base speeds are all leftward; edge steering can slow, accelerate or reverse them. */
        const steerVelocity=steer*([172,96,136][index]||120);
        state.x+=(-state.speed+steerVelocity+state.impulse)*dt;
        state.impulse*=Math.exp(-dt*5.4);
      }else if(packing){
        state.impulse*=Math.exp(-dt*8);
      }

      normalize(state);
      state.strip.__ykLaneX=state.x;
      state.strip.style.transform='translate3d('+state.x.toFixed(2)+'px,0,0)';
    });

    if(packing&&(allPacked||now>=packEnd)){
      packing=false;
      states.forEach(state=>{state.packTarget=null;state.packV=0;});
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
})();


/* Cross-row hero cards: smooth version.
   The tall card only spans two rows while the two reserved slots are nearly
   perfectly aligned. Once they drift apart it falls into a real wide slot.
   Geometry is cached and lane positions are read from JS memory to avoid
   forced layout/style reads on every animation frame. */
(()=>{
  const viewport=document.querySelector('.project-gallery-lanes');
  const gallery=viewport?.closest('[data-project-gallery]');
  if(!viewport||!gallery||viewport.dataset.fallReady)return;

  const strips=[...viewport.querySelectorAll('.project-gallery-strip')];
  const lanes=[...viewport.querySelectorAll('.project-gallery-lane')];
  if(strips.length<3||lanes.length<3)return;
  viewport.dataset.fallReady='1';

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const layer=document.createElement('div');
  layer.className='gallery-fall-layer';
  viewport.appendChild(layer);

  let standardMetrics=[[],[],[]];
  let wideMetrics=[[],[],[]];
  let rows=[];
  let viewportWidth=1;

  const readLaneX=strip=>{
    const x=strip.__ykLaneX;
    return Number.isFinite(x)?x:0;
  };

  const measure=()=>{
    viewportWidth=Math.max(1,viewport.clientWidth);
    rows=lanes.map(lane=>({top:lane.offsetTop,height:lane.offsetHeight}));
    strips.forEach((strip,row)=>{
      const all=[...strip.children].filter(el=>el.classList.contains('project-tile'));
      const metric=el=>({
        tile:el,
        left:el.offsetLeft,
        width:el.offsetWidth,
        center:el.offsetLeft+el.offsetWidth/2
      });
      standardMetrics[row]=all.filter(el=>!el.classList.contains('project-tile--wide')).map(metric);
      wideMetrics[row]=all.filter(el=>el.classList.contains('project-tile--wide')).map(metric);
    });
  };
  measure();
  new ResizeObserver(measure).observe(viewport);

  const started=performance.now();
  const defs=[
    {pair:[0,1],preferred:.43,theme:'amber',firstDelay:4800,startLower:true},
    {pair:[1,2],preferred:.76,theme:'blue',firstDelay:8800,startLower:false}
  ].map((def,index)=>{
    const shell=document.createElement('div');
    shell.className='gallery-fall-shell';
    shell.dataset.landRow=def.startLower?'lower':'upper';

    const card=document.createElement('div');
    card.className='gallery-fall-card gallery-fall-card--'+def.theme;
    shell.appendChild(card);
    layer.appendChild(shell);

    return {
      ...def,index,shell,card,
      mode:'bridge',
      targetRow:def.startLower?def.pair[1]:def.pair[0],
      x:0,y:0,w:0,h:0,
      initialized:false,
      transitionStart:0,
      transitionDuration:0,
      transitionArc:0,
      from:null,
      transitionReserve:[],
      motionProgress:0,
      nextAt:started+def.firstDelay,
      cycle:0,
      hops:0,
      bridgeChoice:null,
      impactTimer:0
    };
  });

  let activeDef=null;
  let reservedPrev=new Set();
  let pressurePrev=new Set();

  const visible=(metrics,xOffset)=>{
    const margin=viewportWidth*.42;
    return metrics
      .map(m=>({
        ...m,
        screenLeft:xOffset+m.left,
        screenCenter:xOffset+m.center
      }))
      .filter(m=>m.screenLeft+m.width>-margin&&m.screenLeft<viewportWidth+margin);
  };

  const nearestWide=(row,xOffset,desiredCenter)=>{
    const candidates=visible(wideMetrics[row],xOffset);
    if(!candidates.length)return null;
    return candidates.reduce((best,m)=>
      Math.abs(m.screenCenter-desiredCenter)<Math.abs(best.screenCenter-desiredCenter)?m:best
    );
  };

  const chooseBridgePair=(def,xs,desiredCenter)=>{
    const upper=visible(standardMetrics[def.pair[0]],xs[def.pair[0]]);
    const lower=visible(standardMetrics[def.pair[1]],xs[def.pair[1]]);
    let best=null;

    for(const a of upper){
      for(const b of lower){
        const align=Math.abs(a.screenLeft-b.screenLeft);
        const center=(a.screenCenter+b.screenCenter)/2;
        const score=align*8+Math.abs(center-desiredCenter)*.16;
        if(!best||score<best.score)best={a,b,align,center,score};
      }
    }
    if(!best)return null;

    const current=def.bridgeChoice;
    if(current){
      const a=upper.find(m=>m.tile===current.a.tile);
      const b=lower.find(m=>m.tile===current.b.tile);
      if(a&&b){
        const align=Math.abs(a.screenLeft-b.screenLeft);
        const center=(a.screenCenter+b.screenCenter)/2;
        const score=align*8+Math.abs(center-desiredCenter)*.16;
        if(score<=best.score*1.28+14){
          def.bridgeChoice={a,b,align,center,score};
          return def.bridgeChoice;
        }
      }
    }

    def.bridgeChoice=best;
    return best;
  };

  const clamp01=t=>Math.max(0,Math.min(1,t));
  const smooth=t=>{
    const p=clamp01(t);
    return p*p*(3-2*p);
  };

  const triggerImpact=(def,landed,targetRow)=>{
    def.shell.dataset.landRow=targetRow===def.pair[0]?'upper':'lower';
    def.shell.classList.toggle('is-landed',landed);
    def.shell.classList.remove('is-impact');
    void def.shell.offsetWidth;
    def.shell.classList.add('is-impact');
    clearTimeout(def.impactTimer);
    def.impactTimer=setTimeout(()=>def.shell.classList.remove('is-impact'),760);
  };

  const beginTransition=(def,target,{landed,targetRow,kind,oldReserve=[]})=>{
    def.transitionStart=performance.now();
    def.transitionReserve=oldReserve.filter(Boolean);
    def.from={x:def.x,y:def.y,w:def.w,h:def.h};
    def.targetRow=targetRow;
    def.motionKind=kind;
    def.transitionDuration=kind==='hop'?980:kind==='stand'?1040:940;
    def.transitionArc=kind==='hop'?-12:kind==='stand'?-8:-6;
    triggerImpact(def,landed,targetRow);
  };

  const resetBubbleShape=def=>{
    def.motionProgress=0;
    def.shell.style.setProperty('--bubble-rotate','0deg');
    def.shell.style.setProperty('--bubble-shell-x','1');
    def.shell.style.setProperty('--bubble-shell-y','1');
    def.shell.style.setProperty('--bubble-radius','13px');
  };

  const moveBox=(def,target,now)=>{
    if(!def.initialized){
      def.x=target.x;def.y=target.y;def.w=target.w;def.h=target.h;
      def.initialized=true;
      resetBubbleShape(def);
      return true;
    }

    const elapsed=now-def.transitionStart;
    if(def.transitionStart&&elapsed<def.transitionDuration){
      const raw=clamp01(elapsed/def.transitionDuration);
      const moveP=1-Math.pow(1-raw,3);
      const shapeP=smooth((raw-.10)/.78);
      const squeeze=Math.sin(Math.PI*raw);
      const settle=Math.sin(Math.PI*2*raw)*(1-raw);
      const from=def.from||target;
      const direction=def.targetRow===def.pair[0]?-1:1;

      // Position moves first; the card then squeezes through a near-square shape.
      def.x=from.x+(target.x-from.x)*moveP+(direction*4*squeeze);
      def.y=from.y+(target.y-from.y)*moveP+(squeeze*def.transitionArc);

      const baseW=from.w+(target.w-from.w)*shapeP;
      const baseH=from.h+(target.h-from.h)*shapeP;
      def.w=Math.max(1,baseW*(1-.045*squeeze));
      def.h=Math.max(1,baseH*(1-.030*squeeze));

      def.motionProgress=squeeze;
      def.shell.style.setProperty('--bubble-rotate',(direction*3.2*squeeze+settle*.9).toFixed(2)+'deg');
      def.shell.style.setProperty('--bubble-shell-x',(1-.022*squeeze).toFixed(3));
      def.shell.style.setProperty('--bubble-shell-y',(1+.020*squeeze).toFixed(3));
      def.shell.style.setProperty('--bubble-radius',(13+13*squeeze).toFixed(1)+'px');
      return false;
    }

    def.transitionStart=0;
    def.transitionReserve=[];
    def.x=target.x;def.y=target.y;def.w=target.w;def.h=target.h;
    resetBubbleShape(def);
    return true;
  };

  const bridgeBox=(def,aligned)=>{
    const upper=rows[def.pair[0]];
    const lower=rows[def.pair[1]];
    const x=Math.round((aligned.a.screenLeft+aligned.b.screenLeft)/2);
    const width=Math.round((aligned.a.width+aligned.b.width)/2);
    return {
      x,
      y:upper.top,
      w:width,
      h:(lower.top+lower.height)-upper.top
    };
  };

  const scheduleBridge=(def,now)=>{
    def.nextAt=now+(def.index===0?7200:8600)+(def.cycle%3)*900;
  };

  const startFall=(def,aligned,xs,now)=>{
    const rowChoice=(def.cycle+(def.startLower?1:0))%2;
    const row=rowChoice?def.pair[1]:def.pair[0];
    const wide=nearestWide(row,xs[row],def.x+def.w/2);
    if(!wide)return false;

    def.mode='landed';
    def.hops=0;
    def.cycle+=1;
    activeDef=def;
    gallery.classList.add('has-crossrow-active');
    def.nextAt=now+3100+(def.index*450)+(def.cycle%2)*700;

    beginTransition(def,{
      x:wide.screenLeft,
      y:rows[row].top,
      w:wide.width,
      h:rows[row].height
    },{
      landed:true,targetRow:row,kind:'fall',
      oldReserve:[aligned.a.tile,aligned.b.tile]
    });
    return true;
  };

  const startHop=(def,xs,now)=>{
    const other=def.targetRow===def.pair[0]?def.pair[1]:def.pair[0];
    const wide=nearestWide(other,xs[other],def.x+def.w/2);
    if(!wide)return false;
    const old=nearestWide(def.targetRow,xs[def.targetRow],def.x+def.w/2);

    def.hops+=1;
    def.nextAt=now+2100+(def.index*300);
    beginTransition(def,{
      x:wide.screenLeft,
      y:rows[other].top,
      w:wide.width,
      h:rows[other].height
    },{
      landed:true,targetRow:other,kind:'hop',
      oldReserve:[old?.tile]
    });
    return true;
  };

  const startStand=(def,aligned,xs)=>{
    const old=nearestWide(def.targetRow,xs[def.targetRow],def.x+def.w/2);
    def.mode='rising';
    def.nextAt=Infinity;
    beginTransition(def,bridgeBox(def,aligned),{
      landed:false,targetRow:def.pair[0],kind:'stand',
      oldReserve:[old?.tile]
    });
  };

  const applyReservations=next=>{
    for(const tile of reservedPrev){
      if(!next.has(tile))tile.classList.remove('is-reserved-by-fall');
    }
    for(const tile of next){
      if(!reservedPrev.has(tile))tile.classList.add('is-reserved-by-fall');
    }
    reservedPrev=next;
  };

  const releaseBubblePressure=next=>{
    for(const tile of pressurePrev){
      if(next.has(tile))continue;
      tile.style.removeProperty('--bubble-shift');
      tile.style.removeProperty('--bubble-scale-x');
      tile.style.removeProperty('--bubble-scale-y');
    }
    pressurePrev=next;
  };

  const applyBubblePressure=(def,xs,reservedNext,pressureNext)=>{
    const transitionAmount=def.transitionStart?Math.max(.08,def.motionProgress):0;
    const restingAmount=def.mode==='landed'?.10:0;
    const amount=Math.max(transitionAmount,restingAmount);
    if(amount<=0)return;

    const center=def.x+def.w/2;
    const activeRows=new Set([...def.pair,def.targetRow]);

    activeRows.forEach(row=>{
      const candidates=visible([...standardMetrics[row],...wideMetrics[row]],xs[row]);
      candidates.forEach(m=>{
        if(reservedNext.has(m.tile))return;
        const distance=m.screenCenter-center;
        const radius=Math.max(250,def.w*.72+155);
        const proximity=Math.max(0,1-Math.abs(distance)/radius);
        if(proximity<=0)return;

        const pressure=proximity*proximity*amount;
        const direction=distance<0?-1:1;
        const maxShift=Math.min(28,14+def.w*.045);
        const shift=direction*maxShift*pressure;
        const sx=1-.032*pressure;
        const sy=1+.014*pressure;

        m.tile.style.setProperty('--bubble-shift',shift.toFixed(2)+'px');
        m.tile.style.setProperty('--bubble-scale-x',sx.toFixed(4));
        m.tile.style.setProperty('--bubble-scale-y',sy.toFixed(4));
        pressureNext.add(m.tile);
      });
    });
  };


  const frame=now=>{
    if(rows.length!==3){
      requestAnimationFrame(frame);
      return;
    }

    const xs=strips.map(readLaneX);
    const reservedNext=new Set();
    const pressureNext=new Set();

    for(const def of defs){
      const desiredCenter=def.initialized?def.x+def.w/2:viewportWidth*def.preferred;
      const aligned=chooseBridgePair(def,xs,desiredCenter);

      if(!aligned){
        def.shell.style.opacity='0';
        continue;
      }

      const upright=bridgeBox(def,aligned);
      let target=upright;

      if(!def.initialized){
        def.x=upright.x;def.y=upright.y;def.w=upright.w;def.h=upright.h;
        def.initialized=true;
      }

      if(def.mode==='bridge'){
        reservedNext.add(aligned.a.tile);
        reservedNext.add(aligned.b.tile);

        // Only remain vertical while the two real slots visually meet.
        // After its minimum display time, the first visible drift triggers the fall.
        if(now>=def.nextAt&&!activeDef&&aligned.align>4.5){
          startFall(def,aligned,xs,now);
        }
      }

      if(def.mode==='landed'){
        const wide=nearestWide(def.targetRow,xs[def.targetRow],def.x+def.w/2);
        if(wide){
          target={x:wide.screenLeft,y:rows[def.targetRow].top,w:wide.width,h:rows[def.targetRow].height};
          reservedNext.add(wide.tile);
        }else{
          target={x:def.x,y:def.y,w:def.w,h:def.h};
        }

        if(now>=def.nextAt&&def.transitionStart===0){
          const shouldHop=def.hops===0&&def.cycle%5===0;
          if(shouldHop){
            if(!startHop(def,xs,now))def.nextAt=now+700;
          }else if(aligned.align<=2.5){
            startStand(def,aligned,xs);
          }else{
            // Wait for a genuinely clean alignment rather than standing up crooked.
            def.nextAt=now+180;
          }
        }
      }

      if(def.mode==='rising'){
        target=upright;
        reservedNext.add(aligned.a.tile);
        reservedNext.add(aligned.b.tile);
      }

      for(const tile of def.transitionReserve)reservedNext.add(tile);
      const settled=moveBox(def,target,now);

      if(def.mode==='rising'&&settled){
        def.mode='bridge';
        activeDef=null;
        gallery.classList.remove('has-crossrow-active');
        scheduleBridge(def,now);
      }

      def.shell.classList.toggle('is-cruising',def.mode==='landed'&&def.transitionStart===0);
      def.shell.style.width=Math.max(1,def.w).toFixed(1)+'px';
      def.shell.style.height=Math.max(1,def.h).toFixed(1)+'px';
      def.shell.style.transform='translate3d('+def.x.toFixed(1)+'px,'+def.y.toFixed(1)+'px,0)';

      const visibleCard=def.x+def.w>-def.w*.3&&def.x<viewportWidth+def.w*.3;
      def.shell.style.opacity=visibleCard?'1':'0';

      applyBubblePressure(def,xs,reservedNext,pressureNext);
    }

    applyReservations(reservedNext);
    releaseBubblePressure(pressureNext);
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
})();
