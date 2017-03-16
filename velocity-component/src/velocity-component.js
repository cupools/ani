import { h, Component } from 'preact'
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui.min'
import isEqual from 'lodash.isEqual'

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
      const { duration = 0, delay = 0, easing = 'linear', loop = 0, complete = null, ...props } = keyframe

      if (keyframe.keyframes) {
        // Velocity Effect calls
        const __aniName = `transition${Math.random().toString().slice(2, 10)}`
        Velocity.RegisterEffect(__aniName, {
          calls: keyframe.keyframes.map(item => [item, item.durationPercentage]),
          loop
        })
        Velocity(this._getDOMTarget(), __aniName, { duration, delay, easing, loop, complete })
      } else {
        // single transform
        Velocity(this._getDOMTarget(), props, { duration, delay, easing, loop, complete })
      }
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
