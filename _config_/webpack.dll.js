const { resolve } = require('path')

const Webpack = require('webpack')
const parsePreferences = require('./helpers/parsePreferences')

const rootPath = resolve(__dirname, '..')

const { PATHS, VENDORS } = parsePreferences(rootPath)

const entries = {}

Object.keys(VENDORS).forEach(vGroup => {
  entries[vGroup] = VENDORS[vGroup]
})

const config = {
  context: rootPath,

  entry: entries,

  output: {
    filename: 'dll/[name].dll.js',
    path: PATHS.DISTRIBUTION,
    library: '[name]'
  },

  plugins: [
    new Webpack.DllPlugin({
      name: '[name]',
      path: `${PATHS.DISTRIBUTION}/dll/[name].json`
    }),
    new Webpack.NamedModulesPlugin()
  ],

  resolve: {
    modules: [PATHS.NODE_MODULES],
    extensions: ['.js', '.jsx', '.json', '.css'],
    enforceExtension: false
  }
}

module.exports = config
