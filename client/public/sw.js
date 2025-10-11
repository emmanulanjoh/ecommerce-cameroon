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
  'https://hpqe2tck8u.us-east-1.awsapprunner.com', // Replace with your actual domain
  'cloudfront.net',
  'amazonaws.com'
];

// Function to validate URL against SSRF attacks
function isAllowedUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Extract hostname for validation
    const hostname = urlObj.hostname;
    
    // Allow only HTTPS in production (except localhost for dev)
    const isLocalhost = hostname.includes('localhost') || hostname === '127.0.0.1';
    const isHttps = urlObj.protocol === 'https:';
    
    if (!isHttps && !isLocalhost) {
      return false;
    }
    
    // Check against allowed domains
    return ALLOWED_DOMAINS.some(domain => hostname.includes(domain));
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
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for failed requests
        return new Response('Network error', { status: 408 });
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
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

// Message event with enhanced origin verification
self.addEventListener('message', event => {
  // Verify origin using the same domain validation as other functions
  const isValidOrigin = event.origin && ALLOWED_DOMAINS.some(domain => {
    try {
      const originUrl = new URL(event.origin);
      return originUrl.hostname.includes(domain);
    } catch (e) {
      return false;
    }
  });
  
  if (!isValidOrigin) {
    console.warn('Message from unauthorized origin:', event.origin);
    return;
  }
  
  // Handle verified messages
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});