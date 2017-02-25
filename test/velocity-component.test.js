/* eslint-env mocha, browser */

import { h, Component, render } from 'preact'
import VelocityComponent from '../velocity-component'

class Todo extends Component {
  componentWillMount() {
    if (this.props.end) this.props.end()
  }
  render() {
    return <div></div>
  }
}

describe('velocity-component', () => {
  let root = null
  const container = document.createElement('div')
  document.body.appendChild(container)

  const $ = s => [].slice.call(container.querySelectorAll(s))

  beforeEach(() => {
    root = render(<div>></div>, container, root)
  })

  it('should works', () => {
    $('.item').should.be.lengthOf(4)
  })
})
