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

// 1. FORCE IMMEDIATE ACTIVATION (Prevents SW from getting stuck in "waiting")
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 2. FETCH HANDLER (CRITICAL)
// Resolves the "Fetch handler: DOES_NOT_EXIST" error. 
// Required by Chrome to treat the app as a true PWA and keep the SW healthy.
self.addEventListener('fetch', (event) => {
  // Pass-through. No caching logic needed for now.
});

// 3. BACKGROUND NOTIFICATION HANDLER
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const title = payload.notification?.title || payload.data?.title || "Batrisi Medical Sahay";
  const body = payload.notification?.body || payload.data?.body || "";
  
  // Use self.registration.scope so it navigates correctly on GitHub Pages
  const clickActionUrl = payload.data?.url || self.registration.scope;

  const options = {
    body: body,
    icon: "./icon-192.png", // Ensure this path is correct relative to the SW
    badge: "./icon-192.png",
    vibrate: [200, 100, 200, 100, 200],
    data: { url: clickActionUrl }
  };

  // Prevent duplicate notifications if Firebase auto-handled the `notification` payload
  if (!payload.notification) {
    return self.registration.showNotification(title, options);
  }
});

// 4. CLICK HANDLER (Focuses the app if it's in the background, or opens it)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || self.registration.scope;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if the PWA is already open
      for (const client of clientList) {
        if (client.url === targetUrl || client.url.includes(self.registration.scope)) {
          if ('focus' in client) {
            return client.focus();
          }
        }
      }
      // If the app is fully closed, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
