/* AeroDesign — мини-игра «Лопни кульки». Грузится только по кнопке «Грати». */
(function(){
'use strict';
var css='.gm{position:fixed;inset:0;z-index:85;background:linear-gradient(180deg,#ffe6f0 0%,#fff6e8 55%,#e6f4ff 100%);touch-action:none;user-select:none;-webkit-user-select:none}.gm canvas{position:absolute;inset:0;width:100%;height:100%}.gm-h{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:10px;padding:12px 14px;z-index:2;font:900 16px Nunito,system-ui,sans-serif;color:#1f1a2e}.gm-h b{background:#fff;border-radius:999px;padding:8px 14px;box-shadow:0 6px 16px -10px #0006}.gm-h .sp{flex:1}.gm-h button{width:44px;height:44px;border-radius:50%;background:#fff;font-size:20px;font-weight:900;box-shadow:0 6px 16px -10px #0006}.gm-p{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:3;padding:20px}.gm-p[hidden]{display:none}.gm-c{background:#fff;border-radius:26px;padding:26px 22px;max-width:420px;width:100%;text-align:center;box-shadow:0 30px 60px -30px #1f1a2e88;font-family:Nunito,system-ui,sans-serif}.gm-c h3{font:700 24px/1.15 Unbounded,Nunito,sans-serif;margin-bottom:10px}.gm-c p{color:#665e72;margin-bottom:16px}.gm-c .big{font:700 54px/1 Unbounded,Nunito,sans-serif;color:#d1225c;margin:6px 0 10px}.gm-c .code{display:inline-block;font:900 22px monospace;letter-spacing:.12em;background:#fff1dc;color:#8a5200;padding:8px 16px;border-radius:12px;margin-bottom:14px}.gm-c .btn{width:100%;margin-top:8px}.gm-x{position:absolute;top:20%;left:50%;transform:translate(-50%,0);font:900 30px Unbounded,Nunito,sans-serif;color:#d1225c;z-index:2;pointer-events:none;opacity:0;transition:opacity .3s}';
window.ADgame=function(C,order,toast){
 var L=C.t.g,d=document;if(d.querySelector('.gm'))return;
 if(!d.getElementById('gmcss')){var s=d.createElement('style');s.id='gmcss';s.textContent=css;d.head.appendChild(s)}
 var ls={g:function(k){try{return localStorage.getItem(k)}catch(e){return null}},s:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
 var el=d.createElement('div');el.className='gm';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
 el.innerHTML='<canvas></canvas><div class="gm-h"><b class="gs">'+L.score+': 0</b><b class="gt">'+L.time+': 30</b><span class="sp"></span><button class="gmu" aria-label="Звук">♪</button><button class="gmx" aria-label="'+L.close+'">×</button></div><div class="gm-x">x2</div><div class="gm-p"><div class="gm-c"></div></div>';
 d.body.appendChild(el);d.documentElement.classList.add('lock');history.pushState({game:1},'');
 var cv=el.querySelector('canvas'),cx=cv.getContext('2d'),pn=el.querySelector('.gm-p'),card=el.querySelector('.gm-c'),gs=el.querySelector('.gs'),gt=el.querySelector('.gt'),gx=el.querySelector('.gm-x');
 var W,H,DPR=Math.min(window.devicePixelRatio||1,2);function rs(){W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0)}rs();addEventListener('resize',rs);
 var COLS=['#ff4f86','#3fb2ff','#9b7bff','#2fd0a7','#ff8a5c','#ffd23f','#f4f1ef'];
 var B=[],P=[],F=[],score=0,left=30,t=0,spawn=0,playing=false,combo=0,lastPop=-9,mute=ls.g('ad_mute')==='1',ac=null,raf;
 el.querySelector('.gmu').style.opacity=mute?.4:1;
 function snd(f){if(mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();var n=ac.sampleRate*.08,b=ac.createBuffer(1,n,ac.sampleRate),a=b.getChannelData(0);for(var i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,4);var s=ac.createBufferSource();s.buffer=b;var g=ac.createBiquadFilter();g.type='bandpass';g.frequency.value=f||1400;s.connect(g);g.connect(ac.destination);s.start()}catch(e){}}
 function add(){var r=Math.max(24,Math.min(W,H)*(.055+Math.random()*.03)),k=Math.random(),ty=k<.08?'g':k<.2?'b':'n';
  B.push({x:r+Math.random()*(W-2*r),y:H+r*1.4,r:r,vy:(70+Math.random()*70)*(1+t/30*.9)*(H/800+.35),ph:Math.random()*6,c:ty==='g'?'#f0b23c':ty==='b'?'#26232e':COLS[Math.random()*COLS.length|0],ty:ty})}
 function shade(h,p){var n=parseInt(h.slice(1),16);return'rgb('+[n>>16,n>>8&255,n&255].map(function(x){return Math.round(p<0?x*(1+p):x+(255-x)*p)}).join(',')+')'}
 function draw(b){var x=b.x+Math.sin(t*1.6+b.ph)*b.r*.25,y=b.y,r=b.r;b.dx=x;
  cx.strokeStyle='rgba(120,100,115,.6)';cx.lineWidth=1.3;cx.beginPath();cx.moveTo(x,y+r*1.18);cx.bezierCurveTo(x-r*.3,y+r*1.7,x+r*.3,y+r*2.1,x,y+r*2.6);cx.stroke();
  var g=cx.createRadialGradient(x-r*.35,y-r*.45,r*.1,x,y,r*1.2);g.addColorStop(0,'#fff');g.addColorStop(.2,b.c);g.addColorStop(1,shade(b.c,-.35));cx.fillStyle=g;
  cx.beginPath();cx.ellipse(x,y,r*.9,r*1.1,0,0,6.283);cx.fill();cx.fillStyle=shade(b.c,-.35);cx.beginPath();cx.moveTo(x-r*.12,y+r*1.18);cx.lineTo(x+r*.12,y+r*1.18);cx.lineTo(x,y+r*1.05);cx.fill();
  if(b.ty!=='n'){cx.fillStyle=b.ty==='g'?'#5a3a00':'#fff';cx.font='900 '+(r*.62|0)+'px Nunito,system-ui,sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(b.ty==='g'?'+5':'−5',x,y)}}
 function pop(b){var v=b.ty==='g'?5:b.ty==='b'?-5:1;if(b.ty==='n'){combo=t-lastPop<.7?combo+1:1;lastPop=t;if(combo>=5){v=2;gx.style.opacity=1;clearTimeout(gx._t);gx._t=setTimeout(function(){gx.style.opacity=0},500)}}else combo=0;
  score=Math.max(0,score+v);gs.textContent=L.score+': '+score;snd(b.ty==='b'?400:b.ty==='g'?2200:1300);if(navigator.vibrate&&b.ty==='b')navigator.vibrate(40);
  for(var i=0;i<14;i++){var a=Math.random()*6.283,s=120+Math.random()*260;P.push({x:b.dx,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,l:.7,c:i%3?b.c:'#ffd23f',r:2+Math.random()*3})}
  F.push({x:b.dx,y:b.y,v:(v>0?'+':'')+v,l:.8,c:v<0?'#26232e':'#d1225c'})}
 cv.addEventListener('pointerdown',function(e){if(!playing)return;var x=e.clientX,y=e.clientY;for(var i=B.length-1;i>=0;i--){var b=B[i],dx=(x-b.dx)/(b.r*1.05),dy=(y-b.y)/(b.r*1.25);if(dx*dx+dy*dy<=1){pop(b);B.splice(i,1);return}}combo=0});
 var lt=0;function loop(now){raf=requestAnimationFrame(loop);var dt=Math.min(.05,(now-(lt||now))/1000);lt=now;cx.clearRect(0,0,W,H);
  if(playing){t+=dt;left-=dt;if(left<=0){left=0;end()}gt.textContent=L.time+': '+Math.ceil(left);spawn-=dt;if(spawn<=0){add();spawn=Math.max(.2,.55-t*.011)*(Math.random()*.5+.75)}}
  for(var i=B.length-1;i>=0;i--){var b=B[i];b.y-=b.vy*dt;if(b.y<-b.r*3)B.splice(i,1);else draw(b)}
  for(i=P.length-1;i>=0;i--){var p=P[i];p.l-=dt;if(p.l<=0){P.splice(i,1);continue}p.vy+=500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;cx.globalAlpha=Math.min(1,p.l*2);cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.r,p.r*1.6)}
  for(i=F.length-1;i>=0;i--){var f=F[i];f.l-=dt;if(f.l<=0){F.splice(i,1);continue}f.y-=60*dt;cx.globalAlpha=Math.min(1,f.l*2);cx.fillStyle=f.c;cx.font='900 26px Nunito,system-ui,sans-serif';cx.textAlign='center';cx.fillText(f.v,f.x,f.y)}cx.globalAlpha=1}
 raf=requestAnimationFrame(loop);
 function start(){score=0;left=30;t=0;spawn=0;combo=0;B=[];P=[];F=[];gs.textContent=L.score+': 0';pn.hidden=true;playing=true;for(var i=0;i<4;i++){add();B[B.length-1].y=H*(.5+i*.15)}}
 function panel(h){card.innerHTML=h;pn.hidden=false;var b=card.querySelector('.st');if(b)b.focus()}
 function intro(){var best=+(ls.g('ad_best')||0);panel('<h3>'+L.start+'!</h3><p>'+L.tip+'</p>'+(best?'<p><b>'+L.best+': '+best+'</b></p>':'')+'<button class="btn b1 st">'+L.start+' ▶</button>');card.querySelector('.st').onclick=start}
 function end(){playing=false;var best=Math.max(score,+(ls.g('ad_best')||0));ls.s('ad_best',best);var win=score>=C.goal;if(win)ls.s('ad_win',C.promo);
  var url=C.url+'/'+(ls.g('ad_my')?'?ref='+ls.g('ad_my'):''),txt=L.shareText.replace('{n}',score);
  panel('<div class="big">'+score+'</div><p>'+L.best+': '+best+'</p>'+(win?'<p>'+L.win+'</p><div class="code">'+C.promo+'</div><button class="btn b1 st go">'+L.use+'</button>':'<p>'+L.lose+'</p>')+'<button class="btn '+(win?'b2':'b1 st')+' ag">'+L.again+'</button><a class="btn b2" target="_blank" rel="noopener" href="https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(txt)+'">'+L.share+'</a><button class="btn b2 cl">'+L.close+'</button>');
  card.querySelector('.ag').onclick=start;card.querySelector('.cl').onclick=function(){close()};
  var go=card.querySelector('.go');if(go)go.onclick=function(){close();var t2=d.querySelector('#cats,#prices');if(t2)t2.scrollIntoView({behavior:'smooth'})}}
 var closed=false;function close(fromPop){if(closed)return;closed=true;cancelAnimationFrame(raf);removeEventListener('resize',rs);removeEventListener('popstate',onPop);removeEventListener('keydown',onKey);el.remove();d.documentElement.classList.remove('lock');if(!fromPop&&history.state&&history.state.game)history.back()}
 function onPop(){close(true)}function onKey(e){if(e.key==='Escape')close()}
 addEventListener('popstate',onPop);addEventListener('keydown',onKey);
 el.querySelector('.gmx').onclick=function(){close()};
 el.querySelector('.gmu').onclick=function(){mute=!mute;ls.s('ad_mute',mute?'1':'0');this.style.opacity=mute?.4:1};
 intro();
};
})();
