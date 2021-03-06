import path from 'path'
import fs from 'fs'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const pkg = JSON.parse(fs.readFileSync('./package.json'))
const external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}))

export default {
  entry: 'velocity-component/src/velocity-component.js',
  dest: 'velocity-component/lib/velocity-component.js',
  sourceMap: path.resolve('velocity-component/lib/velocity-component.js'),
  moduleName: 'VelocityComponent',
  format: 'umd',
  external,
  plugins: [
    babel({
      babelrc: false,
      comments: false,
      exclude: 'node_modules/**',
      presets: [
        'es2015-loose-rollup',
        'stage-0',
        'react'
      ],
      plugins: [
        'transform-class-properties',
        ['transform-es2015-classes', { loose: true }],
        ['transform-react-jsx', { pragma: 'h' }]
      ]
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      skip: external
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: '**/*.css'
    }),
    uglify()
  ]
}
