let PORT;

if (process.env.NODE_ENV === 'development') {
  PORT = '8585';
} else {
  PORT = process.env.PORT || 8585;
}

module.exports = { PORT };
