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
      state.strip.__ykLoop=state.loop;
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
    if(drag||Math.abs(steerTarget)>.03||gallery.classList.contains('has-crossrow-active')||gallery.classList.contains('has-bubble-hero')){
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


/* Work gallery coupled bubble morph V6.
   Vertical units and every neighbouring tile are solved as one 1D packing system.
   Source rows close the released width exactly; crossed rows open the required width exactly.
   Local squish is added only at the gap edges for a softer bubble feel. */
(()=>{
  const section=document.querySelector('.project-streams-section');
  const gallery=section?.querySelector('[data-project-gallery]');
  const viewport=gallery?.querySelector('.project-gallery-lanes');
  const lanes=[...(gallery?.querySelectorAll('[data-gallery-lane]')||[])];
  const strips=lanes.map(lane=>lane.querySelector('.project-gallery-strip'));
  if(!section||!gallery||!viewport||lanes.length!==3||strips.some(x=>!x))return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const t0=performance.now();
  const defs=[
    {selector:'.demo-07',row:0,direction:1,preferred:.22,nextAt:t0+1100,hold:6200,seed:.4,cycle:0},
    {selector:'.demo-13',row:1,direction:1,preferred:.73,nextAt:t0+2600,hold:5600,seed:1.8,cycle:0},
    {selector:'.demo-16',row:2,direction:-1,preferred:.47,nextAt:t0+4300,hold:6500,seed:3.1,cycle:0},
    {selector:'.demo-01',row:0,direction:1,preferred:.78,nextAt:t0+6900,hold:5100,seed:4.6,cycle:0},
    {selector:'.demo-11',row:1,direction:-1,preferred:.34,nextAt:t0+8400,hold:5900,seed:5.8,cycle:0},
    {selector:'.demo-19',row:2,direction:-1,preferred:.79,nextAt:t0+10100,hold:5400,seed:7.2,cycle:0}
  ];

  const active=[];
  let touched=new Set();
  let last=performance.now();

  const clamp01=v=>Math.max(0,Math.min(1,v));
  const smooth=v=>{
    const p=clamp01(v);
    return p*p*(3-2*p);
  };

  const laneX=row=>{
    const x=strips[row].__ykLaneX;
    return Number.isFinite(x)?x:0;
  };
  const loopLength=row=>{
    const loop=strips[row].__ykLoop;
    return Number.isFinite(loop)&&loop>1?loop:strips[row].scrollWidth/2;
  };
  const wrappedDelta=(delta,row)=>{
    const loop=loopLength(row);
    if(!Number.isFinite(loop)||loop<=1)return delta;
    while(delta>loop/2)delta-=loop;
    while(delta<-loop/2)delta+=loop;
    return delta;
  };

  const gapSize=()=>{
    const style=getComputedStyle(viewport);
    return parseFloat(style.rowGap||style.gap)||10;
  };

  const baseCenter=(tile,row)=>laneX(row)+tile.offsetLeft+tile.offsetWidth/2;

  const visibleInstances=def=>{
    const x=laneX(def.row);
    const width=viewport.clientWidth;
    return [...strips[def.row].querySelectorAll(def.selector)]
      .map(tile=>({
        tile,
        center:x+tile.offsetLeft+tile.offsetWidth/2,
        left:x+tile.offsetLeft,
        width:tile.offsetWidth
      }))
      .filter(m=>m.left+m.width>50&&m.left<width-50);
  };

  const chooseTile=def=>{
    const candidates=visibleInstances(def)
      .filter(m=>!active.some(s=>s.tile===m.tile));
    if(!candidates.length)return null;
    const desired=viewport.clientWidth*def.preferred;
    return candidates.reduce((best,m)=>
      Math.abs(m.center-desired)<Math.abs(best.center-desired)?m:best
    );
  };

  const ensure=(map,tile)=>{
    if(!map.has(tile)){
      map.set(tile,{x:0,y:0,r:0,sx:1,sy:1,radius:13,hero:false});
    }
    return map.get(tile);
  };

  const applyStyles=map=>{
    const next=new Set(map.keys());

    for(const tile of touched){
      if(next.has(tile))continue;
      tile.style.removeProperty('--bubble-x');
      tile.style.removeProperty('--bubble-y');
      tile.style.removeProperty('--bubble-r');
      tile.style.removeProperty('--bubble-sx');
      tile.style.removeProperty('--bubble-sy');
      tile.style.removeProperty('--bubble-radius');
      tile.classList.remove('is-bubble-hero');
    }

    for(const [tile,s] of map){
      tile.style.setProperty('--bubble-x',s.x.toFixed(2)+'px');
      tile.style.setProperty('--bubble-y',s.y.toFixed(2)+'px');
      tile.style.setProperty('--bubble-r',s.r.toFixed(2)+'deg');
      tile.style.setProperty('--bubble-sx',s.sx.toFixed(4));
      tile.style.setProperty('--bubble-sy',s.sy.toFixed(4));
      tile.style.setProperty('--bubble-radius',s.radius.toFixed(1)+'px');
      tile.classList.toggle('is-bubble-hero',s.hero);
    }

    touched=next;
  };

  const spring=(state,dt)=>{
    const stiffness=44;
    const damping=11.9;
    const acceleration=(state.target-state.p)*stiffness-state.v*damping;
    state.v+=acceleration*dt;
    state.p+=state.v*dt;
    state.p=Math.max(-.035,Math.min(1.065,state.p));
  };

  const activate=(def,chosen,now)=>{
    const rowHeight=lanes[def.row].clientHeight;
    const gap=gapSize();
    const normal=[...strips[def.row].children].find(tile=>
      tile.classList.contains('project-tile')&&!tile.classList.contains('project-tile--wide')
    );
    const normalWidth=normal?.offsetWidth||chosen.tile.offsetHeight;

    active.push({
      def,
      tile:chosen.tile,
      p:0,
      v:0,
      target:1,
      phase:'grow',
      holdUntil:0,
      startedAt:now,
      rowHeight,
      gap,
      targetSx:Math.min(.70,Math.max(.40,normalWidth/Math.max(1,chosen.tile.offsetWidth))),
      targetSy:(rowHeight*2+gap)/Math.max(1,chosen.tile.offsetHeight)
    });
    def.nextAt=Infinity;
  };

  const finish=(state,now)=>{
    const index=active.indexOf(state);
    if(index>=0)active.splice(index,1);
    state.def.cycle+=1;
    state.def.nextAt=now+6500+(state.def.cycle%4)*900+state.def.row*420;
  };

  const maxActive=()=>{
    if(viewport.clientWidth>=1500)return 3;
    if(viewport.clientWidth>=950)return 2;
    return 1;
  };

  const statePrep=state=>{
    const p=clamp01(state.p);
    const eased=smooth(p);
    const sourceRow=state.def.row;
    const targetRow=sourceRow+state.def.direction;
    const center0=baseCenter(state.tile,sourceRow);
    const sx=1+(state.targetSx-1)*eased;
    const sy=1+(state.targetSy-1)*eased;
    const visualWidth=state.tile.offsetWidth*sx;

    return {
      state,p,eased,sourceRow,targetRow,
      center0,center:center0,
      sx,sy,visualWidth,
      releaseHalf:Math.max(0,(state.tile.offsetWidth-visualWidth)/2),
      gapHalf:(visualWidth+state.gap*1.45)*.5*eased
    };
  };

  const shiftAt=(row,point,preps,excludeState=null,useAdjusted=false)=>{
    let shift=0;
    for(const prep of preps){
      const state=prep.state;
      if(state===excludeState)continue;
      const center=useAdjusted?prep.center:prep.center0;
      const d=wrappedDelta(point-center,row);
      if(Math.abs(d)<.5)continue;

      if(row===prep.sourceRow){
        shift+=d<0?prep.releaseHalf:-prep.releaseHalf;
      }
      if(row===prep.targetRow){
        shift+=d<0?-prep.gapHalf:prep.gapHalf;
      }
    }
    return shift;
  };

  const prepareStates=()=>{
    const preps=active.map(statePrep);

    // First pass: move each hero with the environment created by all other heroes.
    preps.forEach(prep=>{
      prep.environmentX=shiftAt(
        prep.sourceRow,
        prep.center0,
        preps,
        prep.state,
        false
      );
      prep.center=prep.center0+prep.environmentX;
    });

    return preps;
  };

  const conflict=(chosen,def,preps)=>{
    const minDistance=Math.max(315,viewport.clientWidth*.17);
    return preps.some(prep=>{
      const targetPairA=[def.row,def.row+def.direction].sort().join('-');
      const targetPairB=[prep.sourceRow,prep.targetRow].sort().join('-');
      const distance=Math.abs(chosen.center-prep.center);
      return distance<minDistance || (targetPairA===targetPairB&&distance<390);
    });
  };

  const tryStart=now=>{
    if(active.length>=maxActive())return;
    const preps=prepareStates();

    const due=defs
      .filter(def=>now>=def.nextAt&&!active.some(s=>s.def===def))
      .sort((a,b)=>a.nextAt-b.nextAt);

    for(const def of due){
      if(active.length>=maxActive())break;
      const chosen=chooseTile(def);
      if(!chosen){
        def.nextAt=now+550;
        continue;
      }
      if(conflict(chosen,def,preps)){
        def.nextAt=now+650;
        continue;
      }
      activate(def,chosen,now);
      preps.push(statePrep(active[active.length-1]));
    }
  };

  const render=now=>{
    const preps=prepareStates();
    const map=new Map();
    const heroTiles=new Set(active.map(s=>s.tile));

    // First solve every normal tile as one rigidly coupled row packing system.
    for(let row=0;row<strips.length;row++){
      const tiles=[...strips[row].children].filter(tile=>tile.classList.contains('project-tile'));

      for(const tile of tiles){
        if(heroTiles.has(tile))continue;

        const center=baseCenter(tile,row);
        const x=shiftAt(row,center,preps,null,true);
        let edgePressure=0;
        let edgeSign=0;

        // Only the shape, not the position, gets a local soft falloff.
        for(const prep of preps){
          if(row!==prep.sourceRow&&row!==prep.targetRow)continue;
          const d=wrappedDelta(center-prep.center,row);
          const edge=row===prep.targetRow?prep.gapHalf:prep.visualWidth*.5;
          const distToEdge=Math.abs(Math.abs(d)-edge);
          const local=Math.max(0,1-distToEdge/150)*prep.eased;
          if(local>edgePressure){
            edgePressure=local;
            edgeSign=d<0?-1:1;
          }
        }

        const s=ensure(map,tile);
        s.x=x;
        s.r=edgeSign*.65*edgePressure;
        s.sx=1-.034*edgePressure;
        s.sy=1+.014*edgePressure;
        s.radius=13+7*edgePressure;
      }
    }

    // Then render the vertical units themselves on top of that same packing solution.
    for(const prep of preps){
      const state=prep.state;
      const s=ensure(map,state.tile);
      const breathe=state.phase==='hold'
        ? Math.sin(now*.0017+state.def.seed)*prep.eased
        : 0;
      const squeeze=Math.sin(Math.PI*prep.p);
      const verticalStep=(state.rowHeight+state.gap)*.5*prep.eased;

      s.hero=true;
      s.x=prep.environmentX+breathe*2.8;
      s.y=state.def.direction*verticalStep+breathe*1.2;
      s.r=state.def.direction*4.6*squeeze+state.v*1.05+breathe*.8;
      s.sx=prep.sx*(1-.026*squeeze);
      s.sy=prep.sy*(1+.012*squeeze);
      s.radius=13+22*squeeze+Math.abs(breathe)*2.5;
    }

    applyStyles(map);

    gallery.classList.toggle('has-bubble-hero',active.length>0);
    gallery.classList.toggle('has-crossrow-active',active.length>0);
    gallery.classList.toggle('has-two-bubbles',active.length>1);
    gallery.classList.toggle('has-three-bubbles',active.length>2);
  };

  const tick=now=>{
    const dt=Math.min(.033,(now-last)/1000||.016);
    last=now;

    tryStart(now);

    for(const state of [...active]){
      spring(state,dt);

      if(state.phase==='grow'&&Math.abs(1-state.p)<.012&&Math.abs(state.v)<.045){
        state.p=1;
        state.v=0;
        state.phase='hold';
        state.holdUntil=now+state.def.hold;
      }else if(state.phase==='hold'&&now>=state.holdUntil){
        state.target=0;
        state.phase='return';
      }else if(state.phase==='return'&&Math.abs(state.p)<.012&&Math.abs(state.v)<.045){
        state.p=0;
        state.v=0;
        finish(state,now);
      }
    }

    render(now);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
})();
