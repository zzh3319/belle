import apiDev from './api.dev';
import api from './api';

let exportAPI;
// 判断环境导出开发用的API和生产用的API
if (process.env.NODE_ENV !== 'production') {
  exportAPI = apiDev;
} else {
  exportAPI = api;
}
const expotValue = exportAPI;
export default expotValue;
