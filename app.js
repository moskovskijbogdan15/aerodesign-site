/* AeroDesign — основной скрипт: заказ, галерея-лента, конструктор, 3D, игра, рефералка, язык */
(function(){
'use strict';
var C=JSON.parse(document.getElementById('cfg').textContent),L=C.t,d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var ls={g:function(k){try{return localStorage.getItem(k)}catch(e){return null}},s:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})};
var fmt=function(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')};
function el(h){var t=d.createElement('div');t.innerHTML=h.trim();return t.firstChild}
var tt;function toast(m){var t=$('#toast');if(!t){t=el('<div id="toast" role="status"></div>');d.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},3600)}
function copy(s){try{if(navigator.clipboard)return navigator.clipboard.writeText(s).catch(function(){})}catch(e){}}
function lock(on){d.documentElement.classList.toggle('lock',!!on)}

/* ── «Сейчас принимаем» по киевскому времени ── */
var lv=$('.live');if(lv){try{var h=+new Intl.DateTimeFormat('en-GB',{hour:'numeric',hour12:false,timeZone:'Europe/Kyiv'}).format(new Date());if(h>=23||h<8){lv.classList.add('n');lv.lastChild.textContent=L.liveOff}}catch(e){}}

/* ── Рефералка и промокод ── */
var q=new URLSearchParams(location.search),rf=(q.get('ref')||'').replace(/[^A-Za-z0-9]/g,'').slice(0,12).toUpperCase();
if(rf&&rf!==ls.g('ad_my')){ls.s('ad_ref',rf);setTimeout(function(){toast(L.inv.got)},900)}
function extras(){var a=[],r=ls.g('ad_ref'),p=ls.g('ad_win');if(r)a.push(L.md.ref+r);if(p)a.push(L.md.promo+p);return a}

/* ── Окно заказа ── */
var md;function order(item){
 var msg=L.md.hi+item+'\n'+L.md.addr+'\n'+L.md.time+(extras().length?'\n'+extras().join('\n'):'');
 if(!md){md=el('<div class="md" hidden role="dialog" aria-modal="true" aria-labelledby="mdh"><div class="bx"><button class="xb" aria-label="×">×</button><h3 id="mdh">'+L.md.h+'</h3><label class="fld"><span>'+L.md.msg+'</span><textarea rows="5"></textarea></label><div class="ch"><a class="btn tgb" target="_blank" rel="noopener">'+L.md.tg+'</a><a class="btn vbb">'+L.md.vb+'</a><a class="btn b2" href="tel:'+C.phone+'">'+L.md.call+' · '+C.phoneH+'</a></div></div></div>');
  d.body.appendChild(md);
  md.addEventListener('click',function(e){if(e.target===md||e.target.closest('.xb'))closeMd()});
  var ta=$('textarea',md),upd=function(){var v=encodeURIComponent(ta.value);$('.tgb',md).href='https://t.me/'+C.tg+'?text='+v;$('.vbb',md).href='viber://chat?number=%2B'+C.phone.slice(1)+'&draft='+v};
  ta.addEventListener('input',upd);md._u=upd;
  $$('.tgb,.vbb',md).forEach(function(a){a.addEventListener('click',function(){copy(ta.value);setTimeout(function(){toast(L.md.copied)},300)})});
 }
 $('textarea',md).value=msg;md._u();md.hidden=false;lock(1);setTimeout(function(){$('.tgb',md).focus()},50);
 history.pushState({md:1},'');
}
var skip=0;
function closeMd(fromPop){if(!md||md.hidden)return;md.hidden=true;if(!lbOpen)lock(0);if(!fromPop&&history.state&&history.state.md){skip=1;history.back()}}
d.addEventListener('click',function(e){var b=e.target.closest('[data-order]');if(b){e.preventDefault();order(b.getAttribute('data-order'))}});

