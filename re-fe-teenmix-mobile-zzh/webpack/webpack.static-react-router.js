/*
 *{
 * routes
 * template
 * }
 */

var flattenDeep = require('lodash/flattenDeep');
var path = require('path');

function StaticReactRouterPlugin(options) {
	this.options = options;
}

StaticReactRouterPlugin.prototype.apply = function (compiler) {
	let { routes } = this.options;
	let routesFactory = require(path.join('../', routes));
	let routesArray = routesFactory({});
	compiler.plugin('emit', function (compilation, cb) {
		let array = getAllPaths(routesArray);
		let index = compilation.assets['index.html'];
		array.map((path)=> {
			if (path !== '/') {
				compilation.assets[path + '/index.html'] = index;
			}
		});
		return cb && cb();
	});
};
function getNestedPaths(route, prefix) {
	if (!route) return [];
	if (Array.isArray(route)) {
		return route.map(x => getNestedPaths(x, prefix));
	}
	let path = route.path;
	if (!path) {
		return [];
	}

	path = (prefix || '') + path;
	const nextPrefix = path === '/' ? path : path + '/';

	const childRoutes = route.childRoutes;
	return [].concat([path], getNestedPaths(childRoutes, nextPrefix));
}
function getAllPaths(routes) {
	return flattenDeep(getNestedPaths(routes));
}
module.exports = StaticReactRouterPlugin;
