'use strict'

//this env file should only be used at build time!!!!!!!!!

var assign = require('object-assign')
var parse = require('parse-keys')

var DEFAULTS = {
  //all env variables should be listed here,
  //even if they are blank
  NODE_ENV: 'development',
  HOT: false,
  PORT: 8181,
  LOCALE: 'ro-RO',
  PUBLIC_PATH: '/',
  HASH_HISTORY: false
}

module.exports = assign(
  {},

  DEFAULTS,

  //all env vars
  process.env,

  //but some of them processed
  parse(process.env, Object.keys(DEFAULTS))
)
