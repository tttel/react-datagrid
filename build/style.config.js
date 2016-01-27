var ExtractTextPlugin = require('extract-text-webpack-plugin')

var loaders = require('./loaders.config')

module.exports = {
  bail: true,
  entry: {
    index: './index.scss'
  },
  output: {
    filename: 'index.css',
    path: '.'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('index.css')
  ]
}