/* ── Галерея-лента (идея Андрея): тап по фото → лента вверх-вниз, «Назад» → там же ── */
var G=C.gal||[],lb,lbOpen=false,cur=0,io;
function openLb(i){
 if(!G.length)return;
 if(!lb){
  lb=el('<div class="lb" hidden role="dialog" aria-modal="true" aria-label="'+L.lb.photo+'"><div class="lb-t"><button class="lb-x">‹ '+L.lb.back+'</button><span class="lb-n"></span></div><div class="lb-f"></div><div class="lb-a"><button aria-label="↑">↑</button><button aria-label="↓">↓</button></div><div class="lb-h">'+L.lb.hint+'</div></div>');
  d.body.appendChild(lb);var f=$('.lb-f',lb);
  f.innerHTML=G.map(function(g,k){return'<figure class="lb-s" data-i="'+k+'"><img data-src="'+g.l+'" width="'+g.lw+'" height="'+g.lh+'" alt="'+esc(g.cap||C.catT+' — '+L.lb.photo+' '+(k+1))+'"><figcaption class="lb-c">'+(g.cap?'<p>«'+esc(g.cap)+'»</p>':'')+'<button class="btn b1 bs" data-order="'+esc(g.ord||((g.cap?C.capT+' «'+g.cap+'»':C.catT)+' ('+L.lb.photo+' '+(k+1)+')'))+'">'+L.lb.order+'</button></figcaption></figure>'}).join('');
  io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){cur=+x.target.dataset.i;$('.lb-n',lb).textContent=(cur+1)+' / '+G.length;load(cur);load(cur+1);load(cur-1)}})},{root:f,threshold:.55});
  $$('.lb-s',lb).forEach(function(s){io.observe(s)});
  $('.lb-x',lb).addEventListener('click',function(){closeLb()});
  var ab=$$('.lb-a button',lb);ab[0].onclick=function(){go(cur-1)};ab[1].onclick=function(){go(cur+1)};
 }
 lb.hidden=false;lbOpen=true;lock(1);load(i);load(i+1);
 var f=$('.lb-f',lb);f.scrollTop=i*f.clientHeight;cur=i;$('.lb-n',lb).textContent=(i+1)+' / '+G.length;
 var hn=$('.lb-h',lb);hn.style.opacity=1;setTimeout(function(){hn.style.opacity=0},2200);
 history.pushState({lb:1},'');setTimeout(function(){$('.lb-x',lb).focus()},30);
}
function load(i){var s=lb&&$('.lb-s[data-i="'+i+'"] img',lb);if(s&&s.dataset.src){s.src=s.dataset.src;s.removeAttribute('data-src')}}
function go(i){if(i<0||i>=G.length)return;var f=$('.lb-f',lb);f.scrollTo({top:i*f.clientHeight,behavior:'smooth'})}
function closeLb(fromPop){if(!lbOpen)return;lb.hidden=true;lbOpen=false;if(!md||md.hidden)lock(0);
 var t=$('.gal [data-lb="'+cur+'"]');if(t){$$('.gal .seen').forEach(function(x){x.classList.remove('seen')});t.classList.add('seen');var r=t.getBoundingClientRect();if(r.top<70||r.bottom>innerHeight)t.scrollIntoView({block:'center'})}
 if(!fromPop&&history.state&&history.state.lb){skip=1;history.back()}}
d.addEventListener('click',function(e){var b=e.target.closest('[data-lb]');if(b){e.preventDefault();openLb(+b.getAttribute('data-lb'))}});
addEventListener('popstate',function(){if(skip){skip=0;return}if(md&&!md.hidden){closeMd(true);return}if(lbOpen)closeLb(true)});
addEventListener('keydown',function(e){if(e.key==='Escape'){if(md&&!md.hidden)closeMd();else if(lbOpen)closeLb()}if(lbOpen&&(!md||md.hidden)){if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();go(cur+1)}if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();go(cur-1)}}});

