module.exports = function (appConfig) {
	return [
    {
            path: '/',
            getComponent(nextState, callback) {
                require.ensure([], (require) => {
                    //返回一个工厂方法，传入appConfig返回组件
                    var factory = require('src/pages/home');
                    callback(null, factory(appConfig));
                });
            },
    },
	
    {
    		path: 'productCategories',
    		getComponent(nextState, callback) {
    			require.ensure([], (require) => {
    				//返回一个工厂方法，传入appConfig返回组件
    				var factory = require('src/pages/productCategories');
    				callback(null, factory(appConfig));
    			});
    		},
    },
    {
            path: 'movieShow',
            getComponent(nextState, callback) {
                require.ensure([], (require) => {
                    //返回一个工厂方法，传入appConfig返回组件
                    var factory = require('src/pages/movieShow');
                    callback(null, factory(appConfig));
                });
            },
    },
    {
            path: 'newListing',
            getComponent(nextState, callback) {
                require.ensure([], (require) => {
                    //返回一个工厂方法，传入appConfig返回组件
                    var factory = require('src/pages/newListing');
                    callback(null, factory(appConfig));
                });
            },
    },
  
    {
            path: 'brandStory',
            getComponent(nextState, callback) {
                require.ensure([], (require) => {
                    //返回一个工厂方法，传入appConfig返回组件
                    var factory = require('src/pages/brandStory');
                    callback(null, factory(appConfig));
                });
            },
    },
    {
            path: 'contactUs',
            getComponent(nextState, callback) {
                require.ensure([], (require) => {
                    //返回一个工厂方法，传入appConfig返回组件
                    var factory = require('src/pages/contactUs');
                    callback(null, factory(appConfig));
                });
            },
    },
    ];
}
