/* V38.68 — logos completos, forma reciente y movimiento de borde para Tabla. */
(()=>{'use strict';
if(window.__JR68_TABLE_MOTION)return;window.__JR68_TABLE_MOTION=true;
const BUILD='38-68-r1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const META={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
const BYNAME=Object.fromEntries(Object.entries(META).map(([id,n])=>[norm(n),id]));
let data={categories:{},team_logos:{}};
let dataLogoMap=new Map();
const LOGOS={
 'boavista':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_qiq0dy','boavista fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_qiq0dy',
 'manchester':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/ManchesterU_zltkh0','toros de cuenda':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/TorosCuenda_od8vcf',
 'la esperanza':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaEsperanzaFC_vazya7','dynamo':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dinamo_rgamvy',
 'terricolas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Terricolas_ltbrzy','franco fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoFC_vtd8d7',
 'herreras fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/HerreraFC_mnmlsd','linces':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c',
 'juventus':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_ntqr0b','hermanos':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Hermanos_kbfrmh',
 'san jose fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseMonta%C3%B1a_ilen4d','lobos cdg':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Lobos_efloib',
 'napoli':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv','abejas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Abejas_lxn6l9',
 'dep nopalero':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Nopalero_skdsij','dep zapata':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dep.Zapata_a5dsaz',
 'san juan fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJuanFC_jhprtf','tapatio':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/tapatio_svt6lz',
 'san antonio fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanAntonioFC_tw7bi1','celticos':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CelticosFC_nv4ukd',
 'san julian':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJulianFC_wetv0z','dep la luz':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/DepLaLuz_wibidf',
 'tavera fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/TaveraFC_gpdbhg','pachangas fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Pachangas_upqelg',
 'san jose jrs':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseJR_dio2dt','barza':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Barcelona_amoaiq',
 'mazacotes fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Mazacotes_ko8o0w','dep maravillas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/MAravillasFC_mnmhwx',
 'populares':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PopularesFC_onellt','promesas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PromesasFC_w4lwk8','promesas fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PromesasFC_w4lwk8',
 'capibaras':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Capibara_vocmbl','la cuadrilla':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CuadrillaFC_vpfbtr',
 'la canchita deportes':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaCanchita_enf6ca','galeana':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Galeana_kujrh0',
 'aldama fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Aldama_mqm3r1','malvinas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Malvinas_wdiwk9',
 'osasuna':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Osasuna_lv6rsa','san antonio jrs':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanAntonioJR_jzmfka',
 'la huerta':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaHuertaCuenda_bm4fxj',
 'c de gasca':'./assets/teams/deportivo-cg.webp','cerrito de gasca':'./assets/teams/deportivo-cg.webp','cuenda':'./assets/teams/tc-cuenda.webp','pozos fc':'./assets/teams/pozos-fc.webp',
 'psv':'./assets/teams/psv.webp','a santiago':'./assets/teams/atletico-santiago.webp','f tavera':'./assets/teams/franco-tavera-jr-veteranos.webp','america':'./assets/branding/america-veteranos-35-user.png','huracan':'./assets/teams/huracan.webp'
};
function currentId(){
 try{const raw=String(localStorage.getItem('jrCategory')||'').trim();if(/^\d+$/.test(raw)&&META[raw])return raw;const id=BYNAME[norm(raw)];if(id)return id}catch(_){}
 const a=$('#jr53TopCategoryHost [data-category][aria-pressed="true"],#jr53TopCategoryHost [data-category].active,#categoryBar [data-category].active');
 if(a){const raw=String(a.dataset.category||a.textContent||'').trim();if(/^\d+$/.test(raw)&&META[raw])return raw;const id=BYNAME[norm(raw)];if(id)return id}
 return '2';
}
function rebuildLogoMap(){dataLogoMap=new Map();Object.entries(data?.team_logos||{}).forEach(([k,v])=>{const src=typeof v==='string'?v:(v?.local||v?.source||'');if(src)dataLogoMap.set(norm(k),src)})}
function logoFor(name){return dataLogoMap.get(norm(name))||LOGOS[norm(name)]||''}
function resolved(src){return src&&src.startsWith('.')?src+'?v='+BUILD:src}
function setImg(img,name,src){if(!img||!src)return;const want=resolved(src);if((img.getAttribute('src')||'')!==want)img.src=want;img.alt='Escudo '+name;img.loading='lazy';img.decoding='async'}
function ensureTeamLogo(wrap,name){const src=logoFor(name);if(!wrap||!src)return;let img=$('img.jr64-crest',wrap);if(!img){img=document.createElement('img');img.className='jr64-crest';const old=$('.jr64-crest',wrap);old?.remove();wrap.prepend(img)}setImg(img,name,src)}
function fixtureForms(id){
 const by=new Map(),c=data?.categories?.[id];
 for(const block of (c?.fixtures||[])){
  const hs=(block?.headers||[]).map(norm),hi=hs.findIndex(x=>x==='local'),ai=hs.findIndex(x=>x==='visitante'),gis=hs.map((x,i)=>x==='goles'?i:-1).filter(i=>i>=0);
  if(hi<0||ai<0||gis.length<2)continue;
  for(const r of (block.rows||[])){
   const home=String(r?.[hi]??'').trim(),away=String(r?.[ai]??'').trim(),hg0=String(r?.[gis[0]]??'').trim(),ag0=String(r?.[gis[1]]??'').trim();
   const num=x=>/^\d+$/.test(x),goal=x=>x==='-'||num(x);if(!home||!away||!goal(hg0)||!goal(ag0)||(!num(hg0)&&!num(ag0)))continue;
   const hg=hg0==='-'?0:Number(hg0),ag=ag0==='-'?0:Number(ag0);const hr=hg>ag?'G':hg<ag?'P':'E',ar=hg>ag?'P':hg<ag?'G':'E';
   const push=(team,res)=>{const k=norm(team),xs=by.get(k)||[];xs.push(res);if(xs.length>5)xs.shift();by.set(k,xs)};push(home,hr);push(away,ar);
  }
 }
 return by;
}
function formHtml(xs){return xs?.length?`<span class="jr64-form jr68-form">${xs.map(x=>`<i class="${x==='G'?'g':x==='P'?'p':'e'}" title="${x==='G'?'Ganado':x==='P'?'Perdido':'Empatado'}">${x}</i>`).join('')}</span>`:''}
function fixTable(){
 const id=currentId(),forms=fixtureForms(id);
 $$('#view-table .jr64-table tbody tr').forEach(tr=>{const cells=tr.children;if(cells.length<11)return;const name=$('b',cells[1])?.textContent?.trim()||'';if(!name)return;ensureTeamLogo($('.jr64-team',cells[1]),name);const xs=forms.get(norm(name));if(xs?.length)cells[9].innerHTML=formHtml(xs)});
 $$('#view-table .jr64-podium-card').forEach(card=>{const name=$('.jr64-teamcopy b',card)?.textContent?.trim()||'';const src=logoFor(name);if(!src)return;let img=$('img.jr67-podium-crest,img.jr64-crest',card);if(!img){img=document.createElement('img');img.className='jr64-crest jr67-podium-crest';$('.jr64-rank',card)?.insertAdjacentElement('afterend',img)}setImg(img,name,src)});
 $$('#view-stats .jr64-performance article').forEach(card=>{const name=$('.jr64-performance-copy b',card)?.textContent?.trim()||'';const src=logoFor(name);if(!src)return;let wrap=$('.jr67-performance-crest',card),img=wrap&&$('img',wrap);if(!wrap){wrap=document.createElement('span');wrap.className='jr67-performance-crest';img=document.createElement('img');img.className='jr64-crest';wrap.append(img);const copy=$('.jr64-performance-copy',card);if(copy)card.insertBefore(wrap,copy)}setImg(img,name,src)});
}
function installHeroFX(){
 const hero=$('#view-table .jr64-hero.table');if(!hero)return;
 if(!$('.jr68-edge-dots',hero)){const dots=document.createElement('span');dots.className='jr68-edge-dots';dots.setAttribute('aria-hidden','true');dots.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><i></i>';hero.append(dots)}
 if(!$('.jr68-radar',hero)){const radar=document.createElement('span');radar.className='jr68-radar';radar.setAttribute('aria-hidden','true');radar.innerHTML='<i></i><i></i><b></b>';hero.append(radar)}
}
function polish(){fixTable();installHeroFX()}
let timer=0;function later(ms=100){clearTimeout(timer);timer=setTimeout(polish,ms)}
function start(){polish();[250,800,1800,3600].forEach(t=>setTimeout(polish,t));document.addEventListener('click',e=>{if(e.target.closest('#categoryBar [data-category],#jr53TopCategoryHost [data-category]')){[100,300,800].forEach(t=>setTimeout(polish,t))}},true);addEventListener('hashchange',()=>later(120));addEventListener('pageshow',()=>later(120))}
fetch('./data/official-live.json?restore68='+BUILD,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{data=d||data;rebuildLogoMap();start()}).catch(()=>start());
window.JRRestore68={build:BUILD,refresh:polish,logoFor};
})();
