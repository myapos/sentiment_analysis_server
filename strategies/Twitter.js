const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const { TWITTER } = require('../config.js');

const Twitter = () => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: TWITTER.API_KEY,
        consumerSecret: TWITTER.API_KEY_SECRET,
        callbackURL: TWITTER.CALLBACK_URL,
      },
      (token, tokenSecret, profile, cb) =>
        // User.findOrCreate({ twitterId: profile.id }, (err, user) => cb(err, user),
        // );
        cb(null, profile)
    )
  );
};

module.exports = Twitter;
