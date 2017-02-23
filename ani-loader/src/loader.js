import path from 'path'
import stylus from 'stylus'
import postcss from 'postcss'

export const loader = function loader(content) {
  const raw = JSON.stringify(process(content))
  return `module.exports = ${raw};`
}

export const process = function process(content) {
  const css = preprocess(content)
  const obj = render(css)
  return obj
}

function preprocess(content) {
  let raw = ''
  stylus(content)
    .import(path.join(__dirname, 'mixin'))
    .render((err, css) => {
      if (err) throw err
      raw = css
    })

  return raw
}

function render(css) {
  const root = postcss.parse(css)

  // collect keyframes first
  // TODO: support @keyframes
  const keyframeStorage = walkNode(root, 'atRule', atRule => {
    const { name } = atRule
    const transform = walkNode(atRule, 'decl', decl => ({ [decl.prop]: convertValue(decl.value) }))
    return {
      [name]: transform
    }
  })

  // TODO: selector inherit
  const ret = walkNode(root, 'rule', rule => {
    const { selector } = rule
    const declarations = walkNode(rule, 'decl', decl => ({ [decl.prop]: convertValue(decl.value) }))

    if (!declarations.animation) {
      return {}
    }

    const animationParams = generateAnimationParams(declarations.animation)

    const keyframes = animationParams.map(item => {
      const { __aniName } = item

      if (__aniName.includes('__SPLIT__')) {
        return Object.assign({}, item, getAnimationParamsFromString(__aniName))
      }
      return Object.assign({}, item, keyframeStorage[item.__aniName] || {})
    })

    return {
      [selector]: {
        ...declarations,
        animation: declarations.animation.replace(/to\(.*?\)/g, 'anonymous'),
        keyframes
      }
    }
  })

  return ret
}

function walkNode(root, type, fn) {
  const ret = {}
  const method = `walk${type.charAt(0).toUpperCase() + type.slice(1)}s`

  root[method](node => {
    const obj = fn(node)
    Object.assign(ret, obj)
  })

  return ret
}

/**
 * generate animation parameters from animation declaration
 */
function generateAnimationParams(animation) {
  const timeReg = /^\d+m?s$/i
  const loopReg = /^(\d|infinite|forwards|steps\(\d+\))$/i
  const timeConvert = n => parseFloat(n) * (/\d+s$/.test(n) ? 1e3 : 1)

  if (!animation) {
    return []
  }

  return animation
    .replace(/to\((.*?)\)/g, (_, $1) => `to(${$1.replace(/\s*,\s*/g, '__SPLIT__')})`)
    .split(',')
    .map(raw => {
      const params = raw.trim().replace(/\s+/g, ' ').split(' ')
      return params.reduce(
        (ret, str) => {
          // the first parameter should be `aniName`
          if (ret.__aniName === undefined) {
            return { ...ret, __aniName: str }
          }
          // if the parameter satisfies time, it may be `duration` or `delay`
          if (timeReg.test(str)) {
            const type = ret.duration === undefined ? 'duration' : 'delay'
            return { ...ret, [type]: timeConvert(str) }
          }
          // it the parameter satisfies loop properties
          if (ret.duration !== undefined && loopReg.test(str)) {
            return { ...ret, loop: convertValue(str) }
          }
          // otherwise it may be easing name or bezier
          return { ...ret, easing: str }
        },
        {}
      )
    })
}

function getAnimationParamsFromString(raw) {
  const params = raw.slice(3, -1).split('__SPLIT__')
  return params.reduce(
    (ret, item, index) => {
      if (index % 2 === 1) return ret
      return Object.assign({}, ret, { [item]: convertValue(params[index + 1]) })
    },
    { __aniName: 'anonymous' }
  )
}

function convertValue(str) {
  return isNaN(str) ? str : parseFloat(str)
}
