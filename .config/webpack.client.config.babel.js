import 'babel-polyfill'
import { resolve } from 'path'

import Webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import FaviconsPlugin from 'favicons-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import VisualizerPlugin from 'webpack-visualizer-plugin'
import chalk from 'chalk'
import rucksack from 'rucksack-css'
import postcssMath from 'postcss-math'
import precss from 'precss'

import parseConfigs from './helpers/parseConfigs'

const config = async options => {
  const parsedConfigs = await parseConfigs(resolve(__dirname, '..'))
  const { APP_META, PATHS, ALIASES, PSEUDO_PATHS, ENTRIES } = parsedConfigs
  const {
    BUNDLE_NAME_CLIENT,
    BUILD_SOURCEMAPS,
    BUILD_GZIP,
    BUILD_STYLES,
    BUILD_ICON_STATS,
    BUILD_VISUALIZER_STATS,
    RELATIVE_PUBLICPATH,
    INDEXHTML_FROM_PATHS,
    INDEXHTML_FILE_NAME,
    INDEXHTML_FILE_EXT,
    BASE_FAVICON_FROM_CFG,
    HTML_TEMPLATE_FROM_CFG
  } = PSEUDO_PATHS

  return {
    context: process.cwd(),

    target: 'web',

    devtool: 'source-map',

    entry: ENTRIES,

    output: {
      path: PATHS.BUILD_CLIENT,
      filename: BUNDLE_NAME_CLIENT,
      chunkFilename: BUNDLE_NAME_CLIENT,
      sourceMapFilename: BUILD_SOURCEMAPS,
      publicPath: RELATIVE_PUBLICPATH
    },

    resolve: {
      modules: [PATHS.NODE_MODULES],
      extensions: ['.js', '.jsx', '.json', '.css'],
      enforceExtension: false,
      alias: ALIASES
    },

    module: {
      rules: [
        { test: /\.json$/, exclude: [PATHS.NODE_MODULES], loader: 'json-loader' },
        {
          test: /\.jsx?$/,
          include: [PATHS.APP],
          exclude: [PATHS.NODE_MODULES],
          loader: 'babel-loader',
          query: {
            babelrc: false,
            presets: [['es2015', { modules: false }], 'stage-2', 'react'],
            plugins: ['transform-runtime']
          }
        },
        {
          test: /\.css$/,
          include: [PATHS.APP],
          exclude: [PATHS.NODE_MODULES],
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: [
              {
                loader: 'css-loader',
                query: {
                  sourceMap: true,
                  modules: true,
                  importLoaders: 1,
                  localIdentName: '[name]__[local]__[hash:base64:7]'
                }
              },
              { loader: 'postcss-loader', query: { sourceMap: true } }
            ]
          })
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          include: [PATHS.APP],
          exclude: [PATHS.NODE_MODULES],
          loader: 'url-loader',
          query: { limit: 20000, mimetype: 'application/font-woff', name: 'fonts/[hash].[ext]' }
        },
        {
          test: /\.ttf$|\.eot$/,
          include: [PATHS.APP],
          exclude: [PATHS.NODE_MODULES],
          loader: 'file-loader',
          query: { name: 'fonts/[hash].[ext]' }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          include: [PATHS.APP],
          exclude: [PATHS.NODE_MODULES],
          use: [
            {
              loader: 'url-loader',
              query: { limit: 20000, hash: 'sha512', name: 'images/[name].[hash].[ext]' }
            },
            { loader: 'image-webpack-loader' }
          ]
        }
      ]
    },

    plugins: [
      new Webpack.DefinePlugin({ 'process.env': {
        'NODE_ENV': JSON.stringify(options.production ? 'production' : 'development')
      }}),

      new ProgressBarPlugin({
        width: 100,
        clear: false,
        complete: chalk.bgCyan(' '),
        format: `${chalk.bold('Building... [')}:bar${chalk.bold('][')}${
          chalk.bold.magenta(':percent')}${chalk.bold('] - :msg')}`
      }),

      new VisualizerPlugin({ filename: BUILD_VISUALIZER_STATS }),

      new CleanPlugin([
        '/**/*.js', '/**/*.js', '/**/*.css', '/**/*.gz', '/sourcemaps', '/images', '/fonts'
      ].map(path => `${PATHS.BUILD_CLIENT}/${path}`), { root: process.cwd(), verbose: false }),

      new Webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compressor: { screw_ie8: true, keep_fnames: true, warnings: false },
        mangle: { screw_ie8: true, keep_fnames: true }
      }),

      new Webpack.optimize.CommonsChunkPlugin({
        names: [...Object.keys(ENTRIES).filter(en => en !== 'app'), 'manifest'],
        minChunks: Infinity
      }),

      new Webpack.optimize.AggressiveMergingPlugin({ minSizeReduce: 1.5 }),

      new Webpack.optimize.DedupePlugin(),

      new CompressionPlugin({ asset: BUILD_GZIP, algorithm: 'gzip' }),

      new ExtractTextPlugin({ filename: BUILD_STYLES, allChunks: true }),

      new FaviconsPlugin({
        title: APP_META.APP_NAME,
        logo: `${PATHS.CONFIGS}/${BASE_FAVICON_FROM_CFG}`,
        emitStats: false,
        statsFilename: BUILD_ICON_STATS,
        persistentCache: true,
        background: '#ffffff',
        inject: true,
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

      new HtmlPlugin({
        nonlocal: process.env.nonlocal,
        production: options.production,
        cache: true,
        inject: false,
        template: `${PATHS.CONFIGS}/${HTML_TEMPLATE_FROM_CFG}`,
        filename: `${PATHS[INDEXHTML_FROM_PATHS]}/${INDEXHTML_FILE_NAME}${INDEXHTML_FILE_EXT}`,
        minify: {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          keepClosingSlash: true,
          preserveLineBreaks: true,
          collapseWhitespace: true
        },
        META: APP_META
      }),

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
    ]
  }
}

export default config
