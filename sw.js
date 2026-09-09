const CACHE='liga-jr-v20';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./assets/v18-clubs.css?v=20','./assets/v18-clubs.js?v=20','./data/temporada-actual-v20.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>undefined))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
async function networkFirst(r){try{const x=await fetch(r,{cache:'no-store'});if(x&&x.ok){const c=await caches.open(CACHE);c.put(r,x.clone()).catch(()=>undefined)}return x}catch(e){return(await caches.match(r))||caches.match('./index.html')}}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html')){e.respondWith(networkFirst(e.request));return}e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(async y=>{if(y&&y.ok){const c=await caches.open(CACHE);c.put(e.request,y.clone()).catch(()=>undefined)}return y})))})
