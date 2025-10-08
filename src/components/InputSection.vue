<!-- 输入框 -->
<template>
  <div class="input-section">
    <input type="text" placeholder="添加新任务..." v-model="newTodo" @keyup.enter="addTodo" class="todo-input"/>
    <button @click="addTodo" class="add-btn">
      <i class="fas fa-plus"></i>添加
    </button>
  
<!-- 过滤按钮 -->
    <div class="filters">
      <button @click="filter = 'all'" :class=" {active: filter === 'all' }" class="fliter-btn">全部</button>
      <button @click="filter = 'active'" :class=" {active: filter === 'active' }" class="fliter-btn">未完成</button>
      <button @click="filter = 'completed'" :class=" {active: filter === 'completed' }" class="fliter-btn">已完成</button>
      
    </div>
  </div>
</template>

<script>
export default {
props: ['filter'],
emits:['add-todo','set-filter'],
data( ){
  return {
    newTodo: ''
  } 
},
  methods:{
  addTodo(){
    if (this.newTodo.trim())
  {
    this.$emit('add-todo', this.newTodo.trim());
    this.newTodo = '';
  }
  }
  },
  watch:{
    filter(newVal){
    this.$emit('set-filter',newVal)
  }
  }

}
</script>

<style scoped>
.input-section{
display: flex;
flex-direction:column;
gap:1rem;
margin-bottom: 2rem;
padding: o 1rem;
}
.todo-input{
  padding: 0.8rem 1rem;
  border:2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}
.todo-input:focus{
  outline: none;
  border-color:#42b983;
}
.add-btn{
  padding: 0.8rem 1.5rem;
  background-color: #42b983;
  color:white;
  border:none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap:  0.5rem;
}
.add-btn:hover{
  background-color: #359e6d

}
.filters{
  display:flex;
  gap:0.5rem;
  justify-content: center;
}
.fliter-btn{
  padding: 0.5rem 1rem;
  border:1px solid white;
  background-color: white ;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
.filter-btn.active{
  background-color: #42b983;
  color: white;
  border-color: #42b983;

}
.fliter-btn:hover:not(.active){
  border-color:#42b983;
  color: #42b983;
}
</style>