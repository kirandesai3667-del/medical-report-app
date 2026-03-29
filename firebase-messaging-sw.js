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

// ✅ Handle background messages directly
messaging.onBackgroundMessage((payload) => {
  console.log('[sw] Background message received:', payload);
  
  const title = payload.notification?.title || payload.data?.title || 'Batrisi Medical Sahay';
  const body = payload.notification?.body || payload.data?.body || '';
  const icon = 'https://kirandesai3667-del.github.io/medical-report-app/icon-192.png';
  
  console.log('[sw] Showing notification:', title, body);
  
  return self.registration.showNotification(title, {
    body: body,
    icon: icon,
    badge: icon,
    vibrate: [200, 100, 200],
    data: {
      url: 'https://kirandesai3667-del.github.io/medical-report-app/'
    }
  });
});

// ✅ Optional: Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://kirandesai3667-del.github.io/medical-report-app/')
  );
});
