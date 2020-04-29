const CACHE_NAME = 'password-generator-cache'
const urlsToCache = [
    '/',
    '/css/style.css',
    '/js/passwd.js'
]
const urlsToCacheFirst = [
    '/css/style.css',
    '/js/passwd.js'
]

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Opened cache')
            return cache.addAll(urlsToCache)
        })
    )
})

self.addEventListener('fetch', function(event) {
    let networkFirst = true
    for(let path in urlsToCacheFirst) {
        if(event.request.url.indexOf(path) !== -1) {
            networkFirst = false
            break
        }
    }
    if(networkFirst) {
        event.respondWith(networkFirst(event))
    } else {
        event.respondWith(cacheFirst(event))
    }
})

// cache-first strategy
function cacheFirst(event) {
    return caches.match(event.request)
        .then(function(response) {
            if(response) {
                return response
            }
        
            return fetch(event.request).then(
                function(response) {
                    if( !response || response.status !== 200 || response.type !== 'basic' ) {
                        return response
                    }
        
                    saveToCache(event, response)
        
                    return response
                }
            )
        })
}

// network-first strategy
function networkFirst(event) {
    return fetch(event.request).then(
        function(response) {
            if( !response || response.status !== 200 ) {
                caches.match(event.request)
                    .then(function(response) {
                        if(response) {
                            return response
                        }
                    })
            }

            saveToCache(event, response)

            return response
        }
    )
}

function saveToCache(event, response) {
    const responseToCache = response.clone()
        
    caches.open(CACHE_NAME)
        .then(function(cache) {
            cache.delete(event.request, {ignoreSearch: true}).then(function(found) {
                console.log('cache entry was deleted.', found)
            })
            cache.put(event.request, responseToCache)
        })
}

