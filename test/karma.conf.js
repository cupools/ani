module.exports = config => {
  config.set({
    basePath: '..',
    frameworks: ['mocha', 'chai-sinon'],
    reporters: ['mocha'],
    browsers: ['PhantomJS'],
    files: [
      'test/velocity-component.test.js'
    ],
    exclude: [],
    preprocessors: {
      'test/**/*.js': ['webpack'],
      'src/**/*.js': ['webpack']
    },
    client: {
      mocha: {
        timeout: 6000
      }
    },
    webpack: require('../build/webpack.base'),
    webpackMiddleware: {
      noInfo: true
    }
  })
}
