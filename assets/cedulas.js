(()=>{'use strict';
const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
let data,categories,fallback;
const TEAM_LOGOS={
 'C DE GASCA':'./assets/teams/deportivo-cg.webp','CERRITO DE GASCA':'./assets/teams/deportivo-cg.webp','JUVENTUS':'./assets/teams/juventus.webp',
 'CUENDA':'./assets/teams/tc-cuenda.webp','POZOS FC':'./assets/teams/pozos-fc.webp','POZOS':'./assets/teams/pozos-fc.webp','BOAVISTA':'./assets/teams/boavista-fc.webp',
 'PSV':'./assets/teams/psv.webp','AMERICA':'./assets/branding/america-veteranos-35-user.png'
};
const logo=t=>TEAM_LOGOS[norm(t)]||'';
const teams=c=>{const live=Array.from(new Set([...Object.keys(c.rosters||{}),...(c.standings||[]).flatMap(t=>(t.rows||[]).map(r=>r[1]))])).filter(Boolean);return (live.length?live:(fallback[c.name]||[]).map(t=>t.name)).sort((a,b)=>a.localeCompare(b,'es'))};
const selected=()=>categories.find(c=>String(c.id)===$('cat').value);
function options(el,values){el.innerHTML=values.map(v=>'<option>'+esc(v)+'</option>').join('');el.disabled=false}
function changeCategory(){const c=selected();const list=teams(c);options($('home'),list);options($('away'),list);if(list.length>1)$('away').selectedIndex=1}
function roster(c,team){
 const names=c.rosters?.[team]||[];const rows=names.length?names:Array(18).fill('');const src=logo(team);
 return '<h3 class="team-title">'+(src?'<img src="'+src+'" alt="">':'')+'<span>'+esc(team)+'</span></h3>'+(!names.length?'<p class="empty-note">La liga todavía no tiene nombres públicos en el snapshot para este equipo. Completa y verifica la plantilla antes de firmar.</p>':'')+'<div class="roster"><table><thead><tr><th>#</th><th>Jugador</th><th>Dorsal</th><th>Goles</th><th>TA</th><th>TR</th><th>Firma</th></tr></thead><tbody>'+rows.map((n,i)=>'<tr><td>'+(i+1)+'</td><td'+(!n?' contenteditable="true"':'')+'>'+esc(n)+'</td>'+Array(5).fill('<td contenteditable="true"></td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function sheet(c,home,away,folio=''){
 return '<article class="sheet"><div class="sheet-head"><img src="./assets/liga-logo.webp" alt="Liga Juventino Rosas"><div><small>LIGA MUNICIPAL DE FÚTBOL</small><h2>Juventino Rosas A.C.</h2><p>'+(away?'CÉDULA ARBITRAL':'PLANTILLA DE EQUIPO')+' · '+esc(c.name)+'</p></div><div class="folio">'+(folio?'CÉDULA #'+esc(folio):'DOCUMENTO INTERNO')+'</div></div><p class="pending">PENDIENTE DE VALIDACIÓN Y FIRMA DE LA LIGA</p><h2>'+esc(home)+(away?' vs '+esc(away):'')+'</h2><p class="meta"><span>Fecha: '+esc($('date').value||'Por confirmar')+'</span><span>Campo: '+esc($('field').value||'Por confirmar')+'</span><span>Árbitro: '+esc($('referee').value||'Por asignar')+'</span></p>'+roster(c,home)+(away?roster(c,away):'')+'<h3>Observaciones / resultado</h3><div class="notes" contenteditable="true"></div><div class="signatures"><span>Árbitro</span><span>Delegado / capitán</span><span>Validación de la liga</span></div><small>Generada dentro de Liga Juventino Rosas con el snapshot deportivo '+esc(data.captured_at_utc||'sin fecha')+'. No redirige a una cédula de otro sitio.</small></article>';
}
function generate(folio=''){const c=selected(),h=$('home').value,a=$('away').value;if(!c||!h||!a){$('status').textContent='Selecciona categoría y equipos.';return}if(h===a){$('status').textContent='Selecciona dos equipos diferentes.';return}$('sheets').innerHTML=sheet(c,h,a,folio);$('print').disabled=false;$('status').textContent='Cédula propia lista. Completa los campos y revisa antes de imprimir.'}
$('cat').onchange=changeCategory;$('generate').onclick=()=>generate();$('print').onclick=()=>window.print();
$('all').onclick=()=>{$('sheets').innerHTML=categories.flatMap(c=>teams(c).map(t=>sheet(c,t))).join('');$('print').disabled=false;$('status').textContent='Plantillas generadas para todos los equipos.'};
Promise.all(['./data/official-live.json?b=38-57','./data/cedulas-teams.json?b=38-57'].map(url=>fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}))).then(([d,f])=>{
 fallback=f;data=d;categories=Object.values(d.categories||{});if(!categories.length)throw Error('Sin categorías');
 $('cat').innerHTML=categories.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');$('cat').disabled=false;changeCategory();$('generate').disabled=false;$('all').disabled=false;
 const id=new URLSearchParams(location.search).get('cedula');
 if(id){
   $('cedulaRef').textContent='Cédula #'+id;let found=false;
   for(const c of categories){
     const match=(c.cedulas||[]).find(x=>String(x.id)===String(id));
     if(match){$('cat').value=String(c.id);changeCategory();$('home').value=match.local||'';$('away').value=match.away||'';if(match.fecha&&!$('date').value)$('date').value=String(match.fecha).slice(0,10);if(match.field)$('field').value=match.field;if($('home').value&&$('away').value){generate(id);found=true}break}
     const ids=c?.dashboard?.current_cedulas||[];if(ids.map(String).includes(String(id))){$('cat').value=String(c.id);changeCategory()}
   }
   if(!found)$('status').textContent='Cédula #'+id+' registrada. Selecciona o confirma los equipos y genera la cédula propia.';
 }else $('status').textContent='Datos cargados. Puedes generar una cédula propia o las plantillas de los equipos.';
}).catch(e=>{$('status').textContent='No se pudieron cargar los datos de la liga. Recarga la página.';console.warn(e)});
})();
