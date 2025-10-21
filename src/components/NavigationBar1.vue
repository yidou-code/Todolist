<template>
  <nav class="navbar style-5" :style="navbarStyle">
    <div class="container">
      <div class="logo">
        <!-- 用户头像区域，点击跳转到登录 -->
        <div class="user-avatar" @click="goToLogin">
          <div class="anime-img">
           <img :src="computedUserAvatar" alt="用户头像" class="avatar-img" @error="handleAvatarError"/>
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
      isOnline: false,
      // 添加一个强制更新的计数器
      updateCounter: 0,
      boundMethods: null
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
    },
    // 添加计算属性来强制更新头像
    computedUserAvatar() {      
      // 这个计算属性依赖 updateCounter，当它变化时会强制重新计算
      this.updateCounter;
      return this.getCurrentAvatar();
    }
  },
  watch: {
    // 监听路由变化，当跳转到任务页面时重新加载用户信息
    '$route'(to) {
      // 移除了未使用的 'from' 参数
      if (to.name === 'MyHome') {
        console.log('路由跳转到任务页面，重新加载用户信息');
        this.loadUserInfo();
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

    this.boundMethods = {
    viewProfile: this.viewProfile.bind(this),
    showLogoutConfirm: this.showLogoutConfirm.bind(this),
    performLogout: this.performLogout.bind(this)
  };
    // 初始化时随机选择一个时钟图标
    this.randomClockClass = this.getRandomClock();
    
    // 加载用户信息
    this.loadUserInfo();
    
    // 监听用户登录状态变化
    this.$eventBus.$on('userLoggedIn', this.handleUserLoggedIn);
    this.$eventBus.$on('userAvatarUpdated', this.handleUserAvatarUpdated);
    this.$eventBus.$on('userLoggedOut', this.handleUserLoggedOut);
    
    console.log('导航栏组件已挂载，开始监听用户事件');
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    // 移除事件监听
    this.$eventBus.$off('userLoggedIn', this.handleUserLoggedIn);
    this.$eventBus.$off('userAvatarUpdated', this.handleUserAvatarUpdated);
    this.$eventBus.$off('userLoggedOut', this.handleUserLoggedOut);
  },
  methods: {
    // 处理用户登录事件
    handleUserLoggedIn(userData) {
      console.log('导航栏收到用户登录事件:', userData);
      this.loadUserInfo();
      // 强制更新
      this.updateCounter++;
    },
    
   // 处理用户头像更新事件
handleUserAvatarUpdated(avatarData) {
  console.log('导航栏收到头像更新事件:', avatarData);
  console.log('当前用户信息:', this.getUserInfo());
  
  // 确保avatarData包含正确的URL
  if (avatarData && avatarData.avatarUrl) {
    console.log('新头像URL:', avatarData.avatarUrl);
    this.userAvatar = avatarData.avatarUrl;
    
    // 更新本地存储
    const userInfo = this.getUserInfo();
    if (userInfo) {
      userInfo.avatar = avatarData.avatarUrl;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('更新后的本地存储:', userInfo);
    }
    
    // 强制更新
    this.updateCounter++;
    console.log('updateCounter 已增加:', this.updateCounter);
  } else {
    console.error('头像数据格式错误:', avatarData);
  }
},
    
    // 处理用户注销事件
    handleUserLoggedOut() {
      console.log('导航栏收到用户注销事件');
      this.resetToDefault();
      this.updateCounter++;
    },

    // 头像加载错误处理
    handleAvatarError(event) {
      console.warn('头像加载失败，使用默认头像');
      event.target.src = require('../assets/可莉.jpg');
    },

// 获取当前头像（带缓存清除）
getCurrentAvatar() {
  const userInfo = this.getUserInfo();
  if (userInfo && userInfo.avatar) {
    // 检查是否是Base64数据URL或外部URL
    if (userInfo.avatar.startsWith('data:image') || userInfo.avatar.startsWith('http')) {
      // Base64数据URL或外部URL，直接返回，不添加时间戳
      return userInfo.avatar;
    } else {
      // 本地资源路径，可能需要添加时间戳
      const timestamp = new Date().getTime();
      return `${userInfo.avatar}?t=${timestamp}`;
    }
  }
  return require('../assets/可莉.jpg');
},
    // 获取用户信息
    getUserInfo() {
      try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
      }
    },

    // 加载用户信息
    loadUserInfo() {
      console.log('开始加载用户信息...');
      const userInfo = this.getUserInfo();
      if (userInfo) {
        console.log('找到用户信息:', userInfo);
        this.userName = userInfo.name || '';
        this.userAvatar = userInfo.avatar || require('../assets/可莉.jpg');
        this.isOnline = userInfo.isOnline || false;
        
        // 强制更新视图
        this.$nextTick(() => {
          this.updateCounter++;
        });
      } else {
        console.log('未找到用户信息，使用默认状态');
        this.resetToDefault();
      }
      console.log('导航栏加载用户信息：', userInfo);
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
  this.$eventBus.$emit('showAnimeModal', {
    title: '用户操作',
    message: `${this.userName}，您想要执行什么操作？`,
    type: 'confirm',
    theme: 'cute',
    character: 'cat',
    icon: 'bi bi-person-circle',
    confirmText: '查看资料',
    cancelText: '退出登录',
    onConfirm: () => {
      console.log("用户点击了查看资料");
      this.viewProfile();
    },
    onCancel: () => {
      console.log("用户点击了退出登录");
      this.showLogoutConfirm();
    }
  });
},

// 查看用户资料
viewProfile() {
  this.$eventBus.$emit('showAnimeModal', {
    title: '用户资料',
    message: `👤 <strong>${this.userName}</strong><br>📱 状态: ${this.isOnline ? '🟢 在线' : '⚫ 离线'}`,
    type: 'alert',
    theme: 'cute',
    character: 'rabbit',
    icon: 'bi bi-info-circle',
    confirmText: '好的'
  });
},

// 显示退出登录确认
showLogoutConfirm() {
  this.$eventBus.$emit('showAnimeModal', {
    title: '退出登录',
    message: '确定要退出登录吗？<br><small>我们会想念你的～</small>',
    type: 'confirm',
    theme: 'cute',
    character: 'dog',
    icon: 'bi bi-box-arrow-right',
    confirmText: '退出登录',
    cancelText: '再想想',
    onConfirm: () => {
      console.log("用户确认退出登录");
      this.performLogout();
    },
    onCancel: () => {
      console.log("用户取消退出登录");
    }
  });
},

// 执行退出登录
performLogout() {
  console.log('开始执行退出登录');
  
  // 清除用户相关数据
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('rememberedUser');
  
  // 重置组件状态
  this.resetToDefault();
  
  // 发出用户注销事件
  this.$eventBus.$emit('userLoggedOut');
  
  console.log('用户数据已清除，准备跳转');
  
  // 使用最可靠的方式跳转
  setTimeout(() => {
    window.location.href = '/login';
  }, 100);
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
    },

    
  }
}
</script>

<!-- 样式保持不变 -->
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