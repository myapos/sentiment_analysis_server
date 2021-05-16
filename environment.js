/* It will detect the environment and return any related environment variable */
const environment = () => {
  const env = {};

  if (process.env.NODE_ENV === 'development') {
    env.PORT = '8585';
    env.BASE_URL = `http://localhost:${env.PORT}`;
  } else {
    // production environment
    env.BASE_URL = 'https://sentimental-analysis-server.herokuapp.com/';
  }

  console.log('process.env.NODE_ENV', process.env.NODE_ENV, 'env', env);

  return {
    ...env,
  };
};

module.exports = environment;
