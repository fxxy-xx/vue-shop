import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import nProgress from 'nprogress'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//在request拦截器中，展示进度条

axios.interceptors.request.use(config =>{
  
  config.headers.Authorization = window.sessionStorage.getItem('token');
  //console.log(config);
  NProgress.start()
  return config;
})

//在response拦截器中隐藏进度条
axios.interceptors.request.use(config =>{
  NProgress.done()
  return config;
})

Vue.prototype.$http = axios
Vue.component('tree-table',TreeTable)
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth()+1+'').padStart(2,'0');
  const d = (dt.getDate()+'').padStart(2,'0');

  return `${y}-${m}-${d}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
