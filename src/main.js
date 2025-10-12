import Vue from 'vue'
import App from './App.vue'
import router from './router';
// 引入 Bootstrap Icons 的 CSS
import 'bootstrap-icons/font/bootstrap-icons.css';
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
