const sw = self;

sw.addEventListener('install', (event) => {
    event.waitUntil(sw.skipWaiting());
});

sw.addEventListener('activate', (event) => {
    event.waitUntil(sw.clients.claim());
});
