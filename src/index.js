import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { cacheRestore } from './utils/cache';
import './index.css';
// Required by Lenis. Global CSS can only be imported here, not from a component.
// Everything in it is scoped to the `lenis` class Lenis puts on <html> while it
// is running, so it is inert until the smooth scroll hook mounts.
import 'lenis/dist/lenis.css';
import App from './App';

// Warm in-memory cache from previous session before any fetches
(function warmCache() {
    try {
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k && k.startsWith('studly_cache_')) {
                cacheRestore(k.replace('studly_cache_', ''));
            }
        }
    } catch {}
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Register Service Worker for PWA install support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}