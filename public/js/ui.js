// toggle sidenav
$('.button-collapse').sideNav();

// enable collapsible
$('.ollapsible').collapsible();

// logout button
$('.logout a').click(function(){
  firebase.auth().signOut();
});
