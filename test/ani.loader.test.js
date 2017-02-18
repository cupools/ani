/* eslint-env mocha */

import Chai from 'chai'
import loader from '../ani-loader/src/loader'

Chai.should()

describe('ani-loader', () => {
  it('should work', () => {
    const stylesheet = `
      .foo
        width 10px
        height 10px
        opacity 1
        animation fade-out 1s 2s linear infinite
      @keyframes fade-out
        from
          opacity 1
        to
          opacity 0
    `

    loader.call(null, stylesheet).should.be.eql({
      width: '10px',
      height: '10px',
      opacity: 1,
      keyframes: [{
        opacity: 1
      }, {
        opacity: 0,
        delay: 2000,
        duration: 1000,
        easing: 'linear',
        loop: true
      }]
    })
  })
})
