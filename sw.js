const CACHE='liga-jr-v27';
const CORE=[
  './','./index.html','./manifest.webmanifest','./icon.svg',
  './assets/v18-clubs.css?v=22','./assets/v18-clubs.js?v=22',
  './assets/v21-functional.js?v=22','./assets/v22-functional.css?v=22','./assets/v22-functional.js?v=22',
  './assets/v23-open-source.css?v=23','./assets/v23-open-source.js?v=23',
  './assets/v24-performance.css?v=24','./assets/v24-performance.js?v=24',
  './assets/v25-ambitious.css?v=25.0','./assets/v25-ambitious.js?v=25.0',
  './assets/v26-fix-buttons.css?v=26.0','./assets/v26-fix-buttons.js?v=26.0',
  './assets/v27-intelligent.css?v=27.0','./assets/v27-intelligent.js?v=27.0',
  './media/gran-final-veteranos-35.png',
  './docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf'
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>undefined))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
async function networkFirst(req){try{const r=await fetch(req,{cache:'no-store'});if(r&&r.ok){const c=await caches.open(CACHE);c.put(req,r.clone()).catch(()=>undefined)}return r}catch(e){return(await caches.match(req))||caches.match('./index.html')}}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html')){e.respondWith(networkFirst(e.request));return}e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)))});
