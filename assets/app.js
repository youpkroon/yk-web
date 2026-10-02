document.getElementById('year').textContent=new Date().getFullYear();
/* Stable section identity underline controller.
   Independent from Projects and other section animations. */
(()=>{
  const init=()=>{
    const rows=[...document.querySelectorAll('.section-id-row')];
    if(!rows.length)return;

    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resolveContent=row=>{
      const section=row.closest('section');
      if(!section)return row;
      switch(section.id){
        case 'capabilities': return section.querySelector('.cap-head')||row;
        case 'workshop': return section.querySelector('.workshop-head')||row;
        case 'work': return section.querySelector('.work-head')||row;
        case 'about': return section.querySelector('.about-copy')||row;
        case 'contact': return section.querySelector('.contact-copy')||row;
        default: return row;
      }
    };

    const items=rows.map(row=>({
      row,
      content:resolveContent(row)
    }));

    if(reduce){
      items.forEach(({row})=>row.style.setProperty('--line-progress','1'));
      return;
    }

    let raf=0;

    const sync=()=>{
      raf=0;
      const vh=Math.max(1,window.innerHeight);
      const viewportCenter=vh*.50;
      const fullZone=vh*.08;
      const fadeZone=vh*.64;

      for(const {row,content} of items){
        const rect=content.getBoundingClientRect();
        const center=rect.top+rect.height*.5;
        const distance=Math.abs(center-viewportCenter);

        let t=1;
        if(distance>fullZone){
          t=1-((distance-fullZone)/(fadeZone-fullZone));
          t=Math.max(0,Math.min(1,t));
        }

        const eased=t*t*(3-2*t);
        const progress=.055+.945*eased;
        row.style.setProperty('--line-progress',progress.toFixed(4));
      }
    };

    const requestSync=()=>{
      if(raf)return;
      raf=requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll',requestSync,{passive:true});
    window.addEventListener('resize',requestSync,{passive:true});
    window.addEventListener('load',requestSync,{once:true});

    if('ResizeObserver' in window){
      const ro=new ResizeObserver(requestSync);
      items.forEach(({content})=>ro.observe(content));
    }

    document.fonts?.ready?.then(requestSync).catch(()=>{});
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();

(function(){
  const hero=document.querySelector('.hero');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){
    hero?.classList.add('hero-ready');
    return;
  }
  requestAnimationFrame(()=>hero?.classList.add('hero-ready'));
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


/* Work gallery slot-coupled bubble morph V7.
   Each vertical card keeps its source-row slot. The crossed row opens only at a
   real boundary between two cards, then translates both row segments so that
   the resulting gap is centered exactly on the vertical card. */
(()=>{
  const section=document.querySelector('.project-streams-section');
  const gallery=section?.querySelector('[data-project-gallery]');
  const viewport=gallery?.querySelector('.project-gallery-lanes');
  const lanes=[...(gallery?.querySelectorAll('[data-gallery-lane]')||[])];
  const strips=lanes.map(lane=>lane.querySelector('.project-gallery-strip'));
  if(!section||!gallery||!viewport||lanes.length!==3||strips.some(x=>!x))return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const start=performance.now();
  const defs=[
    {selector:'.demo-07',row:0,direction:1,preferred:.24,nextAt:start+900,hold:7000,seed:.3,cycle:0},
    {selector:'.demo-13',row:1,direction:1,preferred:.72,nextAt:start+2600,hold:6400,seed:1.7,cycle:0},
    {selector:'.demo-16',row:2,direction:-1,preferred:.43,nextAt:start+4900,hold:6900,seed:3.0,cycle:0},
    {selector:'.demo-01',row:0,direction:1,preferred:.76,nextAt:start+8200,hold:6100,seed:4.3,cycle:0},
    {selector:'.demo-11',row:1,direction:-1,preferred:.31,nextAt:start+10400,hold:6500,seed:5.6,cycle:0},
    {selector:'.demo-19',row:2,direction:-1,preferred:.77,nextAt:start+12800,hold:6200,seed:6.9,cycle:0}
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
    return Number.isFinite(loop)&&loop>1?loop:Math.max(1,strips[row].scrollWidth/2);
  };
  const wrappedDelta=(delta,row)=>{
    const loop=loopLength(row);
    while(delta>loop/2)delta-=loop;
    while(delta<-loop/2)delta+=loop;
    return delta;
  };
  const nearestRepeat=(screenX,row,reference)=>{
    const loop=loopLength(row);
    while(screenX-reference>loop/2)screenX-=loop;
    while(screenX-reference<-loop/2)screenX+=loop;
    return screenX;
  };

  const baseCenter=(tile,row)=>laneX(row)+tile.offsetLeft+tile.offsetWidth/2;

  const visibleInstances=def=>{
    const x=laneX(def.row);
    return [...strips[def.row].querySelectorAll(def.selector)]
      .map(tile=>({
        tile,
        center:x+tile.offsetLeft+tile.offsetWidth/2,
        left:x+tile.offsetLeft,
        width:tile.offsetWidth
      }))
      .filter(m=>m.left+m.width>70&&m.left<viewport.clientWidth-70);
  };

  const chooseTile=def=>{
    const candidates=visibleInstances(def).filter(m=>!active.some(s=>s.tile===m.tile));
    if(!candidates.length)return null;
    const desired=viewport.clientWidth*def.preferred;
    return candidates.reduce((best,m)=>
      Math.abs(m.center-desired)<Math.abs(best.center-desired)?m:best
    );
  };

  const boundaries=row=>{
    const items=[...strips[row].children].filter(tile=>tile.classList.contains('project-tile'));
    const result=[];
    for(let i=0;i<items.length-1;i++){
      const left=items[i];
      const right=items[i+1];
      const leftEdge=left.offsetLeft+left.offsetWidth;
      const rightEdge=right.offsetLeft;
      if(rightEdge<=leftEdge)continue;
      result.push({
        offset:(leftEdge+rightEdge)/2,
        baseGap:rightEdge-leftEdge
      });
    }
    return result;
  };

  const nearestBoundary=(row,reference)=>{
    const x=laneX(row);
    const candidates=boundaries(row);
    if(!candidates.length)return null;

    let best=null;
    for(const boundary of candidates){
      const screen=nearestRepeat(x+boundary.offset,row,reference);
      const distance=Math.abs(screen-reference);
      if(!best||distance<best.distance){
        best={...boundary,screen,distance};
      }
    }
    return best;
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
    const stiffness=43;
    const damping=11.8;
    const a=(state.target-state.p)*stiffness-state.v*damping;
    state.v+=a*dt;
    state.p+=state.v*dt;
    state.p=Math.max(-.035,Math.min(1.06,state.p));
  };

  const activate=(def,chosen,now)=>{
    const targetRow=def.row+def.direction;
    const boundary=nearestBoundary(targetRow,chosen.center);
    if(!boundary)return false;

    const rowHeight=lanes[def.row].clientHeight;
    const verticalGap=parseFloat(getComputedStyle(viewport).rowGap||getComputedStyle(viewport).gap)||10;
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
      targetRow,
      boundaryOffset:boundary.offset,
      boundaryBaseGap:boundary.baseGap,
      rowHeight,
      verticalGap,
      targetSx:Math.min(.70,Math.max(.40,normalWidth/Math.max(1,chosen.tile.offsetWidth))),
      targetSy:(rowHeight*2+verticalGap)/Math.max(1,chosen.tile.offsetHeight),
      startedAt:now
    });

    def.nextAt=Infinity;
    return true;
  };

  const finish=(state,now)=>{
    const i=active.indexOf(state);
    if(i>=0)active.splice(i,1);
    state.def.cycle+=1;
    state.def.nextAt=now+4700+(state.def.cycle%3)*750+state.def.row*350;
  };

  const maxActive=()=>{
    if(viewport.clientWidth>=1420)return 2;
    return 1;
  };

  const prepState=state=>{
    const p=clamp01(state.p);
    const eased=smooth(p);
    const sourceRow=state.def.row;
    const targetRow=state.targetRow;
    const heroCenter=baseCenter(state.tile,sourceRow);
    const sx=1+(state.targetSx-1)*eased;
    const sy=1+(state.targetSy-1)*eased;
    const visualWidth=state.tile.offsetWidth*sx;
    const sourceRelease=(state.tile.offsetWidth-visualWidth)/2;

    const rawBoundary=laneX(targetRow)+state.boundaryOffset;
    const boundary=nearestRepeat(rawBoundary,targetRow,heroCenter);

    return {
      state,p,eased,sourceRow,targetRow,heroCenter,boundary,
      sx,sy,visualWidth,sourceRelease,
      extraGap:(visualWidth+state.boundaryBaseGap)*eased,
      align:(heroCenter-boundary)*eased
    };
  };

  const ownShiftAt=(prep,row,point)=>{
    let shift=0;

    if(row===prep.sourceRow){
      const d=wrappedDelta(point-prep.heroCenter,row);
      if(Math.abs(d)>.5){
        shift+=d<0?prep.sourceRelease:-prep.sourceRelease;
      }
    }

    if(row===prep.targetRow){
      const d=wrappedDelta(point-prep.boundary,row);
      const half=prep.extraGap/2;
      if(d<0)shift+=prep.align-half;
      else shift+=prep.align+half;
    }

    return shift;
  };

  const combinedShiftAt=(row,point,preps,exclude=null)=>{
    let shift=0;
    for(const prep of preps){
      if(prep===exclude)continue;
      shift+=ownShiftAt(prep,row,point);
    }
    return shift;
  };

  const refinePreps=()=>{
    const preps=active.map(prepState);

    // Two small fixed-point passes align every target gap after all other
    // vertical units have shifted the same row.
    for(let pass=0;pass<2;pass++){
      for(const prep of preps){
        const heroOther=combinedShiftAt(prep.sourceRow,prep.heroCenter,preps,prep);
        const leftOther=combinedShiftAt(prep.targetRow,prep.boundary-1,preps,prep);
        const rightOther=combinedShiftAt(prep.targetRow,prep.boundary+1,preps,prep);
        const boundaryOther=(leftOther+rightOther)/2;
        prep.align=(prep.heroCenter+heroOther-(prep.boundary+boundaryOther))*prep.eased;
      }
    }

    return preps;
  };

  const conflicts=(def,chosen,boundary)=>{
    const pair=[def.row,def.row+def.direction].sort().join('-');
    const minDistance=Math.max(360,viewport.clientWidth*.20);

    return active.some(state=>{
      const prep=prepState(state);
      const otherPair=[prep.sourceRow,prep.targetRow].sort().join('-');
      const distance=Math.abs(chosen.center-prep.heroCenter);
      return distance<minDistance || (pair===otherPair&&distance<460);
    });
  };

  const tryStart=now=>{
    if(active.length>=maxActive())return;

    const due=defs
      .filter(def=>now>=def.nextAt&&!active.some(state=>state.def===def))
      .sort((a,b)=>a.nextAt-b.nextAt);

    for(const def of due){
      if(active.length>=maxActive())break;

      const chosen=chooseTile(def);
      if(!chosen){
        def.nextAt=now+500;
        continue;
      }

      const targetRow=def.row+def.direction;
      const boundary=nearestBoundary(targetRow,chosen.center);
      if(!boundary){
        def.nextAt=now+600;
        continue;
      }

      if(conflicts(def,chosen,boundary)){
        def.nextAt=now+650;
        continue;
      }

      activate(def,chosen,now);
    }
  };

  const render=now=>{
    const preps=refinePreps();
    const map=new Map();
    const heroTiles=new Set(active.map(state=>state.tile));

    for(let row=0;row<strips.length;row++){
      const tiles=[...strips[row].children].filter(tile=>tile.classList.contains('project-tile'));

      for(const tile of tiles){
        if(heroTiles.has(tile))continue;

        const center=baseCenter(tile,row);
        const s=ensure(map,tile);
        s.x=combinedShiftAt(row,center,preps);

        // Soft deformation only at the edge of a real gap.
        let pressure=0;
        let pressureSign=0;
        for(const prep of preps){
          let edgeCenter=null;
          let edgeDistance=Infinity;

          if(row===prep.sourceRow){
            const d=wrappedDelta(center-prep.heroCenter,row);
            edgeDistance=Math.abs(Math.abs(d)-prep.visualWidth/2);
            edgeCenter=prep.heroCenter;
          }
          if(row===prep.targetRow){
            const d=wrappedDelta(center-(prep.boundary+prep.align),row);
            const distance=Math.abs(Math.abs(d)-prep.visualWidth/2);
            if(distance<edgeDistance){
              edgeDistance=distance;
              edgeCenter=prep.boundary+prep.align;
            }
          }

          if(edgeCenter!==null){
            const local=Math.max(0,1-edgeDistance/120)*prep.eased;
            if(local>pressure){
              pressure=local;
              pressureSign=wrappedDelta(center-edgeCenter,row)<0?-1:1;
            }
          }
        }

        s.r=pressureSign*.7*pressure;
        s.sx=1-.030*pressure;
        s.sy=1+.012*pressure;
        s.radius=13+7*pressure;
      }
    }

    for(const prep of preps){
      const state=prep.state;
      const s=ensure(map,state.tile);
      const envX=combinedShiftAt(prep.sourceRow,prep.heroCenter,preps,prep);
      const breathe=state.phase==='hold'
        ? Math.sin(now*.00165+state.def.seed)*prep.eased
        : 0;
      const squeeze=Math.sin(Math.PI*prep.p);

      s.hero=true;
      s.x=envX+breathe*2.4;
      s.y=state.def.direction*(state.rowHeight+state.verticalGap)*.5*prep.eased+breathe*1.0;
      s.r=state.def.direction*4.2*squeeze+state.v*.95+breathe*.65;
      s.sx=prep.sx*(1-.023*squeeze);
      s.sy=prep.sy*(1+.011*squeeze);
      s.radius=13+21*squeeze+Math.abs(breathe)*2;
    }

    applyStyles(map);
    gallery.classList.toggle('has-bubble-hero',active.length>0);
    gallery.classList.toggle('has-crossrow-active',active.length>0);
    gallery.classList.toggle('has-two-bubbles',active.length>1);
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


/* =========================================================
   X-INSPIRED SECTION MOTION
   One IntersectionObserver, no libraries.
   Existing content, ids and layout are left untouched.
   ========================================================= */
(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root=document.documentElement;
  const targets=[];

  const addTarget=(el,type,delay=0,vars={})=>{
    if(!el)return;
    el.dataset.xReveal=type;
    el.style.setProperty('--x-delay',Math.max(0,delay)+'ms');
    Object.entries(vars).forEach(([key,value])=>el.style.setProperty(key,value));
    targets.push(el);
  };

  const splitTitle=el=>{
    if(!el||el.dataset.xLettersReady)return;
    const text=el.textContent||'';
    el.dataset.xLettersReady='1';
    el.setAttribute('aria-label',text.trim());
    el.textContent='';
    let charIndex=0;

    text.split(/(\s+)/).forEach(token=>{
      if(/^\s+$/.test(token)){
        el.appendChild(document.createTextNode(token));
        return;
      }

      const word=document.createElement('span');
      word.className='x-title-word';
      word.setAttribute('aria-hidden','true');

      [...token].forEach(char=>{
        const letter=document.createElement('span');
        letter.className='x-title-letter';
        letter.textContent=char;
        letter.style.setProperty('--x-letter-delay',(charIndex*30)+'ms');
        charIndex+=1;
        word.appendChild(letter);
      });

      el.appendChild(word);
    });

    addTarget(el,'letters',0);
  };

  /* Section titles: X-style letter build, preserving the exact text. */
  document.querySelectorAll('.section-title').forEach(splitTitle);

  /* About: two controlled directions rather than scattered motion. */
  addTarget(document.querySelector('#about .about-copy'),'from-left',0,{
    '--x-from-x':'-90px',
    '--x-from-y':'18px'
  });
  addTarget(document.querySelector('#about .about-visual'),'from-right',120,{
    '--x-from-x':'110px',
    '--x-from-y':'-12px'
  });

  /* Services: deterministic "random" assembly inspired by X homepage. */
  const scatter=[
    ['-285px','-70px','.74','-4deg'],
    ['245px','45px','1.12','3deg'],
    ['-170px','235px','.82','5deg'],
    ['295px','-135px','.70','-5deg'],
    ['-255px','120px','1.08','4deg'],
    ['210px','220px','.78','6deg'],
    ['285px','80px','.88','-4deg'],
    ['-205px','-175px','1.14','5deg']
  ];

  document.querySelectorAll('#capabilities .skill').forEach((el,i)=>{
    const [x,y,scale,rot]=scatter[i%scatter.length];
    const delay=(i*137)%480;
    addTarget(el,'assemble',delay,{
      '--x-from-x':x,
      '--x-from-y':y,
      '--x-from-scale':scale,
      '--x-from-rot':rot
    });
  });

  document.querySelectorAll('#capabilities .pill').forEach((el,i)=>{
    addTarget(el,'small-rise',80+i*55,{
      '--x-from-y':'34px'
    });
  });

  addTarget(document.querySelector('#capabilities .intro'),'from-right',90,{
    '--x-from-x':'85px',
    '--x-from-y':'0px'
  });

  /* Workshop: calmer, mostly vertical rise like X Projects. */
  addTarget(document.querySelector('#workshop .intro'),'small-rise',120,{
    '--x-from-y':'70px'
  });
  document.querySelectorAll('#workshop .work-card').forEach((el,i)=>{
    addTarget(el,'bottom-card',i*100,{
      '--x-from-y':'150px'
    });
  });

  /* Projects overview: restrained directional build. */
  addTarget(document.querySelector('#work .work-overview .intro'),'from-right',100,{
    '--x-from-x':'95px',
    '--x-from-y':'20px'
  });

  /* Contact: two pieces converge rather than using the same card motion. */
  addTarget(document.querySelector('#contact .contact-copy'),'from-left',0,{
    '--x-from-x':'-105px',
    '--x-from-y':'30px'
  });
  addTarget(document.querySelector('#contact .contact-main-link'),'from-right',150,{
    '--x-from-x':'120px',
    '--x-from-y':'40px'
  });
  addTarget(document.querySelector('#contact .foot'),'small-rise',260,{
    '--x-from-y':'45px'
  });

  /* Projects gallery uses its original proven reveal and motion. */

  if(reduce){
    targets.forEach(el=>{
      el.dataset.inView='1';
      el.classList.add('is-built');
    });
    return;
  }

  root.classList.add('x-motion-ready');

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      el.dataset.inView='1';
      el.classList.add('is-built');
      observer.unobserve(el);
    });
  },{
    threshold:.10,
    rootMargin:'0px 0px -7% 0px'
  });

  targets.forEach(el=>observer.observe(el));
})();



/* FAQ accordion */
(()=>{
  const section=document.querySelector('.faq-section');
  if(!section)return;

  const items=[...section.querySelectorAll('.faq-item')];

  const setOpen=(item,open)=>{
    const button=item.querySelector('.faq-question');
    const answer=item.querySelector('.faq-answer');
    item.classList.toggle('is-open',open);
    button?.setAttribute('aria-expanded',open?'true':'false');
    answer?.setAttribute('aria-hidden',open?'false':'true');
  };

  items.forEach(item=>{
    item.querySelector('.faq-question')?.addEventListener('click',()=>{
      const willOpen=!item.classList.contains('is-open');
      items.forEach(other=>setOpen(other,false));
      if(willOpen)setOpen(item,true);
    });
  });
})();
