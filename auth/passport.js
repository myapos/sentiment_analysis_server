const { FACEBOOK_APP_ID, SECRET, CALLBACK_URL } = require('../config.js');
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, id);
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID
        clientSecret: SECRET,
        callbackURL: CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('profile', profile);
        done(null, profile);
      }
    )
  );
};
