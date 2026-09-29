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


/* Work gallery bubble morph.
   A real wide tile morphs in place and nearby tiles yield around it. */
(()=>{
  const section=document.querySelector('.project-streams-section');
  const gallery=section?.querySelector('[data-project-gallery]');
  const viewport=gallery?.querySelector('.project-gallery-lanes');
  const lanes=[...(gallery?.querySelectorAll('[data-gallery-lane]')||[])];
  const strips=lanes.map(lane=>lane.querySelector('.project-gallery-strip'));
  if(!section||!gallery||!viewport||lanes.length!==3||strips.some(x=>!x))return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const defs=[
    {selector:'.demo-07',row:0,direction:1,preferred:.43,firstDelay:3200,hold:2500},
    {selector:'.demo-13',row:1,direction:1,preferred:.70,firstDelay:6400,hold:2300}
  ];

  let active=null;
  let nextDef=0;
  let nextAt=performance.now()+defs[0].firstDelay;
  let touched=new Set();
  let last=performance.now();

  const laneX=row=>{
    const x=strips[row].__ykLaneX;
    return Number.isFinite(x)?x:0;
  };

  const rowGap=()=>{
    const style=getComputedStyle(viewport);
    return parseFloat(style.rowGap||style.gap)||10;
  };

  const visibleInstances=def=>{
    const x=laneX(def.row);
    const width=viewport.clientWidth;
    return [...strips[def.row].querySelectorAll(def.selector)]
      .map(tile=>({
        tile,
        left:x+tile.offsetLeft,
        width:tile.offsetWidth,
        center:x+tile.offsetLeft+tile.offsetWidth/2
      }))
      .filter(m=>m.left+m.width>50&&m.left<width-50);
  };

  const chooseTile=def=>{
    const candidates=visibleInstances(def);
    if(!candidates.length)return null;
    const desired=viewport.clientWidth*def.preferred;
    return candidates.reduce((best,m)=>
      Math.abs(m.center-desired)<Math.abs(best.center-desired)?m:best
    );
  };

  const setVars=(tile,{x=0,y=0,r=0,sx=1,sy=1,radius=13})=>{
    tile.style.setProperty('--bubble-x',x.toFixed(2)+'px');
    tile.style.setProperty('--bubble-y',y.toFixed(2)+'px');
    tile.style.setProperty('--bubble-r',r.toFixed(2)+'deg');
    tile.style.setProperty('--bubble-sx',sx.toFixed(4));
    tile.style.setProperty('--bubble-sy',sy.toFixed(4));
    tile.style.setProperty('--bubble-radius',radius.toFixed(1)+'px');
    touched.add(tile);
  };

  const clearVars=tile=>{
    tile.style.removeProperty('--bubble-x');
    tile.style.removeProperty('--bubble-y');
    tile.style.removeProperty('--bubble-r');
    tile.style.removeProperty('--bubble-sx');
    tile.style.removeProperty('--bubble-sy');
    tile.style.removeProperty('--bubble-radius');
  };

  const clearUntouched=next=>{
    for(const tile of touched){
      if(next.has(tile))continue;
      clearVars(tile);
      tile.classList.remove('is-bubble-hero');
    }
    touched=next;
  };

  const activate=(def,chosen)=>{
    const rowHeight=lanes[def.row].clientHeight;
    const gap=rowGap();
    const baseTile=[...strips[def.row].children].find(el=>
      el.classList.contains('project-tile')&&!el.classList.contains('project-tile--wide')
    );
    const baseWidth=baseTile?.offsetWidth||chosen.tile.offsetHeight;

    active={
      def,
      tile:chosen.tile,
      p:0,
      v:0,
      target:1,
      phase:'grow',
      holdUntil:0,
      rowHeight,
      gap,
      targetSx:Math.min(.72,Math.max(.44,baseWidth/Math.max(1,chosen.tile.offsetWidth))),
      targetSy:(rowHeight*2+gap)/Math.max(1,chosen.tile.offsetHeight)
    };

    chosen.tile.classList.add('is-bubble-hero');
    gallery.classList.add('has-bubble-hero','has-crossrow-active');
    nextAt=Infinity;
  };

  const finish=now=>{
    if(!active)return;
    clearVars(active.tile);
    active.tile.classList.remove('is-bubble-hero');
    active=null;
    gallery.classList.remove('has-bubble-hero','has-crossrow-active');
    nextDef=(nextDef+1)%defs.length;
    nextAt=now+(nextDef===0?2500:3000);
  };

  const spring=(state,dt)=>{
    const stiffness=48;
    const damping=12.8;
    const a=(state.target-state.p)*stiffness-state.v*damping;
    state.v+=a*dt;
    state.p+=state.v*dt;
    state.p=Math.max(-.025,Math.min(1.055,state.p));
  };

  const applyFrame=(state,next)=>{
    const p=Math.max(0,Math.min(1,state.p));
    const tile=state.tile;
    const row=state.def.row;
    const targetRow=row+state.def.direction;
    const center=laneX(row)+tile.offsetLeft+tile.offsetWidth/2;

    const squeeze=Math.sin(Math.PI*p);
    const sx=1+(state.targetSx-1)*p;
    const sy=1+(state.targetSy-1)*p;
    const y=state.def.direction*(state.rowHeight+state.gap)*.5*p;
    const rotation=state.def.direction*(4.5*squeeze)+state.v*1.35;
    const radius=13+20*squeeze;

    setVars(tile,{
      x:0,
      y,
      r:rotation,
      sx:sx*(1-.035*squeeze),
      sy:sy*(1+.015*squeeze),
      radius
    });
    next.add(tile);

    const collapse=(tile.offsetWidth-tile.offsetWidth*sx)*.5;
    const heroCenter=center;

    // Same row gently closes the gap as the wide tile becomes narrow.
    [...strips[row].children].forEach(other=>{
      if(other===tile||!other.classList.contains('project-tile'))return;
      const otherCenter=laneX(row)+other.offsetLeft+other.offsetWidth/2;
      const d=otherCenter-heroCenter;
      const radiusX=Math.max(440,tile.offsetWidth*1.2);
      const proximity=Math.max(0,1-Math.abs(d)/radiusX);
      if(proximity<=0)return;
      const strength=proximity*proximity*p;
      const direction=d<0?1:-1;
      setVars(other,{
        x:direction*collapse*.58*strength,
        y:0,
        r:0,
        sx:1-.014*strength,
        sy:1+.006*strength,
        radius:13
      });
      next.add(other);
    });

    // The adjacent row bubbles out of the way where the tall tile passes through.
    if(targetRow>=0&&targetRow<strips.length){
      [...strips[targetRow].children].forEach(other=>{
        if(!other.classList.contains('project-tile'))return;
        const otherCenter=laneX(targetRow)+other.offsetLeft+other.offsetWidth/2;
        const d=otherCenter-heroCenter;
        const radiusX=Math.max(390,tile.offsetHeight*2.05);
        const proximity=Math.max(0,1-Math.abs(d)/radiusX);
        if(proximity<=0)return;
        const strength=proximity*proximity*p;
        const direction=d<0?-1:1;
        setVars(other,{
          x:direction*(36+18*squeeze)*strength,
          y:0,
          r:direction*.9*squeeze*strength,
          sx:1-.035*strength,
          sy:1+.014*strength,
          radius:13+5*strength
        });
        next.add(other);
      });
    }
  };

  const tick=now=>{
    const dt=Math.min(.033,(now-last)/1000||.016);
    last=now;

    if(!active&&now>=nextAt){
      const def=defs[nextDef];
      const chosen=chooseTile(def);
      if(chosen)activate(def,chosen);
      else nextAt=now+700;
    }

    const nextTouched=new Set();

    if(active){
      spring(active,dt);

      if(active.phase==='grow'&&Math.abs(1-active.p)<.012&&Math.abs(active.v)<.05){
        active.p=1;
        active.v=0;
        active.phase='hold';
        active.holdUntil=now+active.def.hold;
      }else if(active.phase==='hold'&&now>=active.holdUntil){
        active.target=0;
        active.phase='return';
      }else if(active.phase==='return'&&Math.abs(active.p)<.012&&Math.abs(active.v)<.05){
        active.p=0;
        active.v=0;
        finish(now);
      }

      if(active)applyFrame(active,nextTouched);
    }

    clearUntouched(nextTouched);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
})();
