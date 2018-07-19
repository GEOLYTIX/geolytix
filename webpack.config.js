const path = require('path');
module.exports = {
  entry: {
    desktop: ['babel-polyfill', './public/js/desktop.js'],
    mobile: ['babel-polyfill', './public/js/mobile.js'],
    gd_map: ['babel-polyfill', './public/js/gd_map.js']
  },
  output: {
    path: path.resolve(__dirname, 'public/js/build'),
    filename: '[name]_bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  }
};
