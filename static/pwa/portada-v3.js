/* Foto primero; video optimizado después de al menos tres segundos. */
(() => {
  const hero = document.getElementById('portada');
  const video = document.getElementById('portada-video');
  const toggle = document.getElementById('portada-pausa');
  const banner = document.getElementById('estado-conexion');
  const installButton = document.getElementById('instalar-app');
  const language = () => document.documentElement.lang || 'es';
  const labels = {
    es: ['Pausar video','Reproducir video','Instalar La Peña de Marito','Sin conexión: estás viendo información guardada. Confirmá precios y disponibilidad al reservar.'],
    en: ['Pause video','Play video','Install La Peña de Marito','Offline: showing saved information. Confirm prices and availability when booking.'],
    pt: ['Pausar vídeo','Reproduzir vídeo','Instalar La Peña de Marito','Sem conexão: informações salvas. Confirme preços e disponibilidade ao reservar.'],
    fr: ['Pause vidéo','Lire la vidéo','Installer La Peña de Marito','Hors ligne : informations enregistrées. Confirmez les prix et disponibilités lors de la réservation.']
  };
  function translate() {
    const t = labels[language()] || labels.es;
    toggle.textContent = t[video.paused ? 1 : 0];
    toggle.setAttribute('aria-label', toggle.textContent);
    installButton.textContent = t[2];
    banner.textContent = t[3];
  }
  let cachedPage = false;
  function showConnection() { banner.hidden = navigator.onLine && !cachedPage; translate(); }
  window.addEventListener('offline', showConnection);
  window.addEventListener('online', () => { cachedPage = false; showConnection(); if (typeof loadEverything === 'function') loadEverything(); });
  new MutationObserver(translate).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  showConnection();
  let installPrompt;
  window.addEventListener('beforeinstallprompt', e => {e.preventDefault();installPrompt=e;installButton.hidden=false;});
  installButton.addEventListener('click', async () => {
    if (!installPrompt) return;
    await installPrompt.prompt(); await installPrompt.userChoice;
    installPrompt=null; installButton.hidden=true;
  });
  window.addEventListener('appinstalled', () => {installButton.hidden=true;installPrompt=null;});
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data?.type === 'CACHED_PAGE') {cachedPage=true;showConnection();}
    });
    navigator.serviceWorker.register('/sw.js', {scope:'/',updateViaCache:'none'}).catch(console.warn);
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manualPause=false, inView=true, started=false;
  function syncPlayback() {
    if (!started) return;
    if (manualPause || !inView || document.hidden || reduced.matches) video.pause();
    else video.play().catch(() => {manualPause=true;toggle.hidden=false;translate();});
  }
  toggle.addEventListener('click', () => {manualPause=!manualPause;syncPlayback();translate();});
  video.addEventListener('play', translate);
  video.addEventListener('pause', translate);
  video.addEventListener('playing', () => {hero.classList.add('video-visible');toggle.hidden=false;});
  video.addEventListener('error', () => {hero.classList.remove('video-visible');toggle.hidden=true;});
  document.addEventListener('visibilitychange', syncPlayback);
  reduced.addEventListener('change', syncPlayback);
  new IntersectionObserver(entries => {inView=entries[0].isIntersecting;syncPlayback();}).observe(hero);
  // Carga completa del archivo optimizado: permite reutilizarlo sin problemas
  // de respuestas parciales (Range/206) en el almacenamiento del navegador.
  const initialPhoto = new Promise(resolve => setTimeout(resolve,3000));
  (async () => {
    if (reduced.matches || navigator.connection?.saveData) return;
    const controller=new AbortController();
    const timeout=setTimeout(() => controller.abort(), 45000);
    try {
      const response=await fetch(video.dataset.src,{cache:'force-cache',signal:controller.signal});
      if (!response.ok || !response.headers.get('Content-Type')?.startsWith('video/')) throw new Error('Video no disponible');
      if (Number(response.headers.get('Content-Length')) > 24*1024*1024) {controller.abort();throw new Error('Comprimir el video a menos de 24 MB');}
      const blob=await response.blob();
      if (blob.size > 24*1024*1024) throw new Error('Video demasiado grande');
      await initialPhoto;
      video.src=URL.createObjectURL(blob); video.muted=true; started=true; syncPlayback();
    } catch (error) {console.info('Se mantiene la foto de portada:',error.message);}
    finally {clearTimeout(timeout);}
  })();
})();

/* Aparición de secciones y tarjetas; admite contenido cargado por idioma. */
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const progress=document.getElementById('lectura-progreso');
  const nav=document.querySelector('.menu-nav');
  let ticking=false;
  function updateScroll() {
    const max=document.documentElement.scrollHeight-innerHeight;
    const fraction=max>0 ? Math.min(1,Math.max(0,scrollY/max)) : 0;
    progress.style.transform=`scaleX(${fraction})`;
    nav.classList.toggle('nav-elevada',nav.getBoundingClientRect().top<=1);
    ticking=false;
  }
  function schedule() {if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  updateScroll();
  if(!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const seen=new WeakSet();
  const animations=new Set();
  const selector='.contact-panel,.section-header,.daily-card,.dish-card,.daily-option';
  const observer=new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if(reduced.matches) return;
      const element=entry.target;
      const siblings=element.parentElement ? Array.from(element.parentElement.children) : [];
      const delay=element.matches('.dish-card,.daily-option') ? (Math.max(0,siblings.indexOf(element))%4)*45 : 0;
      const animation=element.animate([
        {opacity:0,transform:'translateY(20px)'},
        {opacity:1,transform:'translateY(0)'}
      ],{duration:560,delay,easing:'cubic-bezier(.2,.65,.25,1)',fill:'backwards'});
      animations.add(animation);
      animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
    });
  },{threshold:.06,rootMargin:'0px 0px -18px 0px'});
  function observeTree(root) {
    if(!(root instanceof Element)) return;
    const targets=[...(root.matches(selector)?[root]:[]),...root.querySelectorAll(selector)];
    targets.forEach(el => {if(!seen.has(el)){seen.add(el);observer.observe(el);}});
  }
  observeTree(document.body);
  const main=document.querySelector('.menu-page');
  new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(observeTree));
    schedule();
  }).observe(main,{childList:true,subtree:true});
  reduced.addEventListener('change',() => {if(reduced.matches) animations.forEach(animation=>animation.cancel());});
})();
