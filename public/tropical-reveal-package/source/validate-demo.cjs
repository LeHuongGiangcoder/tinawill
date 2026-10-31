const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').resolve(__dirname,'..')+'/';
const nodes=new Map();let clock=0,raf;
class Node {constructor(){this.style={};this.dataset={};this.children=[];this.listeners={};this.clientWidth=390;this.value=0;}append(n){this.children.push(n);}addEventListener(k,f){this.listeners[k]=f;}setAttribute(k,v){this[k]=v;}getAnimations(){return [{pause(){},play(){},currentTime:0}];}}
class Img extends Node{decode(){return Promise.resolve();}}
const document={hidden:false,images:[],querySelector(s){if(!nodes.has(s))nodes.set(s,new Node());return nodes.get(s);},createElement(){return new Node();}};
const ctx={window:{},document,Image:Img,Map,Math,Promise,console,performance:{now:()=>clock},matchMedia:()=>({matches:false}),ResizeObserver:class {constructor(fn){this.fn=fn;}observe(){this.fn();}},requestAnimationFrame:f=>{raf=f;}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(root+'scene-data.js','utf8'),ctx);vm.runInContext(fs.readFileSync(root+'demo.js','utf8'),ctx);
const demo=ctx.window.TropicalDemo,data=demo.manifest,scene=nodes.get('#scene');
assert.equal(data.elements.length,36);assert.equal(data.floaters.length,4);
const sprites=scene.children.filter(n=>n.dataset.layer);assert.equal(sprites.length,36);
demo.frame(0,0);for(const e of data.elements){const n=sprites.find(n=>n.dataset.layer===e.id);assert.equal(n.style.opacity,1);assert(n.style.transform.includes(`${e.closed.x}px`));}
demo.frame(0,1);for(const e of data.elements){const n=sprites.find(n=>n.dataset.layer===e.id);assert(Math.abs(n.style.opacity-e.open.opacity)<1e-8);assert(Math.abs(parseFloat(n.style.width)-e.open.width)<1e-8);}
const floats=scene.children.filter(n=>n.dataset.floater);demo.frame(2,1);const a=floats.map(n=>n.style.transform);demo.frame(34,1);const b=floats.map(n=>n.style.transform);assert(a.every((v,i)=>v!==b[i]));assert.equal(demo.progress,1);
demo.resume();clock=50;raf(clock);demo.open();clock=10000;raf(clock);assert.equal(demo.progress,1);
assert.equal(document.querySelector('#water-belt').style.animationDuration,'240s');
demo.frame(3,.7/5);const middle=data.elements.find(e=>e.group==='mid_left');assert(sprites.find(n=>n.dataset.layer===middle.id).style.transform.includes(`${middle.closed.x}px`));assert(nodes.get('#camera-world').style.transform.includes('scale('));
demo.frame(0,1);assert(nodes.get('#camera-world').style.transform.includes('scale(1.16)'));
demo.frame(4,2.1/5);const later=data.elements.find(e=>e.group==='top_right');assert(sprites.find(n=>n.dataset.layer===later.id).style.transform.includes(`${later.closed.x}px`));
console.log('PASS: drone camera, staggered depth gates, 36 sprite poses, 4 independent moving floaters after reveal, final opacities, replay, and separate 240s water flow.');
