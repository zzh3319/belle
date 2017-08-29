var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

module.exports = webpackMerge(commonConfig, {
  debug: true,
  devtool: 'source-map',
  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    pathinfo: true,
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.dependencies.LabeledModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ],
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    stats: 'minimal',
    setup: function(app) {
      app.use('/data', function(req, res) {

        res.sendFile(path.join(helpers.root('static'), '/data/' + (req.url || '').split(/\?/)[0]));
      });
    },
	proxy: {
		'/api1': {
			"target": "http://www.xui.com/api/",
			"changeOrigin": true,
			"pathRewrite": { "^/api1" : "" }
		},
		"/api2": {
			"target": "http://jsonplaceholder.typicode.com/",
			"changeOrigin": true,
			"pathRewrite": { "^/api2" : "" }
		}
	}
  }
});
