(()=>{'use strict';
const BUILD='38-67-r1';
const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
let data,categories,fallback;
const Q=new URLSearchParams(location.search);
const QUERY_JORNADA=Q.get('jornada')||'';
const TEAM_LOGOS={
 'C DE GASCA':'./assets/teams/deportivo-cg.webp','CERRITO DE GASCA':'./assets/teams/deportivo-cg.webp','JUVENTUS':'./assets/teams/juventus.webp',
 'CUENDA':'./assets/teams/tc-cuenda.webp','POZOS FC':'./assets/teams/pozos-fc.webp','POZOS':'./assets/teams/pozos-fc.webp','BOAVISTA':'./assets/teams/boavista-fc.webp',
 'PSV':'./assets/teams/psv.webp','A SANTIAGO':'./assets/teams/atletico-santiago.webp','F TAVERA':'./assets/teams/franco-tavera-jr-veteranos.webp','AMERICA':'./assets/branding/america-veteranos-35-user.png',
 'HERMANOS':'./assets/teams/club-deportivo-hermanos.webp','SAN JOSE FC':'./assets/teams/san-jose.webp','LINCES':'./assets/teams/linces.webp','LOBOS CDG':'./assets/teams/lobos-cdg.webp',
 'TERRICOLAS':'./assets/teams/terricolas-fc.webp','GALACTICOS':'./assets/teams/galacticos-pozos.webp','FRANCO FC':'./assets/teams/franco-fc.webp','HERRERAS FC':'./assets/teams/herrera-fc.webp',
 'NAPOLI':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv','ABEJAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Abejas_lxn6l9',
 'LA CANCHITA DEPORTES':'./assets/teams/la-canchita.webp','GALEANA':'./assets/teams/atletico-galeana.webp','ALDAMA FC':'./assets/teams/aldama.webp','SAN ANTONIO JRS':'./assets/teams/san-antonio-jr.webp',
 'PROMESAS':'./assets/teams/promesas-fc-pozos.webp','PROMESAS FC':'./assets/teams/promesas-fc-pozos.webp','LA HUERTA':'./assets/teams/la-huerta-cuenda.webp',
 'TAVERA FC':'./assets/teams/tavera-fc.webp','SAN JOSE JRS':'./assets/teams/san-jose-jr.webp','SAN JULIAN':'./assets/teams/san-julian-fc.webp','DEP NOPALERO':'./assets/teams/deportivo-nopalero.webp',
 'LA ESPERANZA':'./assets/teams/la-esperanza-fc.webp','MANCHESTER':'./assets/teams/manchester-united.webp','TOROS DE CUENDA':'./assets/teams/tc-cuenda.webp',
 'MALVINAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Malvinas_wdiwk9','CAPIBARAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Capibara_vocmbl',
 'LA CUADRILLA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CuadrillaFC_vpfbtr','MAZACOTES FC':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Mazacotes_ko8o0w',
 'DEP MARAVILLAS':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/MAravillasFC_mnmhwx','OSASUNA':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Osasuna_lv6rsa',
 'POPULARES':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PopularesFC_onellt','DYNAMO':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dinamo_rgamvy'
};
const logo=t=>{
 const key=norm(t);if(TEAM_LOGOS[key])return TEAM_LOGOS[key];
 for(const [name,v] of Object.entries(data?.team_logos||{})){
  if(norm(name)!==key)continue;
  if(typeof v==='string')return v;
  return v?.local||v?.path||v?.source||'';
 }
 return '';
};
const teams=c=>{const live=Array.from(new Set([...Object.keys(c.rosters||{}),...(c.standings||[]).flatMap(t=>(t.rows||[]).map(r=>r[1]))])).filter(Boolean);return (live.length?live:(fallback[c.name]||[]).map(t=>t.name)).sort((a,b)=>a.localeCompare(b,'es'))};
const selected=()=>categories.find(c=>String(c.id)===$('cat').value);
function options(el,values){el.innerHTML=values.map(v=>'<option>'+esc(v)+'</option>').join('');el.disabled=false}
function selectNorm(el,value){const want=norm(value);const opt=Array.from(el.options).find(o=>norm(o.value||o.textContent)===want);if(opt){el.value=opt.value;return true}return false}
function changeCategory(){const c=selected();const list=teams(c);options($('home'),list);options($('away'),list);if(list.length>1)$('away').selectedIndex=1}
function roster(c,team){
 const names=c.rosters?.[team]||[];const rows=names.length?names:Array(18).fill('');const src=logo(team);
 return '<h3 class="team-title">'+(src?'<img src="'+esc(src)+(src.startsWith('.')?'?v='+BUILD:'')+'" alt="Escudo '+esc(team)+'">':'')+'<span>'+esc(team)+'</span></h3>'+(!names.length?'<p class="empty-note">La liga todavía no tiene nombres públicos en el snapshot para este equipo. Completa y verifica la plantilla antes de firmar.</p>':'')+'<div class="roster"><table><thead><tr><th>#</th><th>Jugador</th><th>Dorsal</th><th>Goles</th><th>TA</th><th>TR</th><th>Firma</th></tr></thead><tbody>'+rows.map((n,i)=>'<tr><td>'+(i+1)+'</td><td'+(!n?' contenteditable="true"':'')+'>'+esc(n)+'</td>'+Array(5).fill('<td contenteditable="true"></td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function sheet(c,home,away,folio=''){
 return '<article class="sheet"><div class="sheet-head"><img src="./assets/liga-logo.webp" alt="Liga Juventino Rosas"><div><small>LIGA MUNICIPAL DE FÚTBOL</small><h2>Juventino Rosas A.C.</h2><p>'+(away?'CÉDULA ARBITRAL':'PLANTILLA DE EQUIPO')+' · '+esc(c.name)+'</p></div><img src="'+({1:'./assets/categories/veteranos-50.webp',2:'./assets/categories/veteranos-35-user.png',3:'./assets/branding/primera-fuerza-hd.png',4:'./assets/categories/segunda-fuerza.webp',5:'./assets/categories/intermedia.webp'}[c.id])+'" alt="Logo categoría"><div class="folio">'+(folio?'CÉDULA #'+esc(folio):'DOCUMENTO INTERNO')+'</div></div><p class="pending">PENDIENTE DE VALIDACIÓN Y FIRMA DE LA LIGA</p><h2>'+esc(home)+(away?' vs '+esc(away):'')+'</h2><p class="meta"><span>Jornada: '+esc(QUERY_JORNADA||'Por confirmar')+'</span><span>Fecha: '+esc($('date').value||'Por confirmar')+'</span><span>Campo: '+esc($('field').value||'Por confirmar')+'</span><span>Árbitro: '+esc($('referee').value||'Por asignar')+'</span></p>'+roster(c,home)+(away?roster(c,away):'')+'<h3>Resultado final, cambios e incidencias</h3><p contenteditable="true">Hora de inicio: ____ · Hora de término: ____ · Marcador local: ____ · Visitante: ____</p><div class="notes" contenteditable="true"></div><div class="signatures"><span>Árbitro</span><span>Delegado / capitán</span><span>Validación de la liga</span></div><small>Generada dentro de Liga Juventino Rosas con el snapshot deportivo '+esc(data.captured_at_utc||'sin fecha')+'. No redirige a una cédula de otro sitio.</small></article>';
}
function generate(folio=''){const c=selected(),h=$('home').value,a=$('away').value;if(!c||!h||!a){$('status').textContent='Selecciona categoría y equipos.';return}if(h===a){$('status').textContent='Selecciona dos equipos diferentes.';return}$('sheets').innerHTML=sheet(c,h,a,folio);$('print').disabled=false;$('status').textContent='Cédula propia lista. Completa los campos y revisa antes de imprimir.'}
$('cat').onchange=changeCategory;$('generate').onclick=()=>generate();$('print').onclick=()=>window.print();
$('all').onclick=()=>{$('sheets').innerHTML=categories.flatMap(c=>teams(c).map(t=>sheet(c,t))).join('');$('print').disabled=false;$('status').textContent='Plantillas generadas para todos los equipos.'};
Promise.all(['./data/official-live.json?b='+BUILD,'./data/cedulas-teams.json?b='+BUILD].map(url=>fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}))).then(([d,f])=>{
 fallback=f;data=d;categories=Object.values(d.categories||{});if(!categories.length)throw Error('Sin categorías');
 $('cat').innerHTML=categories.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');$('cat').disabled=false;
 const queryCategory=Q.get('category')||'';if(queryCategory){const c=categories.find(x=>norm(x.name)===norm(queryCategory));if(c)$('cat').value=String(c.id)}
 changeCategory();$('generate').disabled=false;$('all').disabled=false;
 const queryHome=Q.get('local')||'',queryAway=Q.get('visitante')||'',queryField=Q.get('field')||'',queryDate=Q.get('date')||'';
 if(queryHome)selectNorm($('home'),queryHome);if(queryAway)selectNorm($('away'),queryAway);if(queryField)$('field').value=queryField;
 if(queryDate){const m=String(queryDate).match(/(\d{2})\/(\d{2})\/(\d{4})/);$('date').value=m?`${m[3]}-${m[2]}-${m[1]}`:String(queryDate).slice(0,10)}
 const id=Q.get('cedula');
 if(id){
   $('cedulaRef').textContent='Cédula #'+id;let found=false;
   for(const c of categories){
     const match=(c.cedulas||[]).find(x=>String(x.id)===String(id));
     if(match){$('cat').value=String(c.id);changeCategory();selectNorm($('home'),match.local||'');selectNorm($('away'),match.away||'');if(match.fecha&&!$('date').value)$('date').value=String(match.fecha).slice(0,10);if(match.field)$('field').value=match.field;if($('home').value&&$('away').value){generate(id);found=true}break}
     const ids=c?.dashboard?.current_cedulas||[];if(ids.map(String).includes(String(id))){$('cat').value=String(c.id);changeCategory()}
   }
   if(!found)$('status').textContent='Cédula #'+id+' registrada. Selecciona o confirma los equipos y genera la cédula propia.';
 }else if(queryHome&&queryAway&&$('home').value&&$('away').value){generate();$('status').textContent='Cédula del partido cargada con los equipos correctos.'}
 else $('status').textContent='Datos cargados. Puedes generar una cédula propia o las plantillas de los equipos.';
}).catch(e=>{$('status').textContent='No se pudieron cargar los datos de la liga. Recarga la página.';console.warn(e)});
})();
