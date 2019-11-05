const filesToCache = [
    '/',
    'style/main.css',
    'images/still_life_medium.jpg',
    'index.html',
    'pages/offline.html',
    'pages/404.html'
  ];
  
const staticCacheName = 'pages-cache-v1';
  

self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');

    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )

    self.skipWaiting();
})

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    //console.log('Fetch request ', event.request);

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if(response){
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }

                console.log('Network request for ', event.request.url);
                return fetch(event.request)
                        .then(response => {
                            // TODO 5 - Respond with custom 404 page 
                            if(response.status == 404){
                                //throw Error(response.statusText);
                                return caches.match('pages/404.html')
                            }

                            return caches.open(staticCacheName)
                                .then(cache => {
                                    cache.put(event.request.url, response.clone());
                                    return response;
                                });
                        })

          
            }).catch(error => {
                console.log('Error, ', error);
                return caches.match('pages/offline.html')

            })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating new service worker...');

    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            console.log({cacheNames});
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
});