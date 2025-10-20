// src/utils/userManager.js

/**
 * 用户管理工具类
 */
class UserManager {
  // 获取当前用户信息
  static getCurrentUser() {
    try {
      const userInfo = localStorage.getItem('userInfo')
      return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  // 获取登录状态
  static isLoggedIn() {
    return !!localStorage.getItem('token')
  }

  // 用户登录
  static login(userData) {
    try {
      localStorage.setItem('userInfo', JSON.stringify(userData))
      localStorage.setItem('token', 'user_token_' + Date.now())
      localStorage.setItem('lastLogin', new Date().toISOString())
      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 用户注销
  static logout() {
    try {
      const userInfo = this.getCurrentUser()
      if (userInfo) {
        // 保存注销记录（可选）
        const logoutRecord = {
          username: userInfo.name,
          logoutTime: new Date().toISOString()
        }
        const logoutHistory = JSON.parse(localStorage.getItem('logoutHistory') || '[]')
        logoutHistory.push(logoutRecord)
        localStorage.setItem('logoutHistory', JSON.stringify(logoutHistory))
      }

      // 清除用户数据
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
      return true
    } catch (error) {
      console.error('注销失败:', error)
      return false
    }
  }

  // 获取所有注册用户（模拟数据库）
  static getRegisteredUsers() {
    try {
      return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    } catch {
      return []
    }
  }

  // 验证用户凭据
  static validateCredentials(username, password) {
    const users = this.getRegisteredUsers()
    const user = users.find(u => u.username === username && u.password === password)
    return user || null
  }

  // 更新用户信息
  static updateUserInfo(updatedInfo) {
    try {
      const currentUser = this.getCurrentUser()
      if (currentUser) {
        const newUserInfo = { ...currentUser, ...updatedInfo }
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
        return true
      }
      return false
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return false
    }
  }

  // 检查用户名是否可用
  static isUsernameAvailable(username) {
    const users = this.getRegisteredUsers()
    return !users.some(user => user.username === username)
  }

  // 检查邮箱是否可用
  static isEmailAvailable(email) {
    const users = this.getRegisteredUsers()
    return !users.some(user => user.email === email)
  }
}

export default UserManager