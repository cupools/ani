'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = exports.loader = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _stylus = require('stylus');

var _stylus2 = _interopRequireDefault(_stylus);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var loader = exports.loader = function loader(content) {
  var raw = JSON.stringify(process(content));
  return 'module.exports = ' + raw + ';';
};

var process = exports.process = function process(content) {
  var css = preprocess(content);
  var obj = render(css);
  return obj;
};

function preprocess(content) {
  var raw = '';
  (0, _stylus2.default)(content).import(_path2.default.join(__dirname, 'mixin')).render(function (err, css) {
    if (err) throw err;
    raw = css;
  });

  return raw;
}

function render(css) {
  var root = _postcss2.default.parse(css);

  // collect keyframes first
  // TODO: support @keyframes
  var keyframeStorage = walkNode(root, 'atRule', function (atRule) {
    var name = atRule.name;

    var transform = walkNode(atRule, 'decl', function (decl) {
      return _defineProperty({}, decl.prop, convertValue(decl.value));
    });
    return _defineProperty({}, name, transform);
  });

  // TODO: selector inherit
  var ret = walkNode(root, 'rule', function (rule) {
    var selector = rule.selector;

    var declarations = walkNode(rule, 'decl', function (decl) {
      return _defineProperty({}, decl.prop, convertValue(decl.value));
    });

    if (!declarations.animation) {
      return {};
    }

    var animationParams = generateAnimationParams(declarations.animation);

    var keyframes = animationParams.map(function (item) {
      var __aniName = item.__aniName;


      if (__aniName.includes('__SPLIT__')) {
        return _extends({}, item, getAnimationParamsFromString(__aniName));
      }
      return _extends({}, item, keyframeStorage[item.__aniName] || {});
    });

    return _defineProperty({}, selector, _extends({}, declarations, {
      animation: declarations.animation.replace(/to\(.*?\)/g, 'anonymous'),
      keyframes: keyframes
    }));
  });

  return ret;
}

function walkNode(root, type, fn) {
  var ret = {};
  var method = 'walk' + (type.charAt(0).toUpperCase() + type.slice(1)) + 's';

  root[method](function (node) {
    var obj = fn(node);
    _extends(ret, obj);
  });

  return ret;
}

/**
 * generate animation parameters from animation declaration
 */
function generateAnimationParams(animation) {
  var timeReg = /^(\d+)?(\.)?\d+m?s$/i;
  var loopReg = /^(\d|infinite|forwards|steps\(\d+\))$/i;
  var timeConvert = function timeConvert(n) {
    return parseFloat(n) * (/ms$/.test(n) ? 1 : 1e3);
  };

  if (!animation) {
    return [];
  }

  return animation.replace(/to\((.*?)\)/g, function (_, $1) {
    return 'to(' + $1.replace(/\s*,\s*/g, '__SPLIT__') + ')';
  }).split(',').map(function (raw) {
    var params = raw.trim().replace(/\s+/g, ' ').split(' ');
    return params.reduce(function (ret, str) {
      // the first parameter should be `aniName`
      if (ret.__aniName === undefined) {
        return _extends({}, ret, { __aniName: str });
      }
      // if the parameter satisfies time, it may be `duration` or `delay`
      if (timeReg.test(str)) {
        var type = ret.duration === undefined ? 'duration' : 'delay';
        return _extends({}, ret, _defineProperty({}, type, timeConvert(str)));
      }
      // it the parameter satisfies loop properties
      if (ret.duration !== undefined && loopReg.test(str)) {
        return _extends({}, ret, { loop: convertValue(str) });
      }
      // otherwise it may be easing name or bezier
      return _extends({}, ret, { easing: str });
    }, {});
  });
}

function getAnimationParamsFromString(raw) {
  var params = raw.slice(3, -1).split('__SPLIT__');
  return params.reduce(function (ret, item, index) {
    if (index % 2 === 1) return ret;
    return _extends({}, ret, _defineProperty({}, item, convertValue(params[index + 1])));
  }, { __aniName: 'anonymous' });
}

function convertValue(str) {
  return isNaN(str) ? str : parseFloat(str);
}