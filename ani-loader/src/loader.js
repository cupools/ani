import stylus from 'stylus'
import postcss from 'postcss'


export default function process(content) {
  const css = preprocess(content)
  const obj = render(css)
  return obj
}

function preprocess(content) {
  let raw = ''
  stylus(content).render((err, css) => {
    if (err) throw err
    raw = css
  })
  return raw
}

function render(css) {
  const root = postcss.parse(css)
  return {}
}
