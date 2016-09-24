require('babel-register')({
  presets: ['es2015', 'react', 'stage-2']
})

require('babel-polyfill')

module.exports = require('./mockserver')
