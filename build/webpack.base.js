const path = require('path')

module.exports = {
  entry: {
    'velocity-component': './velocity-component/src/velocity-component.js'
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  }
}
