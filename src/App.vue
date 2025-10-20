<template>
  <div id="app">
    <!-- 选择其中一个导航栏组件使用 -->
    <NavigationBar1 />
    
    <!-- <NavigationBar2 /> -->
    <!-- <NavigationBar3 /> -->
    <!-- <NavigationBar4 /> -->
    <!-- <NavigationBar5 /> -->
       <!-- 路由组件将在这里渲染 -->
  <router-view />
    
  
  </div>
</template>

<script>
// 导入所有导航栏组件，根据需要注释/取消注释
import NavigationBar1 from './components/NavigationBar1.vue'
// import NavigationBar2 from './components/NavigationBar2.vue'
// import NavigationBar3 from './components/NavigationBar3.vue'
// import NavigationBar4 from './components/NavigationBar4.vue'
// import NavigationBar5 from './components/NavigationBar5.vue'



// import MyHead from './components/MyHead.vue'
// import InputSection from './components/InputSection.vue'
// import TaskList from './components/TaskList.vue'
// import MyFooter from './components/MyFooter.vue'

export default {
  name: 'App',
  components: {
    NavigationBar1,
    // NavigationBar2,
    // NavigationBar3,
    // NavigationBar4,
    // NavigationBar5,
    // MyHead,
    // InputSection,
    // TaskList,
    // MyFooter
  },
  data() {
    return {
      todos: [],
      currentFilter: 'all'
    }
  },
  computed: {
     showNavigation() {
      // 在登录和注册页面隐藏导航栏
      return this.$route.name !== 'Login' && this.$route.name !== 'Register'
    },
    filteredTodos() {
      switch (this.currentFilter) {
        case 'active':
          return this.todos.filter(todo => !todo.completed)
        case 'completed':
          return this.todos.filter(todo => todo.completed)
        default:
          return this.todos
      }
    },
    remaining() {
      return this.todos.filter(todo => !todo.completed).length
    },
    completedCount() {
      return this.todos.filter(todo => todo.completed).length
    }
  },
  methods: {

    goToBackgroundSetting() {
      this.$router.push('/background');
    },



    addTodo(text) {
      this.todos.push({
        text,
        completed: false
      })
    },
    setFilter(filter) {
      this.currentFilter = filter
    },
    updateTodo(index, updatedTodo) {
      this.todos.splice(index, 1, updatedTodo)
    },
    removeTodo(index) {
      this.todos.splice(index, 1)
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.246);
  border-radius: 15px;
  margin-top: 5%;
}

.container {
  /* z-index: 0; */
  width: 100%;
  height :1000px;
  background:url('./assets/主页背景图3.png') ; 
  border-radius: 0 0 15px 15px;
    background-repeat: no-repeat;
  background-position: center;
  background-size:99% 96% ;
  /* opacity: 0.8; */
    cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: all 0.3s ease;
 
}

/* 引入Font Awesome图标库 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
    