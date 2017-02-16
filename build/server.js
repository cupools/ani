const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const child = require('child_process')
const config = require('./webpack.dev.js')

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
    noInfo: true,
    quiet: true,
    chunks: false
  }
}).listen(3000, err => {
  if (err) {
    log(err)
  } else {
    log('Listening at http://127.0.0.1:3000')
    child.exec('open http://127.0.0.1:3000/examples/index.html')
  }
})

function log(...args) {
  console.log(...args) // eslint-disable-line no-console
}
