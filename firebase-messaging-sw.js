importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
  authDomain: "batrisi-medical-sahay.firebaseapp.com",
  projectId: "batrisi-medical-sahay",
  storageBucket: "batrisi-medical-sahay.firebasestorage.app",
  messagingSenderId: "632157918744",
  appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
});

const messaging = firebase.messaging();

// 🔔 YE LINE MOBILE POP-UP KE LIYE SABSE ZAROORI HAI
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received ', payload);
    
    const notificationTitle = payload.notification.title || "Naya Medical Update";
    const notificationOptions = {
        body: payload.notification.body || "Ek naya program add kiya gaya hai.",
        icon: './icon-192.png',
        badge: './icon-192.png',
        data: {
            url: "https://kirandesai3667-del.github.io/medical-report-app/"
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click par app kholne ke liye
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
