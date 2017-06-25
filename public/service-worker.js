//importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-messaging.js');
importScripts('/lib/sw/sw-toolbox.js'); 



firebase.initializeApp({
  'messagingSenderId': '549083960147'
});

const messaging = firebase.messaging();

// Installs service worker
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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

//Cache
toolbox.options.debug = true;
toolbox.precache(['index.html','login.html']);
toolbox.router.get('/', toolbox.networkFirst);

toolbox.router.get('/(.*)', toolbox.cacheFirst, {origin: 'https://www.gstatic.com'});
toolbox.router.get('/(.*)', toolbox.cacheFirst, {origin: 'https://cdn.firebase.com'});
toolbox.router.get('/(.*)', toolbox.cacheFirst, {origin: 'https://fonts.googleapis.com'});
toolbox.router.get('/(.*)', toolbox.cacheFirst, {origin: 'https://fonts.gstatic.com'});


toolbox.router.get("manifest.json", toolbox.networkFirst);
toolbox.router.get("index.html", toolbox.networkFirst);
toolbox.router.get("login.html", toolbox.networkFirst);
toolbox.router.get("css/*.css", toolbox.cacheFirst);
toolbox.router.get("js/*.js", toolbox.networkFirst);
toolbox.router.get("lib/*.js", toolbox.cacheFirst);
toolbox.router.get("*.png", toolbox.cacheFirst);