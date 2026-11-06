/* Dependency-free scroll controller. See ANIMATION-GUIDE.md for mounting. */
export function mountCatScroll({
  stage, upper, lower, art, layer,
  assetBase = './assets/',
  frameSources = {},
  landing = { x: .363, y: .694 },
  sizeRatio = .20,
  debugPath = null,
  onUpdate = () => {},
} = {}) {
  if (![stage, upper, lower, art, layer].every(Boolean)) throw new Error('Missing cat scene element');
  const files = ['run-01','run-02','run-03','run-04','crouch','jump','land','sit'];
  const images = files.map(name => {
    const img = new Image(); img.src = frameSources[name] || assetBase + 'cat-' + name + '.png';
    img.alt = ''; img.draggable = false; img.className = 'cat-scroll-frame';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;';
    layer.appendChild(img); return img;
  });
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText += ';position:absolute;left:0;top:0;pointer-events:none;transform-origin:50% 87.5%;will-change:transform;opacity:0;';
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  let geom, target=0, current=0, raf=0, lastTime=0, stopped=false, manual=null;
  const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
  const lerp = (a,b,t) => a+(b-a)*t;
  const ease = t => t*t*(3-2*t);
  function cubic(p,t) {
    const u=1-t;
    return { x:u*u*u*p[0].x+3*u*u*t*p[1].x+3*u*t*t*p[2].x+t*t*t*p[3].x,
      y:u*u*u*p[0].y+3*u*u*t*p[1].y+3*u*t*t*p[2].y+t*t*t*p[3].y };
  }
  const point=(x,y)=>({x,y});
  function measure() {
    if (stopped) return;
    const sr=stage.getBoundingClientRect(), ur=upper.getBoundingClientRect(), lr=lower.getBoundingClientRect(), ar=art.getBoundingClientRect();
    const w=sr.width, top=ur.top-sr.top, uh=ur.height;
    // Full uncropped transparent art. If object-fit is used, measure its content box instead.
    const end=point(ar.left-sr.left+ar.width*landing.x,ar.top-sr.top+ar.height*landing.y);
    const run=[
      [point(-.12*w,top+.51*uh),point(.08*w,top+.50*uh),point(.02*w,top+.75*uh),point(.15*w,top+.82*uh)],
      [point(.15*w,top+.82*uh),point(.21*w,top+.87*uh),point(.36*w,top+.86*uh),point(.36*w,top+.88*uh)],
      [point(.36*w,top+.88*uh),point(.54*w,top+.94*uh),point(.55*w,top+.97*uh),point(.43*w,top+uh-.012*w)]
    ];
    const takeoff=run[2][3], lowerTop=lr.top-sr.top;
    // Two smooth descent curves form one leap, kept in the left margin of the red section.
    const jump=[
      [takeoff,point(.30*w,lowerTop-.08*w),point(.025*w,lowerTop+.13*w),point(.055*w,lowerTop+.50*w)],
      [point(.055*w,lowerTop+.50*w),point(.04*w,lowerTop+.90*w),point(.08*w,end.y-.21*w),end]
    ];
    geom={w,run,jump,end,start:Math.max(sr.top+scrollY,sr.top+scrollY+run[0][0].y-innerHeight*.70),
      finish:sr.top+scrollY+end.y-innerHeight*.68};
    if(debugPath) {
      debugPath.setAttribute('viewBox',`0 0 ${w} ${sr.height}`);
      debugPath.querySelector('path').setAttribute('d',[...run,...jump].map((c,i)=>`${i===0?'M '+c[0].x+' '+c[0].y:''} C ${c[1].x} ${c[1].y} ${c[2].x} ${c[2].y} ${c[3].x} ${c[3].y}`).join(' '));
    }
    readScroll();
  }
  function pose(p) {
    let pos, a=0, frame=0, next=-1, mix=0, sx=1, sy=1, phase='run';
    if (p<.48) {
      const q=p/.48*3, i=Math.min(2,Math.floor(q));pos=cubic(geom.run[i],q-i);
      // Frame index depends on scroll progress: paws stop when the user stops scrolling.
      frame=Math.floor(p*112)%4;
      a=8+Math.sin(p*14)*9;
      pos.y-=Math.abs(Math.sin(p*56*Math.PI))*geom.w*.006;
    } else if (p<.53) {
      pos=geom.run[2][3];frame=4;phase='crouch';
      const q=ease((p-.48)/.05);sx=1+.06*q;sy=1-.05*q;
    } else if (p<.90) {
      const q=(p-.53)/.37*2, i=Math.min(1,Math.floor(q));pos=cubic(geom.jump[i],q-i);
      frame=5;phase='jump';
      // The illustrated leap is already diagonal. Only a small extra tilt is needed.
      a=lerp(-12,16,Math.sin(clamp((p-.53)/.37)*Math.PI));
      // Turn back into landing over the final part of flight, no long crossfade.
      if(p>.875){next=6;mix=ease((p-.875)/.025);a*=1-mix;}
    } else if(p<.95) {
      pos=geom.end;frame=6;phase='land';
      const q=(p-.90)/.05;sy=1-.10*Math.sin(Math.PI*q);sx=1+.07*Math.sin(Math.PI*q);
    } else {
      pos=geom.end;frame=6;next=7;mix=ease(clamp((p-.95)/.045));phase=p>=.995?'sit':'settle';
    }
    return {pos,a,frame,next,mix,sx,sy,phase};
  }
  function render(p) {
    if(!geom)return;
    const reduced=mq.matches;
    const state=pose(reduced?1:p), s=geom.w*sizeRatio;
    const {pos,a,frame,next,mix,sx,sy,phase}=state;
    layer.style.width=s+'px';layer.style.height=s+'px';
    layer.style.opacity=reduced?'1':String(clamp(p/.025));
    layer.style.transform=`translate3d(${pos.x-s*.5}px,${pos.y-s*.875}px,0) rotate(${a}deg) scale(${sx},${sy})`;
    images.forEach((im,i)=>im.style.opacity=String(i===frame?1-mix:i===next?mix:0));
    onUpdate({progress:p,phase:reduced?'reduced-motion':phase,x:pos.x,y:pos.y});
  }
  function loop(time) {
    raf=0;if(stopped)return;
    const dt=lastTime?Math.min(40,time-lastTime):16.7;lastTime=time;
    current+= (target-current)*(1-Math.exp(-dt/65));
    if(Math.abs(current-target)<.00005)current=target;
    render(current);
    if(current!==target)raf=requestAnimationFrame(loop);else lastTime=0;
  }
  function readScroll() {
    if(!geom||stopped)return;
    target=manual===null?clamp((scrollY-geom.start)/Math.max(1,geom.finish-geom.start)):manual;
    if(mq.matches){current=target;render(current);}else if(!raf)raf=requestAnimationFrame(loop);
  }
  const ro=new ResizeObserver(measure); [stage,upper,lower,art].forEach(el=>ro.observe(el));
  const imageReady=()=>measure();art.addEventListener('load',imageReady);
  const mediaChange=()=>{current=target;render(current);};mq.addEventListener('change',mediaChange);
  addEventListener('scroll',readScroll,{passive:true});addEventListener('resize',measure);
  const fontsReady=()=>measure();document.fonts?.ready.then(fontsReady);
  measure();current=target;render(current);
  return {
    refresh:measure,
    setProgress(p){manual=p===null?null:clamp(p);readScroll();},
    getState(){return {progress:current,target,geometry:geom};},
    destroy(){stopped=true;cancelAnimationFrame(raf);ro.disconnect();removeEventListener('scroll',readScroll);removeEventListener('resize',measure);art.removeEventListener('load',imageReady);mq.removeEventListener('change',mediaChange);images.forEach(im=>im.remove());layer.style.opacity='0';}
  };
}
