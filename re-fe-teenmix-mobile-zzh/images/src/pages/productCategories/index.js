import model from './models/productCategories';
import component from './components/Productcategories';

module.exports = function ({ app,registerModel }) {
    
	// app.unmodel(model.namespace);
	// //注册model
	// app.model(model);
    registerModel(model); 

	//返回Root组件
	return component;
}
