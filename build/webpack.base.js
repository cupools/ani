const path = require('path')

module.exports = {
  entry: {
    'velocity-component': './velocity-component/src/velocity-component.js'
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    path: path.resolve('lib/'),
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  externals: {
    preact: 'preact',
    'velocity-animate': 'velocity-animate'
  }
}
