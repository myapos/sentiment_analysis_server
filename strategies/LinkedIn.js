const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { LINKEDIN } = require('../config.js');

const LinkedIn = () => {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: LINKEDIN.API_KEY,
        clientSecret: LINKEDIN.SECRET_KEY,
        callbackURL: LINKEDIN.CALLBACK_URL,
        // scope: ['r_emailaddress', 'r_liteprofile'],
      },
      (token, tokenSecret, profile, done) => {
        // asynchronous verification, for effect...
        process.nextTick(() =>
          // To keep the example simple, the user's LinkedIn profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the LinkedIn account with a user record in your database,
          // and return that user instead.
          done(null, profile)
        );
      }
    )
  );
};

module.exports = LinkedIn;
