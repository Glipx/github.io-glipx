const CACHE_VERSION = 'glipx-v' + Date.now();
const CACHE_NAME = CACHE_VERSION;
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
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});

// Handle taps on local notifications — bring an existing tab to focus,
// or open a new one if Glipx isn't already open.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('github.io-glipx') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/github.io-glipx/');
      }
    })
  );
});
