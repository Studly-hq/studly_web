// Force immediate unregistration and cache clearing
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((names) => {
            // Delete all caches
            return Promise.all(names.map((name) => caches.delete(name)));
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Pass all requests through to network (no caching)
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request));
});