/* ── Конструктор надписи ── */
var mk=$('#mk');if(mk){
 var HX={latex:['#ffffff','#ff7aa8','#6cc6ff','#ff4d5e','#26232e','#9b7bff','#43d1b0','#e9b44c'],foil:['#e9b44c','#c9ccd3','#e8a587','#e8304a','#ff7aa8','#2a2733','#3d8bff'],bubble:['#ffffff'],giant:['#ffffff','#ff7aa8','#6cc6ff','#26232e','#e9b44c'],ink:['#ffffff','#1f1a2e','#d9a83a','#b8bcc6','#ff4f86','#e3263c']};
 var COL={};Object.keys(HX).forEach(function(k){COL[k]=HX[k].map(function(h,i){return[h,(L.cn[k]||[])[i]||h]})});var INK=COL.ink;
 var st={type:'latex',shape:'heart',col:'#ff7aa8',ink:null,font:0,qty:1};
 var txt=$('#mk-t'),stage=$('#mk-s'),out=$('#mk-q'),pr=$('#mk-p');
 var lum=function(h){var n=parseInt(h.slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255};
 var shd=function(h,p){var n=parseInt(h.slice(1),16);return'#'+[n>>16,n>>8&255,n&255].map(function(x){return Math.max(0,Math.min(255,Math.round(p<0?x*(1+p):x+(255-x)*p))).toString(16).padStart(2,'0')}).join('')};
 function wrap(t,max){var o=[],l='';t.split(/\s+/).filter(Boolean).forEach(function(w){while(w.length>max+2){if(l){o.push(l);l=''}o.push(w.slice(0,max));w=w.slice(max)}if(!w)return;if(!l)l=w;else if((l+' '+w).length<=max)l+=' '+w;else{o.push(l);l=w}});if(l)o.push(l);return o}
 function svg(){
  var t=txt.value.trim()||L.mkPh,c=st.type==='bubble'?'#ffffff':st.col,ink=st.ink||(st.type==='bubble'?'#ff4f86':lum(c)>.62?'#1f1a2e':'#ffffff');
  var sh=st.type==='foil'?st.shape:st.type==='bubble'?'bub':'lat',cx=50,cy={lat:54,heart:47,star:57,round:52,bub:52}[sh],W={lat:74,heart:62,star:40,round:70,bub:68}[sh];
  var cw=st.font?.46:.62,mx=Math.max(6,Math.floor(W/(13*cw))),ln=wrap(t,mx);if(ln.length>4)ln=wrap(t,Math.floor(mx*1.4));ln=ln.slice(0,5);
  var L2=Math.max.apply(0,ln.map(function(x){return x.length})),fs=Math.min(ln.length<3?17:ln.length<4?14:12,W/(L2*cw))*(st.font?1.25:1);
  var lh=fs*1.1,y0=cy-(ln.length-1)*lh/2+fs*.35,ff=st.font?"Caveat,'Segoe Script',cursive":"Unbounded,Nunito,system-ui,sans-serif";
  var dk=shd(c,-.3),lt=shd(c,.5),g='<defs><radialGradient id="mg" cx="34%" cy="28%" r="78%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".22" stop-color="'+c+'"/><stop offset="1" stop-color="'+dk+'"/></radialGradient><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+lt+'"/><stop offset=".45" stop-color="'+c+'"/><stop offset=".7" stop-color="'+dk+'"/><stop offset="1" stop-color="'+c+'"/></linearGradient></defs>',b='',k=110;
  if(sh==='lat')b='<path d="M50 4C23 4 6 26 6 52c0 28 23 51 44 55 21-4 44-27 44-55C94 26 77 4 50 4Z" fill="url(#mg)"/>';
  else if(sh==='heart'){b='<path d="M50 96C22 78 5 60 5 38 5 20 18 8 33 8c8 0 14 4 17 11 3-7 9-11 17-11 15 0 28 12 28 30 0 22-17 40-45 58Z" fill="url(#fg)" stroke="'+dk+'" stroke-width="1"/>';k=101}
  else if(sh==='star'){b='<path d="M50 6l12.6 28.5 31 3.1-23.3 20.6 6.8 30.4L50 72.9 22.9 88.6l6.8-30.4L6.4 37.6l31-3.1Z" fill="url(#fg)" stroke="'+c+'" stroke-width="7" stroke-linejoin="round"/>';k=93}
  else if(sh==='round')b='<circle cx="50" cy="52" r="45" fill="url(#fg)" stroke="'+dk+'" stroke-width="1"/>';
  else{var cf='',cs=['#ff4f86','#ffd23f','#3fb2ff','#9b7bff','#2fd0a7'];for(var i=0;i<26;i++){var a=i*2.39996,r=10+((i*37)%30);cf+='<circle cx="'+(50+Math.cos(a)*r).toFixed(1)+'" cy="'+(56+Math.sin(a)*r*.9).toFixed(1)+'" r="'+(1.6+(i%3)*.7)+'" fill="'+cs[i%5]+'"/>'}
   b='<circle cx="50" cy="52" r="46" fill="#ffffff" fill-opacity=".28" stroke="#ffffff" stroke-opacity=".9" stroke-width="1.5"/>'+cf+'<ellipse cx="34" cy="28" rx="12" ry="7" fill="#fff" opacity=".75" transform="rotate(-30 34 28)"/>'}
  var tx='<text text-anchor="middle" font-family="'+ff+'" font-weight="700" font-size="'+fs.toFixed(1)+'" fill="'+ink+'"'+(ink==='#ffffff'&&lum(c)>.7?' stroke="#00000022" stroke-width=".4"':'')+'>'+ln.map(function(x,i){return'<tspan x="'+cx+'" y="'+(y0+i*lh).toFixed(1)+'">'+esc(x)+'</tspan>'}).join('')+'</text>';
  return'<svg viewBox="0 0 100 162" role="img" aria-label="'+esc(t)+'">'+g+b+tx+'<path d="M45.5 '+k+'h9l-4.5-6z" fill="'+dk+'"/><path d="M50 '+k+'c-7 12 7 19 0 30s7 12 0 '+(162-k-30)+'" stroke="#bcb1b8" stroke-width="1.3" fill="none"/></svg>';
 }
 var tp=function(){return L.types.filter(function(x){return x[0]===st.type})[0]};
 function draw(){stage.innerHTML=svg();var t=tp(),sum=t[2]*st.qty;out.textContent=t[1]+(st.type==='foil'?' · '+L.shapes.filter(function(s){return s[0]===st.shape})[0][1].toLowerCase():'')+' · '+st.qty+' × '+fmt(t[2])+' '+L.uah;pr.innerHTML=fmt(sum)+' <small>'+L.uah+'</small>'}
 function sw(box,list,curv,fn){box.innerHTML=list.map(function(x){return'<button type="button" class="sw'+(x[0]===curv?' on':'')+'" style="background:'+x[0]+'" data-v="'+x[0]+'" data-n="'+esc(x[1])+'" aria-label="'+esc(x[1])+'" title="'+esc(x[1])+'"></button>'}).join('');box.onclick=function(e){var b=e.target.closest('.sw');if(!b)return;$$('.sw',box).forEach(function(z){z.classList.toggle('on',z===b)});fn(b.dataset.v);draw()}}
 function colors(){var l=COL[st.type];if(!l.some(function(x){return x[0]===st.col}))st.col=l[0][0];sw($('#mk-c'),l,st.col,function(v){st.col=v});$('#mk-shp').hidden=st.type!=='foil'}
 $('#mk-ty').onclick=function(e){var b=e.target.closest('[data-v]');if(!b)return;st.type=b.dataset.v;$$('#mk-ty .pill').forEach(function(z){z.classList.toggle('on',z===b)});colors();draw()};
 $('#mk-shp').onclick=function(e){var b=e.target.closest('[data-v]');if(!b)return;st.shape=b.dataset.v;$$('#mk-shp .pill').forEach(function(z){z.classList.toggle('on',z===b)});draw()};
 sw($('#mk-i'),INK,'',function(v){st.ink=v});
 $('#mk-f').onclick=function(e){var b=e.target.closest('[data-v]');if(!b)return;st.font=+b.dataset.v;$$('#mk-f .pill').forEach(function(z){z.classList.toggle('on',z===b)});
  if(st.font&&!d.getElementById('cav')){var l=d.createElement('link');l.id='cav';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';l.onload=function(){setTimeout(draw,150)};d.head.appendChild(l)}draw()};
 $('#mk-n').onclick=function(e){var b=e.target.closest('button');if(!b)return;st.qty=Math.max(1,Math.min(50,st.qty+(+b.dataset.d)));$('#mk-n output').textContent=st.qty;draw()};
 $('#mk-ph').onclick=function(e){var b=e.target.closest('button');if(!b)return;txt.value=b.textContent;draw()};
 txt.addEventListener('input',draw);colors();draw();
 $('#mk-o').onclick=function(){var t=tp(),cn=$('#mk-c .on'),ik=$('#mk-i .on');order(C.capT+' «'+(txt.value.trim()||'…')+'» — '+$('#mk-q').textContent+' = '+fmt(t[2]*st.qty)+' '+L.uah+(cn&&st.type!=='bubble'?'; '+L.mkColor.toLowerCase()+': '+cn.dataset.n:'')+(ik?'; '+L.mkInk.toLowerCase()+': '+ik.dataset.n:'')+(st.font?'; '+L.mkFonts[1].toLowerCase():''))};
}

/* ── Приглашение друга ── */
var tr={'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye','ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ь':'','ю':'yu','я':'ya','ы':'y','э':'e','ё':'yo','ъ':''};
d.addEventListener('click',function(e){if(!e.target.closest('[data-invite]'))return;e.preventDefault();
 var m=el('<div class="md" role="dialog" aria-modal="true"><div class="bx"><button class="xb" aria-label="×">×</button><h3>'+L.inv.h+'</h3><label class="fld"><span>'+L.inv.name+'</span><input maxlength="20" autocomplete="given-name"></label><button class="btn b1" style="width:100%">'+L.inv.make+'</button><div class="ch" hidden style="margin-top:12px"><input class="lnk" readonly style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--line);font:700 14px var(--fb)"><a class="btn tgb" target="_blank" rel="noopener">'+L.inv.tg+'</a><button class="btn b2 cp">'+L.inv.copy+'</button></div></div></div>');
 d.body.appendChild(m);lock(1);var inp=$('input',m);inp.value=ls.g('ad_nm')||'';inp.focus();
 m.addEventListener('click',function(ev){if(ev.target===m||ev.target.closest('.xb')){m.remove();if(!lbOpen&&(!md||md.hidden))lock(0)}});
 $('.b1',m).onclick=function(){var n=inp.value.trim().toLowerCase();ls.s('ad_nm',inp.value.trim());
  var code=ls.g('ad_my');if(!code){code=(n.split('').map(function(ch){return tr[ch]!=null?tr[ch]:/[a-z]/.test(ch)?ch:''}).join('').replace(/[^a-z]/g,'').slice(0,6)||'ad').toUpperCase()+(10+Math.floor(Math.random()*90));ls.s('ad_my',code)}
  var url=C.url+'/?ref='+code;$('.lnk',m).value=url;$('.ch',m).hidden=false;
  $('.tgb',m).href='https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(L.inv.text);
  $('.cp',m).onclick=function(){copy(L.inv.text+' '+url);toast(L.inv.done)};
  if(navigator.share&&matchMedia('(pointer:coarse)').matches)navigator.share({title:'AeroDesign',text:L.inv.text,url:url}).catch(function(){})};
});

/* ── Мини-игра (грузится только по кнопке) ── */
d.addEventListener('click',function(e){if(!e.target.closest('[data-game]'))return;e.preventDefault();
 if(window.ADgame)return window.ADgame(C,order,toast);var s=d.createElement('script');s.src='/game.js?v='+C.v;s.onload=function(){window.ADgame(C,order,toast)};d.head.appendChild(s)});

/* ── Плашка языка ── */
(function(){if(ls.g('ad_lang'))return;var nl=(navigator.languages||[navigator.language||'']).join(',').toLowerCase(),p=nl.slice(0,2),o=C.lgb;
 if(!o||!((C.lang==='uk'&&p==='ru')||(C.lang==='ru'&&p==='uk')))return;
 var b=el('<div class="lgb" lang="'+o.l+'"><span>'+o.t+'</span><a href="'+C.alt+'">'+o.y+'</a><button class="no">'+o.n+'</button></div>');
 d.body.insertBefore(b,d.body.firstChild);$('a',b).onclick=function(){ls.s('ad_lang',o.l)};$('.no',b).onclick=function(){ls.s('ad_lang',C.lang);b.remove()}})();
$$('.lang').forEach(function(a){a.addEventListener('click',function(){ls.s('ad_lang',C.lang==='uk'?'ru':'uk')})});

/* ── 3D-шарики: только мощное устройство с GPU, после загрузки и простоя ── */
var stg=$('#stage');if(stg){
 var ok=function(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return false;var c=navigator.connection;if(c&&(c.saveData||/2g/.test(c.effectiveType||'')))return false;if(navigator.deviceMemory&&navigator.deviceMemory<2)return false;
  try{var cv=d.createElement('canvas'),gl=cv.getContext('webgl',{failIfMajorPerformanceCaveat:true});if(!gl)return false;var x=gl.getExtension('WEBGL_debug_renderer_info'),r=x?gl.getParameter(x.UNMASKED_RENDERER_WEBGL):'';var lc=gl.getExtension('WEBGL_lose_context');if(lc)lc.loseContext();return!/swiftshader|llvmpipe|softpipe|software|basic render/i.test(r)}catch(e){return false}};
 var go3=function(){if(!ok())return;var s=d.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.integrity='sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==';s.crossOrigin='anonymous';s.referrerPolicy='no-referrer';
  s.onload=function(){var b=d.createElement('script');b.src='/b3d.js?v='+C.v;d.head.appendChild(b)};d.head.appendChild(s)};
 var idle=function(){(window.requestIdleCallback||function(f){setTimeout(f,1200)})(go3,{timeout:3000})};
 if(d.readyState==='complete')setTimeout(idle,600);else addEventListener('load',function(){setTimeout(idle,600)});
}
window.ADorder=order;window.ADtoast=toast;
})();
