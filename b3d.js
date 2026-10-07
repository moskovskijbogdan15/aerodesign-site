/* AeroDesign — 3D-шарики в первом экране (three.js r128). Тап/клик по шарику — лопается с конфетти и вырастает заново. */
(function(){
'use strict';
var T=window.THREE,st=document.getElementById('stage');if(!T||!st||st.dataset.on)return;st.dataset.on=1;
var touch=matchMedia('(pointer:coarse)').matches,W=st.clientWidth||400,H=st.clientHeight||380;
var R;try{R=new T.WebGLRenderer({antialias:!touch,alpha:true,powerPreference:'high-performance'})}catch(e){return}
var dpr=Math.min(window.devicePixelRatio||1,touch?1.5:1.75);R.setPixelRatio(dpr);R.setSize(W,H,false);
R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.08;
var cv=R.domElement;cv.setAttribute('aria-hidden','true');st.insertBefore(cv,st.firstChild);
var sc=new T.Scene(),cam=new T.PerspectiveCamera(31,W/H,.1,100);cam.position.set(0,.3,15.5);cam.lookAt(0,.15,0);

/* окружение для глянцевых бликов: градиентная сфера + «софтбоксы» */
(function(){var e=new T.Scene(),g=new T.SphereGeometry(30,24,12),p=g.attributes.position,a=[],top=new T.Color('#fff6fa'),mid=new T.Color('#ffd3e2'),bot=new T.Color('#3b2b4d');
 for(var i=0;i<p.count;i++){var y=p.getY(i)/30,c=y>0?mid.clone().lerp(top,y):mid.clone().lerp(bot,-y);a.push(c.r,c.g,c.b)}
 g.setAttribute('color',new T.Float32BufferAttribute(a,3));e.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
 var pg=new T.PlaneGeometry(14,9);[[-13,11,9,3],[14,6,7,2.4],[0,-3,-17,1.1]].forEach(function(q){var m=new T.Mesh(pg,new T.MeshBasicMaterial({color:new T.Color(q[3],q[3],q[3]),side:T.DoubleSide}));m.position.set(q[0],q[1],q[2]);m.lookAt(0,0,0);e.add(m)});
 var pm=new T.PMREMGenerator(R);sc.environment=pm.fromScene(e,.035).texture;pm.dispose()})();
sc.add(new T.HemisphereLight(0xffffff,0xffd6e6,.55));var dl=new T.DirectionalLight(0xffffff,1.1);dl.position.set(-4,7,6);sc.add(dl);

/* геометрия */
var latex=(function(){var p=[],N=28;for(var i=0;i<=N;i++){var t=Math.PI*i/N;p.push(new T.Vector2(Math.max(1e-4,Math.sin(t)*(.86+.14*(1-Math.cos(t))/2)),-1.12*Math.cos(t)))}return new T.LatheGeometry(p,40)})();
var knot=new T.ConeGeometry(.1,.17,12);
var heart=(function(){var s=new T.Shape();s.moveTo(0,-.95);s.bezierCurveTo(-.25,-.7,-1,-.25,-1,.25);s.bezierCurveTo(-1,.7,-.6,.95,-.33,.95);s.bezierCurveTo(-.12,.95,0,.8,0,.62);s.bezierCurveTo(0,.8,.12,.95,.33,.95);s.bezierCurveTo(.6,.95,1,.7,1,.25);s.bezierCurveTo(1,-.25,.25,-.7,0,-.95);
 var g=new T.ExtrudeGeometry(s,{depth:.16,bevelEnabled:true,bevelThickness:.22,bevelSize:.15,bevelSegments:5,curveSegments:30});g.center();return g})();
var star=(function(){var s=new T.Shape();for(var i=0;i<10;i++){var a=Math.PI/2+i*Math.PI/5,r=i%2?.46:1;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}s.closePath();
 var g=new T.ExtrudeGeometry(s,{depth:.14,bevelEnabled:true,bevelThickness:.2,bevelSize:.13,bevelSegments:4,curveSegments:8});g.center();return g})();
var phys=function(c,ch){return ch?new T.MeshStandardMaterial({color:c,roughness:.17,metalness:.9,envMapIntensity:1.35}):new T.MeshPhysicalMaterial({color:c,roughness:.33,metalness:0,clearcoat:.75,clearcoatRoughness:.16,envMapIntensity:1.05})};
var foil=function(c){return new T.MeshStandardMaterial({color:c,roughness:.2,metalness:1,envMapIntensity:1.45})};

/* букет */
var D=[['l','#ff4f86',1.05,-1.9,1.55,.2],['l','#3fb2ff',1,.05,2.45,-.7],['l','#e9b44c',.95,1.95,1.45,.1,1],['h','#f0a08e',.95,-.5,.45,1.3],['l','#9b7bff',.9,-2.7,-.25,-.5],['l','#f4f1ef',.95,.95,.15,.9],['s','#f2c14e',.85,2.75,-.15,-.4],['l','#2fd0a7',.85,-1.25,-1.15,.55],['l','#ff8a5c',.8,1.4,-1.25,.15]];
var bunch=new T.Group();sc.add(bunch);var G=new T.Vector3(0,-5.2,.6),items=[],meshes=[];
var lm=new T.LineBasicMaterial({color:0xb5a7b1,transparent:true,opacity:.9});
D.forEach(function(d,i){var h=new T.Group(),m,k=d[0],s=d[2];
 if(k==='l'){m=new T.Mesh(latex,phys(d[1],d[6]));var kn=new T.Mesh(knot,m.material);kn.position.y=-1.2;m.add(kn)}
 else m=new T.Mesh(k==='h'?heart:star,foil(d[1]));
 m.scale.setScalar(s);h.add(m);h.position.set(d[3],d[4],d[5]);bunch.add(h);
 var ln=new T.Line(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(new Float32Array(66),3)),lm);ln.frustumCulled=false;sc.add(ln);
 var it={h:h,m:m,ln:ln,b:h.position.clone(),ph:i*1.7,att:new T.Vector3(0,k==='l'?-1.3:k==='h'?-1.08:-.55,0),k:k,c:new T.Color(d[1]),pop:0,grow:0};m.userData.it=it;items.push(it);meshes.push(m)});

/* конфетти */
var NP=360,pg=new T.BufferGeometry(),pp=new Float32Array(NP*3),pc=new Float32Array(NP*3),pv=[],pl=new Float32Array(NP),pi=0;
for(var i=0;i<NP;i++){pp[i*3+1]=-99;pv.push(new T.Vector3())}
pg.setAttribute('position',new T.BufferAttribute(pp,3));pg.setAttribute('color',new T.BufferAttribute(pc,3));
var pts=new T.Points(pg,new T.PointsMaterial({size:.14,vertexColors:true,transparent:true,depthWrite:false}));pts.frustumCulled=false;sc.add(pts);
var CF=['#ff4f86','#ffd23f','#3fb2ff','#9b7bff','#2fd0a7','#ffffff'].map(function(c){return new T.Color(c)});
function burst(p,c){for(var n=0;n<46;n++){var j=pi++%NP,a=Math.random()*6.283,b=Math.random()*3.14,v=2.5+Math.random()*3.5;pp[j*3]=p.x;pp[j*3+1]=p.y;pp[j*3+2]=p.z;pv[j].set(Math.cos(a)*Math.sin(b)*v,Math.cos(b)*v+1.5,Math.sin(a)*Math.sin(b)*v);var cc=n%3?CF[n%6]:c;pc[j*3]=cc.r;pc[j*3+1]=cc.g;pc[j*3+2]=cc.b;pl[j]=1.4+Math.random()*.6}}

/* ввод */
var px=0,py=0,has=false,ray=new T.Raycaster(),mv=new T.Vector2(),hov=false,wp=new T.Vector3();
function ndc(e){var r=cv.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);return mv}
function pick(e){ray.setFromCamera(ndc(e),cam);var x=ray.intersectObjects(meshes,true)[0];if(!x)return null;var o=x.object;while(o&&!o.userData.it)o=o.parent;return o&&o.userData.it}
st.addEventListener('pointermove',function(e){var r=st.getBoundingClientRect();px=(e.clientX-r.left)/r.width*2-1;py=(e.clientY-r.top)/r.height*2-1;has=true;if(!touch){var it=pick(e);var h2=!!(it&&!it.pop);if(h2!==hov){hov=h2;cv.style.cursor=h2?'pointer':''}}});
st.addEventListener('pointerleave',function(){has=false});
st.addEventListener('pointerdown',function(e){var it=pick(e);if(!it||it.pop)return;it.pop=clock;it.m.getWorldPosition(wp);burst(wp,it.c);var hn=st.querySelector('.hint3d');if(hn)hn.style.opacity=0});

