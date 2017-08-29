var webpack = require('webpack');

var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');

var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

var pxtorem = require('postcss-pxtorem');

var helpers = require('./helpers');
var ROOT_PATH = helpers.root.path;
var path = require('path');

var node_modules_path = helpers.root('node_modules');

var src_dir = 'src';

var src_path = helpers.root(src_dir);

module.exports = {
	entry: {
		'dva-immutable': [
			'dva', 'immutable',
			'react', 'react-dom', 'react-router'
		],
		'polyfills': [path.join(src_dir, 'polyfills.js'), 'babel-polyfill'],
		'app': [path.join(src_dir, 'app.jsx')]
	},
	resolve: {
		root: [ROOT_PATH],
		modulesDirectories: ['node_modules', node_modules_path],
		extensions: ['', '.web.js', '.js', '.js', '.jsx'],
	},
	output: {
		libraryTarget: 'var'
	},
	module: {
		loaders: [
        { test: /\.json$/, loader: "json" },
		{
			test: /\.html$/,
			loader: 'html'
		}, {
			test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
			loader: 'file?name=assets/[name].[hash].[ext]'
		}, {
			test: function test(filePath) {
				return (/\.css$/.test(filePath) && !/\.p\.css$/.test(filePath));
			},
			loaders: ['style', 'css', 'postcss']
		}, {
			test: /\.p\.css$/,
			loaders: ['style', 'css?modules&importLoaders=1&camelCase&localIdentName=[name]---[local]---[hash:base64:5]', 'postcss']
		}, {
			test: /\.(js|jsx)$/,
			exclude: /(node_modules)/,
			loader: 'babel',
			query: {
				plugins: ['lodash'],
			}
		}]
	},

	postcss: function () {
		return [
			precss,
			pxtorem({
				rootValue: 100,
				propWhiteList: [],
			}),
			autoprefixer({
				browsers: [
					'>1%',
					'last 4 versions',
					'Firefox ESR',
					'not ie < 9', // React doesn't support IE8 anyway
				]
			}),
		];
	},

	plugins: [
		new LodashModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['polyfills', 'dva-immutable']
		}),
		new HtmlWebpackPlugin({
			template: path.join(src_path, 'index.html')
		})
	]
};
