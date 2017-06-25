var CURRENT_FRIENDS = [];
var CURRENT_FRIEND  = [];
var CURRENT_PID     = null;

function render_loading_table(){
  $('table tbody').html(`
    <tr>
      <td>
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      </td>
    </tr>
  `);
}
function refresh_friend_table(){
  render_loading_table();
  get_all_friends().then(function(friends){
    if(friends){
      $('table tbody').html('');
      for(var pid in friends){
        $('table tbody').append(`
          <tr>
            <td class='mod' pid='${pid}'>${friends[pid].name}</td>
          </tr>
        `);
      }
      // update current friends
      CURRENT_FRIENDS = friends;
    }
    else {
      alert('Friends not found');
      $('table tbody').html('');
    }
  });
}

// bind dom
$('table').on('click', 'td.mod', function(){
  // update current friend
  var pid = $(this).attr('pid');
  CURRENT_PID = pid;
  CURRENT_FRIEND = CURRENT_FRIENDS[pid];
  $('#request-friend-modal').modal('open', {
    ready: function(modal, trigger){
      $('.name').html(CURRENT_FRIEND.name);
      $('.bio').html(CURRENT_FRIEND.bio);
    },
    complete: function(){
      $('.name').html('');
      $('.bio').html('');
    }
  });
});

$('#del').click(function(){
  if(confirm('Do you really want to remove him ?')){
    render_loading_table();
    $('#request-friend-modal').modal('close');
    remove_friend(CURRENT_PID).then(function(){
      refresh_friend_table();
    });
  }
});

// when firebase auth ready
firebase.auth().onAuthStateChanged(function(user){
  refresh_friend_table();
});
