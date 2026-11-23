// Topkapi Leads — Service Worker
// بيخلّي السيستم يتنزّل كتطبيق على الموبايل (من غير Play Store) وبيفتح الواجهة بسرعة.
// الداتا نفسها مش بتتخزن هنا — بتيجي من السيستم (Apps Script) زي ما هي.
const CACHE = 'tk-shell-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// صفحات الموقع نفسه بس: من النت الأول، ولو مفيش نت من النسخة المحفوظة
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
