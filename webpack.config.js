const path = require('path');

module.exports = {
  // other webpack configuration options...
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  }
};