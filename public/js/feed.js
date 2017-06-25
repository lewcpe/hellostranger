var REQUEST_PID = null;

var ALL_PROFILES = {};
var ALL_FRIENDS  = {};
var UID_NAMES    = {};
var PID_NAMES    = {};

// bind post item
$('.new.red.btn-floating').click(function(){
  $('#post-modal #msg').val('');
  $('#post-modal').modal('open');

  if($('.allow-friends .progress').length == 1){
    // query friend list at firsttime
    $('#post-modal .allow-friends').html('');
    if(ALL_FRIENDS){
      for(var pid in ALL_FRIENDS){
        var f = ALL_FRIENDS[pid];
        var uid = f.uid;
        $('#post-modal .allow-friends').append(`
          <p>
            <input type="checkbox" id="${uid}" checked="checked" value="${uid}" />
            <label for="${uid}">${f.name}</label>
          </p>
        `);
      }
    }
  }
  else {
    // checked all friends by default
    $('.allow-friends input[type=checkbox]').prop('checked', true);
  }
});

// bind request friend modal buttons
$('#request-friend-modal #accept').click(function(){
  var my_pid = $('#request-friend-modal input[name=accept_profile]:checked').attr('id');
  add_friend(my_pid, REQUEST_PID).then(function(){
    localStorage.removeItem('REQUEST_FRIEND_TOKEN');
    $('#request-friend-modal').modal('close');
  });
});
$('#request-friend-modal #reject').click(function(){
  localStorage.removeItem('REQUEST_FRIEND_TOKEN');
  $('#request-friend-modal').modal('close');
});

// submit post item
$('#post-modal #submit').click(function(){
  var msg = $('#post-modal #msg').val().trim();
  var pic = '<3'; // TODO
  var uids = $.map($('.allow-friends input:checked'), function(r, i){
    return r.value;
  });
  if(msg){ // msg must not blank
    create_new_post(msg, pic, uids);
    /*
     * TODO create_new_post not return promise yet
     *      I think this process should take about 1 sec.. :d
     **/
    $('#post-modal').modal('close');
    play_feed_loading();
    setTimeout(function(){
      query_feed();
    }, 1000);
  }
});

// loading animation
function play_feed_loading(){
  $('.feed').html(`
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  `);
}

function query_feed(){
  play_feed_loading();
  get_timeline().then(function(items){
    $('.feed').html('');
    $(items.reverse()).each(function(i, r){
      //
      // console.log(r);
      //
      var username = UID_NAMES[r.owner] || 'Unknown';
      var msg = r.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
      var d = new Date(r.created);
      var ds = d.toLocaleString();
      var allowed = '';
      for(var pid in r.allowed){
        var name = PID_NAMES[pid] || 'Unknown';
        allowed += `<img title='${name}' src='android-chrome-192x192.png'>`;
      }
      //
      $('.feed').append(`
        <div class="col s12 l6">
          <div class="card">
            <div class="card-content">
              <div class='poster'>
                <img class='left avatar' src='android-chrome-192x192.png'>
                <div class='name'>${username}</div>
                <div>${ds}</div>
                <div class='clear'></div>
              </div>
              <p>${msg}</p>
            </div>
            <div class="card-image hide">
              <img src="img/sample-1.jpg">
            </div>
            <div class="card-action friend">
              ${allowed}
            </div>
            <div class="card-action hide">
              comment..
            </div>
          </div>
        </div>
      `);
    });
  });
}

// when firebase auth ready
firebase.auth().onAuthStateChanged(function(user){

  // query profiles, friends data first
  // map into pid <-> name, uid <-> name hash
  get_all_profiles().then(function(snap){
    ALL_PROFILES = snap.val();
    return get_all_friends().then(function(friends){
      return friends;
    });
  }).then(function(friends){
    ALL_FRIENDS = friends;
  }).then(function(){
    $([ ALL_PROFILES, ALL_FRIENDS ]).each(function(i, src){
      for(var pid in src){
        var p = src[pid];
        UID_NAMES[p.uid] = p.name;
        PID_NAMES[pid]   = p.name;
      }
    });
  }).then(function(){
    // loading feed
    query_feed();

    // update accept profile list in friend request modal
    if(ALL_PROFILES){
      $('#request-friend-modal .accept-profile').html('');
      for(var pid in ALL_PROFILES){
        var profile = ALL_PROFILES[pid];
        $('#request-friend-modal .accept-profile').append(`
          <p>
            <input name="accept_profile" type="radio" id="${pid}" />
            <label for="${pid}">${profile.name}</label>
          </p>
        `);
      }
      // checked on first profile
      $('#request-friend-modal input[name=accept_profile]')[0].checked = 'checked';
    }
    else {
      alert('Profile not found');
    }
  });

  // display request friend modal if request-friend-token exist
  var rf_token = localStorage.getItem('REQUEST_FRIEND_TOKEN');
  if(rf_token){
    REQUEST_PID = atob(rf_token);
    if(false){ // TODO if owner pid, remove this token
      localStorage.removeItem('REQUEST_FRIEND_TOKEN');
    }
    else {
      get_profile_detail(REQUEST_PID).then(function(profile){
        $('#request-friend-modal .name').html(profile.name);
        $('#request-friend-modal .bio').html(profile.bio);
        $('#request-friend-modal').modal('open');
      });
    }
  }

});
