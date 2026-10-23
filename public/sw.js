// Retain offline static assets without replaying stale live forecasts or another route's HTML.
const CACHE_NAME='muttrah-static-v2';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('muttrah')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const r=event.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin||r.mode==='navigate'||!/^\/(?:_astro|images|icons)\//.test(u.pathname))return;
 event.respondWith(fetch(r).then(response=>{if(response.ok)void caches.open(CACHE_NAME).then(c=>c.put(r,response.clone())).catch(()=>{});return response;}).catch(async()=>await caches.match(r)||new Response('',{status:503})));
});
