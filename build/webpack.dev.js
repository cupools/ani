const webpack = require('webpack')
const merge = require('webpack-merge')

const webpackBaseConfig = require('./webpack.base')

module.exports = merge(webpackBaseConfig, {
  entry: Object.keys(webpackBaseConfig.entry).reduce(
    (ret, key) => (
      Object.assign({}, ret, {
        [key]: [
          'webpack-dev-server/client?http://127.0.0.1:3000',
          'webpack/hot/dev-server'
        ].concat(ret[key])
      })
    ),
    webpackBaseConfig.entry
  ),
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: 'eval'
})
