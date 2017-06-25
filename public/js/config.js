// This config file is for the demo only. It is in .gitignore and will not be pushed to git repo.
var config = {
    apiKey: "AIzaSyBi2eKbCreXTrxpAY5MrBDMi6f-arySOhQ",
    authDomain: "hellostranger-a3014.firebaseapp.com",
    databaseURL: "https://hellostranger-a3014.firebaseio.com",
    projectId: "hellostranger-a3014",
    storageBucket: "hellostranger-a3014.appspot.com",
    messagingSenderId: "549083960147"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

// On load register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then((registration) => {
            // Successfully registers service worker
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            messaging.useServiceWorker(registration);
        })
        .then(() => {
            // Requests user browser permission
            return messaging.requestPermission();
        })
        .then(() => {
            // Gets messaging token
            return messaging.getToken();
        })
        .then((token) => {
            console.log('TOKEN RECEIVED: ' + token);
            updateToken();
        })
        .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function updateToken() {
 // Get Instance ID token. Initially this makes a network call, once retrieved
 // subsequent calls to getToken will return from cache.
    messaging.getToken()
    .then(function(currentToken) {
        if (currentToken) {
            console.log("currentToken", currentToken);
            update_token(currentToken).then(function(snap) {
                console.log("Update token from message");
            });
            //$("#token").html(currentToken);
        } else {
            // Show permission request.
            console.log("No Instance ID token available. Request permission to generate one.");
            //$("#token").html("foo");
        }
    })
    .catch(function(err) {
        console.log("An error occurred while retrieving token. ", err);
    });
}

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
   messaging.getToken()
   .then(function(refreshedToken) {
     console.log('TOKEN REFRESHED: ' + token);
     updateToken();
   })
   .catch(function(err) {
     console.log('Unable to retrieve refreshed token ', err);
   });
});

//Handle message
messaging.onMessage((payload) => {
    console.log("RECIVE: ", payload);
});