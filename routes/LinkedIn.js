const passport = require('passport');
const { LINKEDIN } = require('../config.js');

const LinkedIn = (app) => {
  app.get(
    LINKEDIN.CALLBACK_URL,
    passport.authenticate('linkedin', {
      successRedirect: '/profile',
      failureRedirect: '/login',
    })
  );

  app.get('/login/linkedin', passport.authenticate('linkedin'));
};

module.exports = LinkedIn;
