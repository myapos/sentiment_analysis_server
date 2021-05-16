/* It will detect the environment and return any related environment variable */
const environment = () => {
  const env = {};

  if (process.env.NODE_ENV === 'development') {
    env.PORT = '8585';
    // env.CLIENT_BASE_URL = `http://localhost:${env.PORT}`;
    env.CLIENT_BASE_URL = 'http://localhost:3000';
  } else {
    // production environment
    env.CLIENT_BASE_URL =      'https://sentimental-analysis-dashboard.herokuapp.com/';
  }

  console.log('process.env.NODE_ENV', process.env.NODE_ENV, 'env', env);

  return {
    ...env,
  };
};

module.exports = environment;
