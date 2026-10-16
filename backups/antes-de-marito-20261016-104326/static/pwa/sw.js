const VERSION='20261006-v3';
const PREFIX='pena-marito-';
const PAGES=PREFIX+'pages-'+VERSION;
const ASSETS=PREFIX+'assets-'+VERSION;
const VIDEO=PREFIX+'video-'+VERSION;
const CORE=['/','/static/pwa/offline.html','/static/pwa/portada-v3.css','/static/pwa/portada-v3.js','/static/pwa/icon-192.png','/static/pwa/icon-512.png'];
const MENU=/^\/(?:menu_(?:es|en|pt|fr)|(?:menu-dia|entradas|regionales|tradicionales|pastas|postres)(?:_(?:en|pt|fr))?|entrees_fr)$/;
self.addEventListener('install',event => {
  event.waitUntil((async () => {const cache=await caches.open(ASSETS);await cache.addAll(CORE);await self.skipWaiting();})());
});
self.addEventListener('activate',event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if(name.startsWith(PREFIX) && ![PAGES,ASSETS,VIDEO].includes(name)) await caches.delete(name);
    await self.clients.claim();
  })());
});
async function save(cache,request,response,maxEntries) {
  try {
    await cache.put(request,response);
    const keys=(await cache.keys()).filter(key => !CORE.includes(new URL(key.url).pathname));
    for (const key of keys.slice(0,Math.max(0,keys.length-maxEntries))) await cache.delete(key);
  } catch (error) {console.info('No se pudo guardar este recurso',error.name);}
}
async function freshPage(event) {
  const cache=await caches.open(PAGES);
  try {
    const response=await fetch(event.request,{cache:'no-cache'});
    if (response.ok) await save(cache,event.request,response.clone(),40);
    if (response.status>=500) throw new Error('Servidor no disponible');
    return response;
  } catch (error) {
    const cached=await cache.match(event.request) || (new URL(event.request.url).pathname==='/' ? await (await caches.open(ASSETS)).match('/') : null);
    if (cached) {
      const client=await self.clients.get(event.clientId);
      client?.postMessage({type:'CACHED_PAGE'});
      return cached;
    }
    if (event.request.mode==='navigate') return (await caches.open(ASSETS)).match('/static/pwa/offline.html');
    return new Response('Sin conexión y sin copia guardada',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
}
self.addEventListener('fetch',event => {
  const request=event.request, url=new URL(request.url);
  if(request.method!=='GET' || url.origin!==self.location.origin) return;
  // Se deja el streaming de otros videos al servidor/navegador.
  if (request.headers.has('Range')) return;
  if(url.pathname==='/' || MENU.test(url.pathname)) {event.respondWith(freshPage(event));return;}
  if(url.pathname==='/static/videos/pena-portada-horizontal-v1.mp4') {
    event.respondWith((async () => {
      const cache=await caches.open(VIDEO), cached=await cache.match(request);
      if(cached) return cached;
      const response=await fetch(request);
      if(response.status===200 && response.headers.get('Content-Type')?.startsWith('video/')) {
        const length=Number(response.headers.get('Content-Length'));
        if(length>0 && length<=24*1024*1024) await save(cache,request,response.clone(),1);
      }
      return response;
    })());return;
  }
  if(!url.pathname.startsWith('/static/') || /\.(mp4|webm|mov|mp3|ogg)$/i.test(url.pathname)) return;
  if(!/\.(png|jpe?g|webp|gif|svg|ico|css|js|woff2?)$/i.test(url.pathname)) return;
  // Las imágenes se muestran desde caché y se verifican en segundo plano.
  // CORE tiene nombres versionados y permanece disponible sin red.
  const work=(async () => {
    const cache=await caches.open(ASSETS), cached=await cache.match(request);
    if(cached && CORE.includes(url.pathname)) return cached;
    const refresh=fetch(request,{cache:'no-cache'}).then(async response => {
      if(response.status===200) await save(cache,request,response.clone(),240);
      return response;
    });
    if(cached) {event.waitUntil(refresh.catch(()=>{}));return cached;}
    return refresh;
  })();
  event.respondWith(work);
});
