// bind post item
$('.new.red.btn-floating').click(function(){
  $('#post-modal').modal('open');

  if($('.allow-friends .progress').length == 1){
    // query friend list at firsttime
    get_all_friends().then(function(friends){
      $('#post-modal .allow-friends').html('');
      if(friends){
        for(var uid in friends){
          $('#post-modal .allow-friends').append(`
            <p>
              <input type="checkbox" id="${uid}" checked="checked" value="${uid}" />
              <label for="${uid}">${friends[uid].name}</label>
            </p>
          `);
        }
      }
    });
  }
  else {
    // checked all friends by default
    $('.allow-friends input[type=checkbox]').prop('checked', true);
  }
});

// submit post item
$('#post-modal #submit').click(function(){
  var uids = $.map($('.allow-friends input:checked'), function(r, i){
    return r.value;
  });

  // TODO collect modal data -> post new
  alert(uids);

});

// when firebase auth ready
firebase.auth().onAuthStateChanged(function(user){

  // update accept profile list in friend request modal
  get_all_profiles().then(function(snap){
    var profiles = snap.val();
    if(profiles){
      $('#request-friend-modal .accept-profile').html('');
      for(var pid in profiles){
        var profile = profiles[pid];
        $('#request-friend-modal .accept-profile').append(`
          <p>
            <input name="accept_profile" type="radio" id="${pid}" />
            <label for="accept_profile">${profile.name}</label>
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

});
