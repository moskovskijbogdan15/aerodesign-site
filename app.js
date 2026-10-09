/* AeroDesign — основной скрипт: заказ, галерея-лента, конструктор, 3D, игра, рефералка, язык */
(function(){
'use strict';
var C=JSON.parse(document.getElementById('cfg').textContent),L=C.t,d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var ls={g:function(k){try{return localStorage.getItem(k)}catch(e){return null}},s:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})};
var fmt=function(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'\u202f')};
var BOT="aerodesign_kyiv_bot",BOTAPI="https://aerodesign-bot.moskovskijbogdan15.workers.dev",CM={"vypyska":["101","102","103","104"],"dytyache":["201","202","203","204"],"dlya-nei":["301","302","303","304"],"dlya-nioho":["401","402","403","404"],"napysy":["501","502","503","504","505","506"],"oformlennya":["601","602","603","604"],"cifry":["701"],"gender":["801"],"korobka":["901"]};
var PR={};try{PR=Object.assign(JSON.parse(d.getElementById('pr').textContent),JSON.parse(d.getElementById('pro').textContent||'{}'))}catch(e){}
var tok=function(s){return String(s).replace(/\{(\d{3})\}/g,function(m,c){return PR[c]!=null?fmt(PR[c]):m})};
function el(h){var t=d.createElement('div');t.innerHTML=h.trim();return t.firstChild}
var tt;function toast(m){var t=$('#toast');if(!t){t=el('<div id="toast" role="status"></div>');d.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},3600)}
function copy(s){try{if(navigator.clipboard)return navigator.clipboard.writeText(s).catch(function(){})}catch(e){}}
function lock(on){d.documentElement.classList.toggle('lock',!!on)}

/* ── «Сейчас принимаем» по киевскому времени ── */
var lv=$('.live');if(lv){try{var h=+new Intl.DateTimeFormat('en-GB',{hour:'numeric',hour12:false,timeZone:'Europe/Kyiv'}).format(new Date());if(h>=23||h<8){lv.classList.add('n');lv.lastChild.textContent=L.liveOff}}catch(e){}}

/* ── Фон: днём небо с облаками и шариками, ночью «вечірка» с блёстками (по восходу/закату в Киеве) ── */
var BCOL=['#ff7aa8','#6cc6ff','#f0b23c','#9b7bff','#2fd0a7','#ff4f86'];
function bsvg(c,op,glow){var n=parseInt(c.slice(1),16),dk='#'+[n>>16,n>>8&255,n&255].map(function(x){return Math.round(x*.68).toString(16).padStart(2,'0')}).join(''),id='bg'+Math.random().toString(36).slice(2,8);
 return'<svg viewBox="0 0 100 162" style="opacity:'+op+(glow?';filter:drop-shadow(0 0 16px '+c+'99)':'')+'"><defs><radialGradient id="'+id+'" cx="34%" cy="28%" r="78%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".22" stop-color="'+c+'"/><stop offset="1" stop-color="'+dk+'"/></radialGradient></defs><path d="M50 4C23 4 6 26 6 52c0 28 23 51 44 55 21-4 44-27 44-55C94 26 77 4 50 4Z" fill="url(#'+id+')"/><path d="M45.5 110h9l-4.5-6z" fill="'+dk+'"/><path d="M50 110c-7 12 7 19 0 30s7 13 0 22" stroke="#bcb1b8" stroke-width="1.3" fill="none"/></svg>'}
function decor(t){var night=t==='night',small=innerWidth<860;$$('.sky .fx').forEach(function(fx){var s='',big=!!fx.closest('.hero2');
 if(night){for(var i=0;i<(big?(small?14:24):10);i++)s+='<i class="sp" style="left:'+((i*37+7)%97)+'%;top:'+((i*53+11)%86)+'%;animation-delay:-'+(i%7)*.4+'s;font-size:'+(9+(i%4)*5)+'px">✦</i>'}
 else s='<i class="cl" style="width:230px;height:62px;left:3%;top:'+(big?'14%':'22%')+'"></i><i class="cl" style="width:160px;height:44px;left:6%;top:'+(big?'10%':'16%')+'"></i><i class="cl" style="width:260px;height:70px;right:2%;top:'+(big?'66%':'38%')+'"></i><i class="cl" style="width:180px;height:50px;left:46%;top:3%;opacity:.55"></i>';
 var B=big?(small?[[1,44,84,3,7],[0,40,2,46,9]]:[[0,62,1,58,9],[1,50,44,2,7],[2,42,95,16,8],[3,54,93,70,10],[5,36,2,88,7]]):(small?[[1,34,88,10,8]]:[[1,40,92,14,8],[0,34,2,56,9]]);
 B.forEach(function(b,k){s+='<div class="bl" style="width:'+b[1]+'px;left:'+b[2]+'%;top:'+b[3]+'%;--t:'+b[4]+'s;animation-delay:-'+(k*1.3)+'s">'+bsvg(BCOL[b[0]],night?.55:.62,night)+'</div>'});
 fx.innerHTML=s})}
