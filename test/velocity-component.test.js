/* eslint-env mocha, browser */
import { h, render } from 'preact'
import VelocityComponent from '../velocity-component/'

describe('velocity-component', () => {
  let root = null
  const container = document.createElement('div')
  document.body.appendChild(container)

  const $ = s => [].slice.call(container.querySelectorAll(s))

  beforeEach(() => {
    root = render(<VelocityComponent />, container, root)
  })

  it('should works', () => {
    $('span').should.be.lengthOf(1)
  })
})
