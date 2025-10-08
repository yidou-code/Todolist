<template>
  <div class="todo-list">
    <div v-for = "(todo, index) in filteredTodos" :key="index" class="todo-item" :class="{completed: todo.completed}">
      <div class="todo-check">
        <input type="checkbox" name="" id="" class="checkbox" v-model="todo.completed" @change="$emit('update-todo', index, todo.completed)"/>
      
      </div> 
      <div class="todo-text">{{ todo.text }}</div>
      <div class="todo-actions">
        <button class="delete-btn" @click="$emit('remove-todo',index)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
<!-- 空状态提示 -->
    <div class="empty-state" v-if="filteredTodos.length === 0">
      <i class="fas fa-box-open anime-icon"></i>
      <p>没有任务哦~ 快去添加吧！</p>
    </div>
  </div>
</template>

<script>
export default {
  props:[filteredTodos]

}
</script>

<style scoped>
.todo-list {
  padding:0 1rem;
}
.todo-item {
  display:flex;
  align-items: center;
  padding: 1 rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}
.todo-item:hover {
  background-color: #f9f9f9;
}
.todo-item.completed .todo-text{
text-decoration:line-through;
color: #888;
}
.todo-check{
  margin-right: 1rem;

}
.checkbox{
  width:1.2rem;
  height:1.2rem;
  cursor: pointer;
}
.todo-text{
  flex:1;
  font-size: 1rem;
}
.todo-actions{
  margin-left:1rem;
}
.delete-btn{
  background: transparent;
  border:none;
  color:#d93025;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s;

}
.delete-btn:hover{
  color:#d93025
}
.empty-state{
  display:flex;
  flex-direction: column;
  align-items: center;
  padding:3rem 1rem;
  color:#888;
}
.anime-icon{
  font-size: 3rem;
  margin: bottom 1rem;
  opacity: 0.6;
}
</style>