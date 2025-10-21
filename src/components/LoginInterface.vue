<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 返回主页按钮 -->
      <div class="back-section">
        <button class="back-btn" @click="goToHome">
          <i class="bi bi-arrow-left"></i>
          返回主页
        </button>
      </div>

      <!-- 标题 -->
      <div class="header-section">
        <h2 class="login-title">用户登录</h2>
        <p class="login-subtitle">欢迎回到任务清单</p>
      </div>

      <!-- 头像上传区域 -->
      <div class="avatar-section">
        <div class="avatar-uploader" @click="handleAvatarClick">
          <img 
            :src="avatarUrl" 
            alt="用户头像" 
            class="avatar-img"
          >
          <div class="avatar-mask">
            <i class="fas fa-camera"></i>
            <span class="mask-text">修改头像</span>
          </div>
          <input 
            type="file" 
            ref="avatarInput" 
            class="avatar-input"
            accept="image/*"
            @change="handleAvatarChange"
          >
        </div>
        <p class="avatar-tip">点击修改头像</p>
        
        <!-- 头像操作按钮 -->
        <div class="avatar-actions" v-if="tempAvatar">
          <button class="avatar-confirm-btn" @click="confirmAvatar">
            <i class="fas fa-check"></i>
            确认头像
          </button>
          <button class="avatar-cancel-btn" @click="cancelAvatar">
            <i class="fas fa-times"></i>
            取消
          </button>
        </div>
      </div>

      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="fas fa-user"></i>
            用户名
          </label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            class="form-input"
            placeholder="请输入用户名"
            :class="{ 'input-error': validateError.username }"
            @blur="validateField('username')"
            @input="clearError('username')"
          >
          <p class="error-text" v-if="validateError.username">
            <i class="fas fa-exclamation-circle"></i>
            {{ validateError.username }}
          </p>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i>
            密码
          </label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            class="form-input"
            placeholder="请输入密码"
            :class="{ 'input-error': validateError.password }"
            @blur="validateField('password')"
            @input="clearError('password')"
          >
          <p class="error-text" v-if="validateError.password">
            <i class="fas fa-exclamation-circle"></i>
            {{ validateError.password }}
          </p>
        </div>

        <div class="form-actions">
          <label class="remember-checkbox">
            <input 
              type="checkbox" 
              v-model="form.remember" 
              class="custom-checkbox"
            >
            <span class="checkbox-text">记住登录状态</span>
          </label>
          <a href="#" class="forgot-link" @click.prevent="showForgotPassword">忘记密码？</a>
        </div>

        <button 
          type="submit" 
          class="login-btn"
          :disabled="isSubmitting"
          :class="{ 'btn-loading': isSubmitting }"
        >
          <span v-if="!isSubmitting">
            <i class="fas fa-sign-in-alt"></i>
            登录
          </span>
          <span v-if="isSubmitting">
            <i class="fas fa-spinner fa-spin"></i>
            登录中...
          </span>
        </button>

        <div class="register-guide">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">
            <i class="fas fa-user-plus"></i>
            立即注册
          </router-link>
        </div>
      </form>
    </div>

    <!-- 加载遮罩 -->
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>登录中，请稍候...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginInterface',
  data() {
    return {
      form: {
        username: '',
        password: '',
        remember: false
      },
      avatarUrl: require('@/assets/可莉.jpg'),
      tempAvatar: null, // 临时头像文件
      originalAvatar: require('@/assets/可莉.jpg'), // 原始头像
      validateError: {},
      isSubmitting: false,
      hasAvatarChanged: false // 标记头像是否被修改
    }
  },
  created() {
    // 从本地存储读取记住的用户信息
    this.loadRememberedUser();
  },
  methods: {
    // 返回主页
    goToHome() {
      this.$router.push('/');
    },

    // 加载记住的用户
    loadRememberedUser() {
      try {
        const savedUser = localStorage.getItem('rememberedUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          this.form.username = user.username || '';
          this.form.remember = true;
          
          // 如果有保存的头像，使用保存的头像
          if (user.avatar) {
            this.avatarUrl = user.avatar;
            this.originalAvatar = user.avatar;
          }
        }
      } catch (error) {
        console.log('读取记住的用户失败:', error);
      }
    },

    // 保存记住的用户
   // 保存记住的用户
saveRememberedUser() {
  if (this.form.remember) {
    const userToRemember = {
      username: this.form.username,
      avatar: this.avatarUrl, // 保存当前显示的头像（可能是新确认的头像）
      rememberTime: new Date().toISOString()
    };
    localStorage.setItem('rememberedUser', JSON.stringify(userToRemember));
    console.log('已保存记住的用户:', userToRemember);
  } else {
    localStorage.removeItem('rememberedUser');
  }
},

    // 头像上传处理
    handleAvatarClick() {
      this.$refs.avatarInput.click();
    },
    
    handleAvatarChange(e) {
      const file = e.target.files[0];
      if (file) {
        if (!this.validateAvatarFile(file)) return;
        
        const reader = new FileReader();
        reader.onload = (res) => {
          this.avatarUrl = res.target.result;
          this.tempAvatar = file;
          this.hasAvatarChanged = true;
        };
        reader.readAsDataURL(file);
      }
    },
    
    validateAvatarFile(file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.showMessage('请上传 JPG、PNG 或 GIF 格式的图片', 'error');
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.showMessage('图片大小不能超过 2MB', 'error');
        return false;
      }
      return true;
    },

