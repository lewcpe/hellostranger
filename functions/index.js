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
    var friendref = admin.database().ref("friends/" + friendUid).once('value');
    return friendref.then(function(snap) {
      var friendobj = snap.val();
      var owner_uid = friendobj.owner;
      var tokenref = admin.database().ref("token/" + owner_uid).once('value');
      return tokenref.then(function(snap) {
        var token = snap.val();
        const payload = {
          notification: {
            title: "New friend added",
            body: friendobj.name + " just added you as a friend, click to see his/her profile"
          }
        };
        console.log('Send message to device with token = ' + token);
        return admin.messaging().sendToDevice(token, payload);
      });
    });
});

exports.sendTimelineNoti = functions.database.ref("/timeline/{userid}/{postid}").onWrite(event => {
  const userid = event.params.userid;
  const postid = event.params.postid;
  console.log("New feed on timeline - "+postid);
  var postref = admin.database().ref('post/' + postid).once('value');
  return postref.then(function(snap) {
    var postobj = snap.val();
    var tokenref = admin.database().ref("token/" + userid).once('value');
    return tokenref.then(function(snap) {
      var token = snap.val()

      const payload = {
        notification: {
          title: "New post on your timeline",
          body: postobj.message.substring(0, 100)
        }
      }
      console.log("Sending new post noti");
      return admin.messaging().sendToDevice(token, payload);
    })
  });
});