<template>
  <nav class="navbar style-5" :style="navbarStyle">
    <div class="container">
      <div class="logo">
        <!-- 用户头像区域，点击跳转到登录 -->
        <div class="user-avatar" @click="goToLogin">
          <div class="anime-img">
            <img :src="userAvatar" alt="用户头像" class="avatar-img" />
            <div class="online-status" :class="isOnline ? 'online' : 'offline'"></div>
          </div>
          <div class="user-info">
            <span class="username">{{ userName || '未登录' }}</span>
            <span class="user-status">{{ isOnline ? '在线' : '离线' }}</span>
          </div>
        </div>
        <span>今日倒计时</span>
        <span class="countdown-display" v-if="showCountdown">
          <i :class="['bi', randomClockClass]" class="clock-icon"></i>
          {{ hours }}:{{ minutes }}:{{ seconds }} 
        </span>
      </div>
      <ul class="nav-links">
        <li class="nav-item">
          <router-link to="/Todolist" class="nav-link">任务</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/background" class="nav-link">背景图</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">关于</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar1',
  data() {
    return {
      targetTime: new Date(),
      countdownInterval: null,
      hours: '00',
      minutes: '00',
      seconds: '00',
      showCountdown: false,
      clockIconClasses: [
        'bi-alarm', 'bi-alarm-fill', 'bi-clock', 'bi-clock-fill', 
        'bi-stopwatch', 'bi-stopwatch-fill', 'bi-hourglass', 'bi-hourglass-split'
      ],
      randomClockClass: '',
      // 用户相关数据
      userName: '',
      userAvatar: require('../assets/可莉.jpg'), // 默认头像
      isOnline: false
    }
  },
  computed: {
    navbarStyle() {
      const bg = localStorage.getItem('navBackground');
      const opacity = localStorage.getItem('navOpacity') || 100;
      
      if (bg) {
        return {
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '98% !important',
          height: 'auto !important',
          margin: '0',
          padding: '0.5rem',
          transition: 'all 0.3s ease',
          borderRadius: '15px 15px 0 0',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.17)',
          opacity: opacity / 100
        }
      } else {
        return {
          backgroundImage: `url('../assets/原神导航栏背景图.png')`,
          backgroundSize: 'cover !important',
          backgroundPosition: 'center !important',
          backgroundRepeat: 'no-repeat !important',
          width: '98% !important',
          height: 'auto !important',
          margin: '0',
          padding: '0.5rem',
          transition: 'all 0.3s ease',
          borderRadius: '15px 15px 0 0',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.17)',
          opacity: opacity / 100
        }
      }
    }
  },
  mounted() {
    this.setTargetToEndOfDay();
    this.calculateCountdown();
    this.showCountdown = true;
    this.countdownInterval = setInterval(() => {
      this.calculateCountdown();
    }, 1000);

    // 初始化时随机选择一个时钟图标
    this.randomClockClass = this.getRandomClock();
    
    // 加载用户信息
    this.loadUserInfo();
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
  methods: {
    // 加载用户信息
    loadUserInfo() {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          this.userName = user.name || '';
          this.userAvatar = user.avatar || require('../assets/可莉.jpg');
          this.isOnline = user.isOnline || false;
        } catch (error) {
          console.error('解析用户信息失败:', error);
          this.resetToDefault();
        }
      } else {
        this.resetToDefault();
      }
    },

    // 重置为默认状态
    resetToDefault() {
      this.userName = '';
      this.userAvatar = require('../assets/可莉.jpg');
      this.isOnline = false;
    },

    // 跳转到登录页面
    goToLogin() {
      if (this.userName) {
        // 如果已登录，显示用户菜单
        this.showUserMenu();
      } else {
        // 如果未登录，跳转到登录页面
        this.$router.push('/login');
      }
    },

    // 显示用户菜单
    showUserMenu() {
      // 直接使用确认对话框，避免定义未使用的变量
      if (confirm(`${this.userName}，您想要执行什么操作？\n\n点击"确定"查看资料，点击"取消"退出登录`)) {
        this.viewProfile();
      } else {
        this.logout();
      }
    },

    // 查看用户资料
    viewProfile() {
      alert(`用户资料:\n\n姓名: ${this.userName}\n状态: ${this.isOnline ? '在线' : '离线'}`);
    },

    // 退出登录
    logout() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('userInfo');
        this.resetToDefault();
        alert('已退出登录');
      }
    },

    // 随机选择一个时钟图标类
    getRandomClock() {
      const randomIndex = Math.floor(Math.random() * this.clockIconClasses.length);
      return this.clockIconClasses[randomIndex];
    },

    // 设置目标时间为当天结束
    setTargetToEndOfDay() {
      const now = new Date();
      this.targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    },

    // 计算倒计时
    calculateCountdown() {
      const now = new Date().getTime();
      const target = this.targetTime.getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        this.targetTime.setDate(this.targetTime.getDate() + 1);
        this.calculateCountdown();
        return;
      }
      
      const hoursDiff = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsDiff = Math.floor((diff % (1000 * 60)) / 1000);
      
      this.hours = hoursDiff.toString().padStart(2, '0');
      this.minutes = minutesDiff.toString().padStart(2, '0');
      this.seconds = secondsDiff.toString().padStart(2, '0');
    }
  }
}
</script>

