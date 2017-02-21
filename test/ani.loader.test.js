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
      @fade-out
        opacity 0
    `

    loader.call(null, stylesheet).should.be.eql({
      '.foo': {
        width: '10px',
        height: '10px',
        opacity: 1,
        animation: 'fade-out 1s 2s linear infinite',
        keyframes: [{
          __aniName: 'fade-out',
          opacity: 0,
          delay: 2000,
          duration: 1000,
          easing: 'linear',
          loop: 'infinite'
        }]
      }
    })
  })

  it('should work', () => {
    const stylesheet = `
      .foo
        width 10px
        height 10px
        opacity 1
        animation fade-in 1s,
                  fade-out 2s 10ms ease-in 2
      @fade-in
        opacity 1
      @fade-out
        opacity 0
    `

    loader.call(null, stylesheet).should.be.eql({
      '.foo': {
        width: '10px',
        height: '10px',
        opacity: 1,
        animation: 'fade-in 1s, fade-out 2s 10ms ease-in 2',
        keyframes: [{
          __aniName: 'fade-in',
          opacity: 1,
          duration: 1000
        }, {
          __aniName: 'fade-out',
          opacity: 0,
          duration: 2000,
          delay: 10,
          easing: 'ease-in',
          loop: 2
        }]
      }
    })
  })
})
