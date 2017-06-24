const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest((req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   admin.database().ref('/messages').push({original: original}).then(snapshot => {
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     res.redirect(303, snapshot.ref);
//   });
// });

/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendNotification = functions.database.ref('/friends/{friendUid}').onWrite(event => {
    const friendUid = event.params.friendUid;
    console.log('friendUid',friendUid);

    const tokens = "cSXgBdmWR_E:APA91bHHhgackUaUKAdGYkYJ8V4x6pkWFC8DFwPEyXMlU3P7xl-pF8hCNajstPu6q5P4zTRvG_rB1fpOHiZ55OETgDsbLG1ambU0dixAQXveq-0JkUCe49nrC4Q7X7QeCY_vnlV-S0-I";
    const payload = {
      notification: {
        title: "New friend request",
        body: friendUid + " want to join you?",
        confirm: "http://test"
      }
    };

    console.log('Send message to device');
    admin.messaging().sendToDevice(tokens, payload);
});