import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache all assets generated by your build process
precacheAndRoute(self.__WB_MANIFEST);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache API responses with a Network First strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Handle offline fallback
self.addEventListener('install', (event) => {
  const offlinePage = new Response(
    '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
  event.waitUntil(
    caches.open('offline').then((cache) => cache.put('/offline.html', offlinePage))
  );
});