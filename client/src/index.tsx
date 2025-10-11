import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[ServiceWorker] Registration successful');
        console.log(`[ServiceWorker] Scope: ${registration.scope}`);
        if (registration.installing) {
          console.log('[ServiceWorker] Installing new service worker');
        } else if (registration.waiting) {
          console.log('[ServiceWorker] New service worker waiting to activate');
        } else if (registration.active) {
          console.log('[ServiceWorker] Service worker is active');
        }
      })
      .catch(registrationError => {
        console.error('SW registration failed: ', (registrationError as any)?.message || 'Unknown error');
      });
  });
}