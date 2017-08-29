var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var path = require('path');
var helpers = require('./helpers');
var src_dir = 'src';
var OfflinePlugin = require('offline-plugin');
var StaticReactRouterPlugin = require('./webpack.static-react-router.js');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

//commonConfig.entry.app.unshift(path.join(src_dir, 'offline.js'));

module.exports = webpackMerge(commonConfig, {
  // devtool: 'source-map',
  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    // pathinfo: true,
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.dependencies.LabeledModulesPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      }
    }),
    new StaticReactRouterPlugin({
      routes: path.join(src_dir, 'routes.js')
    }),
    new OfflinePlugin({
      relativePaths: false,
      //publicPath: '/',
      caches: {
        main: [':rest:'],

        // All chunks marked as `additional`, loaded after main section
        // and do not prevent SW to install. Change to `optional` if
        // do not want them to be preloaded at all (cached only when first loaded)
        additional: ['*.chunk.js',
          '*.woff',
          '*.woff2'],
      },

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,

      ServiceWorker: {
        events: true
      },
      AppCache: {
        events: true
      }
    })
  ]
});
