var CURRENT_PROFILES = [];
var CURRENT_PROFILE  = [];
var CURRENT_PID      = null;

function render_loading_table(){
  $('table tbody').html(`
    <tr>
      <td colspan='2'>
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      </td>
    </tr>
  `);
}
function refresh_profile_table(){
  render_loading_table();
  get_all_profiles().then(function(snap){
    var profiles = snap.val();
    if(profiles){
      $('table tbody').html('');
      for(var pid in profiles){
        $('table tbody').append(`
          <tr>
            <td class='mod' pid='${pid}'>${profiles[pid].name}</td>
            <td class='qr' pid='${pid}'><i class="material-icons">share</i></td>
          </tr>
        `);
      }
      // update current profiles
      CURRENT_PROFILES = profiles;
    }
    else {
      alert('Profile not found');
    }
  })
}

// bind dom
$('table').on('click', 'td.mod', function(){
  // update current profile
  var pid = $(this).attr('pid');
  CURRENT_PID = pid;
  CURRENT_PROFILE = CURRENT_PROFILES[pid];
  //
  $('#profile-modal h5').html('Edit profile');
  $('#add').hide();
  $('#edit').show();

  // TODO detect from backend
  if(Object.keys(CURRENT_PROFILES).length > 1){
    $('#del').show();
  }
  else {
    $('#del').hide();
  }

  $('#profile-modal').modal('open', {
    ready: function(modal, trigger){
      var rewriter = new Rewriter();
      $('#name').val(CURRENT_PROFILE.name);
      $('#bio').val(CURRENT_PROFILE.bio);
      $('#bio').focus();
      $('#name').focus();
    },
    complete: function(){
      $('#name').val('');
      $('#bio').val('');
    }
  });
});
$('table').on('click', 'td.qr', function(){
  var pid = $(this).attr('pid');
  var url = `${location.origin}/accept.html#token=${btoa(pid)}`;
  $('#qr-modal .qr').html('');
  var qrcode = new QRCode($('#qr-modal .qr')[0], {
      text: url,
      width: 200,
      height: 200,
  });
  $('#qr-modal .url').html(`or <a href='${url}'>link</a>`);
  $('#qr-modal').modal('open');
});
$('.red.new').click(function(){
  $('#profile-modal h5').html('Add new profile');
  $('#add').show();
  $('#edit').hide();
  $('#del').hide();
  $('#profile-modal').modal('open', {
    ready: function(modal, trigger){
      var rewriter = new Rewriter();
      $('#name').val(generateName());
      $('#bio').val(rewriter.FullSubstitution("<bio>", bioGrammar));
      $('#bio').focus();
      $('#name').focus();
    },
    complete: function(){
      $('#name').val('');
      $('#bio').val('');
    }
  });
});
$('#add').click(function(){
  render_loading_table();
  $('#profile-modal').modal('close');
  var displayname = $('#name').val();
  var bio = $('#bio').val();
  var pic = '<3'; // TODO add later
  create_new_profile(displayname, bio, pic).then(function(){
    refresh_profile_table();
  });
});
$('#edit').click(function(){
  render_loading_table();
  $('#profile-modal').modal('close');
  var displayname = $('#name').val();
  var bio = $('#bio').val();
  var pic = '<3'; // TODO add later
  update_profile(CURRENT_PID, displayname, bio, pic).then(function(){
    refresh_profile_table();
  });
});
$('#del').click(function(){
  if(confirm('Do you really want to delete this profile ?')){
    render_loading_table();
    $('#profile-modal').modal('close');
    remove_profile(CURRENT_PID).then(function(){
      refresh_profile_table();
    });
  }
});

// when firebase auth ready
firebase.auth().onAuthStateChanged(function(user){
  refresh_profile_table();
});
