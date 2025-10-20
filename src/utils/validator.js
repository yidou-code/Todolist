/**
 * 验证用户名
 * @param {string} username - 用户名
 * @returns {string} 错误信息（空字符串表示验证通过）
 */
export const validateUsername = (username) => {
  if (!username) {
    return '请输入用户名'
  }
  if (username.length < 3 || username.length > 16) {
    return '用户名长度需在3-16个字符之间'
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return '用户名只能包含字母、数字和下划线'
  }
  return '' // 验证通过
}

/**
 * 验证密码
 * @param {string} password - 密码
 * @returns {string} 错误信息（空字符串表示验证通过）
 */
export const validatePassword = (password) => {
  if (!password) {
    return '请输入密码'
  }
  if (password.length < 6 || password.length > 20) {
    return '密码长度需在6-20个字符之间'
  }
  // 可选：增加密码复杂度验证（如包含字母和数字）
  if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
    return '密码需包含至少一个字母和一个数字'
  }
  return '' // 验证通过
}