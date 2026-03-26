importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// 1. Firebase Configuration (Same as your index.html)
const firebaseConfig = {
    apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
    authDomain: "batrisi-medical-sahay.firebaseapp.com",
    projectId: "batrisi-medical-sahay",
    storageBucket: "batrisi-medical-sahay.firebasestorage.app",
    messagingSenderId: "632157918744",
    appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 2. Background Message Handler
// Jab mobile lock ho ya app band ho, tab ye function notification dikhayega
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received: ', payload);

    const notificationTitle = payload.notification.title || "Batrisi Medical Sahay";
    const notificationOptions = {
        body: payload.notification.body || "Naya update aaya hai!",
        icon: 'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png',
        badge: 'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png',
        tag: 'batrisi-notification', // Same tag prevents multiple duplicate notifications
        renotify: true,
        data: {
            url: 'https://kirandesai3667-del.github.io/medical-report-app/'
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. Notification Click Logic
// Jab user notification par click karega, toh app khul jayegi
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
