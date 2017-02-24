import { h, Component } from 'preact'
import Velocity from 'velocity-animate'
import { isEqual } from 'lodash'

class VelocityComponent extends Component {
  componentDidMount() {
    this.runAnimation()

    if (!this.props.runOnMount) {
      // should work with default props
      // this._finishAnimation()
    }
  }

  componentWillUnmount() {
    this._stopAnimation()
    this._clearVelocityCache(this._getDOMTarget())
  }

  componentWillUpdate(newProps) {
    if (!isEqual(newProps.keyframes, this.props.keyframes)) {
      this._stopAnimation()
      this._scheduleAnimation()
    }
  }

  runAnimation(config = {}) {
    if (!this.props.keyframes) {
      return
    }

    const dom = this._getDOMTarget()
    this._shouldRunAnimation = false

    if (config.stop) {
      Velocity(dom, 'stop', true)
    } else if (config.finish) {
      Velocity(dom, 'finishAll', true)
    }

    const { keyframes, ...ani } = this.props

    // FIXME, origin status
    Velocity(this._getDOMTarget(), ani, { duration: 0 })

    keyframes.forEach(keyframe => {
      const { duration = 0, delay = 0, easing = 'linear', loop = 0, ...props } = keyframe

      Velocity(this._getDOMTarget(), props, {
        duration,
        delay,
        easing,
        loop
      })
    })
  }

  _scheduleAnimation() {
    if (this._shouldRunAnimation) {
      return
    }

    this._shouldRunAnimation = true
    setTimeout(this.runAnimation.bind(this), 0)
  }

  _getDOMTarget() {
    return this.base
  }

  _finishAnimation() {
    Velocity(this._getDOMTarget(), 'finishAll', true)
  }

  _stopAnimation() {
    Velocity(this._getDOMTarget(), 'stop', true)
  }

  _clearVelocityCache(target) {
    if (target.length) {
      target.forEach(this._clearVelocityCache)
    } else {
      Velocity.Utilities.removeData(target, ['velocity', 'fxqueue'])
    }
  }

  render() {
    return this.props.children.length ? this.props.children[0] : <span {...this.props}></span>
  }

  getDefaultProps() {
    // maybe should work with preact-compat
    return {
      animation: null,
      runOnMount: false
    }
  }
}

export default VelocityComponent
