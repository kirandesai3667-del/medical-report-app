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

// 2. 🔥 BACKGROUND MESSAGE HANDLER (Lock Screen popup fix)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background Message Received:', payload);

    const title = payload.data?.title || payload.notification?.title || 'Batrisi All In One';
    const body = payload.data?.body || payload.notification?.body || 'New Notification Received';

    const notificationOptions = {
        body: body,
        icon: 'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png',
        badge: 'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png',
        visibility: 'public',
        tag: 'batrisi-notification',
        renotify: true,
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        data: {
            url: self.location.origin + '/index.html'
        }
    };

    return self.registration.showNotification(title, notificationOptions);
});

// 3. 🔥 NOTIFICATION CLICK HANDLER
self.addEventListener('notificationclick', (event) => {
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

// 4. 🔥 PWA LIFECYCLE
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 🔥 CRITICAL FIX: TypeError (Failed to convert value to 'Response') solve karne ke liye
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((cachedResponse) => {
                // Agar cache me bhi nahi mila, toh ek naya empty Response bhejdo taki crash na ho
                return cachedResponse || new Response('Network error occurred', { status: 404 });
            });
        })
    );
});
