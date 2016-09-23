const { resolve } = require('path')

const Webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const FaviconsPlugin = require('favicons-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const rucksack = require('rucksack-css')
const postcssMath = require('postcss-math')
const precss = require('precss')

const parsePreferences = require('./helpers/parsePreferences')

const PREFS = parsePreferences(resolve(__dirname, '..'))

const { GENERAL, PATHS, PSEUDO_PATHS, ALIASES, VENDORS } = PREFS

const {
  RELATIVE_PUBLICPATH,
  CLIENT_BUNDLE_NAME_PRO,
  CLIENT_HTML_FILENAME,
  CLIENT_HTML_EXT_PRO,
  CLIENT_HTML_FROM_PATHS
} = PSEUDO_PATHS

const MAPPED_ALIASES = {}

ALIASES.forEach(rel => { MAPPED_ALIASES[rel[0]] = PATHS[rel[1]] })

const config = env => ({
  context: process.cwd(),

  target: 'web',

  devtool: 'source-map',

  entry: {
    vendor: VENDORS['all'],
    app: ['babel-polyfill', PATHS.APP]
  },

  output: {
    path: PATHS.DISTRIBUTION,
    filename: CLIENT_BUNDLE_NAME_PRO,
    chunkFilename: CLIENT_BUNDLE_NAME_PRO,
    sourceMapFilename: 'sourcemaps/[file].map',
    publicPath: RELATIVE_PUBLICPATH
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
        options: {
          presets: [['es2015', { modules: false }], 'stage-2', 'react'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.css$/,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loaders: ExtractTextPlugin.extract('style?sourceMap', [
          'css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:7]',
          'postcss'
        ])
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])$/,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: [PATHS.APP],
        exclude: [PATHS.NODE_MODULES],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 12000,
              hash: 'sha512',
              name: 'images/[name].[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new Webpack.DefinePlugin({ 'process.env': {
      'NODE_ENV': JSON.stringify('production'),
      'BABEL_ENV': JSON.stringify('production')
    }}),

    new ProgressBarPlugin({
      width: 100,
      clear: false,
      complete: chalk.bgCyan(' '),
      format: `${chalk.bold('Building... [')}:bar${chalk.bold('][')}${
        chalk.bold.magenta(':percent')}${chalk.bold('] - :msg')}`
    }),

    new CleanPlugin([
      '/**/*.js', '/**/*.js', '/**/*.css', '/**/*.gz', '/sourcemaps', '/images', '/fonts'
    ].map(path => `${PATHS.DISTRIBUTION}/${path}`), { root: process.cwd(), verbose: false }),

    new Webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'], minChunks: Infinity }),

    new Webpack.optimize.DedupePlugin(),

    new Webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compressor: { screw_ie8: true, keep_fnames: true, warnings: false },
      mangle: { screw_ie8: true, keep_fnames: true }
    }),

    new Webpack.optimize.AggressiveMergingPlugin({ minSizeReduce: 1.5 }),

    new CompressionPlugin({ asset: '[path].gz', algorithm: 'gzip' }),

    new ExtractTextPlugin('stylesheets/[name].[contenthash].css', { allChunks: true }),

    new FaviconsPlugin({
      title: GENERAL.APP_NAME,
      logo: `${PATHS.CONFIGS}/build_assets/favicon.png`,
      emitStats: false,
      statsFilename: 'iconstats-[hash].json',
      persistentCache: true,
      background: '#ffffff',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true
      }
    }),

    new HtmlPlugin(Object.assign(GENERAL, {
      cache: true,
      inject: false,
      template: `${PATHS.CONFIGS}/templates/index_template.html`,
      filename: `${PATHS[CLIENT_HTML_FROM_PATHS]}/${CLIENT_HTML_FILENAME}${CLIENT_HTML_EXT_PRO}`,
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        keepClosingSlash: true,
        preserveLineBreaks: true,
        collapseWhitespace: true
      }
    })),

    new Webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        context: process.cwd(),
        postcss: [precss, postcssMath, rucksack({
          fallbacks: true,
          autoprefixer: { browsers: 'last 3 versions' }
        })],
        imageWebpackLoader: {
          bypassOnDebug: false,
          optimizationLevel: 7,
          interlaced: true,
          progressive: true,
          svgo: {plugins: [
            { mergePaths: false },
            { convertTransform: false },
            { convertShapeToPath: false },
            { cleanupIDs: false },
            { collapseGroups: false },
            { transformsWithOnePath: false },
            { cleanupNumericValues: false },
            { convertPathData: false },
            { moveGroupAttrsToElems: false },
            { removeTitle: true },
            { removeDesc: true },
            { removeMetadata: true }
          ]}
        }
      }
    })
  ],

  resolve: {
    modules: [PATHS.NODE_MODULES],
    extensions: ['.js', '.jsx', '.json', '.css'],
    enforceExtension: false,
    alias: MAPPED_ALIASES
  }
})

module.exports = config
