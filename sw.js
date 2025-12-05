// Nombre del caché
const CACHE_NAME = 'nande-pasantia-cache-v1';

// Lista de archivos que queremos cachear. 
// ASEGÚRATE de que estos nombres de archivo sean correctos.
const urlsToCache = [
    'index.html', 
    'logo_intro.png', 
    'logo_main.png', 
    'intro.mp4' 
    // Asegúrate de incluir todos los archivos importantes que la app necesita.
];

// Evento de Instalación (guarda los archivos iniciales en caché)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Service Worker: Falló el cacheo de archivos', err);
            })
    );
});

// Evento de Fetch (sirve los archivos desde caché)
self.addEventListener('fetch', event => {
    // Intercepta todas las solicitudes
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el archivo está en caché, lo devuelve
                if (response) {
                    return response;
                }
                // Si no está en caché, intenta ir a la red (comportamiento normal)
                return fetch(event.request);
            })
    );
});

// Evento de Activación (limpia cachés viejos si cambias el nombre/versión del CACHE_NAME)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Eliminando caché viejo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
ce Worker: Eliminando caché viejo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