<style scoped>
.navbar {
  background-image: url('../assets/原神导航栏背景图.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 98%;
  height: auto;
  margin: 0;
  padding: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.17);
}

.navbar:hover {
  box-shadow: 0 5px 15px rgba(231, 92, 131, 0.3);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

/* 用户头像区域 */
.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.3rem 0.8rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

.username {
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.user-status {
  font-size: 0.7rem;
  color: #ccc;
}

/* 头像和动画样式 */
.anime-img {
  position: relative;
  display: inline-block;
  animation: float 2s infinite ease-in-out;
}

.avatar-img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.user-avatar:hover .avatar-img {
  border-color: #42b983;
  transform: scale(1.05);
}

/* 在线状态指示器 */
.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.online-status.online {
  background-color: #42b983;
  box-shadow: 0 0 8px #42b983;
}

.online-status.offline {
  background-color: #6c757d;
}

/* 弹跳阴影动画 */
.anime-img::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  animation: shadowBounce 2s infinite ease-in-out;
}

/* 图片上下浮动动画 */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 阴影弹跳动画 */
@keyframes shadowBounce {
  0% {
    width: 30px;
    opacity: 0.15;
  }
  50% {
    width: 20px;
    opacity: 0.08;
  }
  100% {
    width: 30px;
    opacity: 0.15;
  }
}

/* 倒计时显示样式 */
.countdown-display {
  font-size: 1.2rem;
  padding: 4px 10px;
  background-color: rgba(221, 232, 118, 0.669);
  border-radius: 12px;
  margin-left: 10px;
  min-width: 120px;
  text-align: center;
  color: #333;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 0;
  margin: 0;
  padding: 0 2rem 0 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  background-color: rgba(212, 212, 161, 0.263);
  color: rgb(255, 255, 255);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
  display: inline-block;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.nav-link:hover {
  background-color: rgba(56, 25, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.nav-item::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #dc343c;
  top: -5px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  transition: transform 0.3s ease;
}

.nav-item:hover::before {
  transform: translateX(-50%) scale(1);
}

.clock-icon {
  font-size: 1rem;
  color: #333;
  margin-right: 5px;
  transition: all 0.3s ease;
}

.countdown-display:hover .clock-icon {
  color: #42b983;
  transform: rotate(180deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .logo {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .user-avatar {
    order: -1;
  }
  
  .countdown-display {
    margin-left: 0;
    font-size: 1rem;
  }
  
  .nav-links {
    padding: 0;
  }
  
  .nav-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    width: 95%;
    padding: 0.3rem;
  }
  
  .logo span:first-of-type {
    display: none;
  }
  
  .user-info {
    display: none;
  }
  
  .nav-link {
    padding: 0.3rem 0.6rem;
    margin: 0 0.2rem;
    font-size: 0.8rem;
  }
}
</style>