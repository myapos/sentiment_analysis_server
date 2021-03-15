const Profile = (app) => {
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
      res.redirect(`http://localhost:3000?name=${encodeURIComponent(
        displayName,
      )}
          &id=${encodeURIComponent(id)}
          &provider=${encodeURIComponent(provider)}`);
    },
  );
};

module.exports = Profile;
