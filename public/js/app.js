//Business Logic Functions

//Friends Management

function get_all_profiles() {
    var uid = firebase.auth().currentUser.uid;
    return firebase.database().ref("profile").orderByChild("owner").equalTo(uid).once('value');
}

function get_profile_detail(profile_id) {
    var profile_detail_ref = firebase.database().ref("profile/" + profile_id);
    return profile_detail_ref.once('value').then(function(snapshot) {
        console.log("Found Profile Object " + snapshot.key);
        return snapshot.val();
    });
}

function create_new_profile(displayname, bio, pic) {
    var uid = firebase.auth().currentUser.uid;
    var postdata = {
        uid: uid,
        owner: uid,
        name: displayname,
        bio: bio,
        pic: pic,
        created: firebase.database.ServerValue.TIMESTAMP,
        relationship_confirmed: 0,
        status: 1
    };
    var profilekey = firebase.database().ref().child('profile').push().key;
    var profilelistkey = firebase.database().ref("profiles/" + uid).push().key;
    var updates = {};
    updates['profile/' + profilekey] = postdata;
    updates['profiles/' + uid + "/" + profilelistkey] = profilekey;
    return firebase.database().ref().update(updates);
}

function update_profile(profile_id, displayname, bio, pic) {
    var profile_detail_ref = firebase.database().ref("profile/" + profile_id);
    return profile_detail_ref.once('value').then(function(snap) {
        var profile = snap.val()
        profile.name = displayname;
        profile.bio = bio;
        profile.pic = pic;
        var updates = {}
        updates['profile/' + profile_id] = profile;
        return firebase.database().ref().update(updates);
    });
}

function remove_profile(profile_id) {
    var cuid = firebase.auth().currentUser.uid;
    var profile_detail_ref = firebase.database().ref("profile/" + profile_id);
    return profile_detail_ref.once('value').then(function(snap) {
        profileobj = snap.val();
        if (profileobj.owner != cuid) {
            return false;
        }
        snap.ref.remove();
    });
}

//Add Friend use "PROFILE ID" not "USER ID"
function add_friend(my_profileid, his_profileid, cuid) {
    cuid = cuid || firebase.auth().currentUser.uid;
    return get_profile_detail(his_profileid).then(function(his_detail) {
        if (his_detail.status == 0) {
            return false;
        }
        var myfriendkey = firebase.database().ref().child('friends').push().key;
        var updates = {};
        his_detail.owner = cuid
        his_detail.created = firebase.database.ServerValue.TIMESTAMP;
        console.log("Prepared His Profile");
        return get_profile_detail(my_profileid).then(function(my_detail) {
            my_detail.owner = his_detail.uid;
            my_detail.created = firebase.database.ServerValue.TIMESTAMP;
            var hisfriendkey = firebase.database().ref().child('friends').push().key;
            his_detail.counter_friend_id = hisfriendkey;
            my_detail.counter_friend_id = myfriendkey;
            updates['friends/' + myfriendkey] = his_detail;
            updates['friends/' + hisfriendkey] = my_detail;
            return firebase.database().ref().update(updates);
        });
    });
}

function get_all_friends(cuid) {
    var uid = cuid || firebase.auth().currentUser.uid;
    return firebase.database().ref("friends").orderByChild('owner').equalTo(uid).once('value').then(function(snap) {
        return snap.val();
    });
}

function remove_friend(friendid) {
    var uid = firebase.auth().currentUser.uid;
    var friendref = firebase.database().ref("friends/" + friendid);
    return friendref.once('value').then(function(snap) {
        friendobj = snap.val()
        if (friendobj.owner != uid) {
            return false;
        }
        counterid = friendobj.counter_friend_id;
        counterref = firebase.database().ref("friends/" + counterid);
        counterref.remove();
        snap.ref.remove();
    });
}

//Post Management

