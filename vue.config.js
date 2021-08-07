const path = require('path')
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, 'api/')
      }
    }
  }
}