// 确认使用新头像
confirmAvatar() {
  this.originalAvatar = this.avatarUrl;
  this.hasAvatarChanged = true;
  this.tempAvatar = null;
  
  // 立即更新到本地存储（如果用户已记住）
  if (this.form.remember && this.form.username) {
    this.saveRememberedUser();
  }
  
  this.showMessage('头像修改成功！', 'success');
},
    // 取消头像修改
    cancelAvatar() {
      this.avatarUrl = this.originalAvatar;
      this.tempAvatar = null;
      this.hasAvatarChanged = false;
      // 清空文件输入
      this.$refs.avatarInput.value = '';
    },

    // 清除错误信息
    clearError(field) {
      if (this.validateError[field]) {
        this.validateError[field] = '';
      }
    },

    // 表单验证
    validateField(field) {
      const error = {};
      
      if (field === 'username') {
        if (!this.form.username.trim()) {
          error.username = '请输入用户名';
        } else if (this.form.username.length < 3) {
          error.username = '用户名长度不能少于3个字符';
        } else if (this.form.username.length > 16) {
          error.username = '用户名长度不能超过16个字符';
        }
      }
      
      if (field === 'password') {
        if (!this.form.password) {
          error.password = '请输入密码';
        } else if (this.form.password.length < 6) {
          error.password = '密码长度不能少于6个字符';
        } else if (this.form.password.length > 20) {
          error.password = '密码长度不能超过20个字符';
        }
      }
      
      this.validateError = { ...this.validateError, ...error };
      return !error[field];
    },
    
    validateForm() {
      const errors = {
        username: this.validateField('username') ? '' : this.validateError.username,
        password: this.validateField('password') ? '' : this.validateError.password
      };
      
      this.validateError = errors;
      return !Object.values(errors).some(error => error !== '');
    },

  
    // 模拟用户验证
    validateUserCredentials(username, password) {
      // 从本地存储获取注册用户列表
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.username === username && u.password === password);
        return user || null;
      } catch {
        return null;
      }
    },

    // 更新用户头像信息
    updateUserAvatar(username, newAvatar) {
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
          // 更新注册用户列表中的头像
          registeredUsers[userIndex].avatar = newAvatar;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          return true;
        }
        return false;
      } catch (error) {
        console.error('更新用户头像失败:', error);
        return false;
      }
    },

    // 登录处理
