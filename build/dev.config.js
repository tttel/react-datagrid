var PORT = 9090;
var webpack = require('webpack')
var path = require('path')

var definePlugin = new webpack.DefinePlugin({
  //we expose all vars exported by env.js to the client
  'process.env': JSON.stringify({
    NODE_ENV: 'development'
  })
});

module.exports = {
  watchPoll: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:' + PORT,
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    publicPath: '/assets/'
  },
  module: {
    loaders: require('./loaders.config')
  },
  externals: {
    faker: 'faker'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    definePlugin
  ],
  devServer: {
    publicPath: '/assets/',
    port: PORT,
    hot: true,
    host: 'localhost',
    historyApiFallback: true
  },
  resolve: {
    modulesDirectories: [
      'app_modules',
      'node_modules'
    ],
    alias: {
      src: path.resolve(__dirname, '../src'),
    }
  }
}
