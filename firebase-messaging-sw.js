// ======================================================================
// FIREBASE MESSAGING SERVICE WORKER (BATRISI ALL IN ONE)
// ======================================================================

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
    authDomain: "batrisi-medical-sahay.firebaseapp.com",
    databaseURL: "https://batrisi-medical-sahay-default-rtdb.firebaseio.com",
    projectId: "batrisi-medical-sahay",
    storageBucket: "batrisi-medical-sahay.firebasestorage.app",
    messagingSenderId: "632157918744",
    appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 2. 🔥 BACKGROUND MESSAGE HANDLER (Lock Screen & Band App Fix)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background Message Received:', payload);

    const title = payload.data?.title || payload.notification?.title || 'Batrisi All In One';
    const body = payload.data?.body || payload.notification?.body || 'New Notification Received';

    const notificationOptions = {
        body: body,
        // ✅ FULL URLS FOR GITHUB PAGES COMPATIBILITY
        icon: 'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png',
        badge: 'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png',
        visibility: 'public', // Critical for Lock Screen
        tag: 'batrisi-notification',
        renotify: true,
        silent: false,
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        data: {
            url: self.location.origin + '/index.html'
        }
    };

    return self.registration.showNotification(title, notificationOptions);
});

// 3. 🔥 NOTIFICATION CLICK HANDLER (Focus or Open App)
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification Clicked.');
    event.notification.close();

    const urlToOpen = event.notification.data.url || self.location.origin + '/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// 4. 🔥 PWA INSTALL LIFECYCLE (Required for "Add to Home Screen")
// Install: Immediately activates the new service worker.
self.addEventListener('install', (event) => {
    console.log('[firebase-messaging-sw.js] Installing...');
    self.skipWaiting();
});

// Activate: Take control of all clients immediately.
self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Activating...');
    event.waitUntil(clients.claim());
});

// Fetch: REQUIRED by Chrome to show the Install Prompt.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// 5. AUTO-CLEANUP CACHE (Optional but helpful)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
