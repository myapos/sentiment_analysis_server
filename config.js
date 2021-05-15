/* FACEBOOK */
const FACEBOOK = {
  APP_ID: '770060963578660',
  SECRET: '0f9f4134cfe41bb287aea59291260172',
  CALLBACK_URL: '/return',
};

const SECRET_KEY_FOR_HASHING = 'KOFINAS@@crete2020';

/* TWITTER */
const TWITTER = {
  API_KEY: '0rb5yqXk6PyzT8Dq0A9gutyNp',
  API_KEY_SECRET: 'ZLIU003X3OirKgdHorLvRfkLr3zr1ny7OWMmYvxbUHFGZ9F3Tj',
  ACCESS_TOKEN: '371491511-h1qAsYD9SfPc4tXPd1N1vBVWhzyv3eNmc9dKww34',
  ACCESS_TOKEN_SECRET: 'ZLIU003X3OirKgdHorLvRfkLr3zr1ny7OWMmYvxbUHFGZ9F3Tj',
  BEARER_TOKEN:
    'AAAAAAAAAAAAAAAAAAAAAJwiMwEAAAAACwK3YALEdkYAt2dnEL3J%2BCO0zrQ%3DyiMDmE5d9WLnvJLwd6qSdhhK4ohKn3fVZsOAeNC0Ux6oMzVblt',
  CALLBACK_URL: '/return_twitter',
};

/* LINKEDIN */
const LINKEDIN = {
  API_KEY: '77f8mcse4p74ql',
  SECRET_KEY: 'QUr3ubxQ1XvFOkIK',
  CALLBACK_URL: '/auth/linkedin/callback',
};

/* GOOGLE */
// https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175
const GOOGLE = {
  CLIENT_ID:
    '179186116211-5gpumelurdnlk6e4069cqobm33il20h9.apps.googleusercontent.com',
  CLIENT_SECRET: '8ZZVVhKp265jtWe4XbzRjnF7',
  CALLBACK_URL: '/auth/google/callback',
};

module.exports = {
  FACEBOOK,
  SECRET_KEY_FOR_HASHING,
  TWITTER,
  LINKEDIN,
  GOOGLE,
};
