const CACHE_NAME = "v1";

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return fetch("./manifest.json")
                .then(function(response) {
                    return response.json();
                })
                .then(function(files) {
                    // Cache everything from the manifest except the sw itself
                    const urlsToCache = Object.values(files).filter(
                        (bundle) => !bundle.includes("sw.js") && !bundle.includes("sw_manifest.json")
                    );

                    return cache.addAll(urlsToCache);
                });
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            return fetch(event.request).then(function(response) {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }

                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var responseToCache = response.clone();

                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});

// Used to update file cached

self.addEventListener("activate", function(event) {
    var cacheWhitelist = ["v1"];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
