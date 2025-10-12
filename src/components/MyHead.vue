<template>
   <!-- 头部标题区域 -->
    <header class="todo-header">
      <h1 class="title">
       <P> <i class="fas fa-star anime-star"></i>   {{ getCurrentDate() }}  <i class="fas fa-star anime-star"></i> <br>任务清单</P>
      </h1>
      
     
    </header>
</template>

<script>

export default {
  methods: {
    getCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      return `${year}年${month}月${date}日`;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
.todo-header { 
  text-align: center;
  padding:0rem 1rem;
 

}
.title{
  margin: 0 0 1rem 0;
  color: #f9fd7ed7;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.8rem;
   /* background-color: #f8f9fa; */
  font-family: 'Quicksand', sans-serif; 
   font-weight: 1000;
     letter-spacing: 1px;
  
}

.anime-star{
  color:#b2b723c2;
  animation: twinkle 3s infinite alternate;

}
.subtitle{  
  margin: 0;
  color: #11ec27;
  font-size: 1rem;
  font-style: italic;

}
@keyframes twinkle {
  from {
    opacity: 0.5; /* 半透明 */
    transform: scale(0.8); /* 稍微缩小 */
  }
  to {
    opacity: 1; /* 完全不透明 */
    transform: scale(2); /* 原始大小 */
  }
}
</style>