importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
    authDomain: "batrisi-medical-sahay.firebaseapp.com",
    databaseURL: "https://batrisi-medical-sahay-default-rtdb.firebaseio.com",
    projectId: "batrisi-medical-sahay",
    storageBucket: "batrisi-medical-sahay.firebasestorage.app",
    messagingSenderId: "632157918744",
    appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Background message received:', payload);
    
    const title = payload.data?.title || payload.notification?.title || 'Batrisi All In One';
    const body = payload.data?.body || payload.notification?.body || 'New notification';

    const options = {
        body: body,
        icon: '/medical-report-app/icon-192x192.png',
        badge: '/medical-report-app/icon-192x192.png',
        
        // 🔓 LOCK SCREEN KE LIYE YE ZAROORI HAI
        visibility: 'public',
        tag: 'batrisi-notification',
        renotify: true,
        silent: false,
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        
        data: {
            url: self.location.origin + '/medical-report-app/'
        }
    };

    return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.indexOf(targetUrl) !== -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});