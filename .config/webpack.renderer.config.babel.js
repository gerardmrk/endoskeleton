import 'babel-polyfill'
import dotenv from 'dotenv'
dotenv.config({ path: './.config/.env' })

import { resolve } from 'path'

import Webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import rucksack from 'rucksack-css'
import postcssMath from 'postcss-math'
import precss from 'precss'

import parseConfigs from './helpers/parseConfigs'

const config = async options => {
  const parsedConfigs = await parseConfigs(resolve(__dirname, '..'))
  const { PATHS, ALIASES, PSEUDO_PATHS } = parsedConfigs
  const { BUNDLE_NAME_RENDERER } = PSEUDO_PATHS
  const RPBP = PSEUDO_PATHS.RELATIVE_PUBLICPATH
  return {
    context: process.cwd(),

    target: 'node',

    externals: [nodeExternals({
      importType: 'commonjs',
      modulesDir: PATHS.NODE_MODULES,
      modulesFromFile: false,
      whitelist: []
    })],

    entry: PATHS.RENDERER,

    output: {
      path: PATHS.BUILD_RENDERER,
      filename: BUNDLE_NAME_RENDERER
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
          include: [PATHS.SOURCE],
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
          include: [PATHS.SOURCE],
          exclude: [PATHS.NODE_MODULES],
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]__[hash:base64:7]'
              }
            },
            { loader: 'postcss-loader', query: { sourceMap: false } }
          ]
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          include: [PATHS.SOURCE],
          exclude: [PATHS.NODE_MODULES],
          loader: 'url-loader',
          query: {
            limit: 20000,
            emitFile: false,
            mimetype: 'application/font-woff',
            name: `${RPBP}fonts/[hash].[ext]`
          }
        },
        {
          test: /\.ttf$|\.eot$/,
          include: [PATHS.SOURCE],
          exclude: [PATHS.NODE_MODULES],
          loader: 'file-loader',
          query: { emitFile: false, name: `${RPBP}fonts/[hash].[ext]` }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          include: [PATHS.SOURCE],
          exclude: [PATHS.NODE_MODULES],
          use: [
            {
              loader: 'url-loader',
              query: {
                limit: 20000,
                emitFile: false,
                hash: 'sha512',
                name: `${RPBP}images/[name].[hash].[ext]`
              }
            },
            { loader: 'image-webpack-loader' }
          ]
        }
      ]
    },

    plugins: [
      new Webpack.DefinePlugin({ 'process.env': {
        'NODE_ENV': JSON.stringify(options.production !== 'false' ? 'production' : 'development'),
        'RENDERER_HOSTNAME': JSON.stringify(process.env.RENDERER_HOSTNAME),
        'RENDERER_PORT_HTTP': JSON.stringify(process.env.RENDERER_PORT_HTTP)
      }}),

      new Webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compressor: { screw_ie8: true, keep_fnames: true, warnings: false },
        mangle: { screw_ie8: true, keep_fnames: true }
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
