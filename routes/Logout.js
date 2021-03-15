const Logout = (app) => {
  app.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('connect.sid');
    res.status(200).json({ clearedCookies: 'OK' });
  });
};

module.exports = Logout;
