var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = [
  {
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader')
  }
]