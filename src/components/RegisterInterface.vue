<template>
  <div class="register-container">
    <div class="register-card">
      <!-- 返回按钮 -->
      <div class="back-section">
        <button class="back-btn" @click="goToLogin">
          <i class="fas fa-arrow-left"></i>
          返回登录
        </button>
      </div>

      <!-- 标题 -->
      <div class="header-section">
        <h2 class="register-title">用户注册</h2>
        <p class="register-subtitle">创建您的任务清单账户</p>
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
            <span class="mask-text">点击上传头像</span>
          </div>
          <input 
            type="file" 
            ref="avatarInput" 
            class="avatar-input"
            accept="image/*"
            @change="handleAvatarChange"
          >
        </div>
        <p class="avatar-tip">建议尺寸：120x120像素</p>
      </div>

      <!-- 注册表单 -->
      <form class="register-form" @submit.prevent="handleSubmit">
        <!-- 用户名 -->
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
            placeholder="请输入3-16位用户名（字母、数字、下划线）"
            :class="{ 'input-error': validateError.username }"
            @blur="validateField('username')"
            @input="clearError('username')"
          >
          <p class="error-text" v-if="validateError.username">
            <i class="fas fa-exclamation-circle"></i>
            {{ validateError.username }}
          </p>
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label for="email" class="form-label">
            <i class="fas fa-envelope"></i>
            邮箱地址
          </label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            class="form-input"
            placeholder="请输入有效的邮箱地址"
            :class="{ 'input-error': validateError.email }"
            @blur="validateField('email')"
            @input="clearError('email')"
          >
          <p class="error-text" v-if="validateError.email">
            <i class="fas fa-exclamation-circle"></i>
            {{ validateError.email }}
          </p>
        </div>

        <!-- 密码 -->
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
            placeholder="6-20位，包含字母和数字"
            :class="{ 'input-error': validateError.password }"
            @blur="validateField('password')"
            @input="clearError('password')"
          >
          <p class="error-text" v-if="validateError.password">
            <i class="fas fa-exclamation-circle"></i>
            {{ validateError.password }}
          </p>
        </div>

        <!-- 确认密码 -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            <i class="fas fa-lock"></i>
            确认密码
          </label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword" 
            class="form-input"
            placeholder="请再次输入密码"
            :class="{ 'input-error': validateError.confirmPassword }"
            @blur="validateField('confirmPassword')"
            @input="clearError('confirmPassword')"
          >
          <p class="error-text" v-if="validateError.confirmPassword">
            <i class="fas fa-exclamation-circle"></i>
            {{ validateError.confirmPassword }}
          </p>
        </div>

        <!-- 用户协议 -->
        <div class="agreement-section">
          <label class="agreement-checkbox">
            <input 
              type="checkbox" 
              v-model="form.agreement" 
              class="custom-checkbox"
            >
            <span class="checkbox-text">我已阅读并同意</span>
          </label>
          <a href="#" class="agreement-link">《用户服务协议》</a>
          <p class="error-text" v-if="validateError.agreement">
            <i class="fas fa-exclamation-circle"></i>
            {{ validateError.agreement }}
          </p>
        </div>

        <!-- 注册按钮 -->
        <button 
          type="submit" 
          class="register-btn"
          :disabled="isSubmitting"
          :class="{ 'btn-loading': isSubmitting }"
        >
          <span v-if="!isSubmitting">
            <i class="fas fa-user-plus"></i>
            立即注册
          </span>
          <span v-if="isSubmitting">
            <i class="fas fa-spinner fa-spin"></i>
            注册中...
          </span>
        </button>

        <!-- 登录引导 -->
        <div class="login-guide">
          <span>已有账号？</span>
          <router-link to="/login" class="login-link">
            <i class="fas fa-sign-in-alt"></i>
            立即登录
          </router-link>
        </div>
      </form>
    </div>

    <!-- 注册成功弹窗 -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="success-modal">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 class="success-title">注册成功！</h3>
        <p class="success-message">欢迎加入任务清单，即将自动登录...</p>
        <div class="success-loading">
          <i class="fas fa-spinner fa-spin"></i>
          跳转中...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterInterface',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
      },
      avatarUrl: require('@/assets/可莉.jpg'),
      tempAvatar: null,
      validateError: {},
      isSubmitting: false,
      showSuccessModal: false
    }
  },
  methods: {
    // 返回登录
    goToLogin() {
      this.$router.push('/login')
    },

    // 头像上传处理
    handleAvatarClick() {
      this.$refs.avatarInput.click()
    },
    
    handleAvatarChange(e) {
      const file = e.target.files[0]
      if (file) {
        if (!this.validateAvatarFile(file)) return
        
        const reader = new FileReader()
        reader.onload = (res) => {
          this.avatarUrl = res.target.result
          this.tempAvatar = file
        }
        reader.readAsDataURL(file)
      }
    },
    
    validateAvatarFile(file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        this.showError('请上传 JPG 或 PNG 格式的图片')
        return false
      }
      if (file.size > 2 * 1024 * 1024) {
        this.showError('图片大小不能超过 2MB')
        return false
      }
      return true
    },

    // 表单验证方法
    clearError(field) {
      if (this.validateError[field]) {
        this.validateError[field] = ''
      }
    },

    validateField(field) {
      const error = {}
      
      if (field === 'username') {
        if (!this.form.username.trim()) {
          error.username = '请输入用户名'
        } else if (this.form.username.length < 3 || this.form.username.length > 16) {
          error.username = '用户名长度需在3-16个字符之间'
        } else if (!/^[a-zA-Z0-9_]+$/.test(this.form.username)) {
          error.username = '用户名只能包含字母、数字和下划线'
        } else {
          // 检查用户名是否已存在（模拟）
          const existingUsers = this.getExistingUsers()
          if (existingUsers.some(user => user.username === this.form.username)) {
            error.username = '该用户名已被使用'
          }
        }
      }
      
      if (field === 'email') {
        if (!this.form.email) {
          error.email = '请输入邮箱地址'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          error.email = '请输入有效的邮箱地址'
        } else {
          // 检查邮箱是否已注册（模拟）
          const existingUsers = this.getExistingUsers()
          if (existingUsers.some(user => user.email === this.form.email)) {
            error.email = '该邮箱已被注册'
          }
        }
      }
      
      if (field === 'password') {
        if (!this.form.password) {
          error.password = '请输入密码'
        } else if (this.form.password.length < 6 || this.form.password.length > 20) {
          error.password = '密码长度需在6-20个字符之间'
        } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(this.form.password)) {
          error.password = '密码需包含至少一个字母和一个数字'
        }
      }
      
      if (field === 'confirmPassword') {
        if (!this.form.confirmPassword) {
          error.confirmPassword = '请确认密码'
        } else if (this.form.password !== this.form.confirmPassword) {
          error.confirmPassword = '两次输入的密码不一致'
        }
      }

      if (field === 'agreement') {
        if (!this.form.agreement) {
          error.agreement = '请同意用户服务协议'
        }
      }
      
      this.validateError = { ...this.validateError, ...error }
      return !error[field]
    },
    
    validateForm() {
      const errors = {
        username: this.validateField('username') ? '' : this.validateError.username,
        email: this.validateField('email') ? '' : this.validateError.email,
        password: this.validateField('password') ? '' : this.validateError.password,
        confirmPassword: this.validateField('confirmPassword') ? '' : this.validateError.confirmPassword,
        agreement: this.form.agreement ? '' : '请同意用户服务协议'
      }
      
      this.validateError = errors
      return !Object.values(errors).some(error => error !== '')
    },

    // 获取已存在用户（模拟）
    getExistingUsers() {
      try {
        const users = localStorage.getItem('registeredUsers')
        return users ? JSON.parse(users) : []
      } catch {
        return []
      }
    },

    // 保存用户信息
    saveUserToStorage(userData) {
      try {
        const existingUsers = this.getExistingUsers()
        existingUsers.push({
          username: userData.username,
          email: userData.email,
          password: userData.password, // 注意：实际项目中密码应该加密存储
          avatar: userData.avatar,
          registerTime: new Date().toISOString()
        })
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))
        return true
      } catch (error) {
        console.error('保存用户信息失败:', error)
        return false
      }
    },

    // 显示错误消息
    showError(message) {
      alert(message) // 可以用更优雅的方式替换
    },

    // 注册提交处理
    async handleSubmit() {
      if (!this.validateForm()) {
        this.showError('请完善表单信息')
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 创建用户数据
        const userData = {
          id: 'user_' + Date.now(),
          username: this.form.username,
          email: this.form.email,
          password: this.form.password, // 注意：实际项目中应该在前端加密
          avatar: this.avatarUrl,
          isOnline: true,
          registerTime: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }

        // 保存到注册用户列表
        if (!this.saveUserToStorage(userData)) {
          throw new Error('注册失败，请重试')
        }

        // 自动登录：保存用户信息和token
        const loginUserData = {
          name: userData.username,
          avatar: userData.avatar,
          isOnline: true
        }
        
        localStorage.setItem('userInfo', JSON.stringify(loginUserData))
        localStorage.setItem('token', 'user_token_' + Date.now())
        localStorage.setItem('currentUser', JSON.stringify(userData))

        // 显示成功弹窗
        this.showSuccessModal = true
        
        // 2秒后自动跳转到主页
        setTimeout(() => {
          this.$router.push('/Todolist')
        }, 2000)

      } catch (error) {
        this.showError(error.message || '注册失败，请重试')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
}

.register-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.register-card::before {
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

.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #42b983, #359e6d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.register-subtitle {
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
}

/* 表单样式 */
.register-form {
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

/* 用户协议 */
.agreement-section {
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.agreement-checkbox {
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

.agreement-link {
  font-size: 0.9rem;
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.agreement-link:hover {
  text-decoration: underline;
}

/* 注册按钮 */
.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.4);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  background: linear-gradient(135deg, #a0d9b7, #8bc9a8) !important;
}

/* 登录引导 */
.login-guide {
  text-align: center;
  font-size: 0.95rem;
  color: #666;
}

.login-link {
  color: #42b983;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.login-link:hover {
  text-decoration: underline;
}

/* 成功弹窗 */
.modal-overlay {
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

.success-modal {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 320px;
  width: 90%;
}

.success-icon {
  font-size: 4rem;
  color: #42b983;
  margin-bottom: 1rem;
}

.success-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1rem 0;
}

.success-message {
  color: #666;
  margin: 0 0 1.5rem 0;
}

.success-loading {
  color: #42b983;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2rem 1.5rem;
  }
  
  .register-title {
    font-size: 1.7rem;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem 1rem;
  }
  
  .agreement-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>