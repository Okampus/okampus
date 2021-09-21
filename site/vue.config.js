// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
require('dotenv').config()
module.exports = {
  // mode: 'production',
  productionSourceMap: false,
  devServer: {
    progress: false,
    port: process.env.VUE_APP_PORT
  },
  configureWebpack: {
    // optimization: {
    //   minimize: true,
    //   minimizer: [
    //     new UglifyJsPlugin({
    //       uglifyOptions: {
    //         output: {
    //           comments: false,
    //           beautify: true
    //         },
    //         mangle: false,
    //         compress: false
    //       }
    //     })
    //   ]
    // },
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, 'api/')
      }
    }
  }
}
