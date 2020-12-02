const express = require('express');
const passport = require('passport');
const cors = require('cors');
const fetch = require('node-fetch');
const { Strategy } = require('passport-facebook');

const helmet = require('helmet');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

const handleErrors = require('./middleware/handleErrors');
const { BadRequest } = require('./utils/errors');
const {
  FACEBOOK_APP_ID,
  SECRET,
  CALLBACK_URL,
  TWITTER_BEARER_TOKEN,
} = require('./config.js');

const { PORT } = require('./constants');

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new Strategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: SECRET,
      callbackURL: CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) =>
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      cb(null, profile),
  ),
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
  }),
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', router);

// Define routes.
app.get('/', (req, res) => {
  // res.cookie('nameOfCookie', 'cookieValue', {
  //   maxAge: 60 * 60 * 1000, // 1 hour
  //   httpOnly: false,
  //   secure: false,
  //   sameSite: true,
  // });
  res.status(200).json({ home: 'OK' });
});

app.get('/check', (req, res) => {
  res.status(200).json({ check: 'OK' });
});

app.get('/login', (req, res) => {
  res.status(200).json({ login: 'OK' });
});

app.get('/login/facebook', passport.authenticate('facebook'));

app.get(
  '/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  }
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
  }
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
      query,
    )}&max_results=100`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
    },
  )
    .then((twitter) => twitter.json())
    .then((tweets) => {
      console.log('tweets', tweets.data[0].text);
      let score = 0;
      tweets.data.forEach((tweet) => {
        const tempScore = sentiment.analyze(tweet.text).score;
        console.log('tempScore', tempScore);
        score += parseInt(tempScore);
      });
      console.log('score', score);
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
