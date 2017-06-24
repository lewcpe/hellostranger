// bind post item
$('.new.red.btn-floating').click(function(){
  $('#post-modal').modal('open');

  if($('.allow-friends .progress').length == 1){
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
});
