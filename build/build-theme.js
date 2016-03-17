'use strict'

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var extractLoaders = require('./extractLoaders')

module.exports = function(themeName){

  var entry = {
    index: './style/theme/' + themeName + '/index.scss'
  };

  return {
    entry: entry,
    output: {
      path: path.resolve('./theme/'),
      filename: themeName + '.css'
    },
    module: {
      loaders: extractLoaders
    },
    plugins: [
      new ExtractTextPlugin(themeName + '.css')
    ]
  }
}