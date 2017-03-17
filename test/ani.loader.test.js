/* eslint-env mocha */

import Chai from 'chai'
import { process } from '../ani-loader'

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

    process.call(null, stylesheet).should.be.eql({
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

    process.call(null, stylesheet).should.be.eql({
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

  it('should work', () => {
    const stylesheet = `
      .foo
        width 10px
        animation to(opacity, 1, translateY, 10px) 2.5s
    `

    process.call(null, stylesheet).should.be.eql({
      '.foo': {
        width: '10px',
        animation: 'anonymous 2.5s',
        keyframes: [{
          __aniName: 'anonymous',
          opacity: 1,
          translateY: '10px',
          duration: 2500
        }]
      }
    })
  })

  it('should work with keyframes', () => {
    const stylesheet = `
      .foo
        width 10px
        animation shake 2s 1s easing

      @keyframes shake
        0%
          rotate 0
        10%
          rotate 10deg
        20%
          rotate -10deg
        30%
          rotate 0
        100%
          rotate 0
    `

    process.call(null, stylesheet).should.be.eql({
      '.foo': {
        width: '10px',
        animation: 'shake 2s 1s easing',
        keyframes: [{
          __aniName: 'shake',
          width: '10px',
          keyframes: [{
            rotate: '0',
            durationPercentage: 0
          }, {
            rotate: '10deg',
            durationPercentage: 0.1
          }, {
            rotatae: '-10deg',
            durationPercentage: 0.1
          }, {
            rotate: '0',
            durationPercentage: 0.1
          }, {
            rotate: '0',
            durationPercentage: 0.7
          }]
        }]
      }
    })
  })
})
