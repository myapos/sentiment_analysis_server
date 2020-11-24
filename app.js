const express = require('express');

const app = express();
const cookieSession = require('cookie-session');
const passport = require('passport');
const { PORT } = require('./constants');
const isLoggedIn = require('./middleware/auth');

require('./passport');

app.use(
  cookieSession({
    name: 'facebook-auth-session',
    keys: ['key1', 'key2'],
  })
);

app.get('/', isLoggedIn, (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/healthy', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
  res.send(`Hello world ${req.user.displayName}`);
});
app.get('/auth/error', (req, res) => res.send('Unknown Error'));
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
