const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
require('dotenv').config()
module.exports = {
  devServer: {
    progress: false,
    port: process.env.VUE_APP_PORT
  },
  configureWebpack: {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            },
            output: {
              comments: false
            }
          }
        })
      ]
    },
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, 'api/')
      }
    }
  }
}
