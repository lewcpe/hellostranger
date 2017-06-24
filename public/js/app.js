//Business Logic Functions

function query_profiles() {
    var userId = firebase.auth().currentUser.uid;
    var profiles_ref = firebase.database().ref("profiles/" + userId);
    return profiles_ref.once('value').then(function(snapshot) {
        console.log("Found Profile: ");
        console.log(snapshot.key);
        return snapshot.val();
    });
}

function get_all_profiles() {
    query_profiles().then(function(profileid_list) {
        for (var key in profileid_list) {
            var profileid = profileid_list[key];
            console.log("Key = " + key);
            console.log("Profile ID = " + profileid);
            var profile_detail = get_profile_detail(profileid);
            console.log(profile_detail);
        }
    });
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

function add_friend(my_profileid, his_profileid) {
    get_profile_detail(his_profileid).then(function(his_detail) {
        if (his_detail.status == 0) {
            return false;
        }
        var friendkey = firebase.database().ref().child('friends').push().key;
        var updates = {};
        his_detail.owner = firebase.auth().currentUser.uid;
        his_detail.created = firebase.database.ServerValue.TIMESTAMP;
        updates['friends/'+friendkey] = his_detail;
        get_profile_detail(my_profileid).then(function(my_detail) {
            my_detail.owner = his_detail.uid;
            my_detail.created = firebase.database.ServerValue.TIMESTAMP;
            var friendkey = firebase.database().ref().child('friends').push().key;
            updates['friends/'+friendkey] = my_detail;
            return firebase.database().ref().update(updates);
        });
    });
}

function get_all_friends() {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref("friends").orderByChild('owner').equalTo(uid).on('value', function(snap) {
        console.log(snap.val());
    });
}