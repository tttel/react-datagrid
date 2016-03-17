var fs = require('fs')
var path = require('path')
var assign = require('object-assign')

var webpack = require('webpack')

var buildTheme = require('./build-theme')
var buildCss = require('./build-css')

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

var themes = getDirectories(path.resolve('./style/theme'))

themes.forEach(theme => {
  webpack(buildTheme(theme)).run(function(err, stats){
    if (err){
      console.error(err)
      process.exit(1)
    }

    console.log('Built theme ' + theme + '.')
  })
})

;['base', 'index'].forEach(file => {
  webpack(buildCss(file)).run((err, stats) => {
    if (err){
      console.error(err)
      process.exit(1)
    }

    console.log('Built file ' + file + '.css')
  })
})