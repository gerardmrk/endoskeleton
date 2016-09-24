const rucksack = require('rucksack-css')

module.exports = function () {
  rucksack({
    fallbacks: true,
    autoprefixer: { browsers: 'last 3 versions' }
  })
}
