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

// ✅ Push event listener – ensures service worker wakes up
self.addEventListener('push', function(event) {
  console.log('[sw] Push event received');
  // Let the FCM SDK handle it
  event.waitUntil(messaging.onBackgroundMessage(event));
});

// ✅ Fetch event – keeps service worker alive
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

messaging.onBackgroundMessage((payload) => {
  console.log('[sw] Background message:', payload);
  const title = payload.notification?.title || payload.data?.title || 'Batrisi Medical Sahay';
  const body = payload.notification?.body || payload.data?.body || '';
  return self.registration.showNotification(title, { body });
});
