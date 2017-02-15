'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _preact = require('preact');

var _velocityAnimate = require('velocity-animate');

var _velocityAnimate2 = _interopRequireDefault(_velocityAnimate);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VelocityComponent = function (_Component) {
  (0, _inherits3.default)(VelocityComponent, _Component);

  function VelocityComponent() {
    (0, _classCallCheck3.default)(this, VelocityComponent);
    return (0, _possibleConstructorReturn3.default)(this, (VelocityComponent.__proto__ || (0, _getPrototypeOf2.default)(VelocityComponent)).apply(this, arguments));
  }

  (0, _createClass3.default)(VelocityComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.runAnimation();

      if (!this.props.runOnMount) {
        // should work with default props
        // this._finishAnimation()
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._stopAnimation();
      this._clearVelocityCache(this._getDOMTarget());
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(newProps) {
      if (!(0, _isEqual2.default)(newProps.animation, this.props.animation)) {
        this._stopAnimation();
        this._scheduleAnimation();
      }
    }
  }, {
    key: 'runAnimation',
    value: function runAnimation() {
      var _this2 = this;

      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.props.animation) {
        return;
      }

      var dom = this._getDOMTarget();
      this._shouldRunAnimation = false;

      if (config.stop) {
        (0, _velocityAnimate2.default)(dom, 'stop', true);
      } else if (config.finish) {
        (0, _velocityAnimate2.default)(dom, 'finishAll', true);
      }

      var _props = this.props,
          animation = _props.animation,
          animationProperty = _props.animationProperty,
          opts = (0, _objectWithoutProperties3.default)(_props, ['animation', 'animationProperty']);

      var animations = [].concat(animation);
      var properties = animations.map(function (_, index) {
        return (0, _assign2.default)({}, opts, [].concat(animationProperty)[index]);
      });

      animations.forEach(function (ani, index) {
        (0, _velocityAnimate2.default)(_this2._getDOMTarget(), ani, properties[index]);
      });
    }
  }, {
    key: '_scheduleAnimation',
    value: function _scheduleAnimation() {
      if (this._shouldRunAnimation) {
        return;
      }

      this._shouldRunAnimation = true;
      setTimeout(this.runAnimation.bind(this), 0);
    }
  }, {
    key: '_getDOMTarget',
    value: function _getDOMTarget() {
      return this.base;
    }
  }, {
    key: '_finishAnimation',
    value: function _finishAnimation() {
      (0, _velocityAnimate2.default)(this._getDOMTarget(), 'finishAll', true);
    }
  }, {
    key: '_stopAnimation',
    value: function _stopAnimation() {
      (0, _velocityAnimate2.default)(this._getDOMTarget(), 'stop', true);
    }
  }, {
    key: '_clearVelocityCache',
    value: function _clearVelocityCache(target) {
      if (target.length) {
        target.forEach(this._clearVelocityCache);
      } else {
        _velocityAnimate2.default.Utilities.removeData(target, ['velocity', 'fxqueue']);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children[0];
    }
  }, {
    key: 'getDefaultProps',
    value: function getDefaultProps() {
      // maybe should work with preact-compat
      return {
        animation: null,
        runOnMount: false
      };
    }
  }]);
  return VelocityComponent;
}(_preact.Component);

exports.default = VelocityComponent;