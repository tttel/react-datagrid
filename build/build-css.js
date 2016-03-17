'use strict'

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var extractLoaders = require('./extractLoaders')

module.exports = function(file){

  var entry = {
    index: './style/' + file + '.scss'
  };

  return {
    entry: entry,
    output: {
      path: path.resolve('./'),
      filename: file + '.css'
    },
    module: {
      loaders: extractLoaders
    },
    plugins: [
      new ExtractTextPlugin(file + '.css')
    ]
  }
}