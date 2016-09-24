const { readFileSync } = require('fs')
let PREFS

try {
  PREFS = JSON.parse(readFileSync('./_config_/preferences.json', 'utf8'))
} catch (err) {
  console.error(err)
}

const { PATHS, ALIASES } = PREFS

const MAPPED_ALIASES = {}

ALIASES.forEach(rel => { MAPPED_ALIASES[rel[0]] = `./${PATHS[rel[1]]}` })

console.log(MAPPED_ALIASES)

require('babel-register')({
  presets: ['es2015', 'stage-2', 'react'],
  plugins: [['module-resolver', { alias: MAPPED_ALIASES }]]
})

require('babel-polyfill')

module.exports = require('./server/mockserver')