async handleSubmit() {
  if (!this.validateForm()) {
    this.showMessage('请完善表单信息', 'error');
    return;
  }
  
  this.isSubmitting = true;
  
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 验证用户凭据
    const user = this.validateUserCredentials(this.form.username, this.form.password);
    
    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // 确定最终使用的头像
    let finalAvatar = user.avatar || require('@/assets/可莉.jpg');
    
    // 如果用户确认了新的头像，使用新头像
    if (this.hasAvatarChanged && this.avatarUrl !== require('@/assets/可莉.jpg')) {
      console.log('使用新确认的头像:', this.avatarUrl);
      finalAvatar = this.avatarUrl;
      
      // 更新用户头像信息到注册用户列表
      this.updateUserAvatar(this.form.username, finalAvatar);
    }

    // 添加调试日志 - 放在这里，在 finalAvatar 定义之后
    console.log('hasAvatarChanged:', this.hasAvatarChanged);
    console.log('avatarUrl:', this.avatarUrl);
    console.log('originalAvatar:', this.originalAvatar);
    console.log('最终使用的头像:', finalAvatar);

    // 创建登录用户数据
    const loginUserData = {
      name: user.username,
      avatar: finalAvatar,  // 确保使用正确的头像
      isOnline: true,
      lastLogin: new Date().toISOString()
    };

    console.log('准备保存的用户数据:', loginUserData);

    // 保存用户信息和token
    localStorage.setItem('userInfo', JSON.stringify(loginUserData));
    localStorage.setItem('token', 'user_token_' + Date.now());
    
    // 保存记住我状态
    this.saveRememberedUser();

    // 等待数据保存完成
    await new Promise(resolve => setTimeout(resolve, 50));

    // 发出用户登录事件，通知导航栏更新
    this.$eventBus.$emit('userLoggedIn', loginUserData);
    
    // 如果头像被修改，发出头像更新事件
    if (this.hasAvatarChanged) {
      this.$eventBus.$emit('userAvatarUpdated', {
        avatarUrl: finalAvatar,
        username: this.form.username
      });
    }

    this.showMessage('登录成功！', 'success');
    
    // 延迟跳转让用户看到成功消息
    setTimeout(() => {
      this.$router.push('/Todolist');
    }, 1000);

  } catch (error) {
    this.showMessage(error.message || '登录失败，请重试', 'error');
  } finally {
    this.isSubmitting = false;
  }
},
// 显示消息（宠物风格）
showMessage(message, type = 'info') {
  const themes = {
    error: { 
      theme: 'warning', 
      character: 'fox', 
      icon: 'fas fa-exclamation-triangle' 
    },
    success: { 
      theme: 'cute', 
      character: 'cat', 
      icon: 'fas fa-check-circle' 
    },
    info: { 
      theme: 'cute', 
      character: 'rabbit', 
      icon: 'fas fa-comment' 
    }
  };
  
  const themeConfig = themes[type] || themes.info;
  
  this.$eventBus.$emit('showAnimeModal', {
    title: type === 'error' ? '出错了' : type === 'success' ? '成功' : '提示',
    message: message,
    type: 'alert',
    ...themeConfig,
    confirmText: '确定'
  });
},
// 忘记密码提示
showForgotPassword() {
  this.$eventBus.$emit('showAnimeModal', {
    title: '忘记密码',
    message: '忘记密码功能暂未开放<br><small>请联系管理员重置密码</small>',
    type: 'alert',
    theme: 'cute',
    character: 'panda',
    icon: 'fas fa-key',
    confirmText: '知道了'
  });
},
  }
}
</script>

<style scoped>
.login-container {
  /* min-height: 100vh; */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #42b983, #359e6d);
}

/* 返回按钮 */
.back-section {
  margin-bottom: 1.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  color: #42b983;
}

/* 标题区域 */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #42b983, #359e6d);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

/* 头像上传区域 */
.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-uploader {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-uploader:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  transition: all 0.3s ease;
}

.avatar-uploader:hover .avatar-img {
  border-color: #42b983;
}

.avatar-mask {
  position: absolute;
  inset: 0;
  background: rgba(66, 185, 131, 0.8);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 50%;
}

.avatar-uploader:hover .avatar-mask {
  opacity: 1;
}

.mask-text {
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.avatar-input {
  display: none;
}

.avatar-tip {
  margin-top: 0.8rem;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 1rem;
}

/* 头像操作按钮 */
.avatar-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin-top: 1rem;
}

.avatar-confirm-btn {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: background-color 0.3s;
}

.avatar-confirm-btn:hover {
  background: #359e6d;
}

.avatar-cancel-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: background-color 0.3s;
}

.avatar-cancel-btn:hover {
  background: #545b62;
}

/* 表单样式 */
.login-form {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
  background: #fafafa;
}

.form-input:focus {
  border-color: #42b983;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
  outline: none;
}

.input-error {
  border-color: #ff4757 !important;
  background: #fff5f5 !important;
}

.error-text {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #ff4757;
  min-height: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* 表单操作区 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.8rem;
  padding: 1rem 0;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.custom-checkbox {
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.5rem;
  accent-color: #42b983;
}

.checkbox-text {
  font-size: 0.9rem;
  color: #666;
}

.forgot-link {
  font-size: 0.9rem;
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #359e6d;
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #42b983, #359e6d);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  background: linear-gradient(135deg, #a0d9b7, #8bc9a8) !important;
}

/* 注册引导 */
.register-guide {
  text-align: center;
  font-size: 0.95rem;
  color: #666;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.register-link {
  color: #42b983;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.3s;
}

.register-link:hover {
  color: #359e6d;
  text-decoration: underline;
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.loading-spinner i {
  font-size: 2rem;
  color: #42b983;
  margin-bottom: 1rem;
}

.loading-spinner p {
  margin: 0;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .login-title {
    font-size: 1.7rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem 1rem;
  }
  
  .avatar-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>