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
    // 1. Data-Only payload se title aur body extract karein
    const title = payload.data?.title || 'Batrisi All In One';
    const body = payload.data?.body || 'You have a new update';
    
    // 2. Notification options (Ensure icon exists in your repo)
    const options = {
        body: body,
        icon: self.location.origin + '/medical-report-app/icon-192x192.png',
        badge: self.location.origin + '/medical-report-app/icon-192x192.png',
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
    
    // Default URL par redirect karein
    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Agar app already khuli hai, toh use focus karo
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.indexOf(targetUrl) !== -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // Agar app band hai, toh open karo
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
