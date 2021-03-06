const path = require('path')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 移除console语句
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
      // 大文件拆分
      config.performance = {
        hints: 'warning',
        maxAssetSize: 30000000,
        // maxEntryPoingtSize: 50000000,
        // assetsFilter: function(assetsFilename) {
        //   return assetsFilename.endWith('.css') || assetsFilename.endWith('.js')
        // }
      }
    } else {
      // 非生产环境配置
    }
  },
  chainWebpack: config => {
    // svg打包
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.include
      .add(resolve('src/icons'))
      .end()
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // 配置路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('utils', resolve('src/utils'))
      .set('components', resolve('src/components'))
      .set('api', resolve('src/api'))
    // 配置打包hash文件名
    config.output
      .filename('js/[name].[hash:3].js')
      .chunkFilename('js/[name].[chunkhash:3].js')
      .end()
    // 修复热更新失效
    config.resolve.symlinks(true)
  },
  devServer: {
    disableHostCheck: true // 开启webpack热重载检查
  },
  publicPath: './', // 配置打包基础路径
  lintOnSave: process.env.NODE_ENV !== 'production',
  integrity: true, // CDN安全属性选项
  outputDir: process.env.outputDir // 打包输入文件名
}
