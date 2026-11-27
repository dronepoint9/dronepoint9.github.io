// Cider Field Guide: caches its own folder so the guide opens on site with no signal,
// plus any aerial imagery tiles viewed or saved for offline.
// Network-first so a fresh copy is used whenever there is a connection.
const CACHE='dp-cider-guide-v1';
const PRE=['./','index.html','cider-solar.kml','../icons/icon-180.png','../icons/icon-192.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PRE.map(u=>c.add(new Request(u,{cache:'no-cache'})).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('dp-cider-guide-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
const TILES='dp-cider-tiles-v1';
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  // NYS orthoimagery tiles: cache-first, they never change for a given year
  if(r.method==='GET'&&u.hostname==='orthos.its.ny.gov'&&u.pathname.includes('/MapServer/tile/')){
    e.respondWith(caches.open(TILES).then(c=>c.match(r.url).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r.url,res.clone());return res}))));
    return;
  }
  if(r.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith('/cider-guide/'))return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{
    if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));}
    return res;
  }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
