const CACHE='liga-jr-v18';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./assets/v18-clubs.css?v=18','./assets/v18-clubs.js?v=18'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).catch(()=>undefined));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put(request,response.clone()).catch(()=>undefined);
    }
    return response;
  }catch(e){
    return (await caches.match(request)) || caches.match('./index.html');
  }
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(event.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html')){
    event.respondWith(networkFirst(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(async response=>{
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put(event.request,response.clone()).catch(()=>undefined);
    }
    return response;
  })));
});
