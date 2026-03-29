importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
  authDomain: "batrisi-medical-sahay.firebaseapp.com",
  projectId: "batrisi-medical-sahay",
  messagingSenderId: "632157918744",
  appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
});

const messaging = firebase.messaging();

// 🔔 Background notification handler (optimized) 
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'Batrisi Medical Sahay';
  const body = payload.notification?.body || payload.data?.body || '';

  const icon = payload.notification?.icon || payload.data?.icon || 
    'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png';

  return self.registration.showNotification(title, {
    body: body,
    icon: icon,
    badge: icon,
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || 'https://kirandesai3667-del.github.io/medical-report-app/',
      type: payload.data?.type || "general"
    }
  });
});

// 🔥 Notification click handler (BEST PRACTICE FIXED)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {

        // ✅ If app already open → focus same tab
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }

        // ✅ Else open new tab
        return clients.openWindow(url);
      })
  );
});