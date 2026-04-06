// MASTER SERVICE WORKER (BATRISI APP) - MERGED
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// 1. Firebase Initialize (मेम्बर और कमिटी के लिए)
firebase.initializeApp({
  apiKey: "AIzaSyC97HQL03FiX8meE2iMaVAF7EJZh7r-XAM",
  authDomain: "batrisi-medical-sahay.firebaseapp.com",
  projectId: "batrisi-medical-sahay",
  messagingSenderId: "632157918744",
  appId: "1:632157918744:web:0e2df6de8a4fc274ba156d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Firebase Background Message received.");
    
    // OneSignal के मैसेज को Firebase हैंडल न करे, इसके लिए चेक:
    if (payload.data && (payload.data.custom || payload.data.onesignal)) {
        return; 
    }

    const title = payload.notification?.title || payload.data?.title || 'Batrisi Update';
    const body = payload.notification?.body || payload.data?.body || '';
    
    self.registration.showNotification(title, {
        body: body,
        icon: '/medical-report-app/icon-192.png',
        badge: '/medical-report-app/icon-192.png'
    });
});

// 2. OneSignal SDK Import (एडमिन ब्रॉडकास्ट के लिए)
// इसे सबसे नीचे रखना ज़रूरी है ताकि ये पूरे सिस्टम को कंट्रोल कर सके
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