var TH=document.documentElement.getAttribute('data-theme')||'day';decor(TH);
if(window.ADth)setInterval(function(){var t=window.ADth();if(t!==TH){TH=t;document.documentElement.setAttribute('data-theme',t);decor(t)}},300000);

/* ── Рефералка и промокод ── */
var q=new URLSearchParams(location.search),rf=(q.get('ref')||'').replace(/[^A-Za-z0-9]/g,'').slice(0,12).toUpperCase();
if(rf&&rf!==ls.g('ad_my')){ls.s('ad_ref',rf);setTimeout(function(){toast(L.inv.got)},900)}
function extras(){var a=[],r=ls.g('ad_ref'),p=ls.g('ad_win');if(r)a.push(L.md.ref+r);if(p)a.push(L.md.promo+p);return a}

/* ── Окно заказа ── */
function botStart(item,start){var m=/^№(\d{3})/.exec(String(item)),a=[start||(m?'o'+m[1]:'site')],w=ls.g('ad_win');if(w)a.push('p'+w);return'https://t.me/'+BOT+'?start='+a.join('-')}
var md;function order(item,start){
 var raw=item;item=tok(item);var msg=L.md.hi+item+'\n'+L.md.addr+'\n'+L.md.time+(extras().length?'\n'+extras().join('\n'):'');
 if(!md){md=el('<div class="md" hidden role="dialog" aria-modal="true" aria-labelledby="mdh"><div class="bx"><button class="xb" aria-label="×">×</button><h3 id="mdh">'+L.md.h+'</h3><label class="fld"><span>'+L.md.msg+'</span><textarea rows="5"></textarea></label><div class="ch"><a class="btn tgb" target="_blank" rel="noopener">'+L.md.tg+'</a><a class="btn vbb">'+L.md.vb+'</a><a class="btn b1" href="tel:'+C.phone+'">'+L.md.call+' · '+C.phoneH+'</a></div>'+(BOT?'<p class="note" style="margin:16px 0 6px">'+L.md.botAlt+'</p><a class="btn b2 btb" target="_blank" rel="noopener" style="width:100%">'+L.md.bot+'</a>':'')+'</div></div>');
  d.body.appendChild(md);
  md.addEventListener('click',function(e){if(e.target===md||e.target.closest('.xb'))closeMd()});
  var ta=$('textarea',md),upd=function(){var v=encodeURIComponent(ta.value);$('.tgb',md).href='https://t.me/'+C.tg+'?text='+v;$('.vbb',md).href='viber://chat?number=%2B'+C.phone.slice(1)+'&draft='+v};
  ta.addEventListener('input',upd);md._u=upd;
  $$('.tgb,.vbb',md).forEach(function(a){a.addEventListener('click',function(){copy(ta.value);setTimeout(function(){toast(L.md.copied)},300)})});
 }
 $('textarea',md).value=msg;md._u();if(BOT)$('.btb',md).href=botStart(raw,start);md.hidden=false;lock(1);setTimeout(function(){$('.tgb',md).focus()},50);
 history.pushState({md:1},'');
}
var skip=0;
function closeMd(fromPop){if(!md||md.hidden)return;md.hidden=true;if(!lbOpen)lock(0);if(!fromPop&&history.state&&history.state.md){skip=1;history.back()}}
d.addEventListener('click',function(e){var b=e.target.closest('[data-order]');if(b){e.preventDefault();order(b.getAttribute('data-order'))}});

