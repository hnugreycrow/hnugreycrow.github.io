import{o as Ba,a as Da,i as ja,s as N,b as J,e as Ae}from"./lifecycle.DzjGS0PL.js";import{af as Pa,ab as za,aT as $a,aU as Ia,i as Ra,u as Wa,aV as Na,aW as Pe,aX as Ya,q as qa,aY as bt,c as rt,f as Q,a as Y,p as Oa,b as Ua,h as l,m as F,ax as O,g as t,d as ut,s as d,e as i,r,v as Xa,t as At,o as h}from"./utils.ClS-Wz-l.js";import{a as Ha,s as K}from"./render.DMw1mtEk.js";import{e as Ka,i as Va}from"./each.BAmeom2v.js";import{i as z}from"./if.CRrLA2Gg.js";import{b as Be}from"./this.CWzlYxWq.js";import{I as f}from"./Icon.BNfbO6Sn.js";import{m as Bt}from"./config.CCKsrnWl.js";import{I as Ga}from"./zh_TW.rXaKD7-8.js";import{i as Ja}from"./translation.BUbPdwB0.js";import"./props.DK11TOGZ.js";const Qa=()=>performance.now(),V={tick:c=>requestAnimationFrame(c),now:()=>Qa(),tasks:new Set};function ze(){const c=V.now();V.tasks.forEach(n=>{n.c(c)||(V.tasks.delete(n),n.f())}),V.tasks.size!==0&&V.tick(ze)}function Za(c){let n;return V.tasks.size===0&&V.tick(ze),{promise:new Promise(_=>{V.tasks.add(n={c,f:_})}),abort(){V.tasks.delete(n)}}}function Dt(c,n){Pe(()=>{c.dispatchEvent(new CustomEvent(n))})}function tr(c){if(c==="float")return"cssFloat";if(c==="offset")return"cssOffset";if(c.startsWith("--"))return c;const n=c.split("-");return n.length===1?n[0]:n[0]+n.slice(1).map(_=>_[0].toUpperCase()+_.slice(1)).join("")}function De(c){const n={},_=c.split(";");for(const L of _){const[j,S]=L.split(":");if(!j||S===void 0)break;const p=tr(j.trim());n[p]=S.trim()}return n}const er=c=>c;function ar(c,n,_,L){var j=(c&Na)!==0,S="both",p,w=n.inert,A=n.style.overflow,b,g;function E(){return Pe(()=>p??=_()(n,L?.()??{},{direction:S}))}var B={is_global:j,in(){n.inert=w,Dt(n,"introstart"),b=Qt(n,E(),g,1,()=>{Dt(n,"introend"),b?.abort(),b=p=void 0,n.style.overflow=A})},out(T){n.inert=!0,Dt(n,"outrostart"),g=Qt(n,E(),b,0,()=>{Dt(n,"outroend"),T?.()})},stop:()=>{b?.abort(),g?.abort()}},R=Pa;if((R.transitions??=[]).push(B),Ha){var u=j;if(!u){for(var v=R.parent;v&&(v.f&za)!==0;)for(;(v=v.parent)&&(v.f&$a)===0;);u=!v||(v.f&Ia)!==0}u&&Ra(()=>{Wa(()=>B.in())})}}function Qt(c,n,_,L,j){var S=L===1;if(Ya(n)){var p,w=!1;return qa(()=>{if(!w){var T=n({direction:S?"in":"out"});p=Qt(c,T,_,L,j)}}),{abort:()=>{w=!0,p?.abort()},deactivate:()=>p.deactivate(),reset:()=>p.reset(),t:()=>p.t()}}if(_?.deactivate(),!n?.duration)return j(),{abort:bt,deactivate:bt,reset:bt,t:()=>L};const{delay:A=0,css:b,tick:g,easing:E=er}=n;var B=[];if(S&&_===void 0&&(g&&g(0,1),b)){var R=De(b(0,1));B.push(R,R)}var u=()=>1-L,v=c.animate(B,{duration:A,fill:"forwards"});return v.onfinish=()=>{v.cancel();var T=_?.t()??1-L;_?.abort();var C=L-T,X=n.duration*Math.abs(C),$=[];if(X>0){var x=!1;if(b)for(var k=Math.ceil(X/16.666666666666668),a=0;a<=k;a+=1){var G=T+C*E(a/k),Z=De(b(G,1-G));$.push(Z),x||=Z.overflow==="hidden"}x&&(c.style.overflow="hidden"),u=()=>{var it=v.currentTime;return T+C*E(it/X)},g&&Za(()=>{if(v.playState!=="running")return!1;var it=u();return g(it,1-it),!0})}v=c.animate($,{duration:X,fill:"forwards"}),v.onfinish=()=>{u=()=>L,g?.(L,1-L),j()}},{abort:()=>{v&&(v.cancel(),v.effect=null,v.onfinish=bt)},deactivate:()=>{j=bt},reset:()=>{L===0&&g?.(1,0)},t:()=>u()}}function je(c){return function(...n){var _=n[0];return _.stopPropagation(),c?.apply(this,n)}}function rr(c){const n=c-1;return n*n*n+1}function ir(c,{delay:n=0,duration:_=400,easing:L=rr,axis:j="y"}={}){const S=getComputedStyle(c),p=+S.opacity,w=j==="y"?"height":"width",A=parseFloat(S[w]),b=j==="y"?["top","bottom"]:["left","right"],g=b.map(C=>`${C[0].toUpperCase()}${C.slice(1)}`),E=parseFloat(S[`padding${g[0]}`]),B=parseFloat(S[`padding${g[1]}`]),R=parseFloat(S[`margin${g[0]}`]),u=parseFloat(S[`margin${g[1]}`]),v=parseFloat(S[`border${g[0]}Width`]),T=parseFloat(S[`border${g[1]}Width`]);return{delay:n,duration:_,easing:L,css:C=>`overflow: hidden;opacity: ${Math.min(C*20,1)*p};${w}: ${C*A}px;padding-${b[0]}: ${C*E}px;padding-${b[1]}: ${C*B}px;margin-${b[0]}: ${C*R}px;margin-${b[1]}: ${C*u}px;border-${b[0]}-width: ${C*v}px;border-${b[1]}-width: ${C*T}px;min-${w}: 0`}}var nr=ut('<div class="fixed bottom-20 right-4 z-[60] max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),sr=ut('<div class="flex space-x-0.5"><div class="w-0.5 h-3 bg-white rounded-full animate-pulse"></div> <div class="w-0.5 h-4 bg-white rounded-full animate-pulse" style="animation-delay: 150ms;"></div> <div class="w-0.5 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 300ms;"></div></div>'),or=ut('<span class="text-sm text-[var(--content-meta)]"></span>'),lr=ut('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>'),cr=ut('<div class="playlist-panel float-panel fixed bottom-20 right-4 w-80 max-h-96 overflow-hidden z-50"><div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80"></div></div>'),dr=ut(`<!> <div><div role="button" tabindex="0" aria-label="显示音乐播放器"><!></div> <div><div class="flex items-center gap-3"><div class="cover-container relative w-12 h-12 rounded-full overflow-hidden cursor-pointer" role="button" tabindex="0"><img alt="封面"/> <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><!></div></div> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0" aria-label="展开音乐播放器"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center" title="隐藏播放器"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div></div></div> <div><div class="flex items-center gap-4 mb-4"><div class="cover-container relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"><img alt="封面"/></div> <div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <div class="text-xs text-30 mt-1"> </div></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center" title="隐藏播放器"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div></div> <div class="progress-section mb-4"><div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-label="播放进度" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div></div> <div class="controls flex items-center justify-center gap-2 mb-4"><button><!></button> <button class="btn-plain w-10 h-10 rounded-lg"><!></button> <button><!></button> <button class="btn-plain w-10 h-10 rounded-lg"><!></button> <button><!></button></div> <div class="bottom-controls flex items-center gap-2"><button class="btn-plain w-8 h-8 rounded-lg"><!></button> <div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-label="音量控制" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div> <button><!></button></div></div> <!></div> <style>.orb-player {
	position: relative;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}
.orb-player::before {
	content: '';
	position: absolute;
	inset: -2px;
	background: linear-gradient(45deg, var(--primary), transparent, var(--primary));
	border-radius: 50%;
	z-index: -1;
	opacity: 0;
	transition: opacity 0.3s ease;
}
.orb-player:hover::before {
	opacity: 0.3;
	animation: rotate 2s linear infinite;
}
.orb-player .animate-pulse {
	animation: musicWave 1.5s ease-in-out infinite;
}
@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
@keyframes musicWave {
	0%, 100% { transform: scaleY(0.5); }
	50% { transform: scaleY(1); }
}
.music-player.hidden-mode {
	width: 48px;
	height: 48px;
}
.music-player {
    max-width: 320px;
    -webkit-user-select: none;
       -moz-user-select: none;
            user-select: none;
}
.mini-player {
    width: 280px;
    position: absolute;
    bottom: 0;
    right: 0;
    /*left: 0;*/
}
.expanded-player {
    width: 320px;
    position: absolute;
    bottom: 0;
    right: 0;
}
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
.progress-section div:hover,
.bottom-controls > div:hover {
    transform: scaleY(1.2);
    transition: transform 0.2s ease;
}
@media (max-width: 768px) {
    .music-player {
        max-width: 280px;
        /*left: 8px !important;*/
        bottom: 8px !important;
        right: 8px !important;
    }
    .music-player.expanded {
        width: calc(100vw - 16px);
        max-width: none;
        /*left: 8px !important;*/
        right: 8px !important;
    }
    .playlist-panel {
        width: calc(100vw - 16px) !important;
        /*left: 8px !important;*/
        right: 8px !important;
        max-width: none;
    }
    .controls {
        gap: 8px;
    }
    .controls button {
        width: 36px;
        height: 36px;
    }
    .controls button:nth-child(3) {
        width: 44px;
        height: 44px;
    }
}
@media (max-width: 480px) {
    .music-player {
        max-width: 260px;
    }
    .song-title {
        font-size: 14px;
    }
    .song-artist {
        font-size: 12px;
    }
    .controls {
        gap: 6px;
        margin-bottom: 12px;
    }
    .controls button {
        width: 32px;
        height: 32px;
    }
    .controls button:nth-child(3) {
        width: 40px;
        height: 40px;
    }
    .playlist-item {
        padding: 8px 12px;
    }
    .playlist-item .w-10 {
        width: 32px;
        height: 32px;
    }
}
@keyframes slide-up {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
.animate-slide-up {
    animation: slide-up 0.3s ease-out;
}
@media (hover: none) and (pointer: coarse) {
    .music-player button,
    .playlist-item {
        min-height: 44px;
    }
    .progress-section > div,
    .bottom-controls > div:nth-child(2) {
        height: 12px;
    }
}
/* 自定义旋转动画，停止时保持当前位置 */
@keyframes spin-continuous {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.cover-container img {
    animation: spin-continuous 3s linear infinite;
    animation-play-state: paused;
}
.cover-container img.spinning {
    animation-play-state: running;
}
/* 让主题色按钮更有视觉反馈 */
button.bg-\\[var\\(--primary\\)\\] {
    box-shadow: 0 0 0 2px var(--primary);
    border: none;
}</style>`,1);function wr(c,n){Ua(n,!1);let _=Bt.meting_api,L=Bt.id,j=Bt.server,S=Bt.type,p=F(!1),w=F(!1),A=F(!1),b=F(!1),g=F(0),E=F(0),B=F(.7),R=F(!1),u=F(!1),v=F(!1),T=F(0),C=F(""),X=F(!1),$=F({title:"Sample Song",artist:"Sample Artist",cover:"/favicon/favicon.ico",url:"",duration:0}),x=F([]),k=F(0),a=F(),G=F(),Z=F();async function it(){l(u,!0);const s=_.replace(":server",j).replace(":type",S).replace(":id",L).replace(":auth","").replace(":r",Date.now().toString());try{const D=await fetch(s);if(!D.ok)throw new Error("meting api error");const H=await D.json();l(x,H.map(W=>{let vt=W.name??W.title??"未知歌曲",_t=W.artist??W.author??"未知艺术家",I=W.duration??0;return I>1e4&&(I=Math.floor(I/1e3)),(!Number.isFinite(I)||I<=0)&&(I=0),{id:W.id,title:vt,artist:_t,cover:W.pic??"",url:W.url??"",duration:I}})),t(x).length>0&&te(t(x)[0]),l(u,!1)}catch{zt("Meting 歌单获取失败"),l(u,!1)}}function jt(){!t(a)||!t($).url||(t(p)?t(a).pause():t(a).play())}function gt(){l(w,!t(w)),t(w)&&(l(b,!1),l(A,!1))}function ht(){l(A,!t(A)),t(A)&&(l(w,!1),l(b,!1))}function Zt(){l(b,!t(b))}function $e(){l(v,!t(v))}function Ie(){l(T,(t(T)+1)%3)}function Re(){if(t(x).length<=1)return;const s=t(k)>0?t(k)-1:t(x).length-1;xt(s)}function Pt(){if(t(x).length<=1)return;let s;if(t(v))do s=Math.floor(Math.random()*t(x).length);while(s===t(k)&&t(x).length>1);else s=t(k)<t(x).length-1?t(k)+1:0;xt(s)}function xt(s){if(s<0||s>=t(x).length)return;const D=t(p);l(k,s),t(a)&&t(a).pause(),te(t(x)[t(k)]),(D||!t(p))&&setTimeout(()=>{t(a)&&(t(a).readyState>=2?t(a).play().catch(()=>{}):t(a).addEventListener("canplay",()=>{t(a).play().catch(()=>{})},{once:!0}))},100)}function yt(s){return s.startsWith("http://")||s.startsWith("https://")||s.startsWith("/")?s:`/${s}`}function te(s){!s||!t(a)||(l($,{...s}),s.url?(l(u,!0),t(a).pause(),O(a,t(a).currentTime=0),l(g,0),l(E,s.duration??0),t(a).removeEventListener("loadeddata",ee),t(a).removeEventListener("error",ae),t(a).removeEventListener("loadstart",re),t(a).addEventListener("loadeddata",ee,{once:!0}),t(a).addEventListener("error",ae,{once:!0}),t(a).addEventListener("loadstart",re,{once:!0}),O(a,t(a).src=yt(s.url)),t(a).load()):l(u,!1))}function ee(){l(u,!1),t(a)?.duration&&t(a).duration>1&&(l(E,Math.floor(t(a).duration)),t(x)[t(k)]&&O(x,t(x)[t(k)].duration=t(E)),O($,t($).duration=t(E)))}function ae(s){l(u,!1),zt(`无法播放 "${t($).title}"，正在尝试下一首...`),t(x).length>1?setTimeout(()=>Pt(),1e3):zt("播放列表中没有可用的歌曲")}function re(){}function zt(s){l(C,s),l(X,!0),setTimeout(()=>{l(X,!1)},3e3)}function We(){l(X,!1)}function Ne(s){if(!t(a)||!t(G))return;const D=t(G).getBoundingClientRect(),W=(s.clientX-D.left)/D.width*t(E);O(a,t(a).currentTime=W),l(g,W)}function Ye(s){if(!t(a)||!t(Z))return;const D=t(Z).getBoundingClientRect(),H=Math.max(0,Math.min(1,(s.clientX-D.left)/D.width));l(B,H),O(a,t(a).volume=t(B)),l(R,t(B)===0)}function ie(){t(a)&&(l(R,!t(R)),O(a,t(a).muted=t(R)))}function ne(s){if(!Number.isFinite(s)||s<0)return"0:00";const D=Math.floor(s/60),H=Math.floor(s%60);return`${D}:${H.toString().padStart(2,"0")}`}function qe(){t(a)&&(t(a).addEventListener("play",()=>{l(p,!0)}),t(a).addEventListener("pause",()=>{l(p,!1)}),t(a).addEventListener("timeupdate",()=>{l(g,t(a).currentTime)}),t(a).addEventListener("ended",()=>{t(T)===1?(O(a,t(a).currentTime=0),t(a).play().catch(()=>{})):t(T)===2||t(k)<t(x).length-1||t(v)?Pt():l(p,!1)}),t(a).addEventListener("error",s=>{l(u,!1)}),t(a).addEventListener("stalled",()=>{}),t(a).addEventListener("waiting",()=>{}))}Ba(()=>{l(a,new Audio),O(a,t(a).volume=t(B)),qe(),it()}),Da(()=>{t(a)&&(t(a).pause(),O(a,t(a).src=""))}),ja();var se=rt(),Oe=Q(se);{var Ue=s=>{var D=dr(),H=Q(D);{var W=e=>{var m=nr(),y=i(m),M=i(y);f(M,{icon:"material-symbols:error",class:"text-xl flex-shrink-0"});var P=d(M,2),o=i(P,!0);r(P);var et=d(P,2),Ct=i(et);f(Ct,{icon:"material-symbols:close",class:"text-lg"}),r(et),r(y),r(m),At(()=>K(o,t(C))),h("click",et,We),Y(e,m)};z(H,e=>{t(X)&&e(W)})}var vt=d(H,2);let _t;var I=i(vt);let oe;var Xe=i(I);{var He=e=>{f(e,{icon:"eos-icons:loading",class:"text-white text-lg"})},Ke=e=>{var m=rt(),y=Q(m);{var M=o=>{var et=sr();Y(o,et)},P=o=>{f(o,{icon:"material-symbols:music-note",class:"text-white text-lg"})};z(y,o=>{t(p)?o(M):o(P,!1)},!0)}Y(e,m)};z(Xe,e=>{t(u)?e(He):e(Ke,!1)})}r(I);var wt=d(I,2);let le;var ce=i(wt),nt=i(ce),$t=i(nt);let de;var ue=d($t,2),Ve=i(ue);{var Ge=e=>{f(e,{icon:"eos-icons:loading",class:"text-white text-xl"})},Je=e=>{var m=rt(),y=Q(m);{var M=o=>{f(o,{icon:"material-symbols:pause",class:"text-white text-xl"})},P=o=>{f(o,{icon:"material-symbols:play-arrow",class:"text-white text-xl"})};z(y,o=>{t(p)?o(M):o(P,!1)},!0)}Y(e,m)};z(Ve,e=>{t(u)?e(Ge):e(Je,!1)})}r(ue),r(nt);var ft=d(nt,2),It=i(ft),Qe=i(It,!0);r(It);var ve=d(It,2),Ze=i(ve,!0);r(ve),r(ft);var fe=d(ft,2),kt=i(fe),ta=i(kt);f(ta,{icon:"material-symbols:visibility-off",class:"text-lg"}),r(kt);var Rt=d(kt,2),ea=i(Rt);f(ea,{icon:"material-symbols:expand-less",class:"text-lg"}),r(Rt),r(fe),r(ce),r(wt);var Et=d(wt,2);let pe;var Wt=i(Et),Nt=i(Wt),me=i(Nt);let be;r(Nt);var Yt=d(Nt,2),qt=i(Yt),aa=i(qt,!0);r(qt);var Ot=d(qt,2),ra=i(Ot,!0);r(Ot);var ge=d(Ot,2),ia=i(ge);r(ge),r(Yt);var he=d(Yt,2),Ft=i(he),na=i(Ft);f(na,{icon:"material-symbols:visibility-off",class:"text-lg"}),r(Ft);var Ut=d(Ft,2),sa=i(Ut);f(sa,{icon:"material-symbols:expand-more",class:"text-lg"}),r(Ut),r(he),r(Wt);var Xt=d(Wt,2),st=i(Xt),oa=i(st);r(st),Be(st,e=>l(G,e),()=>t(G)),r(Xt);var Ht=d(Xt,2),ot=i(Ht);let xe;var la=i(ot);f(la,{icon:"material-symbols:shuffle",class:"text-lg"}),r(ot);var pt=d(ot,2),ca=i(pt);f(ca,{icon:"material-symbols:skip-previous",class:"text-xl"}),r(pt);var lt=d(pt,2);let ye;var da=i(lt);{var ua=e=>{f(e,{icon:"eos-icons:loading",class:"text-xl"})},va=e=>{var m=rt(),y=Q(m);{var M=o=>{f(o,{icon:"material-symbols:pause",class:"text-xl"})},P=o=>{f(o,{icon:"material-symbols:play-arrow",class:"text-xl"})};z(y,o=>{t(p)?o(M):o(P,!1)},!0)}Y(e,m)};z(da,e=>{t(u)?e(ua):e(va,!1)})}r(lt);var mt=d(lt,2),fa=i(mt);f(fa,{icon:"material-symbols:skip-next",class:"text-xl"}),r(mt);var Lt=d(mt,2);let _e;var pa=i(Lt);{var ma=e=>{f(e,{icon:"material-symbols:repeat-one",class:"text-lg"})},ba=e=>{var m=rt(),y=Q(m);{var M=o=>{f(o,{icon:"material-symbols:repeat",class:"text-lg"})},P=o=>{f(o,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};z(y,o=>{t(T)===2?o(M):o(P,!1)},!0)}Y(e,m)};z(pa,e=>{t(T)===1?e(ma):e(ba,!1)})}r(Lt),r(Ht);var we=d(Ht,2),St=i(we),ga=i(St);{var ha=e=>{f(e,{icon:"material-symbols:volume-off",class:"text-lg"})},xa=e=>{var m=rt(),y=Q(m);{var M=o=>{f(o,{icon:"material-symbols:volume-down",class:"text-lg"})},P=o=>{f(o,{icon:"material-symbols:volume-up",class:"text-lg"})};z(y,o=>{t(B)<.5?o(M):o(P,!1)},!0)}Y(e,m)};z(ga,e=>{t(R)||t(B)===0?e(ha):e(xa,!1)})}r(St);var tt=d(St,2),ya=i(tt);r(tt),Be(tt,e=>l(Z,e),()=>t(Z));var Tt=d(tt,2);let ke;var _a=i(Tt);f(_a,{icon:"material-symbols:queue-music",class:"text-lg"}),r(Tt),r(we),r(Et);var wa=d(Et,2);{var ka=e=>{var m=cr(),y=i(m),M=i(y),P=i(M,!0);r(M);var o=d(M,2),et=i(o);f(et,{icon:"material-symbols:close",class:"text-lg"}),r(o),r(y);var Ct=d(y,2);Ka(Ct,5,()=>t(x),Va,(Kt,ct,U)=>{var at=lr();let Ee;var Vt=i(at),Ea=i(Vt);{var Fa=q=>{f(q,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},La=q=>{var Ce=rt(),Ca=Q(Ce);{var Ma=dt=>{f(dt,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},Aa=dt=>{var Me=or();Me.textContent=U+1,Y(dt,Me)};z(Ca,dt=>{U===t(k)?dt(Ma):dt(Aa,!1)},!0)}Y(q,Ce)};z(Ea,q=>{U===t(k)&&t(p)?q(Fa):q(La,!1)})}r(Vt);var Gt=d(Vt,2),Fe=i(Gt);r(Gt);var Le=d(Gt,2),Mt=i(Le);let Se;var Sa=i(Mt,!0);r(Mt);var Jt=d(Mt,2);let Te;var Ta=i(Jt,!0);r(Jt),r(Le),r(at),At(q=>{Ee=N(at,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,Ee,{"bg-[var(--btn-plain-bg)]":U===t(k),"text-[var(--primary)]":U===t(k)}),J(at,"aria-label",`播放 ${t(ct).title??""} - ${t(ct).artist??""}`),J(Fe,"src",q),J(Fe,"alt",t(ct).title),Se=N(Mt,1,"font-medium truncate",null,Se,{"text-[var(--primary)]":U===t(k),"text-90":U!==t(k)}),K(Sa,t(ct).title),Te=N(Jt,1,"text-sm text-[var(--content-meta)] truncate",null,Te,{"text-[var(--primary)]":U===t(k)}),K(Ta,t(ct).artist)},[()=>yt(t(ct).cover)]),h("click",at,()=>xt(U)),h("keydown",at,q=>{(q.key==="Enter"||q.key===" ")&&(q.preventDefault(),xt(U))}),Y(Kt,at)}),r(Ct),r(m),At(Kt=>K(P,Kt),[()=>Ja(Ga.playlist)]),h("click",o,Zt),ar(3,m,()=>ir,()=>({duration:300,axis:"y"})),Y(e,m)};z(wa,e=>{t(b)&&e(ka)})}r(vt),Xa(2),At((e,m,y,M)=>{_t=N(vt,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,_t,{expanded:t(w),"hidden-mode":t(A)}),oe=N(I,1,"orb-player w-12 h-12 bg-[var(--primary)] rounded-full shadow-lg cursor-pointer transition-all duration-500 ease-in-out flex items-center justify-center hover:scale-110 active:scale-95",null,oe,{"opacity-0":!t(A),"scale-0":!t(A),"pointer-events-none":!t(A)}),le=N(wt,1,"mini-player card-base bg-[var(--float-panel-bg)] shadow-xl rounded-2xl p-3 transition-all duration-500 ease-in-out",null,le,{"opacity-0":t(w)||t(A),"scale-95":t(w)||t(A),"pointer-events-none":t(w)||t(A)}),J(nt,"aria-label",t(p)?"暂停":"播放"),J($t,"src",e),de=N($t,1,"w-full h-full object-cover transition-transform duration-300",null,de,{spinning:t(p)&&!t(u),"animate-pulse":t(u)}),K(Qe,t($).title),K(Ze,t($).artist),pe=N(Et,1,"expanded-player card-base bg-[var(--float-panel-bg)] shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out",null,pe,{"opacity-0":!t(w),"scale-95":!t(w),"pointer-events-none":!t(w)}),J(me,"src",m),be=N(me,1,"w-full h-full object-cover transition-transform duration-300",null,be,{spinning:t(p)&&!t(u),"animate-pulse":t(u)}),K(aa,t($).title),K(ra,t($).artist),K(ia,`${y??""} / ${M??""}`),J(st,"aria-valuenow",t(E)>0?t(g)/t(E)*100:0),Ae(oa,`width: ${t(E)>0?t(g)/t(E)*100:0}%`),xe=N(ot,1,"w-10 h-10 rounded-lg",null,xe,{"btn-regular":t(v),"btn-plain":!t(v)}),ot.disabled=t(x).length<=1,pt.disabled=t(x).length<=1,ye=N(lt,1,"btn-regular w-12 h-12 rounded-full",null,ye,{"opacity-50":t(u)}),lt.disabled=t(u),mt.disabled=t(x).length<=1,_e=N(Lt,1,"w-10 h-10 rounded-lg",null,_e,{"btn-regular":t(T)>0,"btn-plain":t(T)===0}),J(tt,"aria-valuenow",t(B)*100),Ae(ya,`width: ${t(B)*100}%`),ke=N(Tt,1,"btn-plain w-8 h-8 rounded-lg",null,ke,{"text-[var(--primary)]":t(b)})},[()=>yt(t($).cover),()=>yt(t($).cover),()=>ne(t(g)),()=>ne(t(E))]),h("click",I,ht),h("keydown",I,e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),ht())}),h("click",nt,jt),h("keydown",nt,e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),jt())}),h("click",ft,gt),h("keydown",ft,e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),gt())}),h("click",kt,je(ht)),h("click",Rt,je(gt)),h("click",Ft,ht),h("click",Ut,gt),h("click",st,Ne),h("keydown",st,e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault(),t(G).getBoundingClientRect();const y=.5*t(E);t(a)&&(O(a,t(a).currentTime=y),l(g,y))}}),h("click",ot,$e),h("click",pt,Re),h("click",lt,jt),h("click",mt,Pt),h("click",Lt,Ie),h("click",St,ie),h("click",tt,Ye),h("keydown",tt,e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),e.key==="Enter"&&ie())}),h("click",Tt,Zt),Y(s,D)};z(Oe,s=>{s(Ue)})}Y(c,se),Oa()}export{wr as default};
