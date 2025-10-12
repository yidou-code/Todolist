<!-- 底部统计 -->
<template>
  <footer class="todo-footer">
    <p>剩余 {{ remaining }} 个任务未完成</p>
    <button @click="clearCompleted" class="clear-btn" v-if="completedCount > 0">
      清除已完成任务

    </button>
  </footer>
</template>

<script>
export default {
props: ['remaining', 'completedCount'],
methods: {
    clearCompleted() {
      this.$emit('clear-completed')  // 触发清除已完成事件
    }
  }
}
</script>

<style scoped>
.todo-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding :1rem;
  margin-top: 2rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.9rem;
  color: #666
}
.clear-btn{
  background:transparent;
  border: none;
  color: #42b983;
  cursor: pointer;
  padding: 0.5rem;
  transition:color 0.3s;
}
.clear-btn:hover{
  color: #359e6d;
  text-decoration: underline;
}
</style>