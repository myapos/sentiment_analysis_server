const passport = require('passport');
const { FACEBOOK_APP_ID, SECRET } = require('./config.js');
const { PORT } = require('./constants.js');

const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: SECRET,
      callbackURL: `http://localhost:${PORT}/auth/facebook/callback`,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
