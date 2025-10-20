import Vue from 'vue'
import App from './App.vue'
import router from './router';
// 引入 Bootstrap Icons 的 CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

Vue.config.productionTip = false

// 创建更健壮的事件总线
const eventBus = new Vue({
  data() {
    return {
      userState: {
        isLoggedIn: false,
        userInfo: null
      }
    }
  },
  methods: {
    // 用户登录事件
    userLoggedIn(userData) {
      this.userState.isLoggedIn = true
      this.userState.userInfo = userData
      this.$emit('userLoggedIn', userData)
    },
    // 用户注销事件
    userLoggedOut() {
      this.userState.isLoggedIn = false
      this.userState.userInfo = null
      this.$emit('userLoggedOut')
    },
    // 头像更新事件
    userAvatarUpdated(avatarData) {
      if (this.userState.userInfo) {
        this.userState.userInfo.avatar = avatarData.avatarUrl
      }
      this.$emit('userAvatarUpdated', avatarData)
    }
  }
})

// 挂载到 Vue 原型
Vue.prototype.$eventBus = eventBus

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')