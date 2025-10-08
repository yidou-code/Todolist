<template>
   <!-- 头部标题区域 -->
    <header class="todo-header">
      <h1 class="title">
        <i class="fas fa-star anime-star"></i>
        动漫任务清单
        <i class="fas fa-star anime-star"></i>
      </h1>
      <p class="subtitle">今天也要元气满满地完成任务哦！</p>
    </header>
</template>

<script>

</script>

<style scoped>
.todo-header { 
  text-align: center;
  padding:2rem 1rem;
  background-color: #f8f9fa;
  margin-bottom: 2rem;
}
.title{
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.anime-star{
  color:#ffd700;
  animation: twinkle 2s infinite alternate;

}
.subtitle{
  margin: 0;
  color: #666;
  font-size: 1rem;
  font-style: italic;

}
@keyframes twinkle{
  from{opacity: 0.5; transform: scale(0.8);}
  to {opacity:1; transform: scale(1.2);}
}
</style>