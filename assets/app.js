document.getElementById('year').textContent=new Date().getFullYear();
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero=document.querySelector('.hero');
  const textTargets=[...document.querySelectorAll('.hero h1'),...document.querySelectorAll('.eyebrow,.section-title,.skill h3,.work-card strong,.project-title,.contact h2,.contact-link')];
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
  document.querySelectorAll('.project').forEach((el,i)=>makeFly(el,i+6,.09*i));
  document.querySelectorAll('.pill').forEach((el,i)=>{el.classList.add('fly-build');const v=vectors[(i+4)%vectors.length];el.style.setProperty('--fx',v.x);el.style.setProperty('--fy',v.y);el.style.setProperty('--fr',v.r);el.style.setProperty('--mr',v.mr);el.style.setProperty('--fs','.80');el.style.setProperty('--ms','1.018');el.style.setProperty('--mx',v.mx);el.style.setProperty('--my',v.my);el.style.setProperty('--fly-dur',v.d);el.style.setProperty('--fly-delay',`${.055*i}s`);});
  document.querySelectorAll('.section-brand,.intro,.about-placeholder,.hero-meta,.skill p,.skill-tags,.image-note,.skill-num,.skill-dot,.project small,.work-card small,.foot').forEach((el,i)=>{el.classList.add('soft-build');el.style.setProperty('--soft-x',i%2?'42px':'-42px');el.style.setProperty('--soft-y',i%3===0?'18px':'0px');el.style.transitionDelay=`${(i%4)*.045}s`;});
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
    document.querySelector('#work > .wrap'),
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

