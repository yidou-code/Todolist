<template>
  <div id="app">
  <MyHeader/>
  <div class="container">

    <InputSection :filter ="filter" @add-todo = "addTodo" @set-filter = "setFilter"/>
    <TaskList :filteredTodos ="filteredTodos" @remove-todo = "removeTodo" @update-todo = "updateTodo"/>
    <MyFooter :renaining ="remaining" :completedCount ="completedCount" @clear-completed = "clearCompleted"/>
    </div>  
  </div>
</template>

<script>
import InputSection from './components/InputSection.vue'
import TaskList from './components/TaskList.vue'
import MyFooter from './components/MyFooter.vue'
import MyHeader from './components/MyHeader.vue'
export default{
  components:{
    
  }
}
</script>

<style>

</style>
