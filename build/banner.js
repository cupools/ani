const pkg = require('../package.json')

module.exports = [
  `v${pkg.version} ${new Date().toLocaleDateString()}`,
  `${pkg.homepage}`
].join('\n')
