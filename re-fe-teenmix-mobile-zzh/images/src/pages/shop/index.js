import model from './models/brandstory';
import component from './components/Brandstory';

module.exports = function ({ app,registerModel }) {
    
	// app.unmodel(model.namespace);
	// //注册model
	// app.model(model);
    registerModel(model); 

	//返回Root组件
	return component;
}
