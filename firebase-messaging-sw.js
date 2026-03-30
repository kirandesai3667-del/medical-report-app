importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// 🔥 Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
  projectId: "batrisi-medical-sahay",
  messagingSenderId: "632157918744",
  appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
});

const messaging = firebase.messaging();


// 🔔 ✅ BACKGROUND NOTIFICATION HANDLER (MOST IMPORTANT)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);

  const title = payload.notification?.title || payload.data?.title || "Batrisi Medical Sahay";
  const body = payload.notification?.body || payload.data?.body || "";

  const options = {
    body: body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/',
    },
    tag: payload.data?.tag || "default", // duplicate control
    renotify: true
  };

  return self.registration.showNotification(title, options);
});


// 🔥 ✅ NOTIFICATION CLICK HANDLER
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification click');

  event.notification.close();

  const targetUrl = event.notification.data?.url || self.registration.scope;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {

        // 🔄 Agar app already open hai → focus
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }

        // 🆕 warna new tab open
        return clients.openWindow(targetUrl);
      })
  );
});


// 🔥 OPTIONAL (UX IMPROVEMENT)
self.addEventListener('push', function(event) {
  console.log('[SW] Push received');

  // Purane notifications clear (optional)
  self.registration.getNotifications().then(notifications => {
    notifications.forEach(n => n.close());
  });
