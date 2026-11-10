// Serves the decrypted prototype under demo/app/ from the cache the password screen fills.
// Each build gets its own cache name, so a new deploy sends visitors back to the password screen.
'use strict';

const CACHE = 'pathways-demo-420c4c641af0';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || !url.href.startsWith(self.registration.scope)) return;

  event.respondWith((async () => {
    if (url.pathname.endsWith('/')) url.pathname += 'index.html';
    const cache = await caches.open(CACHE);
    const hit = await cache.match(url.href, { ignoreSearch: true });
    if (hit) return hit;
    if (event.request.mode === 'navigate') return Response.redirect(new URL('../', self.registration.scope).href, 302);
    return new Response('Not found', { status: 404 });
  })());
});
