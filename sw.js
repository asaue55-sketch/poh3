// Офлайн-кэш. После изменения файлов увеличьте VERSION, чтобы телефоны подхватили обновление.
var VERSION = 'uroki-v2';
var FILES = ['./', 'index.html', 'style.css', 'app.js', 'schedule.js', 'manifest.webmanifest',
  'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'katex/katex.min.css', 'fonts/fonts.css', 'fonts/nunito-cyrillic.woff2', 'fonts/nunito-latin.woff2', 'fonts/lobster-cyrillic.woff2', 'fonts/marckscript-cyrillic.woff2',
  'data/f7.json', 'data/f8.json', 'data/f9.json', 'data/h7.json', 'data/h8.json', 'data/h9.json'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// Сначала сеть (свежая версия), без сети — из кэша.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok) { var copy = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); }); }
    return r;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
  }));
});
