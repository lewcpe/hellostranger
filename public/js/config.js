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
            // Setup token
            // Simple ajax call to send user token to server for saving
            // $.ajax({
            //     type: 'POST',
            //     url: '/api/setToken',
            //     dataType: 'json',
            //     data: JSON.stringify({token: token}),
            //     contentType: 'application/json',
            //     success: (data) => {
            //         console.log('Success ', data);
            //     },
            //     error: (err) => {
            //         console.log('Error ', err);
            //     }
            // })
        })
        .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}