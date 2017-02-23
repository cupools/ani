!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("preact"),require("velocity-animate"),require("lodash.isequal")):"function"==typeof define&&define.amd?define(["preact","velocity-animate","lodash.isequal"],e):t.VelocityComponent=e(t.preact,t.Velocity,t.isEqual)}(this,function(t,e,n){"use strict";e="default"in e?e.default:e,n="default"in n?n.default:n;var o=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},i=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},r=function(t,e){var n={};for(var o in t)e.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o]);return n},a=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e},s=function(s){function p(){return o(this,p),a(this,s.apply(this,arguments))}return i(p,s),p.prototype.componentDidMount=function(){this.runAnimation(),!this.props.runOnMount},p.prototype.componentWillUnmount=function(){this._stopAnimation(),this._clearVelocityCache(this._getDOMTarget())},p.prototype.componentWillUpdate=function(t){n(t.keyframes,this.props.keyframes)||(this._stopAnimation(),this._scheduleAnimation())},p.prototype.runAnimation=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(this.props.keyframes){var o=this._getDOMTarget();this._shouldRunAnimation=!1,n.stop?e(o,"stop",!0):n.finish&&e(o,"finishAll",!0);var i=this.props,a=i.keyframes,s=r(i,["keyframes"]);e(this._getDOMTarget(),s,{duration:0}),a.forEach(function(n){var o=n.duration,i=void 0===o?0:o,a=n.delay,s=void 0===a?0:a,p=n.easing,u=void 0===p?"linear":p,c=n.loop,l=void 0===c?0:c,f=r(n,["duration","delay","easing","loop"]);e(t._getDOMTarget(),f,{duration:i,delay:s,easing:u,loop:l})})}},p.prototype._scheduleAnimation=function(){this._shouldRunAnimation||(this._shouldRunAnimation=!0,setTimeout(this.runAnimation.bind(this),0))},p.prototype._getDOMTarget=function(){return this.base},p.prototype._finishAnimation=function(){e(this._getDOMTarget(),"finishAll",!0)},p.prototype._stopAnimation=function(){e(this._getDOMTarget(),"stop",!0)},p.prototype._clearVelocityCache=function(t){t.length?t.forEach(this._clearVelocityCache):e.Utilities.removeData(t,["velocity","fxqueue"])},p.prototype.render=function(){return this.props.children.length?this.props.children[0]:t.h("span",this.props)},p.prototype.getDefaultProps=function(){return{animation:null,runOnMount:!1}},p}(t.Component);return s});
//# sourceMappingURL=velocity-component.js.map
