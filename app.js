if (process.env.NODE_ENV !== 'production') {
  console.log('edw');
  require('dotenv').config();
}

const express = require('express');
const passport = require('passport');
const cors = require('cors');
const environment = require('./environment');

const env = environment();
/* Strategies */

const helmet = require('helmet');
const Strategies = require('./strategies');
const Routes = require('./routes');

const handleErrors = require('./middleware/handleErrors');

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

if (!env.isInDev) {
  console.log('enable proxy');
  app.enable('trust proxy');
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors({ credentials: true, origin: `${env.CLIENT_BASE_URL}` }));
app.use(cors());

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    proxy: !env.isInDev,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.

Routes.Check(app);
Routes.Facebook(app);
Routes.Twitter(app);
Routes.LinkedIn(app);
Routes.Google(app);
Routes.Profile(app);
Routes.Logout(app);
Routes.Tweets(app);

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
