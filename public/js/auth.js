/*
 * if not logged in, jump to login page
 */
firebase.auth().onAuthStateChanged(function(user){
  if(!user){
    location.href = './login.html';
  }
});
