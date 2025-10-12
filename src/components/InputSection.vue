<!-- 输入框 -->
<template>
  <div class="input-section">
    <!-- 输入框和添加按钮保持不变 -->
    <input type="text" placeholder="添加新任务..." v-model="newTodo" @keyup.enter="addTodo" class="todo-input"/>
    <button @click="addTodo" class="add-btn">
      <i class="fas fa-plus"></i>添加
    </button>
  
    <!-- 过滤按钮 -->
    <div class="filters">
      <!-- 改为修改本地的 currentFilter -->
      <button @click="currentFilter = 'all'" :class="{active: currentFilter === 'all'}" class="filter-btn">全部</button>
      <button @click="currentFilter = 'active'" :class="{active: currentFilter === 'active'}" class="filter-btn">未完成</button>
      <button @click="currentFilter = 'completed'" :class="{active: currentFilter === 'completed'}" class="filter-btn">已完成</button>
    </div>
  </div>
</template>


<script>
export default {
props: ['filter'],
emits:['add-todo','set-filter'],
data( ){
  return {
    newTodo: '',
      currentFilter: this.filter  // 本地状态，初始值来自 props
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
      currentFilter(newVal) {
      this.$emit('set-filter', newVal);
    },
    // 监听父组件传递的 filter 变化，同步到本地状态
    filter(newVal) {
      this.currentFilter = newVal;
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
padding: 0 1rem;
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
  background-color: #1d7f5b4a;
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
  background-color: #873f6d60

}
.filters{
  display:flex;
  gap:0.5rem;
  justify-content: center;
}
.filter-btn{
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
.filter-btn:hover:not(.active){
  border-color:#42b983;
  color: #42b983;
}
</style>