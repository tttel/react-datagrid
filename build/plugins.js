var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')
var assign = require('object-assign')
var env = require('./env')

var envStringified = assign({}, env)

Object.keys(env).forEach(function(k){
  envStringified[k] = JSON.stringify(env[k])
})

var definePlugin = new webpack.DefinePlugin({
  //we expose all vars exported by env.js to the client
  'process.env': envStringified,
  '__DEV__': env.NODE_ENV === 'development'
})

var hmr = env.HOT && env.NODE_ENV != 'production' && new webpack.HotModuleReplacementPlugin();

module.exports = [
  hmr,
  new webpack.NoErrorsPlugin(),
  new ExtractTextPlugin('index.css'),
  definePlugin
].filter(function(p){
  return !!p
})
