importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Firebase Config (Same as index.html)
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

// Background Message Handler
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const title = payload.data?.title || payload.notification?.title || 'Batrisi All In One';
    const body = payload.data?.body || payload.notification?.body || 'New notification received';

    const notificationOptions = {
        body: body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        visibility: 'public',
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

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.');
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

// ======================================================================
// 🚀 PWA INSTALL FIX: PWA ke liye Fetch aur Install events zaroori hain
// ======================================================================

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Immediately activate the new service worker
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Chrome requires a fetch event listener to show the "Add to Home Screen" prompt
self.addEventListener('fetch', (event) => {
    // Basic pass-through fetch. It just lets the network request happen normally.
    event.respondWith(fetch(event.request).catch(() => {
        // Agar net band ho, to app crash hone ke bajay purana page load kare
        return caches.match(event.request); 
    }));
});