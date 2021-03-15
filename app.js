const express = require('express');
const passport = require('passport');
const cors = require('cors');
const fetch = require('node-fetch');
const { Strategy } = require('passport-facebook');
const TwitterStrategy = require('passport-twitter').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const helmet = require('helmet');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

const handleErrors = require('./middleware/handleErrors');
const { BadRequest } = require('./utils/errors');
const {
  FACEBOOK,
  TWITTER,
  LINKEDIN,
  // LINKEDIN_API_KEY,
  // LINKEDIN_SECRET_KEY,
  // CALLBACK_URL_LINKEDIN,
  GOOGLE,
  // GOOGLE_CLIENT_ID,
  // GOOGLE_CLIENT_SECRET,
  // GOOGLE_CALLBACK_URL,
} = require('./config.js');

const { PORT } = require('./constants');

// Configure the Facebook strategy for use by Passport.
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
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
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
// Create a new Express application.
const app = express();

app.use(helmet());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cors());

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/', (req, res) => {
  res.status(200).json({ home: 'OK' });
});

app.get('/check', (req, res) => {
  res.status(200).json({ check: 'OK' });
});

app.get('/login', (req, res) => {
  res.status(200).json({ login: 'OK' });
});

app.get(
  FACEBOOK.CALLBACK_URL,
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get(
  TWITTER.CALLBACK_URL,
  passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
);

app.get(
  LINKEDIN.CALLBACK_URL,
  passport.authenticate('linkedin', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
);

app.get(
  GOOGLE.CALLBACK_URL,
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
);

app.get('/login/facebook', passport.authenticate('facebook'));

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
app.get('/login/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/login/linkedin', passport.authenticate('linkedin'));

app.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

app.get(
  '/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    const { id, displayName, provider } = req.user;
    res.cookie('connect.sid', req.cookies['connect.sid'], {
      maxAge: 30 * 60 * 1000, // 1/2 hour
      httpOnly: false,
      //   secure: false,
      sameSite: true,
    });
    res.redirect(`http://localhost:3000?name=${encodeURIComponent(displayName)}
    &id=${encodeURIComponent(id)}
    &provider=${encodeURIComponent(provider)}`);
  },
);

app.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('connect.sid');
  // res.redirect('http://localhost:3000/');
  res.status(200).json({ clearedCookies: 'OK' });
});

app.get('/tweets', (req, res, next) => {
  const {
    query: { query },
  } = req;

  fetch(
    `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
      query
    )}&max_results=100`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TWITTER.BEARER_TOKEN}`,
      },
    }
  )
    .then((twitter) => twitter.json())
    .then((tweets) => {
      let score = 0;
      tweets.data.forEach((tweet) => {
        const tempScore = sentiment.analyze(tweet.text).score;
        score += parseInt(tempScore);
      });
      // const sentiment_result = sentiment.analyze(tweets.data[0].text);
      // console.dir(sentiment_result);
      return res.status(200).json({ ...tweets, score });
    })
    .catch((e) => {
      const error = new BadRequest(e.message);
      next(error);
      // res.status(400).json({
      //   status: 400,
      //   ...e,
      // });
    });
});
app.use(handleErrors);
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
