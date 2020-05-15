import Vue from 'vue'
// 导入App组件
import App from './App.vue'
// 导入路由
import router from './router'
// 导入element-ui
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标样式
import './assets/fonts/iconfont.css'
// 导入自定义指令
import './directives/focus'
// 导入axios依赖
import axios from 'axios'
// 设置基础url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 设置请求拦截器
axios.interceptors.request.use(config => {
    // 在请求头中增加 Authorization 字段，用于验证用户登录状态
    config.headers['Authorization'] = sessionStorage.getItem('token')
    return config
});
// 把axios挂载到Vue原型对象中
Vue.prototype.$axios = axios
Vue.config.productionTip = false

// 创建Vue实例并挂载路由和根组件
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')