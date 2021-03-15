const passport = require('passport');
const { GOOGLE } = require('../config.js');

const Google = (app) => {
  app.get(
    GOOGLE.CALLBACK_URL,
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/login',
    })
  );

  app.get(
    '/login/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
  );
};

module.exports = Google;
