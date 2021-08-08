const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
module.exports = {
  devServer: {
    progress: false
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
