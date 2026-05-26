// CCTV Verify — Service Worker v1.0
// Cache app shell for offline use; time sync still requires network.
// Tesseract.js is loaded from CDN and browser-cached separately.

const CACHE = 'cctv-verify-v1.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // NEVER cache time-sync or API requests
  const isNoCache =
    url.hostname.includes('cloudflare.com') ||
    url.hostname.includes('worldtimeapi.org') ||
    url.hostname.includes('timeapi.io') ||
    url.hostname.includes('anthropic.com');

  if (isNoCache) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }

  // Tesseract CDN: cache-first (för offline-fallback)
  if (url.hostname.includes('jsdelivr.net') || url.hostname.includes('tessdata')) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        try {
          const res = await fetch(e.request);
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        } catch (err) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // App shell: cache-first
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
