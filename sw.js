const CACHE_NAME = 'glipx-v1';
const ASSETS = [
  '/github.io-glipx/',
  '/github.io-glipx/index.html',
  '/github.io-glipx/manifest.json',
  '/github.io-glipx/icon-192.png',
  '/github.io-glipx/icon-512.png',
  '/github.io-glipx/screenshot-1.png',
  '/github.io-glipx/screenshot-2.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
