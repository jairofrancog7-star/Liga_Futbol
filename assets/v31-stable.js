(function(){
'use strict';

const CATS=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
const TEAMS=[
'C. de Gasca','Pozos FC','Juventus','Cuenda','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán',
'Hermanos','San José FC','Linces','Napoli','Lobos CDG','Terrícolas','Galácticos','Franco FC','Herreras FC','Abejas',
'La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio JRS','Populares','Promesas FC','La Huerta',
'Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José JRS','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata',
'La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Manchester'
].sort((a,b)=>b.length-a.length);

const META={
 'pozos fc':['Veteranos 35+','Pozos, Juventino Rosas, Guanajuato'],
 'c. de gasca':['Veteranos 35+','Cerrito de Gasca, Juventino Rosas, Guanajuato'],
 'cuenda':['Veteranos 35+','Santiago de Cuenda, Juventino Rosas, Guanajuato'],
 'f. tavera':['Veteranos 35+','Tavera, Juventino Rosas, Guanajuato'],
 'tavera fc':['Segunda Fuerza','Tavera, Juventino Rosas, Guanajuato'],
 'san juan fc':['Segunda Fuerza','San Juan de la Cruz, Juventino Rosas, Guanajuato'],
 'san julián':['Segunda Fuerza','San Julián, Juventino Rosas, Guanajuato'],
 'san josé fc':['Primera Fuerza','San José, Juventino Rosas, Guanajuato'],
 'san josé jrs':['Segunda Fuerza','San José, Juventino Rosas, Guanajuato'],
 'san antonio jrs':['Intermedia','San Antonio de Romerillo, Juventino Rosas, Guanajuato'],
 'san antonio fc':['Segunda Fuerza','San Antonio de Romerillo, Juventino Rosas, Guanajuato'],
 'la huerta':['Intermedia','La Huerta, Juventino Rosas, Guanajuato'],
 'la cuadrilla':['Intermedia','La Cuadrilla, Juventino Rosas, Guanajuato'],
 'dep. zapata':['Segunda Fuerza','Colonia Emiliano Zapata, Juventino Rosas, Guanajuato']
};

const VENUES={
 'campo 1':['Campo 1 · Unidad Deportiva Sur','Blvrd Lic. Manuel M. Moreno, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'],
 'campo 2':['Campo 2 · Unidad Deportiva Sur','Blvrd Lic. Manuel M. Moreno, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'],
 'campo 3':['Campo 3 · Unidad Deportiva Sur','Blvrd Lic. Manuel M. Moreno, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Deportiva+Sur%2C+Blvrd+Lic+Manuel+M+Moreno%2C+Juventino+Rosas%2C+Guanajuato'],
 'campo 4':['Campo 4 · Emiliano Zapata','Zona colonia Emiliano Zapata, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Colonia+Emiliano+Zapata%2C+Juventino+Rosas%2C+Guanajuato'],
 'cerrito de gasca':['Cerrito de Gasca','Cerrito de Gasca, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Cerrito+de+Gasca%2C+Juventino+Rosas%2C+Guanajuato'],
 'tavera':['Tavera','Tavera, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Tavera%2C+Juventino+Rosas%2C+Guanajuato'],
 'san juan de la cruz':['San Juan de la Cruz','San Juan de la Cruz, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=San+Juan+de+la+Cruz%2C+Juventino+Rosas%2C+Guanajuato'],
 'santiago de cuenda':['Santiago de Cuenda','Santiago de Cuenda, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=Santiago+de+Cuenda%2C+Juventino+Rosas%2C+Guanajuato'],
 'san antonio de romerillo':['San Antonio de Romerillo','San Antonio de Romerillo, Juventino Rosas, Guanajuato','https://www.google.com/maps/dir/?api=1&destination=San+Antonio+de+Romerillo%2C+Juventino+Rosas%2C+Guanajuato']
};

function q(s,r=document){return r.querySelector(s)}
function qa(s,r=document){return [...r.querySelectorAll(s)]}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(s){return String(s||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function teamFromText(t){const n=norm(t);return TEAMS.find(x=>n===norm(x))||''}
function logoFor(team){const n=norm(team);const img=qa('img').find(i=>norm(i.alt||'')===n||norm(i.title||'')===n);return img?img.src:''}

function modal(){
 let m=q('#jr31Modal'); if(m)return m;
 m=document.createElement('div'); m.id='jr31Modal'; m.className='jr31-modal-bg';
 m.innerHTML='<div class="jr31-modal"><div class="jr31-modal__head"><h3></h3><button class="jr31-close" type="button">×</button></div><div class="jr31-modal__body"></div></div>';
 document.body.appendChild(m);
 q('.jr31-close',m).onclick=()=>m.classList.remove('show');
 m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')});
 return m;
}
function openModal(title,html){
 const m=modal(); q('h3',m).textContent=title; q('.jr31-modal__body',m).innerHTML=html; m.classList.add('show'); return m;
}
function toast(msg){
 q('.jr31-toast')?.remove(); const t=document.createElement('div'); t.className='jr31-toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}
function clickText(words){
 const arr=Array.isArray(words)?words:[words];
 const el=qa('button,a,[data-view]').find(x=>arr.some(w=>norm(x.textContent)===norm(w)));
 if(el){el.click();return true} return false;
}
function go(view){
 const m={home:['Inicio'],matches:['Partidos','Jornada','Ver jornada'],table:['Tabla','Ver tabla'],stats:['Estadísticas','Goleo'],match:['Abrir Match Center','Match Center','LIVE Match Center'],more:['Más']};
 if(clickText(m[view]||view))return;
 const h=qa('h1,h2,h3,h4').find(x=>(m[view]||[]).some(w=>norm(x.textContent)===norm(w)));
 if(h)h.scrollIntoView({behavior:'smooth',block:'start'});
}
function setCat(cat){localStorage.setItem('jrCategory',cat);const b=qa('[data-category],button,a').find(x=>norm(x.dataset?.category||x.textContent)===norm(cat));if(b)b.click()}

function openTeam(team){
 const key=norm(team), meta=META[key]||[localStorage.getItem('jrCategory')||'Liga','Juventino Rosas, Guanajuato'];
 const logo=logoFor(team);
 const m=openModal(team,`<div class="jr31-hero"><div class="jr31-avatar">${logo?`<img src="${esc(logo)}" alt="${esc(team)}">`:esc(initials(team))}</div><div><div class="jr31-chip">${esc(meta[0])}</div><h4>${esc(team)}</h4><p>Equipo registrado en la Liga Municipal de Fútbol Juventino Rosas.</p></div></div><div class="jr31-grid"><div class="jr31-card"><small>Origen / zona</small>${esc(meta[1])}</div><div class="jr31-card"><small>Acciones</small>Consulta sus partidos y la tabla de su categoría.</div></div><div class="jr31-actions"><button class="jr31-btn primary" id="jr31Matches">Ver partidos</button><button class="jr31-btn" id="jr31Table">Ver tabla</button><a class="jr31-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta[1])}">Ver zona en Maps</a></div>`);
 q('#jr31Matches',m).onclick=()=>{setCat(meta[0]);m.classList.remove('show');go('matches')};
 q('#jr31Table',m).onclick=()=>{setCat(meta[0]);m.classList.remove('show');go('table')};
}
function venueFromText(text){
 const n=norm(text);
 return Object.keys(VENUES).find(k=>n===norm(k)||n.includes(norm(k)))||'';
}
function openVenue(k){
 const v=VENUES[k]; if(!v)return;
 openModal(v[0],`<div class="jr31-hero"><div class="jr31-avatar">📍</div><div><div class="jr31-chip">Cancha / sede</div><h4>${esc(v[0])}</h4><p>${esc(v[1])}</p></div></div><div class="jr31-actions"><a class="jr31-btn primary" target="_blank" rel="noopener" href="${esc(v[2])}">Cómo llegar en Google Maps</a></div>`);
}
function openCats(){
 const m=openModal('5 categorías',`<div class="jr31-card">Elige una categoría para abrir sus jornadas.</div><div class="jr31-actions">${CATS.map(c=>`<button class="jr31-btn" data-jr31-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>`);
 qa('[data-jr31-cat]',m).forEach(b=>b.onclick=()=>{setCat(b.dataset.jr31Cat);m.classList.remove('show');go('matches')});
}

function decorateSafe(){
 // IMPORTANT: sólo elementos pequeños. Nunca reescribir DIV/ARTICLE grandes.
 qa('button,a,span,b,strong,small,td,th').forEach(el=>{
   const txt=(el.textContent||'').trim(); if(!txt || txt.length>80)return;
   if(norm(txt)==='5 categorias'){el.dataset.jr31='cats';el.classList.add('jr31-click')}
   if(norm(txt)==='live match center'||norm(txt)==='abrir match center'){el.dataset.jr31='match';el.classList.add('jr31-click')}
   if(norm(txt)==='jr matchday'||norm(txt)==='ver jornada'){el.dataset.jr31='matches';el.classList.add('jr31-click')}
   const team=teamFromText(txt);
   if(team){el.dataset.jr31Team=team;el.classList.add('jr31-click')}
   const venue=venueFromText(txt);
   if(venue && /campo|cerrito|tavera|san juan|cuenda|romerillo/i.test(txt)){el.dataset.jr31Venue=venue;el.classList.add('jr31-click')}
 });
 // Logos sólo en TD exactos de equipos.
 qa('td').forEach(td=>{
   if(td.dataset.jr31Logo)return;
   const team=teamFromText((td.textContent||'').trim()); if(!team)return;
   const logo=logoFor(team); if(!logo){td.dataset.jr31Logo='skip';return}
   const label=(td.textContent||'').trim();
   td.innerHTML=`<span class="jr31-teamcell"><span class="jr31-teamcell__logo"><img src="${esc(logo)}" alt="${esc(team)}"></span><span>${esc(label)}</span></span>`;
   td.dataset.jr31Team=team; td.dataset.jr31Logo='1'; td.classList.add('jr31-click');
 });
}
function clickHandler(e){
 const el=e.target.closest('[data-jr31],[data-jr31-team],[data-jr31-venue]');
 if(!el)return;
 if(el.dataset.jr31==='cats'){e.preventDefault();return openCats()}
 if(el.dataset.jr31==='match'){e.preventDefault();return go('match')}
 if(el.dataset.jr31==='matches'){e.preventDefault();return go('matches')}
 if(el.dataset.jr31Team){e.preventDefault();return openTeam(el.dataset.jr31Team)}
 if(el.dataset.jr31Venue){e.preventDefault();return openVenue(el.dataset.jr31Venue)}
}
function guardAgainstOldCollapse(){
 setTimeout(()=>{
   const bodyText=norm(document.body?.innerText||'');
   const suspicious=bodyText.includes('carlos martinez') && bodyText.length<180;
   if(suspicious && sessionStorage.getItem('jr31Recovered')!=='1'){
     sessionStorage.setItem('jr31Recovered','1');
     Promise.resolve().then(async()=>{
       try{
         if('serviceWorker' in navigator){
           const regs=await navigator.serviceWorker.getRegistrations();
           await Promise.all(regs.map(r=>r.unregister()));
         }
         if('caches' in window){
           const ks=await caches.keys();
           await Promise.all(ks.map(k=>caches.delete(k)));
         }
       }catch(_){}
       location.replace('./?v=31-recover-'+Date.now());
     });
   }
 },1600);
}
function boot(){
 decorateSafe();
 document.addEventListener('click',clickHandler,true);
 setTimeout(decorateSafe,350); // una sola pasada segura
 guardAgainstOldCollapse();
 window.LJR_V31={openTeam,openVenue,openCats,go};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
