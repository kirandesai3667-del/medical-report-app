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

// Fetch handler – service worker ko active rakhne ke liye
self.addEventListener('fetch', (event) => {
  // Optional: cache or just pass through
  event.respondWith(fetch(event.request));
});

messaging.onBackgroundMessage((payload) => {
  console.log('[sw] Background message:', payload);
  const title = payload.notification?.title || payload.data?.title || 'Batrisi Medical Sahay';
  const body = payload.notification?.body || payload.data?.body || '';
  self.registration.showNotification(title, { body });
});