/* ── Фото-карточка: фото + название, описание, цена поверх полупрозрачного фона; клик мимо — закрыть ── */
var G=C.gal||[],lb,lbOpen=false,cur=0,lbFrom=null,pre={};
function preload(i){if(i<0||i>=G.length||pre[i])return;pre[i]=1;var im=new Image();im.src=G[i].l}
function show(i){
 var g=G[i];if(!g)return;cur=i;var im=$('.lb-im img',lb);
 im.classList.add('ld');im.onload=function(){im.classList.remove('ld')};
 im.width=g.lw;im.height=g.lh;im.src=g.l;im.alt=g.t||C.catT;
 $('.lb-n',lb).textContent=(i+1)+' / '+G.length;$('.lb-n',lb).hidden=G.length<2;
 $('h3',lb).textContent=g.t||C.catT;var p=$('.lb-d',lb);p.textContent=g.d||'';p.hidden=!g.d;
 var pz=$('.lb-p',lb);pz.textContent=g.p?tok(g.p):'';pz.hidden=!g.p;
 $('.lb-o',lb).setAttribute('data-order',g.ord||((g.t||C.catT)+' ('+L.lb.photo+' '+(i+1)+')'));
 $('.lb-pv',lb).disabled=i<1;$('.lb-nx',lb).disabled=i>=G.length-1;
 preload(i+1);preload(i-1);
}
function openLb(i,from){
 if(!G.length)return;
 if(!lb){
  lb=el('<div class="lb" hidden role="dialog" aria-modal="true" aria-label="'+esc(L.lb.photo)+'"><div class="lb-card"><button class="lb-x" type="button" aria-label="'+esc(L.lb.close)+'" title="'+esc(L.lb.close)+'">×</button><div class="lb-im"><img alt=""><span class="lb-n"></span><button class="lb-pv" type="button" aria-label="←">‹</button><button class="lb-nx" type="button" aria-label="→">›</button></div><div class="lb-info"><h3></h3><p class="lb-d"></p><div class="lb-p price"></div><button class="btn b1 lb-o" type="button">'+L.lb.order+'</button><span class="lb-h">'+L.lb.hint+'</span></div></div></div>');
  d.body.appendChild(lb);
  lb.addEventListener('click',function(e){if(!e.target.closest('.lb-card')||e.target.closest('.lb-x'))closeLb()});
  $('.lb-pv',lb).onclick=function(){go(cur-1)};$('.lb-nx',lb).onclick=function(){go(cur+1)};
  var sx=0,sy=0,box=$('.lb-im',lb);
  box.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  box.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)go(cur+(dx<0?1:-1))},{passive:true});
 }
 lbFrom=from||d.activeElement;show(i);lb.hidden=false;lbOpen=true;lock(1);
 history.pushState({lb:1},'');setTimeout(function(){$('.lb-x',lb).focus({preventScroll:true})},30);
}
function go(i){if(i<0||i>=G.length)return;show(i)}
function closeLb(fromPop){if(!lbOpen)return;lb.hidden=true;lbOpen=false;if(!md||md.hidden)lock(0);
 var t=$('.gal [data-lb="'+cur+'"]')||lbFrom;if(t&&t.classList){$$('.seen').forEach(function(x){x.classList.remove('seen')});if(t.closest('.gal'))t.classList.add('seen');var r=t.getBoundingClientRect();if(r.top<70||r.bottom>innerHeight)t.scrollIntoView({block:'center'});try{t.focus({preventScroll:true})}catch(e){}}
 if(!fromPop&&history.state&&history.state.lb){skip=1;history.back()}}
d.addEventListener('click',function(e){var b=e.target.closest('[data-lb]');if(b){e.preventDefault();openLb(+b.getAttribute('data-lb'),b)}});
addEventListener('popstate',function(){if(skip){skip=0;return}if(md&&!md.hidden){closeMd(true);return}if(lbOpen)closeLb(true)});
addEventListener('keydown',function(e){if(e.key==='Escape'){if(md&&!md.hidden)closeMd();else if(lbOpen)closeLb()}if(lbOpen&&(!md||md.hidden)){if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();go(cur+1)}if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();go(cur-1)}}});

