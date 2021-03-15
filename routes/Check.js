const Check = (app) => {
  app.get('/check', (req, res) => {
    res.status(200).json({ check: 'OK' });
  });
};

module.exports = Check;
