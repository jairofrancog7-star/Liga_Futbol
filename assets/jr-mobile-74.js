(()=>{'use strict';
if(window.__JR74_MOBILE)return;window.__JR74_MOBILE=true;
const BUILD='38-74';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const TEAMS={
 'Primera Fuerza':['Hermanos','San José FC','Linces','Juventus','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas'],
 'Intermedia':['La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta'],
 'Segunda Fuerza':['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata'],
 'Veteranos 35+':['C. de Gasca','Juventus','Cuenda','Pozos FC','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán'],
 'Veteranos 50+':['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']
};
const FALLBACK_LOGOS={
 'c de gasca':'./assets/teams/deportivo-cg.webp','cerrito de gasca':'./assets/teams/deportivo-cg.webp','juventus':'./assets/teams/juventus.webp',
 'cuenda':'./assets/teams/tc-cuenda.webp','pozos fc':'./assets/teams/pozos-fc.webp','boavista':'./assets/teams/boavista-fc.webp','boavista fc':'./assets/teams/boavista-fc.webp',
 'psv':'./assets/teams/psv.webp','america':'./assets/branding/america-veteranos-35-user.png','huracan':'./assets/teams/huracan.webp'
};
let live={};
function activeCategory(){try{return window.LJR_V20_API?.getCategory?.()||localStorage.getItem('jrCategory')||'Primera Fuerza'}catch{return'Primera Fuerza'}}
function categoryTeams(cat){
 const r=window.LJR_V20?.rosters?.[cat]||window.LJR_V20_API?.data?.rosters?.[cat];
 if(Array.isArray(r)&&r.length){const a=r.map(x=>String(x?.name||x?.team||x||'').trim()).filter(Boolean);if(a.length)return[...new Set(a)]}
 return TEAMS[cat]||[];
}
function teamLogo(name){const hit=Object.entries(live?.team_logos||{}).find(([k])=>norm(k)===norm(name));const v=hit?.[1];if(typeof v==='string')return v;if(v?.local)return v.local;return FALLBACK_LOGOS[norm(name)]||''}
function goView(name){
 const b=$(`[data-view="${name}"]`);if(b){b.click();return}
 const v=$('#view-'+name);if(v){$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');location.hash=name}
 else location.hash=name;
}
function setCategory(cat){
 const chip=$$('#categoryBar [data-category],#jr53TopCategoryHost [data-category]').find(x=>norm(x.dataset.category)===norm(cat));
 if(chip&&chip.id!=='jr74Synthetic')try{chip.click()}catch{}
 try{localStorage.setItem('jrCategory',cat)}catch{}
 try{window.LJR_V20_API?.setCategory?.(cat)}catch{}
 document.dispatchEvent(new CustomEvent('jr73-category-change',{detail:{category:cat}}));
}

/* Botones superiores: reducción deliberada para evitar el fallo de texto vertical. */
function compactCategories(){
 const host=$('#jr53TopCategoryHost');if(!host)return;
 $$('.jr81-cat-btn',host).forEach(b=>{
  const cat=b.dataset.category||b.dataset.jr81Category||$('.jr81-cat-title',b)?.textContent?.trim();if(!CATS.includes(cat))return;
  const currentSrc=$('img',b)?.getAttribute('src')||b.dataset.jr74Logo||'';if(currentSrc)b.dataset.jr74Logo=currentSrc;
  const teams=categoryTeams(cat).length||0;const pressed=b.getAttribute('aria-pressed');const src=b.dataset.jr74Logo||'';
  const sig=[cat,teams,src].join('|');if(b.dataset.jr74Sig!==sig){
   b.innerHTML=`<span class="jr81-cat-icon">${src?`<img src="${esc(src)}" alt="${esc(cat)}">`:'<span aria-hidden="true">⚽</span>'}</span><span class="jr81-cat-title">${esc(cat)}</span><span class="jr74-cat-meta">${teams} equipos</span>`;
   b.dataset.jr74Sig=sig;
  }
  if(pressed!==null)b.setAttribute('aria-pressed',pressed);
 });
}

/* Buscador global, inspirado en las apps analizadas, sin reemplazar vistas existentes. */
const ACTIONS=[
 {name:'Partidos y resultados',kind:'Sección',icon:'⚽',view:'matches'},
 {name:'Tabla de posiciones',kind:'Sección',icon:'📊',view:'table'},
 {name:'Estadísticas',kind:'Sección',icon:'📈',view:'stats'},
 {name:'Equipos',kind:'Sección',icon:'🛡️',view:'teams'},
 {name:'Liguilla / cuadro',kind:'Sección',icon:'🏆',view:'bracket'},
 {name:'Momentos',kind:'Sección',icon:'🎬',view:'home',anchor:'jr73MomentsSection'}
];
function searchItems(q){
 const needle=norm(q);let rows=[];
 ACTIONS.forEach(x=>{if(!needle||norm(x.name).includes(needle))rows.push({...x,type:'action'})});
 CATS.forEach(cat=>{if(!needle||norm(cat).includes(needle))rows.push({name:cat,kind:'Categoría',icon:'🏟️',type:'category',category:cat});categoryTeams(cat).forEach(team=>{if(!needle||norm(team).includes(needle))rows.push({name:team,kind:cat,icon:'🛡️',type:'team',category:cat,team})})});
 return rows.slice(0,40);
}
function ensureSearch(){
 const actions=$('.top-actions');if(!actions)return;
 let b=$('#jr74SearchButton');if(!b){b=document.createElement('button');b.id='jr74SearchButton';b.type='button';b.className='icon-btn';b.setAttribute('aria-label','Buscar en la liga');b.textContent='⌕';actions.prepend(b)}
 let d=$('#jr74SearchDialog');if(!d){d=document.createElement('dialog');d.id='jr74SearchDialog';d.innerHTML='<div class="jr74-search-head"><input id="jr74SearchInput" type="search" placeholder="Buscar equipo, categoría o sección" autocomplete="off"><button type="button" data-close aria-label="Cerrar">×</button></div><div class="jr74-search-results" id="jr74SearchResults"></div>';document.body.append(d);$('[data-close]',d).onclick=()=>d.close();
  const input=$('#jr74SearchInput',d),results=$('#jr74SearchResults',d);
  const paint=()=>{const rows=searchItems(input.value);results.innerHTML=rows.length?rows.map((x,i)=>{const src=x.team?teamLogo(x.team):'';return `<button type="button" class="jr74-search-result" data-i="${i}"><span class="ico">${src?`<img src="${esc(src)}" alt="">`:x.icon}</span><span><b>${esc(x.name)}</b><small>${esc(x.kind)}</small></span><span class="go">›</span></button>`}).join(''):'<div class="jr73-empty">Sin resultados.</div>';$$('[data-i]',results).forEach(btn=>btn.onclick=()=>{const x=rows[+btn.dataset.i];d.close();if(x.category)setCategory(x.category);if(x.type==='team'){goView('teams');setTimeout(()=>{const cand=$$('#view-teams *').find(el=>el.children.length<5&&norm(el.textContent)===norm(x.team));cand?.scrollIntoView({behavior:'smooth',block:'center'})},220)}else{goView(x.view||'home');if(x.anchor)setTimeout(()=>$('#'+x.anchor)?.scrollIntoView({behavior:'smooth',block:'start'}),180)}})};
  input.addEventListener('input',paint);d.addEventListener('close',()=>{input.value=''});d._paint=paint;
 }
 b.onclick=()=>{d._paint?.();d.showModal();setTimeout(()=>$('#jr74SearchInput',d)?.focus(),60)};
}

/* Mi equipo favorito: selector persistente y atajos. */
const FAV_KEY='jr74-favorite-team';
function readFavorite(){try{return JSON.parse(localStorage.getItem(FAV_KEY)||'null')}catch{return null}}
function saveFavorite(v){try{localStorage.setItem(FAV_KEY,JSON.stringify(v))}catch{}}
function ensureFavoriteHub(){
 const home=$('#view-home');if(!home)return;let s=$('#jr74FavoriteHub');if(!s){s=document.createElement('section');s.id='jr74FavoriteHub';s.innerHTML=`<div class="jr74-hub-head"><div><small>PERSONALIZA TU LIGA</small><h3>Mi equipo</h3></div><small>Favorito</small></div><div class="jr74-fav-form"><label>Categoría<select id="jr74FavCat"></select></label><label>Equipo<select id="jr74FavTeam"></select></label><button class="primary-btn" type="button" id="jr74FavSave">Guardar</button></div><div id="jr74FavoriteCard"></div>`;const anchor=$('#jr73MomentsSection')||$('#jr53TopCategoryHost');anchor&&home.contains(anchor)?anchor.insertAdjacentElement('afterend',s):home.prepend(s);
  const cat=$('#jr74FavCat',s),team=$('#jr74FavTeam',s);cat.innerHTML=CATS.map(c=>`<option>${esc(c)}</option>`).join('');
  const refill=()=>{const old=team.value;const vals=categoryTeams(cat.value);team.innerHTML=vals.map(t=>`<option>${esc(t)}</option>`).join('');if(vals.includes(old))team.value=old};cat.onchange=refill;refill();
  const old=readFavorite();if(old?.category&&CATS.includes(old.category)){cat.value=old.category;refill();if(categoryTeams(old.category).includes(old.team))team.value=old.team}
  $('#jr74FavSave',s).onclick=()=>{if(!team.value)return;saveFavorite({category:cat.value,team:team.value});renderFavorite()};
 }
 renderFavorite();
}
function renderFavorite(){
 const host=$('#jr74FavoriteCard');if(!host)return;const f=readFavorite();if(!f?.team){host.innerHTML='<div class="jr73-empty" style="margin-top:12px">Elige un equipo para tener accesos rápidos como en las apps de fútbol que revisamos.</div>';return}
 const src=teamLogo(f.team);host.innerHTML=`<article class="jr74-favorite-card"><div class="jr74-favorite-logo">${src?`<img src="${esc(src)}" alt="Escudo ${esc(f.team)}">`:'⚽'}</div><div class="jr74-favorite-copy"><b>${esc(f.team)}</b><small>${esc(f.category)}</small></div><div class="jr74-favorite-actions"><button data-go="teams">Ver equipo</button><button data-go="matches">Partidos</button><button data-go="table">Tabla</button><button data-go="stats">Ranking</button></div></article>`;$$('[data-go]',host).forEach(b=>b.onclick=()=>{setCategory(f.category);goView(b.dataset.go)})
}

/* Barra de competición: calendario/resultados, tabla, cuadro, estadísticas, equipos y momentos. */
function ensureCompetitionNav(){
 const home=$('#view-home');if(!home||$('#jr74CompetitionNav'))return;const n=document.createElement('nav');n.id='jr74CompetitionNav';n.setAttribute('aria-label','Centro de competencia');
 const items=[['matches','Partidos'],['table','Tabla'],['bracket','Cuadro'],['stats','Estadísticas'],['teams','Equipos'],['home','Momentos']];n.innerHTML=items.map(([v,t])=>`<button type="button" data-jr74-view="${v}"${t==='Momentos'?' data-moments="1"':''}>${t}</button>`).join('');
 const a=$('#jr53TopCategoryHost');a&&home.contains(a)?a.insertAdjacentElement('afterend',n):home.prepend(n);$$('button',n).forEach(b=>b.onclick=()=>{goView(b.dataset.jr74View);if(b.dataset.moments)setTimeout(()=>$('#jr73MomentsSection')?.scrollIntoView({behavior:'smooth',block:'start'}),160)})
}

/* Filtros rápidos: reutilizan los controles existentes, no inventan estados. */
function ensureMatchFilters(){
 const view=$('#view-matches');if(!view||$('#jr74MatchQuickFilters'))return;const bar=document.createElement('div');bar.id='jr74MatchQuickFilters';bar.innerHTML='<button class="active" data-find="todos">Todos</button><button data-find="en vivo|live">En vivo</button><button data-find="proxim|próxim|program">Próximos</button><button data-find="final|termin">Finalizados</button>';view.prepend(bar);
 $$('button',bar).forEach(b=>b.onclick=()=>{const patterns=b.dataset.find.split('|');const native=$$('#view-matches button').find(x=>x!==b&&!x.closest('#jr74MatchQuickFilters')&&patterns.some(p=>norm(x.textContent).includes(norm(p))));if(native)native.click();$$('button',bar).forEach(x=>x.classList.toggle('active',x===b))})
}

/* Atajos en Más; conserva todo lo que ya existe. */
function ensureMore(){
 const grid=$('#view-more>.more-grid');if(!grid)return;
 const add=(id,ico,label,fn)=>{if($('#'+id))return;const b=document.createElement('button');b.id=id;b.type='button';b.className='more-link';b.innerHTML=`<span>${ico}</span><b>${label}</b>`;b.onclick=fn;grid.append(b)};
 add('jr74MoreSearch','⌕','Buscar',()=>$('#jr74SearchButton')?.click());add('jr74MoreFavorite','★','Mi equipo',()=>{goView('home');setTimeout(()=>$('#jr74FavoriteHub')?.scrollIntoView({behavior:'smooth',block:'start'}),160)});add('jr74MoreMoments','◉','Momentos',()=>{goView('home');setTimeout(()=>$('#jr73MomentsSection')?.scrollIntoView({behavior:'smooth',block:'start'}),160)});add('jr74MoreBracket','🏆','Cuadro / Liguilla',()=>goView('bracket'));
}

function sync(){compactCategories();ensureSearch();ensureCompetitionNav();ensureFavoriteHub();ensureMatchFilters();ensureMore()}
let timer=0;function queue(ms=80){clearTimeout(timer);timer=setTimeout(sync,ms)}
function start(){sync();[180,500,1000,2200,5000].forEach(ms=>setTimeout(sync,ms));document.addEventListener('click',()=>queue(90),true);addEventListener('hashchange',()=>queue(50));addEventListener('pageshow',()=>queue(50));const mo=new MutationObserver(()=>queue(130));mo.observe(document.body,{childList:true,subtree:true})}
fetch('./data/official-live.json?v='+BUILD,{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(d=>{live=d||{};start()}).catch(start);
})();