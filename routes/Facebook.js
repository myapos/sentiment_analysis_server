const passport = require('passport');
const { FACEBOOK } = require('../config.js');

const Facebook = (app) => {
  app.get(
    FACEBOOK.CALLBACK_URL,
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  app.get('/login/facebook', passport.authenticate('facebook'));
};

module.exports = Facebook;
