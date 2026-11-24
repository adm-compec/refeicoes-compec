// Guarda as telas do app no celular para abrir sem sinal.
const VERSAO = 'rc-v2';
const ARQUIVOS = ['./', './index.html', './config.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // servidor do Google: sempre pela rede
  // tenta a rede (pega atualizações); sem sinal, usa a cópia guardada
  e.respondWith(
    fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSAO).then(ca => ca.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