/* ── Конструктор надписи ── */
var mk=$('#mk');if(mk){
 var TCODE={latex:'501',foil:'502',bubble:'503',giant:'504'};L.types.forEach(function(t){var c=TCODE[t[0]];if(PR[c]!=null)t[2]=+PR[c]});
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
 window.ADmkPrices=function(){L.types.forEach(function(t){var c=TCODE[t[0]];if(PR[c]!=null)t[2]=+PR[c]});draw()};
 var qp=new URLSearchParams(location.search);
 if(qp.get('t')){txt.value=qp.get('t').slice(0,60);var qb=qp.get('b');if(TCODE[qb]){st.type=qb;$$('#mk-ty .pill').forEach(function(z){z.classList.toggle('on',z.dataset.v===qb)})}
  var qs=qp.get('s');if(qs){st.shape=qs;$$('#mk-shp .pill').forEach(function(z){z.classList.toggle('on',z.dataset.v===qs)})}
  var qc=qp.get('c');if(qc!=null&&COL[st.type][+qc])st.col=COL[st.type][+qc][0];var qi=qp.get('i');if(qi!=null&&INK[+qi]){st.ink=INK[+qi][0];sw($('#mk-i'),INK,st.ink,function(v){st.ink=v})}
  var qn=+qp.get('n');if(qn>0){st.qty=Math.min(50,qn);$('#mk-n output').textContent=st.qty}setTimeout(function(){mk.scrollIntoView({block:'start'})},250)}
 txt.addEventListener('input',draw);colors();draw();
 $('#mk-o').onclick=function(){var t=tp(),cn=$('#mk-c .on'),ik=$('#mk-i .on');order(C.capT+' «'+(txt.value.trim()||'…')+'» — '+$('#mk-q').textContent+' = '+fmt(t[2]*st.qty)+' '+L.uah+(cn&&st.type!=='bubble'?'; '+L.mkColor.toLowerCase()+': '+cn.dataset.n:'')+(ik?'; '+L.mkInk.toLowerCase()+': '+ik.dataset.n:'')+(st.font?'; '+L.mkFonts[1].toLowerCase():''),'ins')};
}

