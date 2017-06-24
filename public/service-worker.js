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
    data: {url: data.confirm}
    //"click_action" : "https://wwww.google.com",
    // For additional data to be sent to event listeners, needs to be set in this data {}
    //data: {confirm: data.confirm, decline: data.decline}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log("Action=", event.action);
  console.log("Notification=", event.notification);
  event.notification.close();
  if (event.action == 'confirm') {
    //TODO: clients.openWindow("eventURL");
    console.log('Click confirm',event.notification.data);
  }
  
}, false);

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

