// 先导入公共包
import React from 'react';
import dva from 'dva';
import { Router, browserHistory } from 'dva/router';

import routeFactory from './routes';
import dvaLog from './dvaLog';

// 重置样式
import './reset.css';
// 全局样式
import './global.css';

let element = document.createElement('div');
element.className = 'app';

document.body.appendChild(element);

const app = dva({
	history: browserHistory,
	initialState: {}
});

app.use(dvaLog());

function createElement(RouterComponent, props) {
	// 确保传入了所有的 props！
	return <RouterComponent {...props} />
}

const cached = {};

app.router(function ({ history }) {
	return (<Router
		history={history}
		routes={{
			childRoutes: routeFactory({
				app,
				registerModel (model) {
					if (!cached[model.namespace]) {
						app.model(model);
						cached[model.namespace] = 1;
					}
				}
			}),
		}}
		createElement={createElement}
	/>);
});

app.start(element);
