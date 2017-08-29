import model from './models/contactus';
import component from './components/Contactus';

module.exports = function ({ app, registerModel }) {
	//注册model
	registerModel(model);
	//返回Root组件
	return component;
}
