const cacheName = 'odiscom-staff-walk-shell-v1';
const shell = ['/sitewalk/scott-afb','/walk.js','/sitewalk-scott-afb.webmanifest'];
self.addEventListener('install', event => event.waitUntil((async()=>{
  const cache = await caches.open(cacheName);
  for(const path of shell){
    const response=await fetch(path,{redirect:'error'});
    if(!response.ok) throw Error('Sign in to save the offline checklist');
    await cache.put(path,response);
  }
})()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!shell.includes(url.pathname))return;
  event.respondWith(fetch(event.request).catch(()=>caches.match(url.pathname)));
});
