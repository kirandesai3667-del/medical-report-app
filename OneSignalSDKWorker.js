// MASTER SERVICE WORKER (BATRISI APP)
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

firebase.initializeApp({
  apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
  authDomain: "batrisi-medical-sahay.firebaseapp.com",
  projectId: "batrisi-medical-sahay",
  messagingSenderId: "632157918744",
  appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || 'Batrisi Update';
    const body = payload.notification?.body || payload.data?.body || '';
    self.registration.showNotification(title, {
        body: body,
        icon: '/medical-report-app/icon-192.png',
        badge: '/medical-report-app/icon-192.png'
    });
});
