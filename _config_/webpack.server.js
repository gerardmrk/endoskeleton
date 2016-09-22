const { readFileSync } = require('fs')
const { resolve } = require('path')

const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlPlugin = require('html-webpack-plugin')

let PREFS

try {
  // NON-DYNAMIC [START]
  const rootPath = resolve(__dirname, '..')
  PREFS = JSON.parse(readFileSync(`${rootPath}/_config_/preferences.json`, 'utf8'))
  // NON-DYNAMIC [END]

  Object.keys(PREFS.PATHS).forEach(pathname => {
    const path = PREFS.PATHS[pathname]
    PREFS.PATHS[pathname] = `${rootPath}/${path}`
  })
  PREFS.PATHS['root'] = rootPath
} catch (err) {
  console.error(err)
}

const { GENERAL, PATHS, PSEUDO_PATHS, DEV } = PREFS
const { HMR_HOST, HMR_PORT } = DEV
const {
  CLIENT_BUNDLE_NAME,
  CLIENT_HTML_FILENAME,
  CLIENT_HTML_LOCATION,
  RELATIVE_PUBLICPATH
} = PSEUDO_PATHS

const HMR_ADDR = `http://${HMR_HOST}:${HMR_PORT}`

const config = {
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?${HMR_ADDR}`,
    'webpack/hot/only-dev-server',
    PATHS.APP_ENTRYPOINT
  ],

  output: {
    filename: CLIENT_BUNDLE_NAME,
    path: PATHS.DISTRIBUTION,
    publicPath: RELATIVE_PUBLICPATH
  },

  module: {
    rules: [
      {
        test: /\.json$/,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loader: 'babel-loader'
      },
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
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loader: 'file-loader',
        options: {
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
      filename: `${PATHS[CLIENT_HTML_LOCATION]}/${CLIENT_HTML_FILENAME}`,
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        keepClosingSlash: true,
        preserveLineBreaks: false,
        collapseWhitespace: false
      }
    }))
  ],

  resolve: {
    modules: [PATHS.NODE_MODULES],
    extensions: ['.js', '.jsx', '.json', '.css'],
    enforceExtension: false,
    alias: {
      components: PATHS.APP_COMPONENTS,
      containers: PATHS.APP_CONTAINERS,
      actions: PATHS.APP_ACTIONS,
      reducers: PATHS.APP_REDUCERS,
      utilities: PATHS.APP_UTILITIES
    }
  },

  devtool: 'inline-source-map',

  target: 'web'
}

const server = new WebpackDevServer(Webpack(config), {
  host: HMR_HOST,
  port: HMR_PORT,
  hot: true,
  contentBase: PATHS.DISTRIBUTION,
  publicPath: RELATIVE_PUBLICPATH
})

server.listen(HMR_PORT, HMR_HOST, (err, result) => {
  if (err) return console.error('Error initializing HMR server: ', err)
  console.log(`Local Development Server listening on ${HMR_ADDR}`)
})
