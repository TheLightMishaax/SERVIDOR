const CACHE_NAME = "v3";
const urlsToCache = [
  "/",
  "/indexconsoporte.html",
  "/manifest.json",
  "/offline.html",  // Agrega esta línea
  "/icon-192x192.png",
  "/icon-512x512.png",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve la respuesta desde el cache si existe
      if (response) {
        return response;
      }
      
      // Intenta obtenerla desde la red, y si falla, muestra offline.html
      return fetch(event.request).catch(() => {
        return caches.match("/offline.html"); // Asegúrate de tener este archivo en el cache
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