/* цикл */
var clock=0,last=performance.now(),run=true,vis=true,ry=0,rx=0,vy=0,vx=0,fr=0,acc=0,tier=0,odd=0,shown=false;
var spr=function(v,x,t,dt){var a=64*(t-x)-16*v;return v+a*dt};
var q=new T.Vector3(),g2=new T.Vector3(),c1=new T.Vector3();
function frame(now){if(!run)return;requestAnimationFrame(frame);if(!vis||document.hidden){last=now;return}
 if(touch&&(odd^=1))return;var dt=Math.min(.05,(now-last)/1000);last=now;clock+=dt;
 if(fr<240){fr++;if(fr>40){acc+=dt;if(fr===130&&acc/90>.034&&!tier){tier=1;R.setPixelRatio(1);items.forEach(function(it){if(it.k==='l'&&it.m.material.clearcoat){var o=it.m.material;it.m.material=new T.MeshStandardMaterial({color:o.color,roughness:.3,metalness:0,envMapIntensity:1});it.m.children[0].material=it.m.material}});acc=0}if(fr===220&&tier===1&&acc/90>.05){run=false;st.classList.remove('on');return}}}
 var tx=has?px*.5:Math.sin(clock*.35)*.3,ty=has?py*.14:0;vy=spr(vy,ry,tx,dt);ry+=vy*dt;vx=spr(vx,rx,ty,dt);rx+=vx*dt;
 bunch.rotation.y=ry;bunch.rotation.x=rx;bunch.position.y=Math.sin(clock*.6)*.12;bunch.rotation.z=Math.sin(clock*.4)*.025;
 items.forEach(function(it){var t=clock+it.ph,sc0=1;
  it.h.position.set(it.b.x+Math.sin(t*.9)*.06,it.b.y+Math.sin(t*1.2)*.1,it.b.z);it.h.rotation.z=Math.sin(t*.8)*.08;if(it.k!=='l')it.h.rotation.y=Math.sin(t*.5)*.6;
  if(it.pop){var e=clock-it.pop;if(e<.09)sc0=1+e/.09*.32;else if(e<1.5)sc0=0;else if(e<2.2){var u=(e-1.5)/.7,c3=1.70158;sc0=1+(c3+1)*Math.pow(u-1,3)+c3*Math.pow(u-1,2)}else it.pop=0}
  it.h.scale.setScalar(Math.max(sc0,1e-3));it.h.visible=sc0>.01;it.ln.visible=sc0>.35});
 bunch.updateMatrixWorld();g2.copy(G);bunch.localToWorld(g2);
 items.forEach(function(it){if(!it.ln.visible)return;q.copy(it.att);it.m.localToWorld(q);var a=it.ln.geometry.attributes.position,sw=Math.sin(clock*1.3+it.ph)*.35;c1.set((q.x+g2.x)/2+sw,(q.y+g2.y)/2,(q.z+g2.z)/2);
  for(var n=0;n<=21;n++){var u=n/21,w=1-u;a.setXYZ(n,w*w*q.x+2*w*u*c1.x+u*u*g2.x,w*w*q.y+2*w*u*c1.y+u*u*g2.y,w*w*q.z+2*w*u*c1.z+u*u*g2.z)}a.needsUpdate=true});
 var live=false;for(var j=0;j<NP;j++){if(pl[j]>0){live=true;pl[j]-=dt;pv[j].y-=7*dt;pv[j].multiplyScalar(1-1.2*dt);pp[j*3]+=pv[j].x*dt;pp[j*3+1]+=pv[j].y*dt;pp[j*3+2]+=pv[j].z*dt;if(pl[j]<=0)pp[j*3+1]=-99}}
 if(live)pg.attributes.position.needsUpdate=true;
 R.render(sc,cam);if(!shown){shown=true;st.classList.add('on')}}
requestAnimationFrame(frame);
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(st);
if('ResizeObserver'in window)new ResizeObserver(function(){var w=st.clientWidth,h=st.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}).observe(st);
})();
