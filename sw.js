// Hub only: caches the home page so it opens offline. Every other path on this
// origin (the other apps) is left alone and handled by their own workers.
const CACHE='dp-hub-v1';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(['./','index.html','icons/icon-180.png','icons/icon-192.png'].map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  const mine=u.pathname==='/'||u.pathname==='/index.html'||u.pathname.startsWith('/icons/');
  if(!mine)return;
  e.respondWith(fetch(r).then(res=>{
    if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