function create_new_post(message, pic, allowed_friends) {
    var uid = firebase.auth().currentUser.uid;
    if (allowed_friends.indexOf(uid) == -1) {
        allowed_friends.push(uid);
    }
    var postdata = {
        owner: uid,
        message: message,
        pic: pic,
        created: firebase.database.ServerValue.TIMESTAMP,
        allowed: null
    }
    var postkey = firebase.database().ref().child('post').push().key;
    var updates = {};
    updates['post/' + postkey] = postdata;
    firebase.database().ref().update(updates);
    let allowref = firebase.database().ref("post/" + postkey + "/allowed");
    for (let fuid of allowed_friends) {
        console.log("Create Allowd for " + fuid);
        allowref.child(fuid).set(1);
        let timelineref = firebase.database().ref("timeline/" + fuid)
        timelineref.child(postkey).set(firebase.database.ServerValue.TIMESTAMP);
    }
}

function get_post_from_user(cuid) {
    let uid = cuid || firebase.auth().currentUser.uid;
    return firebase.database().ref("post").orderByChild("owner").equalTo(uid).once('value');
}

function get_timeline() {
    let uid = firebase.auth().currentUser.uid;
    let timelineref = firebase.database().ref("timeline/" + uid)
    console.log("Get Timeline");
    return timelineref.once('value').then(function(snap) {
        console.log("List timeline");
        postdict = snap.val();
        console.log(postdict);
        let retlist = [];
        for (let postkey in postdict) {
            console.log("Key = " + postkey);
            let postref = firebase.database().ref("post/" + postkey);
            retpromise = postref.once('value').then(function(postsnap) {
                console.log("Post snap");
                return postsnap.val();
            });
            retlist.push(retpromise);
        }
        return Promise.all(retlist);
    });
}

function remove_post(postid) {
    let uid = firebase.auth().currentUser.uid;
    let postref = firebase.database().ref("post/" + postid)
    return postref.once('value').then(function(snap) {
        let comment_query = firebase.database().ref('comments').orderByChild('postid').equalTo(postid).once('value');
        console.log("Removing Post - " + snap.key);
        snap.ref.remove();
        return comment_query.then(function(qsnap) {
            qsnap.forEach(function(csnap) {
                csnap.ref.remove()
                console.log("Removing comment - " + csnap.key)
            });
        });
    });
}

// Comments API

function create_new_comment(message, postid) {
    var uid = firebase.auth().currentUser.uid;
    var postdata = {
        owner: uid,
        message: message,
        created: firebase.database.ServerValue.TIMESTAMP,
        postid: postid
    };
    var commentkey = firebase.database().ref().child('comments').push().key;
    var updates = {};
    updates['comments/' + commentkey] = postdata;
    return firebase.database().ref().update(updates);
}

function get_comment_for_post(postid) {
    return firebase.database().ref("comments").orderByChild("postid").equalTo(postid).once('value')
}

function remove_comment(commentid) {
    var uid = firebase.auth().currentUser.uid;
    var commentref = firebase.database().ref("comments/" + commentid)
    return commentref.once('value').then(function(snap) {
        commentobj = snap.val();
        if (commentobj.owner == uid) {
            console.log("Remove by Comment Owner");
            commentref.remove();
            return null
        }
        var postref = firebase.database().ref("post/" + commentobj.postid)
        return portref.once('value').then(function(snap) {
            postobj = snap.val();
            if (postobj.owner == uid) {
                console.log("Remove by Post Owner");
                commentref.remove();
                return null;
            }
            console.log("Cannot Remove");
            return false;
        });
    });
}

// Message Token

function update_token(token) {
    let uid = firebase.auth().currentUser.uid;
    let tokenref = firebase.database().ref("token")
    console.log("Set token = " + token);
    return tokenref.child(uid).set(token);
}

function get_token(uid) {
    let cuid = uid || firebase.auth().currentUser.uid;
    let tokenref = firebase.database().ref("token/" + cuid).once('value');
    return tokenref.then(function(snap) {
        return snap.val();
    });

}
