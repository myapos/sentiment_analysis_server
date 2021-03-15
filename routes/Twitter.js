const passport = require('passport');
const { TWITTER } = require('../config.js');

const Twitter = (app) => {
  app.get(
    TWITTER.CALLBACK_URL,
    passport.authenticate('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/login',
    })
  );

  // Redirect the user to Twitter for authentication.  When complete, Twitter
  // will redirect the user back to the application at
  app.get('/login/twitter', passport.authenticate('twitter'));
};

module.exports = Twitter;
