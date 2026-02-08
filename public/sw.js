// Service Worker for caching and offline support
const CACHE_NAME = 'sunlight-school-v1.0.0';
const STATIC_CACHE = 'sunlight-static-v1.0.0';
const DYNAMIC_CACHE = 'sunlight-dynamic-v1.0.0';
const API_CACHE = 'sunlight-api-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/dashboard/salary',
  '/dashboard/students',
  '/dashboard/teachers',
  '/manifest.json',
  '/favicon.ico',
  // Add your CSS and JS files here when built
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/teachers',
  '/api/students',
  '/api/salaries',
  '/api/salaries/statistics',
  '/api/salaries/helpers',
  '/api/notices',
  '/api/fees',
  '/api/expenses',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Pre-cache critical API data
      caches.open(API_CACHE).then((cache) => {
        console.log('[Service Worker] Pre-caching API endpoints');
        return Promise.all(
          API_ENDPOINTS.map(endpoint => {
            return fetch(`${self.location.origin}${endpoint}`)
              .then(response => {
                if (response.ok) {
                  cache.put(`${self.location.origin}${endpoint}`, response.clone());
                }
              })
              .catch(() => {
                // Ignore fetch errors during install
              });
          })
        );
      })
    ]).then(() => {
      console.log('[Service Worker] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname) || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default: network first for other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request);
      })
  );
});

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  try {
    // Try cache first for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Return cached response and update in background
        fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {
          // Ignore network errors
        });
        return cachedResponse;
      }
    }

    // Network request
    const networkResponse = await fetch(request);
    if (networkResponse.ok && request.method === 'GET') {
      const responseClone = networkResponse.clone();
      caches.open(API_CACHE).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] API request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        success: false,
        message: 'You are offline. Please check your internet connection.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      caches.open(STATIC_CACHE).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Static asset fetch failed:', error);
    // Return a basic offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      return networkResponse;
    }
  } catch (error) {
    // Try cache for navigation
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return caches.match('/offline.html') || new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Sunlight School</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #ef4444; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>You are offline</h1>
          <p>Please check your internet connection and try again.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  console.log('[Service Worker] Performing background sync');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: data.data
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});