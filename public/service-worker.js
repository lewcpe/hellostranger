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
  console.log("Message received. ", payload);
  // Parses data received and sets accordingly
  const data = JSON.parse(payload.data.notification);
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    icon: '/favicon-32x32.png',
    actions: [
      {action: 'confirm', title: 'Confirm'},
      {action: 'cancel', title: 'Ignore'}
    ],
    //"click_action" : "https://wwww.google.com",
    // For additional data to be sent to event listeners, needs to be set in this data {}
    //data: {confirm: data.confirm, decline: data.decline}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Callback fired if Instance ID token is updated.
// messaging.onTokenRefresh(function() {
//   messaging.getToken()
//   .then(function(refreshedToken) {
//     console.log('TOKEN REFRESHED: ' + token);
//     //TODO:send token to server
//   })
//   .catch(function(err) {
//     console.log('Unable to retrieve refreshed token ', err);
//   });
// });

self.addEventListener('notificationclick', (event) => {
  console.log(event.action);
  event.notification.close();
  if (event.action == 'confirm') {
    //TODO: send to server
    console.log('Click confirm');
  }
  
}, false);