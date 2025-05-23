const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // Only assets bigger than 10kB are processed
      minRatio: 0.8, // Only compress if compression ratio is better than this
    }),
  ],
};
