importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '549083960147'
});

const messaging = firebase.messaging();

// Installs service worker
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
});

messaging.setBackgroundMessageHandler((payload) => {
  // Parses data received and sets accordingly
  const data = JSON.parse(payload.data.notification);
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    //icon: '/favicon-32x32.png',
    actions: [
      {action: 'confirmAttendance', title: '👍 Confirm attendance'},
      {action: 'cancel', title: '👎 Not coming'}
    ],
    // For additional data to be sent to event listeners, needs to be set in this data {}
    data: {confirm: data.confirm, decline: data.decline}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});