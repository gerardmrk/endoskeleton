const { readFileSync } = require('fs')
const { resolve } = require('path')

const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlPlugin = require('html-webpack-plugin')

let PREFS

try {
  const rootPath = resolve(__dirname, '..')
  PREFS = JSON.parse(readFileSync(`${rootPath}/_config_/preferences.json`, 'utf8'))
  Object.keys(PREFS.PATHS).forEach(pathname => {
    const path = PREFS.PATHS[pathname]
    PREFS.PATHS[pathname] = `${rootPath}/${path}`
  })
  PREFS.PATHS['root'] = rootPath
  console.log(PREFS)
} catch (err) {
  console.error(err)
}

const { PATHS, DEV } = PREFS
const { HMR_HOST, HMR_PORT } = DEV
const HMR_ADDR = `http://${HMR_HOST}:${HMR_PORT}`

const config = env => ({
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?${HMR_ADDR}`,
    'webpack/hot/only-dev-server',
    PATHS.APP_ENTRYPOINT
  ],

  output: {
    filename: 'meme.js',
    path: PATHS.DISTRIBUTION,
    publicPath: '/'
  },

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    contentBase: PATHS.DISTRIBUTION,
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { modules: false }], 'stage-2', 'react'],
          plugins: ['react-hot-loader/babel']
        }
      },
      {
        test: /\.css$/,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:7]'
            }
          },
          { loader: 'postcss-loader' }
        ]
      }
    ]
  },

  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NamedModulesPlugin(),
    // new HtmlPlugin(Object.assign({}, {
    //   filename: ''
    // }))
  ]
})

module.exports = config
