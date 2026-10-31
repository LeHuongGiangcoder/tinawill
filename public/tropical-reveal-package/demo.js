(() => {
  'use strict';
  const D = window.TROPICAL_SCENE;
  const scene = document.querySelector('#scene');
  const world = document.querySelector('#camera-world');
  const artboard = document.querySelector('#artboard');
  const viewport = document.querySelector('#viewport');
  const belt = document.querySelector('#water-belt');
  const invitation = document.querySelector('#invitation');
  const scrub = document.querySelector('#scrub');
  const output = document.querySelector('#progress-value');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amplitude = reduced ? .12 : 1;
  const state = { progress: 0, revealing: false, revealStart: 0, manual: false, paused: false, lastTime: performance.now(), ambient: 0 };
  const clamp = n => Math.max(0, Math.min(1, n));
  const lerp = (a,b,t) => a+(b-a)*t;
  const ease = t => { const u=clamp(t); return u*u*u*(u*(u*6-15)+10); };
  const nodes = new Map();
  const floated = [];

  function image(src, alt='') { const im = new Image(); im.src = src; im.alt = alt; im.draggable = false; return im; }
  for (let i=0; i<2; i++) belt.append(image(D.water.asset));
  belt.style.animationDuration = `${reduced ? 600 : D.water.period}s`;
  function fullLayer(info) { const im=image(info.asset);im.className='full-layer';im.style.zIndex=info.z;scene.append(im);return im; }
  const ground = fullLayer(D.ground);
  const paper = fullLayer(D.paper);
  for (const e of D.elements) {
    const wrap=document.createElement('div');wrap.className='sprite';wrap.dataset.layer=e.id;wrap.style.zIndex=e.z;
    const im=image(e.asset);wrap.append(im);scene.append(wrap);nodes.set(e.id,wrap);
  }
  for (const f of D.floaters) {
    const wrap=document.createElement('div');wrap.className='floater';wrap.dataset.floater=f.id;wrap.style.zIndex=f.z;wrap.style.width=`${f.width}px`;wrap.append(image(f.asset));scene.append(wrap);
    const ripple=document.createElement('div');ripple.className='ripple';ripple.style.zIndex=f.z-1;ripple.style.width=`${f.ripple.width}px`;ripple.append(image(f.ripple.asset));scene.append(ripple);
    floated.push({ data:f, wrap, ripple });
  }

  function drawReveal(p) {
    const seconds=clamp(p)*D.revealDuration;
    const cameraT=ease((seconds-D.camera.start)/D.camera.duration);
    const cameraScale=lerp(D.camera.scaleFrom,D.camera.scaleTo,reduced ? cameraT*.2 : cameraT);
    world.style.transform=`translate3d(0,${D.camera.offsetY*cameraT*(reduced?.2:1)}px,0) scale(${cameraScale})`;
    world.style.willChange=p>0&&p<1?'transform':'auto';
    for (const e of D.elements) {
      const t=ease((seconds-e.reveal.delay)/e.reveal.duration);
      const a=e.closed,b=e.open,n=nodes.get(e.id);
      const lift=Math.sin(Math.PI*t),motion=e.motion,amount=reduced?.15:1;
      n.style.width=`${lerp(a.width,b.width,t)*(1+motion.liftScale*lift*amount)}px`;
      n.style.opacity=lerp(a.opacity,b.opacity,t);
      n.style.transform=`translate3d(${lerp(a.x,b.x,t)+motion.arcX*lift*amount}px,${lerp(a.y,b.y,t)+motion.arcY*lift*amount}px,0) translate(-50%,-50%) rotate(${lerp(a.rotation,b.rotation,t)+motion.bend*lift*amount}deg) scaleX(${a.flipX ? -1 : 1})`;
    }
    ground.style.opacity=1-ease((seconds-D.ground.fadeStart)/(D.ground.fadeEnd-D.ground.fadeStart));
    const paperT=ease((seconds-D.paper.fadeStart)/(D.paper.fadeEnd-D.paper.fadeStart));
    paper.style.opacity=1-paperT;
    paper.style.transform=`translateY(${-12*paperT}px)`;
    invitation.style.opacity=1-clamp(seconds/.65);
    invitation.style.pointerEvents=seconds>.02 ? 'none' : 'auto';
    invitation.setAttribute('aria-hidden',seconds>.65 ? 'true':'false');
    scrub.value=Math.round(p*1000);output.value=`${Math.round(p*100)}%`;
  }

  function drawAmbient(t) {
    for (const {data:f,wrap,ripple} of floated) {
      const m=f.drift,w=2*Math.PI/m.period;
      // Independent smooth paths. The second frequency avoids synchronized bobbing.
      const dx=amplitude*m.amplitudeX*(Math.sin(w*t+m.phase)+.22*Math.sin(.43*w*t+1.7*m.phase));
      const dy=amplitude*m.amplitudeY*(Math.cos(.81*w*t+m.phase)+.18*Math.sin(.37*w*t+.8));
      const rot=amplitude*m.rotation*Math.sin(.63*w*t+m.phase+.6);
      wrap.style.transform=`translate3d(${f.x+dx}px,${f.y+dy}px,0) translate(-50%,-50%) rotate(${rot}deg)`;
      const wave=(t/f.ripple.period+m.phase/(2*Math.PI))%1;
      const s=1+.13*wave*amplitude;
      ripple.style.opacity=.5*Math.pow(Math.sin(Math.PI*wave),2);
      ripple.style.transform=`translate3d(${f.ripple.x+dx*.65}px,${f.ripple.y+dy*.65}px,0) translate(-50%,-50%) scale(${s})`;
    }
  }
  function resize() { artboard.style.transform=`scale(${viewport.clientWidth/D.canvas.width})`; }
  new ResizeObserver(resize).observe(viewport);resize();
  function open() { state.manual=false;state.progress=0;state.revealing=true;state.revealStart=performance.now();drawReveal(0); }
  document.querySelector('#open').addEventListener('click',open);
  document.querySelector('#replay').addEventListener('click',open);
  document.querySelector('#end').addEventListener('click',()=>{state.manual=false;state.revealing=false;state.progress=1;drawReveal(1);});
  scrub.addEventListener('input',()=>{state.manual=false;state.revealing=false;state.progress=Number(scrub.value)/1000;drawReveal(state.progress);});
  document.querySelector('#motion').addEventListener('click',e=>{
    state.paused=!state.paused;belt.style.animationPlayState=state.paused?'paused':'running';
    e.currentTarget.setAttribute('aria-pressed',String(state.paused));e.currentTarget.textContent=state.paused?'Tiếp tục chuyển động nền':'Tạm dừng chuyển động nền';
  });
  function tick(now) {
    const dt=Math.min(.1,(now-state.lastTime)/1000);state.lastTime=now;
    if (!state.manual) {
      if (!state.paused && !document.hidden) state.ambient+=dt;
      if (state.revealing) {state.progress=clamp((now-state.revealStart)/(D.revealDuration*1000));drawReveal(state.progress);if(state.progress>=1)state.revealing=false;}
      drawAmbient(state.ambient);
    }
    requestAnimationFrame(tick);
  }
  drawReveal(0);drawAmbient(0);requestAnimationFrame(tick);
  const openButton=document.querySelector('#open');openButton.disabled=true;
  Promise.all([...document.images].map(im=>im.decode().catch(()=>{}))).then(()=>{openButton.disabled=false;});
  // Deterministic hooks for screenshots, video rendering and host integration.
  window.TropicalDemo={
    open,
    setProgress(p){state.revealing=false;state.manual=false;state.progress=clamp(p);drawReveal(state.progress);},
    frame(seconds,p){state.manual=true;state.revealing=false;state.progress=clamp(p);drawReveal(state.progress);drawAmbient(seconds);const a=belt.getAnimations()[0];if(a){a.pause();a.currentTime=seconds*1000;}},
    resume(){state.manual=false;state.lastTime=performance.now();belt.getAnimations().forEach(a=>a.play());},
    get progress(){return state.progress;},
    get manifest(){return D;}
  };
})();
