// install service worker
self.addEventListener('install', event => {
    console.log('service worker installing ...');
    self.skipWaiting();
});

// activate service worker 
self.addEventListener('activate', event => {
    console.log('service worker activating ...')
});

self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
});
