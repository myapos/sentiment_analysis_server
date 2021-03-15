const passport = require('passport');
const { Strategy } = require('passport-facebook');
const { FACEBOOK } = require('../config.js');

const Facebook = () => {
  passport.use(
    new Strategy(
      {
        clientID: FACEBOOK.APP_ID,
        clientSecret: FACEBOOK.SECRET,
        callbackURL: FACEBOOK.CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, cb) =>
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        cb(null, profile)
    )
  );
};

module.exports = Facebook;
