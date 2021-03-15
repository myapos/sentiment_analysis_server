const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE } = require('../config.js');

const Google = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE.CLIENT_ID,
        clientSecret: GOOGLE.CLIENT_SECRET,
        callbackURL: GOOGLE.CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, cb) => cb(null, profile)
    )
  );
};

module.exports = Google;
