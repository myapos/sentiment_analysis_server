const fetch = require('node-fetch');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();
const { BadRequest } = require('../utils/errors');
const { TWITTER } = require('../config.js');

const Teets = (app) => {
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
        return res.status(200).json({ ...tweets, score });
      })
      .catch((e) => {
        const error = new BadRequest(e.message);
        next(error);
      });
  });
};

module.exports = Teets;
