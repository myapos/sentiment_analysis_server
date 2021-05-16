let PORT;
const isInDev = process.env.NODE_ENV === 'development';

if (isInDev) {
  PORT = '8585';
} else {
  PORT = process.env.PORT || 8585;
}

module.exports = { PORT };
