// Nombre del caché. ¡Incrementa este número (v2, v3, etc.) 
// cada vez que hagas cambios importantes en el HTML o en los assets!
const CACHE_NAME = 'nande-pasantia-cache-v3'; 

// Lista de archivos para cachear. Asumimos que todo (CSS/JS) está en index.html,
// pero debemos incluir los recursos externos.
const urlsToCache = [
    'index.html', // Tu archivo principal
    '/', // Necesario para el root de la URL
    'logo_intro.png', 
    'logo_main.png', 
    'intro.mp4',
    // La librería externa, ¡es esencial!
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js' 
];

// Evento de Instalación (guarda los archivos iniciales en caché)
self.addEventListener('install', event => {
    // Forzar la activación del nuevo Service Worker inmediatamente
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Service Worker: Falló el cacheo de archivos. Verifica nombres y rutas.', err);
            })
    );
});

// Evento de Fetch (sirve los archivos desde caché)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                // Estrategia: Cache, luego Network (sirve la caché si existe)
                if (response) {
                    return response;
                }
                // Si no está en caché, va a la red
                return fetch(event.request);
            })
            .catch(() => {
                // Esto maneja el caso de URLs externas que fallan (ej: CDN offline)
                // Si la red falla y no hay caché, puedes devolver una página de error si existiera.
                return new Response('No se puede conectar. Intenta de nuevo cuando estés en línea.');
            })
    );
});

// Evento de Activación (limpia cachés viejos)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché viejo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
