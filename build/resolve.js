var path = require('path')

module.exports = {
  // Allow to omit extensions when requiring these files
  extensions: ['', '.js', '.jsx'],
  modulesDirectories: [
    'app_modules',
    'node_modules'
  ],
  alias: {
    src: path.resolve(__dirname, '../src'),
  }
}
