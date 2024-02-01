const { defineConfig } = require('@vue/cli-service')
const target = 'http://localhost:3000'
module.exports = defineConfig({
  devServer: {
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '^/auth': {
        target,
        changeOrigin: true
      },
      '^/openai': {
        target,
        changeOrigin: true
      },
      '^/stock': {
        target,
        changeOrigin: true
      },
      '^/admin': {
        target,
        changeOrigin: true
      },
      '^/mypage': {
        target,
        changeOrigin: true
      },
    },
  },
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
})
