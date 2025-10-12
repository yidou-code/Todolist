<template>
  <div class="container" :style="containerStyle">
    <MyHead />
    <InputSection 
      :filter="currentFilter" 
      @add-todo="addTodo" 
      @set-filter="setFilter" 
    />
    <TaskList 
      :filteredTodos="filteredTodos" 
      @update-todo="updateTodo" 
      @remove-todo="removeTodo" 
    />
    <MyFooter 
      :remaining="remaining" 
      :completedCount="completedCount" 
      @clear-completed="clearCompleted" 
    />
  </div>
</template>

<script>
import MyHead from '../components/MyHead.vue'
import InputSection from '../components/InputSection.vue'
import TaskList from '../components/TaskList.vue'
import MyFooter from '../components/MyFooter.vue'

export default {
  name: 'MyHome',
  components: { MyHead, InputSection, TaskList, MyFooter },
  data() { return { todos: [], currentFilter: 'all' } },
  computed: {
    filteredTodos() {
      switch (this.currentFilter) {
        case 'active': return this.todos.filter(t => !t.completed)
        case 'completed': return this.todos.filter(t => t.completed)
        default: return this.todos
      }
    },
    remaining() { return this.todos.filter(t => !t.completed).length },
    completedCount() { return this.todos.filter(t => t.completed).length },
    containerStyle() {
      const bg = localStorage.getItem('mainBackground');
      return {
        backgroundImage: bg ? `url(${bg})` : 'url(./assets/主页背景图3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
  },
  mounted() {
    const savedTodos = localStorage.getItem('todos')
    this.todos = savedTodos ? JSON.parse(savedTodos) : []
  },
  watch: {
    todos: {
      handler(newTodos) { localStorage.setItem('todos', JSON.stringify(newTodos)) },
      deep: true
    }
  },
  methods: {
    addTodo(text) { this.todos.push({ text, completed: false }) },
    setFilter(filter) { this.currentFilter = filter },
    updateTodo(index, todo) { this.todos.splice(index, 1, todo) },
    removeTodo(index) { this.todos.splice(index, 1) },
    clearCompleted() { this.todos = this.todos.filter(t => !t.completed) }
  }
}
</script>