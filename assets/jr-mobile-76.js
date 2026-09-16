(()=>{'use strict';
if(window.__JR76_MOBILE)return;window.__JR76_MOBILE=true;
const BUILD='38-76';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const TEAM_FALLBACK={'c de gasca':'./assets/teams/deportivo-cg.webp','cerrito de gasca':'./assets/teams/deportivo-cg.webp','juventus':'./assets/teams/juventus.webp','cuenda':'./assets/teams/tc-cuenda.webp','pozos fc':'./assets/teams/pozos-fc.webp','boavista':'./assets/teams/boavista-fc.webp','boavista fc':'./assets/teams/boavista-fc.webp','psv':'./assets/teams/psv.webp','america':'./assets/branding/america-veteranos-35-user.png','huracan':'./assets/teams/huracan.webp'};
const STORE={follow:'jr76-follow',saved:'jr76-saved',pred:'jr76-pred',vote:'jr76-vote',notes:'jr76-notes',snap:'jr76-snap'};
let live={},catLogo={};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
function activeCategory(){try{return window.LJR_V20_API?.getCategory?.()||localStorage.getItem('jrCategory')||'Primera Fuerza'}catch{return'Primera Fuerza'}}
function categoryData(cat=activeCategory()){return Object.values(live?.categories||{}).find(c=>norm(c?.name)===norm(cat))||null}
function allRows(c,key){const out=[];(Array.isArray(c?.[key])?c[key]:[]).forEach(b=>(b?.rows||[]).forEach(r=>out.push({h:b.headers||[],r})));return out}
function col(x,name,nth=0){let seen=0;for(let i=0;i<x.h.length;i++){if(norm(x.h[i])===norm(name)){if(seen===nth)return String(x.r[i]??'').trim();seen++}}return''}
function parseDate(s){const m=String(s||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)):null}
function fixtures(c=categoryData()){
 const now=Date.now();return allRows(c,'fixtures').map(x=>{const when=col(x,'Fecha/Hora'),dt=parseDate(when),past=dt&&dt.getTime()<now-2*3600000,a=col(x,'Goles',0),b=col(x,'Goles',1),n=v=>v==='-'?0:(/^\d+$/.test(v)?+v:null),an=n(a),bn=n(b),final=!!(past&&an!==null&&bn!==null);return{id:col(x,'#')||[col(x,'Jornada'),col(x,'Local'),col(x,'Visitante'),when].join('|'),round:col(x,'Jornada'),home:col(x,'Local'),away:col(x,'Visitante'),homeScore:final?an:null,awayScore:final?bn:null,field:col(x,'Campo'),when,dt,ref:col(x,'Árbitro'),final}}).filter(m=>m.home&&m.away)
}
function standings(c=categoryData()){return allRows(c,'standings').map(x=>({pos:+col(x,'#')||0,team:col(x,'Equipo'),pj:+col(x,'PJ')||0,pg:+col(x,'PG')||0,pe:+col(x,'PE')||0,pp:+col(x,'PP')||0,pts:+col(x,'PTS')||0})).filter(x=>x.team)}
function scorers(c=categoryData()){return allRows(c,'scorers').map(x=>({pos:+col(x,'#')||0,name:col(x,'Jugador'),team:col(x,'Equipo'),goals:+col(x,'Goles')||0})).filter(x=>x.name)}
function suspensions(c=categoryData()){return allRows(c,'suspensions').map(x=>({name:col(x,'Jugador'),team:col(x,'Equipo'),punish:col(x,'Castigo'),pending:col(x,'Pendientes')})).filter(x=>x.name)}
function teamLogo(name){const n=norm(name),d=Object.entries(live?.team_logos||{}).find(([k])=>norm(k)===n)?.[1];if(typeof d==='string')return d;if(d?.local)return d.local;for(const c of Object.values(live?.categories||{}))for(const x of c?.dashboard?.logo_candidates||[]){const t=norm(x?.near_text||'');if(t===n||t.startsWith(n+' '))return x?.source||''}return TEAM_FALLBACK[n]||''}
function goView(name){const b=$(`[data-view="${name}"]`);if(b)return b.click();const v=$('#view-'+name);if(v){$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');location.hash=name}}
function setCategory(cat){const b=$$('#categoryBar [data-category]').find(x=>norm(x.dataset.category)===norm(cat));if(b)b.click();try{localStorage.setItem('jrCategory',cat)}catch{}try{window.LJR_V20_API?.setCategory?.(cat)}catch{}document.dispatchEvent(new CustomEvent('jr73-category-change',{detail:{category:cat}}));setTimeout(renderAll,90)}
function categoryLogo(cat){if(catLogo[cat])return catLogo[cat];const old=$$('#jr53TopCategoryHost [data-category]').find(x=>norm(x.dataset.category)===norm(cat));const src=old?.querySelector('img')?.src||'';if(src)catLogo[cat]=src;return src||(cat==='Primera Fuerza'?'./assets/branding/primera-fuerza-hd.png':'')}
function countTeams(c){return Number(c?.counts?.Equipos??c?.dashboard?.counts?.Equipos??0)||0}

function ensureCategoryStrip(){
 const host=$('#jr53TopCategoryHost');if(!host)return;host.classList.add('jr75-hidden-source');let r=$('#jr75CategoryStrip');if(!r){r=document.createElement('nav');r.id='jr75CategoryStrip';r.setAttribute('aria-label','Categorías');host.before(r)}
 const current=activeCategory();r.innerHTML=CATS.map(cat=>{const src=categoryLogo(cat),c=categoryData(cat),num=countTeams(c);return `<button class="jr75-cat" type="button" data-cat="${esc(cat)}" aria-pressed="${norm(cat)===norm(current)}"><span class="jr75-cat-logo">${src?`<img src="${esc(src)}" alt="">`:'⚽'}</span><span class="jr75-cat-copy"><strong>${esc(cat)}</strong><small>${num?num+' equipos':'Ver categoría'}</small></span></button>`}).join('');
 $$('button',r).forEach(b=>b.onclick=()=>setCategory(b.dataset.cat));
}
function fixCompetitionNav(){const n=$('#jr74CompetitionNav');if(!n)return;n.style.setProperty('display','flex','important');n.style.setProperty('flex-wrap','nowrap','important');n.style.setProperty('overflow-x','auto','important');n.style.setProperty('width','100%','important');$$('button',n).forEach(b=>{b.style.setProperty('flex','0 0 auto','important');b.style.setProperty('width','auto','important');b.style.setProperty('white-space','nowrap','important');if(/estad/i.test(b.textContent||''))b.textContent='Estadísticas'})}

const matchKey=(m,cat=activeCategory())=>[cat,m.id,m.home,m.away,m.when].join('|');
function nextMatch(c=categoryData()){const fs=fixtures(c),now=Date.now(),f=fs.filter(m=>m.dt&&m.dt.getTime()>=now-2*3600000).sort((a,b)=>a.dt-b.dt);return f[0]||fs.sort((a,b)=>(b.dt?.getTime()||0)-(a.dt?.getTime()||0))[0]||null}
const status=m=>m?.final?'FINAL':(m?.dt&&m.dt>Date.now()?'PRÓXIMO':'PROGRAMADO');
const score=m=>m?.final?`${m.homeScore} — ${m.awayScore}`:'VS';
function form(team,c=categoryData()){return fixtures(c).filter(m=>m.final&&(norm(m.home)===norm(team)||norm(m.away)===norm(team))).sort((a,b)=>(a.dt?.getTime()||0)-(b.dt?.getTime()||0)).slice(-5).map(m=>{const h=norm(team)===norm(m.home),gf=h?m.homeScore:m.awayScore,ga=h?m.awayScore:m.homeScore;return gf>ga?'G':gf<ga?'P':'E'})}
function followed(cat=activeCategory()){return read(STORE.follow,[]).some(x=>norm(x)===norm(cat))}
function toggleFollow(){let a=read(STORE.follow,[]),cat=activeCategory();a=followed(cat)?a.filter(x=>norm(x)!==norm(cat)):[cat,...a];write(STORE.follow,a);renderCenter()}
function saved(){return read(STORE.saved,[])}
function isSaved(m){return saved().includes(matchKey(m))}
function toggleSaved(m){let a=saved(),k=matchKey(m);a=a.includes(k)?a.filter(x=>x!==k):[k,...a].slice(0,60);write(STORE.saved,a);renderAll()}

function logNote(title,text){let a=read(STORE.notes,[]);a.unshift({id:Date.now()+Math.random(),title,text,time:Date.now()});write(STORE.notes,a.slice(0,40))}
function snapshot(){const o={};for(const c of Object.values(live?.categories||{}))o$�PЀL@