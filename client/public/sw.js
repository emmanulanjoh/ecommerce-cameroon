const CACHE_NAME = 'findall-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('Cache addAll failed:', err);
          return Promise.resolve();
        });
      })
  );
});

// SSRF Protection: Allowed domains for fetch requests
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'your-production-domain.com', // Update with actual production domain
  'cloudfront.net',
  'amazonaws.com'
];

// Cached regex for performance optimization
const PRIVATE_IP_PATTERN = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.|::1)/;

// Function to validate URL against SSRF attacks
function isAllowedUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Block private IP ranges (cached regex for performance)
    const privateIpPattern = PRIVATE_IP_PATTERN.test(hostname);
    if (privateIpPattern || hostname === 'localhost' || hostname === '127.0.0.1') {
      return hostname === 'localhost' || hostname === '127.0.0.1';
    }
    
    // Allow only HTTPS in production
    if (urlObj.protocol !== 'https:' && !hostname.match(/^(localhost|127\.0\.0\.1)$/)) {
      return false;
    }
    
    // Exact domain matching to prevent subdomain attacks
    return ALLOWED_DOMAINS.some(domain => {
      return hostname === domain || hostname.endsWith('.' + domain.replace(/^https?:\/\//, ''));
    });
  } catch (e) {
    return false;
  }
}

// Fetch event with SSRF protection
self.addEventListener('fetch', event => {
  // Validate URL to prevent SSRF attacks
  if (!isAllowedUrl(event.request.url)) {
    console.warn('Blocked potentially malicious request:', event.request.url);
    event.respondWith(new Response('Request blocked for security', { status: 403 }));
    return;
  }
  
  // Skip caching for CloudFront images to avoid CSP issues
  if (event.request.url.includes('cloudfront.net')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[ServiceWorker] Cache hit:', event.request.url);
          return response;
        }
        console.log('[ServiceWorker] Cache miss, fetching:', event.request.url);
        return fetch(event.request);
      })
      .catch(err => {
        // Log network errors for debugging
        console.error('[ServiceWorker] Network request failed:', event.request.url, err.message || 'Unknown error');
        console.error('[ServiceWorker] Network request failed:', event.request.url);
        return new Response('Network error', { status: 408 });
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating service worker');
  console.log('[ServiceWorker] Activating service worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const deletePromises = cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          console.log(`[ServiceWorker] Deleting old cache: ${cacheName}`);
          return caches.delete(cacheName);
        }
      });
      return Promise.all(deletePromises);
    }).then(() => {
      console.log('[ServiceWorker] Service worker activated successfully');
    })
  );
});

// Push event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Findall!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Findall Sourcing', options)
  );
});

// Notification click event with origin verification
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Validate and construct secure URL
    const baseUrl = self.location.origin;
    const targetUrl = new URL('/', baseUrl).href;
    
    // Verify the URL is from allowed origin before opening
    if (isAllowedUrl(targetUrl)) {
      event.waitUntil(
        clients.openWindow(targetUrl)
      );
    } else {
      console.warn('Blocked cross-origin navigation:', targetUrl);
    }
  }
});

// Helper function to validate message origin
function isValidMessageOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_DOMAINS.some(domain => {
    try {
      const originUrl = new URL(origin);
      return originUrl.hostname.includes(domain);
    } catch (e) {
      return false;
    }
  });
}

// Message event with enhanced origin verification
self.addEventListener('message', event => {
  const isValidOrigin = isValidMessageOrigin(event.origin);
  
  if (!isValidOrigin) {
    console.warn('Message from unauthorized origin:', event.origin);
    return;
  }
  
  // Handle verified messages
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});