(function(){
  const root=document.querySelector('[data-project-explorer]');
  if(!root)return;
  const win=root.querySelector('.explorer-window');
  const canvas=root.querySelector('.archive-canvas');
  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:false});
  const posEl=root.querySelector('.explorer-pos');
  const zoomEl=root.querySelector('.zoom-readout');
  const zoomIn=root.querySelector('.zoom-in');
  const zoomOut=root.querySelector('.zoom-out');
  const zoomReset=root.querySelector('.zoom-reset');
  const factEl=root.querySelector('.archive-fact');
  const factMeta=factEl.querySelector('.archive-fact-meta');
  const factYear=factEl.querySelector('.archive-fact-year');
  const factText=factEl.querySelector('.archive-fact-text');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const facts={
  "2025": {
    "north": "ESA’s Biomass satellite launched with a P-band synthetic-aperture radar designed to measure forest structure and carbon.",
    "east": "Blue Origin’s New Glenn reached orbit on its first flight, using a reusable first-stage architecture.",
    "south": "Firefly Aerospace’s Blue Ghost achieved a commercial lunar landing and operated through a full lunar day.",
    "west": "The Vera C. Rubin Observatory released its first imagery from a 3.2-gigapixel camera built for wide-field sky surveys."
  },
  "2024": {
    "north": "SpaceX caught a returning Super Heavy booster with the launch tower’s mechanical arms during Starship flight 5.",
    "east": "Chang’e 6 returned the first samples ever collected from the Moon’s far side.",
    "south": "Ariane 6 completed its maiden flight, introducing Europe’s new heavy-lift launch system.",
    "west": "Parker Solar Probe made the closest-ever approach to the Sun, flying about 6.1 million km above its surface."
  },
  "2023": {
    "north": "ESA launched Euclid to map the geometry of the dark universe using visible and infrared instruments.",
    "east": "Chandrayaan-3 achieved India’s first soft lunar landing, near the Moon’s south-polar region.",
    "south": "OSIRIS-REx returned samples from asteroid Bennu to Earth in a sealed re-entry capsule.",
    "west": "SpaceX flew the first integrated Starship/Super Heavy test flights, validating a fully reusable launch architecture at unprecedented scale."
  },
  "2022": {
    "north": "NASA’s DART spacecraft deliberately altered the orbit of asteroid moonlet Dimorphos through a kinetic impact.",
    "east": "The James Webb Space Telescope delivered its first full-colour science images after deploying its segmented mirror in space.",
    "south": "Artemis I sent the uncrewed Orion spacecraft around the Moon and back as a full-system test.",
    "west": "NASA’s CAPSTONE entered a near-rectilinear halo orbit around the Moon to demonstrate the orbit planned for Gateway."
  },
  "2021": {
    "north": "Ingenuity made the first powered, controlled flight on another planet using counter-rotating rotors in Mars’ thin atmosphere.",
    "east": "The James Webb Space Telescope launched folded inside an Ariane 5 before completing a complex multi-stage deployment.",
    "south": "Perseverance’s MOXIE experiment produced oxygen from the carbon-dioxide-rich Martian atmosphere.",
    "west": "Inspiration4 became the first orbital mission crewed entirely by private citizens."
  },
  "2020": {
    "north": "Crew Dragon carried astronauts to orbit, restoring crewed orbital launch capability from the United States.",
    "east": "OSIRIS-REx briefly touched asteroid Bennu and collected a sample using a nitrogen-gas sampling head.",
    "south": "Hayabusa2 returned asteroid Ryugu samples to Earth in a re-entry capsule.",
    "west": "SpaceX’s Starship SN8 performed a high-altitude flight and belly-flop manoeuvre, demonstrating its unusual landing approach."
  },
  "2019": {
    "north": "The Event Horizon Telescope produced the first image of a black hole’s shadow using a planet-scale interferometer.",
    "east": "Chang’e 4 became the first spacecraft to soft-land on the far side of the Moon.",
    "south": "Crew Dragon Demo-1 autonomously docked with the International Space Station on its first uncrewed orbital mission.",
    "west": "Virgin Galactic’s SpaceShipTwo carried its first passenger on a suborbital test flight."
  },
  "2018": {
    "north": "Falcon Heavy flew for the first time using three Falcon 9-derived booster cores.",
    "east": "NASA’s InSight lander reached Mars carrying a robotic arm, seismometer and heat-flow experiment.",
    "south": "Parker Solar Probe launched on a trajectory using repeated Venus gravity assists to move closer to the Sun.",
    "west": "BepiColombo launched toward Mercury using electric propulsion and multiple planetary fly-bys."
  },
  "2017": {
    "north": "Cassini ended its mission with a controlled plunge into Saturn after 13 years in orbit around the planet.",
    "east": "SpaceX reflown and landed an orbital-class Falcon 9 first stage on a commercial mission, demonstrating booster reuse.",
    "south": "The Tesla Model 3 entered production with a highly automated battery-electric vehicle platform.",
    "west": "Rocket Lab’s Electron made its first orbital-class test flight using electric-pump-fed Rutherford engines."
  },
  "2016": {
    "north": "Solar Impulse 2 completed the first round-the-world flight powered only by solar energy.",
    "east": "SpaceX achieved its first Falcon 9 landing on an autonomous drone ship at sea.",
    "south": "Juno entered orbit around Jupiter after a five-year interplanetary journey.",
    "west": "LIGO announced the first direct detection of gravitational waves using kilometre-scale laser interferometers."
  },
  "2015": {
    "north": "SpaceX achieved the first successful landing of an orbital-class rocket booster after launch.",
    "east": "New Horizons performed humanity’s first close fly-by of Pluto and transmitted detailed images of its surface.",
    "south": "LIGO recorded the first direct gravitational-wave signal from two merging black holes.",
    "west": "Tesla introduced the Powerwall, packaging lithium-ion battery technology for stationary home energy storage."
  },
  "2014": {
    "north": "Philae became the first spacecraft to make a soft landing on a comet.",
    "east": "Rosetta became the first spacecraft to orbit a comet, matching 67P’s motion around the Sun.",
    "south": "NASA’s Orion EFT-1 flew a high-energy re-entry test to validate systems for future deep-space missions.",
    "west": "Local Motors printed and assembled the Strati, an early full-size car body produced largely by large-format additive manufacturing."
  },
  "2013": {
    "north": "ESA launched Gaia to build an ultra-precise three-dimensional map of the Milky Way.",
    "east": "India launched the Mars Orbiter Mission, which later became the first Asian spacecraft to reach Mars orbit.",
    "south": "SpaceX’s Grasshopper test vehicle demonstrated repeated vertical take-offs and landings for reusable rockets.",
    "west": "The Hyperloop Alpha concept proposed passenger pods travelling through low-pressure tubes using magnetic or air-bearing systems."
  },
  "2012": {
    "north": "Curiosity landed on Mars using the rocket-powered sky-crane system.",
    "east": "SpaceX Dragon became the first commercial spacecraft to deliver cargo to the International Space Station.",
    "south": "Felix Baumgartner’s pressure suit and capsule supported a record-setting stratospheric jump from about 39 km altitude.",
    "west": "The Raspberry Pi launched as a low-cost single-board computer, bringing Linux-capable hardware to education and prototyping."
  },
  "2011": {
    "north": "NASA launched Juno toward Jupiter on an Atlas V, beginning a five-year cruise to the giant planet.",
    "east": "Curiosity launched toward Mars carrying the largest scientific rover payload sent there at the time.",
    "south": "The final Space Shuttle mission, STS-135, completed the programme after 30 years of reusable-orbiter operations.",
    "west": "The first Boeing 787 Dreamliner entered commercial service with extensive composite structure and more-electric aircraft systems."
  },
  "2010": {
    "north": "Burj Khalifa opened at 828 m, becoming the tallest human-made structure in the world.",
    "east": "SpaceX Dragon became the first privately developed spacecraft to orbit Earth and be successfully recovered.",
    "south": "Solar Impulse HB-SIA completed an overnight solar-powered flight, storing daytime energy for continued flight after sunset.",
    "west": "Microsoft Kinect brought real-time depth sensing to a mass-market consumer device using infrared structured-light technology."
  }
};
  const years=Array.from({length:16},(_,i)=>2025-i);
  const R0=520, RING_GAP=390;
  const MIN_Z=.055, MAX_Z=7;
  const palettes={
    north:{dark:'#101923',mid:'#29445b',light:'#6f879a',glow:'rgba(79,128,164,.16)'},
    east: {dark:'#0f1a17',mid:'#284b40',light:'#708f81',glow:'rgba(75,135,108,.14)'},
    south:{dark:'#1a121a',mid:'#4d334b',light:'#90708b',glow:'rgba(132,78,122,.13)'},
    west: {dark:'#1b1711',mid:'#51442e',light:'#9a845d',glow:'rgba(143,112,63,.12)'}
  };
  const dirs=['north','east','south','west'];
  const dirLabel={north:'NORTH',east:'EAST',south:'SOUTH',west:'WEST'};

  const projects=[
    {title:'Project 01',year:2025,status:'Featured',angle:-54,size:365,detail:'Add project image, role and a short result here later.'},
    {title:'Project 02',year:2025,status:'Featured',angle:128,size:340,detail:'Add project image, role and a short result here later.'},
    {title:'Project 03',year:2024,status:'Recent',angle:22,size:315,detail:'Add project image, role and a short result here later.'},
    {title:'Project 04',year:2024,status:'Recent',angle:205,size:325,detail:'Add project image, role and a short result here later.'},
    {title:'Project 05',year:2023,status:'Archive',angle:315,size:295,detail:'Add project image, role and a short result here later.'},
    {title:'Project 06',year:2022,status:'Archive',angle:84,size:320,detail:'Add project image, role and a short result here later.'},
    {title:'Project 07',year:2021,status:'Archive',angle:166,size:300,detail:'Add project image, role and a short result here later.'},
    {title:'Project 08',year:2020,status:'Archive',angle:262,size:330,detail:'Add project image, role and a short result here later.'},
    {title:'Project 09',year:2019,status:'Archive',angle:32,size:290,detail:'Add project image, role and a short result here later.'},
    {title:'Project 10',year:2018,status:'Archive',angle:142,size:310,detail:'Add project image, role and a short result here later.'},
    {title:'Project 11',year:2017,status:'Archive',angle:224,size:285,detail:'Add project image, role and a short result here later.'},
    {title:'Project 12',year:2016,status:'Archive',angle:326,size:305,detail:'Add project image, role and a short result here later.'}
  ];
  const ringRadius=y=>R0+(2025-y)*RING_GAP;
  const quadrantFromAngle=a=>{const d=((a%360)+360)%360;return d>=315||d<45?'east':d<135?'south':d<225?'west':'north';};
  projects.forEach((p,i)=>{const a=p.angle*Math.PI/180;const r=ringRadius(p.year)+(i%2?26:-22);p.x=Math.cos(a)*r;p.y=Math.sin(a)*r;p.palette=quadrantFromAngle(p.angle);p.hover=0;p.open=0;});

  function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
  const depthDefs=[{d:.17,count:58,min:280,max:1200,alpha:.10},{d:.42,count:44,min:190,max:760,alpha:.16},{d:.70,count:28,min:130,max:520,alpha:.23}];
  const depthObjects=[];
  depthDefs.forEach((def,li)=>{
    const r=rng(8801+li*719);
    for(let i=0;i<def.count;i++){
      const a=r()*Math.PI*2, rad=420+Math.pow(r(),.64)*6700;
      const dir=dirs[Math.floor((((a*180/Math.PI)+45+360)%360)/90)%4];
      const size=def.min+Math.pow(r(),1.45)*(def.max-def.min);
      depthObjects.push({x:Math.cos(a)*rad+(r()-.5)*760,y:Math.sin(a)*rad+(r()-.5)*760,size,depth:def.d,alpha:def.alpha*(.72+r()*.56),palette:dir,phase:r()*6.283,sat1:.20+r()*.18,sat2:.09+r()*.13});
    }
  });

  // Pre-render four soft bubble textures once. Reusing them avoids expensive gradient repainting per object.
  const textures={};
  Object.entries(palettes).forEach(([name,p])=>{
    const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');
    const grad=g.createRadialGradient(436,376,44,512,512,488);
    grad.addColorStop(0,p.light);grad.addColorStop(.22,p.mid);grad.addColorStop(.66,p.dark);grad.addColorStop(1,'rgba(4,7,9,0)');
    g.fillStyle=grad;g.beginPath();g.arc(512,512,490,0,Math.PI*2);g.fill();
    const hi=g.createRadialGradient(330,256,0,330,256,220);hi.addColorStop(0,'rgba(255,255,255,.24)');hi.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hi;g.fillRect(0,0,1024,1024);
    textures[name]=c;
  });

  let w=1,h=1,dpr=1;
  let camX=0,camY=0,targetX=0,targetY=0,zoom=1,targetZoom=1;
  let pointer={x:0,y:0,inside:false,overControls:false}, dragging=false, dragMoved=false, dragStart=null;
  let edgeVX=0,edgeVY=0,last=performance.now(),hoverYear=null,hoverProject=-1,selected=-1;
  let active=true;

  // Cursor-controlled travel. Speeds are screen pixels/second at any zoom.
  // A small centre rest zone, a gentle linear start, then a cubic edge boost.
  const MAX_PAN_SPEED=260, PAN_DEAD_ZONE=.10;
  const PAN_ACCELERATION=9, PAN_BRAKING=24;
  const UI_SELECTOR='button,a,input,select,textarea,.explorer-hud,.archive-fact';
  const overUI=target=>target instanceof Element&&!!target.closest(UI_SELECTOR);

  function stopPan(freeze=false){
    // Freeze only pending automatic travel, never a zoom/reset/keyboard move.
    if(freeze&&!dragging&&(Math.abs(edgeVX)+Math.abs(edgeVY)>.01)){
      targetX=camX;targetY=camY;
    }
    edgeVX=edgeVY=0;
  }
  function clearHover(){hoverYear=null;hoverProject=-1;factEl.hidden=true;}
  function cancelPointerSession(){
    stopPan(true);pointer.inside=false;pointer.overControls=false;
    const captured=dragStart?.pointerId;
    dragging=false;dragMoved=false;dragStart=null;
    win.classList.remove('is-dragging');clearHover();win.style.cursor='grab';
    if(captured!==undefined){try{win.releasePointerCapture(captured);}catch{}}
  }
  window.addEventListener('blur',cancelPointerSession);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelPointerSession();});
  // Page scrolling must not leave stale edge coordinates driving the archive.
  window.addEventListener('scroll',()=>{
    if(dragging)return;
    stopPan(true);pointer.inside=false;clearHover();
  },{passive:true});

  function resize(){
    const r=win.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2.75);
    canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  }
  new ResizeObserver(resize).observe(win);resize();
  new IntersectionObserver(es=>{active=es.some(e=>e.isIntersecting);},{threshold:.01}).observe(win);

  function layerScale(depth){return Math.pow(zoom,.46+.54*depth);}
  function worldToScreen(x,y,depth=1){const s=layerScale(depth);return [w/2+(x-camX*depth)*s,h/2+(y-camY*depth)*s,s];}
  function screenToWorld(x,y){return [(x-w/2)/zoom+camX,(y-h/2)/zoom+camY];}

  function drawTextureBubble(x,y,size,palette,alpha,depth,sat1=.27,sat2=.14){
    const [sx,sy,s]=worldToScreen(x,y,depth);const rs=size*s;
    if(sx+rs< -100||sx-rs>w+100||sy+rs< -100||sy-rs>h+100)return;
    ctx.globalAlpha=alpha;ctx.drawImage(textures[palette],sx-rs,sy-rs,rs*2,rs*2);
    // Two overlapping satellites create the reference-like layered depth without copying the image.
    const p=palettes[palette];
    const r1=rs*sat1,r2=rs*sat2;
    ctx.globalAlpha=alpha*.72;ctx.fillStyle=p.glow;ctx.beginPath();ctx.arc(sx+rs*.28,sy+rs*.20,r1,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=alpha*.56;ctx.beginPath();ctx.arc(sx-rs*.24,sy+rs*.31,r2,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  }

  function drawBackground(){
    // The CSS owns the background. Canvas only adds very restrained ambient depth marks.
    depthObjects.sort((a,b)=>a.depth-b.depth).forEach(o=>drawTextureBubble(o.x,o.y,o.size,o.palette,o.alpha,o.depth,o.sat1,o.sat2));
  }

  const yearHits=[];
  function drawRings(){
    yearHits.length=0;
    years.slice().reverse().forEach((year,idx)=>{
      const r=ringRadius(year), major=year===2025||year===2020||year===2015||year===2010;
      const [cx,cy,s]=worldToScreen(0,0,1), rr=r*s;
      if(rr<6)return;
      ctx.globalAlpha=1;ctx.lineWidth=major?1.15:.7;ctx.strokeStyle=major?'rgba(238,242,244,.16)':'rgba(238,242,244,.085)';
      ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.stroke();
      // four quiet quadrant accents, each reflecting its local colour family
      [['east',0],['south',Math.PI/2],['west',Math.PI],['north',Math.PI*1.5]].forEach(([dir,a])=>{ctx.strokeStyle=palettes[dir].glow.replace(/\.\d+\)$/,'.32)');ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(cx,cy,rr,a-.035,a+.035);ctx.stroke();});

      const points=[['north',0,-r],['east',r,0],['south',0,r],['west',-r,0]];
      points.forEach(([dir,x,y])=>{
        const [sx,sy]=worldToScreen(x,y,1);const hovered=hoverYear&&hoverYear.year===year&&hoverYear.dir===dir;
        const fs=Math.max(12,Math.min(37,26*Math.pow(zoom,.13)))*(hovered?1.16:1);
        ctx.font=`500 ${fs}px Arial,Helvetica,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillStyle=hovered?'rgba(255,255,255,.98)':'rgba(244,245,245,.68)';ctx.fillText(String(year),sx,sy);
        const mw=ctx.measureText(String(year)).width;yearHits.push({year,dir,x:sx-mw/2-13,y:sy-fs*.7,w:mw+26,h:fs*1.4});
        if(year===2025){ctx.font='500 7px Arial,Helvetica,sans-serif';ctx.fillStyle='rgba(240,68,82,.82)';ctx.fillText('NOW',sx,sy+fs*.82);}
      });
    });
  }

  function roundRect(c,x,y,wid,hei,r){const rr=Math.min(r,wid/2,hei/2);c.beginPath();c.moveTo(x+rr,y);c.arcTo(x+wid,y,x+wid,y+hei,rr);c.arcTo(x+wid,y+hei,x,y+hei,rr);c.arcTo(x,y+hei,x,y,rr);c.arcTo(x,y,x+wid,y,rr);c.closePath();}
  const projectHits=[];
  function wrapText(text,x,y,maxWidth,lineHeight,maxLines){
    const words=text.split(' ');let line='',lines=[];
    for(const word of words){const t=line?line+' '+word:word;if(ctx.measureText(t).width>maxWidth&&line){lines.push(line);line=word;if(lines.length===maxLines-1)break;}else line=t;}
    if(line&&lines.length<maxLines)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));
  }

  function drawProjectBubble(p,i){
    const [sx,sy,s]=worldToScreen(p.x,p.y,1);const base=p.size*s;
    const hov=i===hoverProject?1.07:1;const op=i===selected?1.34:1;const r=base*.5*hov*op;
    if(sx+r< -80||sx-r>w+80||sy+r< -80||sy-r>h+80)return;
    const pal=palettes[p.palette];
    ctx.save();ctx.translate(sx,sy);
    // soft outer volume
    const aura=ctx.createRadialGradient(0,0,r*.36,0,0,r*1.22);aura.addColorStop(0,pal.glow.replace(/\.\d+\)$/,i===selected?'.20)':'.12)'));aura.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(0,0,r*1.22,0,Math.PI*2);ctx.fill();
    // main sphere
    const g=ctx.createRadialGradient(-r*.27,-r*.30,r*.04,0,0,r);g.addColorStop(0,pal.light);g.addColorStop(.25,pal.mid);g.addColorStop(.72,pal.dark);g.addColorStop(1,'#080b0d');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    // layered inner bubbles inspired by the supplied reference
    ctx.globalAlpha=.34;ctx.fillStyle=pal.light;ctx.beginPath();ctx.arc(r*.16,r*.12,r*.39,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=.20;ctx.beginPath();ctx.arc(r*.43,r*.33,r*.18,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=.14;ctx.beginPath();ctx.arc(-r*.28,-r*.35,r*.22,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle=i<2?'rgba(240,68,82,.52)':'rgba(255,255,255,.14)';ctx.lineWidth=i===hoverProject||i===selected?1.8:1;ctx.beginPath();ctx.arc(0,0,r-.7,0,Math.PI*2);ctx.stroke();
    // text
    const compact=r<86;ctx.textAlign='left';ctx.textBaseline='alphabetic';
    const tx=-r*.62, maxW=r*1.24;
    ctx.font=`500 ${Math.max(7,Math.min(11,r*.055))}px Arial`;ctx.fillStyle='rgba(255,255,255,.62)';ctx.fillText(`${p.year}  ·  ${p.status.toUpperCase()}`,tx,r*.30);
    ctx.font=`500 ${Math.max(15,Math.min(34,r*.17))}px Arial`;ctx.fillStyle='#fff';wrapText(p.title,tx,r*.50,maxW,Math.max(17,r*.18),2);
    if(i===selected&&!compact){ctx.font=`400 ${Math.max(10,Math.min(14,r*.062))}px Arial`;ctx.fillStyle='rgba(255,255,255,.72)';wrapText(p.detail,tx,r*.68,maxW,Math.max(14,r*.075),3);ctx.font='500 8px Arial';ctx.fillStyle='rgba(255,255,255,.44)';ctx.fillText('CLICK AGAIN TO CLOSE',tx,r*.86);}
    ctx.restore();projectHits.push({i,x:sx,y:sy,r});
  }
  function drawProjects(){projectHits.length=0;projects.forEach(drawProjectBubble);}

  function positionFact(hit){
    if(!hit){factEl.hidden=true;return;}
    const f=facts[String(hit.year)]?.[hit.dir];if(!f){factEl.hidden=true;return;}
    factMeta.textContent=`${dirLabel[hit.dir]} / ENGINEERING NOTE`;factYear.textContent=hit.year;factText.textContent=f;factEl.hidden=false;
    const rect=win.getBoundingClientRect();const fw=Math.min(390,w-30),fh=155;
    let left=pointer.x+18,top=pointer.y+18;if(left+fw>w-12)left=pointer.x-fw-18;if(top+fh>h-12)top=pointer.y-fh-18;
    factEl.style.left=Math.max(12,left)+'px';factEl.style.top=Math.max(12,top)+'px';
  }

  function hitTest(){
    if(dragging||!pointer.inside||pointer.overControls){
      hoverYear=null;hoverProject=-1;factEl.hidden=true;
      return;
    }
    let py=null;for(let i=yearHits.length-1;i>=0;i--){const h0=yearHits[i];if(pointer.x>=h0.x&&pointer.x<=h0.x+h0.w&&pointer.y>=h0.y&&pointer.y<=h0.y+h0.h){py=h0;break;}}
    hoverYear=py;positionFact(py);
    let hp=-1;for(let i=projectHits.length-1;i>=0;i--){const p=projectHits[i],dx=pointer.x-p.x,dy=pointer.y-p.y;if(dx*dx+dy*dy<=p.r*p.r){hp=p.i;break;}}hoverProject=hp;
    win.style.cursor=hp>=0?'pointer':(py?'help':'grab');
  }

  function panIntent(x,y,width,height){
    const clamp=v=>Math.max(-1,Math.min(1,v));
    const nx=clamp((x-width/2)/Math.max(1,width/2));
    const ny=clamp((y-height/2)/Math.max(1,height/2));
    const distance=Math.max(Math.abs(nx),Math.abs(ny));
    if(distance<=PAN_DEAD_ZONE)return [0,0];
    const t=(distance-PAN_DEAD_ZONE)/(1-PAN_DEAD_ZONE);
    const strength=.22*t+.78*t*t*t;
    // Normalize after easing so diagonal travel is smooth, not faster/slower.
    const length=Math.hypot(nx,ny);
    return [nx/length*strength,ny/length*strength];
  }
  function edgeTarget(){
    if(!pointer.inside||pointer.overControls||dragging||hoverYear||hoverProject>=0)return [0,0];
    return panIntent(pointer.x,pointer.y,w,h);
  }

  function draw(){ctx.clearRect(0,0,w,h);drawBackground();drawRings();drawProjects();hitTest();}
  function updateHud(){posEl.textContent=`X ${Math.round(camX)} · Y ${Math.round(camY)}`;zoomEl.textContent=Math.round(zoom*100)+'%';}
  function frame(now){
    const dt=Math.min(.04,(now-last)/1000||.016);last=now;
    if(active){
      if(!reduce&&!dragging){
        // Let visitors read a year or choose a project without it sliding away.
        const paused=!pointer.inside||pointer.overControls||hoverYear||hoverProject>=0;
        if(paused)stopPan(true);
        const [ex,ey]=edgeTarget();
        const desiredX=ex*MAX_PAN_SPEED,desiredY=ey*MAX_PAN_SPEED;
        const slowing=Math.hypot(desiredX,desiredY)<Math.hypot(edgeVX,edgeVY);
        const reversing=desiredX*edgeVX+desiredY*edgeVY<0;
        const response=(slowing||reversing||(!ex&&!ey))?PAN_BRAKING:PAN_ACCELERATION;
        const ease=1-Math.exp(-dt*response);
        edgeVX+=(desiredX-edgeVX)*ease;edgeVY+=(desiredY-edgeVY)*ease;
        if(Math.abs(edgeVX)<.02)edgeVX=0;if(Math.abs(edgeVY)<.02)edgeVY=0;
        targetX+=edgeVX*dt/Math.max(zoom,MIN_Z);
        targetY+=edgeVY*dt/Math.max(zoom,MIN_Z);
      }else{stopPan();}
      const camEase=reduce?1:(1-Math.exp(-dt*10));camX+=(targetX-camX)*camEase;camY+=(targetY-camY)*camEase;zoom+=(targetZoom-zoom)*(reduce?1:(1-Math.exp(-dt*10)));
      projects.forEach((p,i)=>{p.hover+=( (i===hoverProject?1:0)-p.hover)*(1-Math.exp(-dt*12));p.open+=( (i===selected?1:0)-p.open)*(1-Math.exp(-dt*9));});
      draw();updateHud();
    }
    requestAnimationFrame(frame);
  }

  function zoomAt(clientX,clientY,factor){
    stopPan(true);
    const rect=win.getBoundingClientRect(),px=clientX-rect.left,py=clientY-rect.top;
    const before=screenToWorld(px,py);targetZoom=Math.min(MAX_Z,Math.max(MIN_Z,targetZoom*factor));
    const afterX=(px-w/2)/targetZoom+targetX,afterY=(py-h/2)/targetZoom+targetY;targetX+=before[0]-afterX;targetY+=before[1]-afterY;
  }
  function reset(){stopPan();targetX=targetY=0;targetZoom=1;selected=-1;clearHover();}
  zoomIn.addEventListener('click',()=>zoomAt(w/2+win.getBoundingClientRect().left,h/2+win.getBoundingClientRect().top,1.28));
  zoomOut.addEventListener('click',()=>zoomAt(w/2+win.getBoundingClientRect().left,h/2+win.getBoundingClientRect().top,1/1.28));
  zoomReset.addEventListener('click',reset);
  win.addEventListener('wheel',e=>{if(overUI(e.target)||!(e.ctrlKey||e.metaKey))return;e.preventDefault();zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.0015));},{passive:false});
  function updatePointer(e){
    const r=win.getBoundingClientRect();
    pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;
    pointer.inside=e.pointerType!=='touch'&&pointer.x>=0&&pointer.y>=0&&pointer.x<=w&&pointer.y<=h;
    pointer.overControls=overUI(e.target);
    if(pointer.overControls)stopPan(true);
  }
  win.addEventListener('pointerenter',updatePointer);
  win.addEventListener('pointerleave',()=>{
    pointer.inside=false;pointer.overControls=false;stopPan(true);clearHover();
    if(!dragging)win.style.cursor='grab';
  });
  win.addEventListener('pointermove',e=>{
    updatePointer(e);
    if(dragging&&dragStart){
      const dx=e.clientX-dragStart.cx,dy=e.clientY-dragStart.cy;
      if(Math.abs(dx)+Math.abs(dy)>5)dragMoved=true;
      targetX=dragStart.x-dx/Math.max(targetZoom,.08);
      targetY=dragStart.y-dy/Math.max(targetZoom,.08);
    }else{hitTest();}
  });
  win.addEventListener('pointerdown',e=>{
    if(e.button!==0||overUI(e.target))return;
    updatePointer(e);stopPan(true);
    dragging=true;dragMoved=false;win.classList.add('is-dragging');
    win.setPointerCapture?.(e.pointerId);
    dragStart={cx:e.clientX,cy:e.clientY,x:targetX,y:targetY,pointerId:e.pointerId};
    factEl.hidden=true;
  });
  win.addEventListener('pointerup',e=>{
    if(!dragging)return;
    updatePointer(e);dragging=false;win.classList.remove('is-dragging');
    try{win.releasePointerCapture?.(e.pointerId);}catch{}
    if(!dragMoved){
      let hp=-1;
      for(let i=projectHits.length-1;i>=0;i--){
        const p=projectHits[i],dx=pointer.x-p.x,dy=pointer.y-p.y;
        if(dx*dx+dy*dy<=p.r*p.r){hp=p.i;break;}
      }
      if(hp>=0)selected=selected===hp?-1:hp;
    }else{
      // Releasing a drag near an edge must not unexpectedly start auto-travel.
      pointer.inside=false;stopPan();
    }
    dragStart=null;
  });
  win.addEventListener('pointercancel',cancelPointerSession);
  win.addEventListener('lostpointercapture',()=>{if(dragging)cancelPointerSession();});
  win.addEventListener('dblclick',e=>{if(overUI(e.target))return;zoomAt(e.clientX,e.clientY,e.shiftKey?1/1.8:1.8);});
  win.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(e.target.tagName))return;stopPan();const step=110/Math.max(targetZoom,.08);if(e.key==='ArrowLeft')targetX-=step;else if(e.key==='ArrowRight')targetX+=step;else if(e.key==='ArrowUp')targetY-=step;else if(e.key==='ArrowDown')targetY+=step;else if(e.key==='+'||e.key==='=')zoomAt(win.getBoundingClientRect().left+w/2,win.getBoundingClientRect().top+h/2,1.25);else if(e.key==='-'||e.key==='_')zoomAt(win.getBoundingClientRect().left+w/2,win.getBoundingClientRect().top+h/2,1/1.25);else if(e.key.toLowerCase()==='r')reset();else return;e.preventDefault();});

  requestAnimationFrame(frame);
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
