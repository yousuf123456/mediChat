importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);


// self.registration.showNotification(notificationTitle,notificationOptions)

const firebaseConfig = {
    apiKey: "AIzaSyABdAM_bn42pxG3DpRq389e32HF9-2e7rE",
    authDomain: "medichat-6f109.firebaseapp.com",
    projectId: "medichat-6f109",
    storageBucket: "medichat-6f109.appspot.com",
    messagingSenderId: "331661391095",
    appId: "1:331661391095:web:60a8bfc1de442ff48f0ff2",
    measurementId: "G-905E4S2ZQS"
};


firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon || "./images/placeholder.jpg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    // Open your webpage when the notification is clicked
    event.waitUntil(
      clients.openWindow(`http://localhost:3000/conversations/${payload.data.conId}`)
    );
  });
});