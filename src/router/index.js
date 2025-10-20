import VueRouter from 'vue-router'
import Vue from 'vue'
import Home from '../view/MyHome.vue'
import BackgroundSetting from "../components/BackgroundSetting.vue"
import LoginInterface from '../components/LoginInterface.vue'
import RegisterInterface from '../components/RegisterInterface.vue'

Vue.use(VueRouter)

const routes = [
  // 默认路由重定向到登录页
  {
    path: '/',
    redirect: '/login'
  },
  // 主页 - 任务清单
  {
    path: '/Todolist',
    name: 'MyHome',
    component: Home,
    meta: {
      requiresAuth: false // 测试阶段开放，生产环境改为 true
    }
  },
  // 登录页面
  {
    path: '/login',
    name: 'Login',
    component: LoginInterface,
    meta: {
      requiresAuth: false,
      title: '用户登录 - 任务清单'
    }
  },
  // 注册页面
  {
    path: '/register',
    name: 'Register',
    component: RegisterInterface,
    meta: {
      requiresAuth: false,
      title: '用户注册 - 任务清单'
    }
  },
  // 背景设置
  {
    path: '/background',
    name: 'BackgroundSetting',
    component: BackgroundSetting,
    meta: {
      requiresAuth: false // 测试阶段开放
    }
  },
  // 关于页面（根据您的导航栏）
  {
    path: '/about',
    name: 'About',
    component: {
      template: `
        <div class="about-page" style="padding: 2rem; text-align: center;">
          <h2>关于任务清单</h2>
          <p>这是一个功能完整的任务管理应用</p>
        </div>
      `
    },
    meta: {
      requiresAuth: false
    }
  },
  // 404 页面
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 路由守卫 - 测试阶段暂时注释掉认证检查
router.beforeEach((to, from, next) => {
  // 测试阶段：开放所有路由访问
  console.log(`路由跳转: ${from.path} -> ${to.path}`)
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = '任务清单'
  }
  
  next()
  
  // 生产环境的认证检查（暂时注释）
  /*
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要登录但未登录，跳转到登录页
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.name === 'Login' && isAuthenticated) {
    // 已登录用户访问登录页，跳转到主页
    next({ name: 'MyHome' })
  } else {
    next()
  }
  */
})

// 修复重复导航错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}

export default router