/* ── Приглашение друга ── */
/* Имя: только буквы (кириллица или латиница), 2–20 символов, есть гласная, без «ааа»/«фыв»; с большой буквы */
var SHORTN={'ян':1,'ия':1,'ія':1,'jo':1,'al':1,'ed':1,'li':1};
function goodName(v){
 var s=String(v||'').replace(/[`´ʼ‘]/g,'’').replace(/'/g,'’').replace(/\s+/g,' ').replace(/\s*-\s*/g,'-').trim();
 if(s.length<2||s.length>20)return'';
 var cyr=/^[а-яіїєґёыэъ’-]+( [а-яіїєґёыэъ’-]+)?$/i.test(s),lat=/^[a-z’-]+( [a-z’-]+)?$/i.test(s);if(!cyr&&!lat)return'';
 var low=s.toLowerCase(),lt=low.replace(/[^a-zа-яіїєґёыэъ]/g,'');
 if(lt.length<2||(lt.length===2&&!SHORTN[lt]))return'';
 if(!/[aeiouyаеєиіїоуюяыэё]/.test(lt))return'';
 if(lt.length>2&&!/[bcdfghjklmnpqrstvwxzбвгґджзйклмнпрстфхцчшщ]/.test(lt))return'';
 if(/(.)\1\1/.test(lt)||/^[ьъ’-]/.test(low)||/фыв|йцу|ячс|asd|qwe|zxc|тест|test|хуй|пизд|бля|fuck/.test(lt))return'';
 return low.replace(/(^|[\s-])([a-zа-яіїєґёыэ])/g,function(m,a,b){return a+b.toUpperCase()});
}
var tr={'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye','ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ь':'','ю':'yu','я':'ya','ы':'y','э':'e','ё':'yo','ъ':''};
d.addEventListener('click',function(e){if(!e.target.closest('[data-invite]'))return;e.preventDefault();
 var m=el('<div class="md" role="dialog" aria-modal="true"><div class="bx"><button class="xb" aria-label="×">×</button><h3>'+L.inv.h+'</h3><label class="fld"><span>'+L.inv.name+'</span><input maxlength="20" autocomplete="given-name"></label><button class="btn b1" style="width:100%">'+L.inv.make+'</button><div class="ch" hidden style="margin-top:12px"><input class="lnk" readonly style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--line);font:700 14px var(--fb)"><a class="btn tgb" target="_blank" rel="noopener">'+L.inv.tg+'</a><button class="btn b2 cp">'+L.inv.copy+'</button></div></div></div>');
 d.body.appendChild(m);lock(1);var inp=$('input',m),er=el('<p class="err" role="alert" hidden></p>');inp.parentNode.appendChild(er);var nm0=ls.g('ad_nm')||'';inp.value=goodName(nm0)?nm0:'';inp.focus();
 inp.addEventListener('input',function(){er.hidden=true;inp.removeAttribute('aria-invalid')});
 m.addEventListener('click',function(ev){if(ev.target===m||ev.target.closest('.xb')){m.remove();if(!lbOpen&&(!md||md.hidden))lock(0)}});
 inp.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();$('.b1',m).click()}});
 $('.b1',m).onclick=function(){var nm=goodName(inp.value);
  if(!nm){er.textContent=L.inv.bad;er.hidden=false;inp.setAttribute('aria-invalid','true');$('.ch',m).hidden=true;inp.focus();return}
  inp.value=nm;ls.s('ad_nm',nm);var n=nm.split(/[\s-]/)[0].toLowerCase();
  var code=ls.g('ad_my');if(!code||ls.g('ad_myn')!==nm){code=(n.split('').map(function(ch){return tr[ch]!=null?tr[ch]:/[a-z]/.test(ch)?ch:''}).join('').replace(/[^a-z]/g,'').slice(0,6)||'ad').toUpperCase()+(10+Math.floor(Math.random()*90));ls.s('ad_my',code);ls.s('ad_myn',nm)}
  var url=C.url+'/?ref='+code;$('.lnk',m).value=url;$('.ch',m).hidden=false;
  $('.tgb',m).href='https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(L.inv.text);
  $('.cp',m).onclick=function(){copy(L.inv.text+' '+url);toast(L.inv.done)};
  if(navigator.share&&matchMedia('(pointer:coarse)').matches)navigator.share({title:'AeroDesign',text:L.inv.text,url:url}).catch(function(){})};
});

/* ── Мини-игра (грузится только по кнопке) ── */
d.addEventListener('click',function(e){if(!e.target.closest('[data-game]'))return;e.preventDefault();
 if(window.ADgame)return window.ADgame(C,order,toast);var s=d.createElement('script');s.src='/game.js?v='+C.v;s.onload=function(){window.ADgame(C,order,toast)};d.head.appendChild(s)});

/* ── Плашка языка (uk/ru/en): предлагаем язык браузера, если человек не понимает текущий ── */
(function(){if(ls.g('ad_lang')||!C.alts||!C.lgbs)return;
 var bl=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']).map(function(x){return String(x).slice(0,2).toLowerCase()});
 if(bl.indexOf(C.lang)>-1)return;var t=null;
 for(var i=0;i<bl.length;i++)if(C.alts[bl[i]]&&bl[i]!==C.lang){t=bl[i];break}
 if(!t&&C.lang!=='en'&&bl[0]&&bl[0]!=='uk'&&bl[0]!=='ru')t='en';
 if(!t)return;var o=C.lgbs[t];
 var b=el('<div class="lgb" lang="'+t+'"><span>'+o.t+'</span><a href="'+C.alts[t]+'">'+o.y+'</a><button class="no" type="button">'+o.n+'</button></div>');
 d.body.insertBefore(b,d.body.firstChild);$('a',b).onclick=function(){ls.s('ad_lang',t)};$('.no',b).onclick=function(){ls.s('ad_lang',C.lang);b.remove()}})();
$$('.langs a').forEach(function(a){a.addEventListener('click',function(){ls.s('ad_lang',a.getAttribute('hreflang'))})});

/* ── Живые цены из Telegram-бота (админ меняет цену в боте — сайт подхватывает) ── */
function applyPrices(j){if(!j||!j.p)return;var hid={};(j.h||[]).forEach(function(c){hid[c]=1});Object.keys(j.p).forEach(function(c){PR[c]=j.p[c]});
 $$('[data-p]').forEach(function(e){var c=e.getAttribute('data-p');if(PR[c]!=null)e.textContent=fmt(PR[c])});
 $$('[data-c]').forEach(function(e){if(hid[e.getAttribute('data-c')])e.remove()});
 $$('[data-min]').forEach(function(e){var l=(CM[e.getAttribute('data-min')]||[]).filter(function(c){return!hid[c]&&PR[c]!=null}).map(function(c){return+PR[c]});if(l.length)e.textContent=fmt(Math.min.apply(0,l))});
 if(window.ADmkPrices)window.ADmkPrices()}
if(BOTAPI&&window.fetch)fetch(BOTAPI+'/prices.json').then(function(r){return r.json()}).then(applyPrices).catch(function(){});
window.ADorder=order;window.ADtoast=toast;
})();
