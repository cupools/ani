import { h, Component } from 'preact'
import Velocity from 'velocity-animate'
import isEqual from 'lodash/isEqual'

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
    if (!isEqual(newProps.animation, this.props.animation)) {
      this._stopAnimation()
      this._scheduleAnimation()
    }
  }

  runAnimation(config = {}) {
    if (!this.props.animation) {
      return
    }

    const dom = this._getDOMTarget()
    this._shouldRunAnimation = false

    if (config.stop) {
      Velocity(dom, 'stop', true)
    } else if (config.finish) {
      Velocity(dom, 'finishAll', true)
    }

    const { animation, animationProperty, ...opts } = this.props
    const animations = [].concat(animation)
    const properties = animations.map(
      (_, index) => Object.assign({}, opts, [].concat(animationProperty)[index])
    )

    animations.forEach((ani, index) => {
      Velocity(this._getDOMTarget(), ani, properties[index])
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
    return this.props.children[0]
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
