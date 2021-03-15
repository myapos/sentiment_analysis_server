const express = require('express');
const passport = require('passport');
const cors = require('cors');
const fetch = require('node-fetch');

/* Strategies */

const helmet = require('helmet');
const Sentiment = require('sentiment');
const Strategies = require('./strategies');

const sentiment = new Sentiment();

const handleErrors = require('./middleware/handleErrors');
const { BadRequest } = require('./utils/errors');
const { FACEBOOK, TWITTER, LINKEDIN, GOOGLE } = require('./config.js');

const { PORT } = require('./constants');

/* Load Strategies */

Strategies.Facebook();
Strategies.Twitter();
Strategies.LinkedIn();
Strategies.Google();

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
