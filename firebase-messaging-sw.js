importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Firebase init
firebase.initializeApp({
  apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
  projectId: "batrisi-medical-sahay",
  messagingSenderId: "632157918744",
  appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
});

const messaging = firebase.messaging();


// 🔔 BACKGROUND NOTIFICATION (MAIN FIX)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message:', payload);

  const title = payload.notification?.title || payload.data?.title || "Batrisi Medical Sahay";
  const body = payload.notification?.body || payload.data?.body || "";

  const options = {
    body: body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/'
    }
  };

  self.registration.showNotification(title, options);
});


// 🔥 CLICK HANDLER (STABLE)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {

        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }

        return clients.openWindow(targetUrl);
      })
  );
});
