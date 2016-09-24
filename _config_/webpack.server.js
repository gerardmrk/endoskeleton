const { resolve } = require('path')

const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlPlugin = require('html-webpack-plugin')
const precss = require('precss')
const rucksack = require('rucksack-css')
const postcssMath = require('postcss-math')

const parsePreferences = require('./helpers/parsePreferences')

const PREFS = parsePreferences(resolve(__dirname, '..'))

const { GENERAL, PATHS, PSEUDO_PATHS, DEV, ALIASES } = PREFS
const { HMR_HOST, HMR_PORT } = DEV
const {
  CLIENT_BUNDLE_NAME_DEV,
  CLIENT_HTML_FILENAME,
  CLIENT_HTML_EXT_DEV,
  CLIENT_HTML_FROM_PATHS
} = PSEUDO_PATHS

const HMR_ADDR = `http://${HMR_HOST}:${HMR_PORT}`

const MAPPED_ALIASES = {}

ALIASES.forEach(rel => { MAPPED_ALIASES[rel[0]] = PATHS[rel[1]] })

const config = {
  context: PATHS.ROOT,

  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    `webpack-dev-server/client?${HMR_ADDR}`,
    'webpack/hot/only-dev-server',
    PATHS.APP_ENTRYPOINT
  ],

  output: {
    filename: CLIENT_BUNDLE_NAME_DEV,
    chunkFilename: CLIENT_BUNDLE_NAME_DEV,
    path: PATHS.DISTRIBUTION,
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.json$/,
        exclude: [PATHS.NODE_MODULES],
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [['es2015', { modules: false }], 'stage-2', 'react'],
          plugins: ['react-hot-loader/babel']
        }
      },
      {
        test: /\.css$/,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loaders: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:7]'
            }
          },
          { loader: 'postcss-loader' }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loader: 'file-loader',
        query: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  },

  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NamedModulesPlugin(),
    new HtmlPlugin(Object.assign(GENERAL, {
      cache: true,
      inject: false,
      favicon: `${PATHS.CONFIGS}/build_assets/favicon.ico`,
      template: `${PATHS.CONFIGS}/templates/index_template.html`,
      filename: `${PATHS['DISTRIBUTION']}/${
        CLIENT_HTML_FILENAME}${CLIENT_HTML_EXT_DEV}`,
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        keepClosingSlash: true,
        preserveLineBreaks: true,
        collapseWhitespace: false
      }
    })),
    new Webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: false,
      options: {
        context: process.cwd(),
        postcss: [
          precss,
          postcssMath,
          rucksack({
            fallbacks: true,
            autoprefixer: { browsers: 'last 3 versions' }
          })
        ]
      }
    })
  ],

  resolve: {
    modules: [PATHS.NODE_MODULES],
    extensions: ['.js', '.jsx', '.json', '.css'],
    enforceExtension: false,
    alias: MAPPED_ALIASES
  },

  devtool: 'cheap-module-eval-source-map',

  target: 'web',

  cache: true
}

const server = new WebpackDevServer(Webpack(config), {
  stats: { colors: true },
  host: HMR_HOST,
  port: HMR_PORT,
  hot: true,
  contentBase: PATHS.DISTRIBUTION,
  publicPath: config.output.publicPath,
  historyApiFallback: true
})

server.listen(HMR_PORT, HMR_HOST, (err, result) => {
  if (err) return console.error('Error initializing HMR server: ', err)
  console.log(`Local Development Server listening on ${HMR_ADDR}`)
})
