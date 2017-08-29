/* eslint prefer-template: 0 */
/**
 * flex高清模式，支持任意等比缩放、兼容性好
 */
(function () {
	'use strict';

	/**
	 * @param {Number} [baseFontSize = 100] - 基础fontSize, 默认100px;
	 * @param {Number} [fontscale = 1] - 有的业务希望能放大一定比例的字体;
	 */
	const win = window;
	win.flex = (baseFontSize, fontscale) => {
		const newBaseFontSize = baseFontSize || 100;
		const newFontscale = fontscale || 1;

		const doc = win.document;
		const ua = navigator.userAgent;
		const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
		const androidVersion = ua.match(/Android([\S\s]+);/i);
		const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
		const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;
		const isAndroidHd = androidVersion && parseInt(androidVersion[1].split('.').join(''), 10) >= 444;
		const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
		let dpr = win.devicePixelRatio || 1;
		if (!isIos && !(matches && matches[1] > 534 && isAndroidHd) && !isUCHd) {
			// 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
			dpr = 1;
		}
		const scale = 1 / dpr;

		let metaEl = doc.querySelector('meta[name="viewport"]');
		if (!metaEl) {
			metaEl = doc.createElement('meta');
			metaEl.setAttribute('name', 'viewport');
			doc.head.appendChild(metaEl);
		}
		metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`);
		doc.body.style.fontSize = doc.documentElement.style.fontSize = `${newBaseFontSize / 2 * dpr * newFontscale}px`;
	};
	win.flex();
}());

if (!navigator.userAgent.match(/android|iphone|ipad|ipod/gi)) {
	let docElement = document.documentElement;
	docElement.className = ((docElement.className || '' ) + ' is-pc').split(/\s+/g).join(' ');

	let styleText = `
    html.is-pc {
      background-color: #DDD !important;
    }

    .is-pc body {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -284px 0 0 -160px !important;
      width: 320px !important;
      height: 568px !important;
      background-color: #FFF;
    }

    .is-pc .am-activity-indicator {
      width: 320px !important;
      height: 568px !important;
      top: 50% !important;
      left: 50% !important;
      margin: -284px 0 0 -160px !important;
    }
`;
	let styleElement = document.createElement('style');
	styleElement.innerText = styleText;
	docElement.appendChild(styleElement);
}
