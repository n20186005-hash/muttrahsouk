// دليل سوق مطرح — Service Worker
// استراتيجية: الشبكة أولاً مع ذاكرة تخزين مؤقت وبديل غير متصل للصفحة الرئيسية.
const CACHE_NAME = 'muttrah-souq-v1';
const CORE_ASSETS = [
  '/',
  '/site.webmanifest',
  '/icons/favicon.svg',
  '/icons/favicon-32.png',
  '/icons/favicon-16.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  // لا نتعامل مع الطلبات غير http(s) (مثل chrome-extension).
  const url = new URL(request.url);
  if (!/^https?:$/.test(url.protocol)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((hit) => {
          if (hit) return hit;
          // ملاحة غير متصلة: عرض الصفحة الرئيسية المخزنة إن أمكن.
          if (request.mode === 'navigate') return caches.match('/');
          return new Response('', { status: 408, statusText: 'Request Timeout' });
        })
      )
  );
});
