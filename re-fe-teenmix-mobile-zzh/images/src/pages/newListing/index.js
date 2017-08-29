import model from './models/newListing';
import component from './components/NewListing';

module.exports = function ({ app, registerModel }) {    
    // app.unmodel(model.namespace);
    // //注册model
    // app.model(model);
     registerModel(model); 
 
    //返回Root组件
    return component;
}
