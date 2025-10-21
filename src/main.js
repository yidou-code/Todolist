import Vue from 'vue'
import App from './App.vue'
import router from './router';
// 引入 Bootstrap Icons 的 CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

Vue.config.productionTip = false

// 创建事件总线
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
    userLoggedIn(userData) {
      this.userState.isLoggedIn = true
      this.userState.userInfo = userData
      this.$emit('userLoggedIn', userData)
    },
    userLoggedOut() {
      this.userState.isLoggedIn = false
      this.userState.userInfo = null
      this.$emit('userLoggedOut')
         console.log('事件总线收到用户注销事件');
      this.$emit('userLoggedOut');
    },
    userAvatarUpdated(avatarData) {
      if (this.userState.userInfo) {
        this.userState.userInfo.avatar = avatarData.avatarUrl
      }
      this.$emit('userAvatarUpdated', avatarData)
    }
    
  }
})

Vue.prototype.$eventBus = eventBus

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')