// MASTER SERVICE WORKER (BATRISI APP) - FIREBASE ONLY
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// 1. Firebase Initialize (सबके लिए - Admin, Member, Committee)
firebase.initializeApp({
  apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
  authDomain: "batrisi-medical-sahay.firebaseapp.com",
  projectId: "batrisi-medical-sahay",
  messagingSenderId: "632157918744",
  appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
});

const messaging = firebase.messaging();

// 2. जब ऐप बैकग्राउंड में हो या बंद हो तब नोटिफिकेशन दिखाना
messaging.onBackgroundMessage((payload) => {
    console.log("Firebase Background Message received.");
    
    const title = payload.notification?.title || payload.data?.title || 'Batrisi Notification';
    const body = payload.notification?.body || payload.data?.body || '';
    
    // Google Apps Script से भेजा गया URL (अगर हो तो)
    const clickUrl = payload.data?.url || '/medical-report-app/';
    
    self.registration.showNotification(title, {
        body: body,
        icon: '/medical-report-app/icon-192.png',
        badge: '/medical-report-app/icon-192.png',
        vibrate: [200, 100, 200, 100, 200], // फ़ोन वाइब्रेट करने के लिए
        requireInteraction: true, // जब तक यूजर हटाए नहीं, नोटिफिकेशन स्क्रीन पर रहे
        data: { url: clickUrl }
    });
});

// 3. नोटिफिकेशन पर क्लिक करने पर ऐप खोलना
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    const urlToOpen = event.notification.data.url || '/medical-report-app/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // अगर ऐप पहले से खुला है तो उसे फोकस (सामने) लाओ
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes('medical-report-app') && 'focus' in client) {
                    return client.focus();
                }
            }
            // अगर ऐप बंद है तो नई विंडो में खोल दो
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
