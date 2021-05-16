const environment = require('../environment');

//  origin: `${env.CLIENT_BASE_URL}` }
const Profile = (app) => {
  const env = environment();
  app.get(
    '/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {
      const { id, displayName, provider } = req.user;
      res.cookie('connect.sid', req.cookies['connect.sid'], {
        maxAge: 30 * 60 * 1000, // 1/2 hour
        httpOnly: false,
        domain: 'herokuapp.com',
        //   secure: false,
        // sameSite: true,
      });

      /* res.cookie('connect.sid', {
        maxAge: 30 * 60 * 1000, // 1/2 hour
        httpOnly: false,
        domain: 'herokuapp.com',
        //   secure: false,
        // sameSite: true,
      }); */
      res.redirect(`${env.CLIENT_BASE_URL}?name=${encodeURIComponent(
        displayName,
      )}
          &id=${encodeURIComponent(id)}
          &provider=${encodeURIComponent(provider)}`);
    },
  );
};

module.exports = Profile;
