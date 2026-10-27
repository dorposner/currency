// Kesher Money (https://money.kesher.me) — Service Worker 2.0
// Offline-first PWA caching & resilient fallback engine

const CACHE_NAME = 'kesher-money-v2.1.0';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.png',
    './apple-touch-icon.png',
    './icon-192.png',
    './icon-512.png'
];

// Fallback seed rates for emergency airplane/jungle mode
const EMERGENCY_RATES = {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "ILS": 3.72,
    "JPY": 154.5,
    "THB": 36.8,
    "CRC": 515.0,
    "MXN": 19.8,
    "CAD": 1.38,
    "AUD": 1.52,
    "CHF": 0.88,
    "ARS": 1240.0,
    "BRL": 5.65,
    "COP": 4320.0,
    "PEN": 3.75,
    "VND": 25300.0,
    "IDR": 15800.0,
    "INR": 84.1,
    "TRY": 34.3,
    "ZAR": 17.6,
    "AED": 3.67,
    "SGD": 1.32,
    "PHP": 58.2,
    "MYR": 4.43,
    "CLP": 950.0,
    "EGP": 48.5,
    "CZK": 23.4,
    "HUF": 372.0,
    "PLN": 4.02,
    "SEK": 10.6,
    "NOK": 10.9,
    "DKK": 6.87,
    "NZD": 1.66,
    "GEL": 2.73
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. Handle Exchange Rate API Requests with Cache-Fallback and Emergency Baseline
    if (url.hostname.includes('er-api.com') || 
        url.hostname.includes('currency-api') || 
        url.hostname.includes('frankfurter.app')) {
        
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    // Try to retrieve cached rates
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Return synthetic emergency rate JSON if completely offline on first launch
                    const emergencyPayload = {
                        result: "success",
                        provider: "offline-emergency-seed",
                        time_last_update_utc: new Date().toUTCString(),
                        time_last_update_unix: Math.floor(Date.now() / 1000),
                        base_code: "USD",
                        rates: EMERGENCY_RATES
                    };
                    return new Response(JSON.stringify(emergencyPayload), {
                        headers: { "Content-Type": "application/json" }
                    });
                })
        );
        return;
    }

    // 2. Handle Local Country Flags & FlagCDN (Cache-First)
    if (url.pathname.includes('/flags/') || url.hostname.includes('flagcdn.com')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                }).catch(() => cachedResponse);
            })
        );
        return;
    }

    // 3. Handle CDN Scripts (Tailwind, Chart.js, Google Fonts) with Stale-While-Revalidate
    if (url.hostname.includes('cdn.tailwindcss.com') || 
        url.hostname.includes('cdn.jsdelivr.net') || 
        url.hostname.includes('fonts.googleapis.com') || 
        url.hostname.includes('fonts.gstatic.com')) {
        
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                }).catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // 3. App Shell & Static Assets: Stale-While-Revalidate
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return networkResponse;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });

            return cachedResponse || fetchPromise;
        })
    );
});
