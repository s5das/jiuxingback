const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  	lintOnSave:false, //关闭语法检查
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all'
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/global.less')
      ]
    }
  }
})
