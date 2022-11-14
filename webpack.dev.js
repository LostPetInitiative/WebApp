const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
var Visualizer = require('webpack-visualizer-plugin2');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new Visualizer({
      filename: './stats.html'
    })
  ]
});