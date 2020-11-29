const passport = require('passport');
const express = require('express');

const router = express.Router();

function isLoggedIn(req, res, next) {
  console.log('is authenticated', req.isAuthenticated());
  console.log('user', req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/error',
  })
);

router.get('/', (req, res) => {
  res.status(200).json({ home: 'OK' }); // load the basic route
});

router.get('/healthy', (req, res) => {
  res.status(200).json({ healthy: 'OK' });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.status(200).json({ profile: 'OK' }); // load the profile route
});

router.get('/error', isLoggedIn, (req, res) => {
  res.status(200).json({ error: 'OK' }); // load the error route
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
