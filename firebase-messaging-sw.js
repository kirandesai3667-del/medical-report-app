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

// 🔔 Background notification handler (FINAL OPTIMIZED)
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'Batrisi Medical Sahay';
  const body = payload.notification?.body || payload.data?.body || '';

  const icon = payload.notification?.icon || payload.data?.icon || '/icon-192.png';

  return self.registration.showNotification(title, {
    body,
    icon,
    badge: icon,
    vibrate: [200, 100, 200],
    tag: payload.data?.tag || "default", // ✅ duplicate control
    renotify: true, // ✅ same tag pe update karega
    data: {
      url: payload.data?.url || '/',
      type: payload.data?.type || "general"
    }
  });
});

// 🔥 Notification click handler (ADVANCED FIXED)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {

        // ✅ If already open → focus
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }

        // ✅ Else open new
        return clients.openWindow(url);
      })
  );
});

// 🔥 OPTIONAL (BEST UX) → auto close old notifications
self.addEventListener('push', (event) => {
  self.registration.getNotifications().then(notifications => {
    notifications.forEach(n => n.close());
  });
});