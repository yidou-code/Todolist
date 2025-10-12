const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 根据环境动态设置 publicPath
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Todolist/'  // 生产环境：对应你的 GitHub 仓库名称
    : '/',           // 开发环境：保持根路径，不影响本地开发
  outputDir: 'dist',       // 打包输出目录
  assetsDir: 'static',     // 静态资源存放目录
  // 可选：如果使用 history 模式路由，需要配置这个
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '你的项目名称'  // 设置页面标题
      return args
    })
  }
})