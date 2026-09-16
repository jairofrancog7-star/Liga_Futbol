(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const isPublic=document.body.classList.contains('jr70-publications');
if(isPublic){const m=new URLSearchParams(location.search).get('mode');if(['credential','bracket'].includes(m))document.body.dataset.mode=m;try{document.body.classList.toggle('light',localStorage.getItem('jrTheme')==='light')}catch{}$('#publicationTheme').onclick=()=>{document.body.classList.toggle('light');try{localStorage.setItem('jrTheme',document.body.classList.contains('light')?'light':'dark')}catch{}};return}
let data=null;const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
function current(){try{return localStorage.getItem('jrCategory')||'Primera Fuerza'}catch{return 'Primera Fuerza'}}
function logo(name){const v=Object.entries(data?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];return typeof v==='string'?v:v?.local}
function tableTools(){const table=$('.jr64-table');if(!table)return;const shell=$('#jr64TableRestore');if(!shell)return;
 if(!$('.jr70-table-controls',shell)){const controls=document.createElement('div');controls.className='jr70-table-controls';controls.innerHTML='<button data-table-mode="compact" aria-pressed="false">Compacta</button><button data-table-mode="full" aria-pressed="true">Completa</button><button data-table-mode="form" aria-pressed="false">Forma</button><label>Lugares de liguilla<select aria-label="Lugares de liguilla"><option value="0">Por confirmar</option><option value="4">4 equipos</option><option value="6">6 equipos</option><option value="8">8 equipos</option></select></label>';
 const wrap=$('.jr64-table-wrap',shell);wrap.before(controls);const note=document.createElement('p');note.className='jr70-qualification-note';note.textContent='Marca la zona de clasificación según el formato elegido en este dispositivo. No confirma clasificados oficiales.';controls.after(note);
 controls.addEventListener('click',e=>{const b=e.target.closest('[data-table-mode]');if(!b)return;table.classList.toggle('jr70-compact',b.dataset.tableMode==='compact');table.classList.toggle('jr70-form',b.dataset.tableMode==='form');$$('[data-table-mode]',controls).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
 const select=$('select',controls);try{select.value=localStorage.getItem('jr70-places-'+current())||'0'}catch{};select.onchange=()=>{try{localStorage.setItem('jr70-places-'+current(),select.value)}catch{};paint()};
 function paint(){const n=+select.value;$$('tbody tr',table).forEach((r,i)=>{r.classList.toggle('jr70-qualified',i<n);r.classList.toggle('jr70-cutoff',n>0&&i===n-1)})}paint();}
 $$('.jr64-podium-card').forEach(card=>{const label=$('.jr64-teamcopy b',card)?.textContent,src=logo(label);if(!src||$('img.jr69-single-crest,img.jr70-podium-logo',card))return;const im=document.createElement('img');im.src=src;im.alt='Escudo '+label;im.className='jr69-single-crest';$('.jr64-teamcopy',card)?.before(im)});
}
// Observe only rebuilt table; batch updates and never replace existing views.
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;tableTools()})}
const tableView=$('#view-table');if(tableView)new MutationObserver(schedule).observe(tableView,{childList:true,subtree:true});
fetch('./data/official-live.json').then(r=>r.json()).then(d=>{data=d;schedule()}).catch(schedule);
})();
