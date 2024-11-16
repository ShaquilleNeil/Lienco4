const path = require('path');

module.exports = {
  // other configuration options...
  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      // add any other modules you need
    },
  },
};
