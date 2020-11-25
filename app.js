const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-facebook');

const router = require('./router.js');

const { FACEBOOK_APP_ID, SECRET, CALLBACK_URL } = require('./config.js');

const { PORT } = require('./constants');

function isLoggedIn(req, res, next) {
  console.log('is authenticated', req.isAuthenticated());
  console.log('user', req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

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
      cb(null, profile)
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

// app.use('/', router);

// Define routes.
app.get('/', (req, res) => {
  res.status(200).json({ home: 'OK' });
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
  },
);

app.get(
  '/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.status(200).json({ user: req.user });
  },
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
