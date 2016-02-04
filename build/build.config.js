var assign = require('object-assign')

var loaders = require('./loaders.config')
var plugins = require('./plugins')
var resolve = require('./resolve')
var env = require('./env')
var externals = assign({}, require('./externals'));

externals.react = 'React';
externals['react-dom'] = 'ReactDOM';

module.exports = {
  bail: true,
  entry: './index.js',
  output: {
    path: __dirname + '/../dist',
    publicPath: env.PUBLIC_PATH || './',
    filename: 'index.js'
  },
  plugins: plugins,
  module: {
    loaders: loaders,
  },
  externals: externals,
  resolve: resolve
}
