
import VueRouter from 'vue-router'
import Home from '../view/MyHome.vue'
import BackgroundSetting from "../components/BackgroundSetting.vue";
import Vue from 'vue'
Vue.use(VueRouter)




const routes = [
  {
    path:'/Todolist',
    name:'MyHome',
    component:Home
  },
  {
    path:'/background',
    name:'BackgroundSetting',
    component:BackgroundSetting
  }
]
const router = new VueRouter({
  mode: 'history', // 对应 Vue 3 的 createWebHistory
  routes
})
// 全局捕获重复导航错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    // 忽略重复导航的错误
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}

export default router