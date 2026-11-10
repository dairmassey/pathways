// Serves the decrypted prototype under demo/app/ from the cache the password screen fills.
// The same in every build: the password screen keeps only the latest build's cache.
'use strict';

const PREFIX = 'pathways-demo-';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || !url.href.startsWith(self.registration.scope)) return;

  event.respondWith((async () => {
    if (url.pathname.endsWith('/')) url.pathname += 'index.html';
    const name = (await caches.keys()).find(key => key.startsWith(PREFIX));
    const hit = name && await (await caches.open(name)).match(url.href, { ignoreSearch: true });
    if (hit) return hit;
    // Locked or missing: back to the password screen, which won't bounce straight back here
    if (event.request.mode === 'navigate') return Response.redirect(new URL('../#locked', self.registration.scope).href, 302);
    return new Response('Not found', { status: 404 });
  })());
});
