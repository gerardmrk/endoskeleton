require('babel-register')({
  presets: ['es2015', 'stage-2', 'react']
})

require('babel-polyfill')

module.exports = require('./mockserver')
