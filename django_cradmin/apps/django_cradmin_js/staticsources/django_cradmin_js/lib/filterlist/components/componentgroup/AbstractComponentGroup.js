"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractLayoutComponentChild = _interopRequireDefault(require("../AbstractLayoutComponentChild"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Abstract base class for rendering components managing componentgroups.
 *
 * See {@link AbstractComponentGroup.defaultProps} for documentation for
 * props and their defaults.
 */
var AbstractComponentGroup =
/*#__PURE__*/
function (_AbstractLayoutCompon) {
  function AbstractComponentGroup() {
    _classCallCheck(this, AbstractComponentGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractComponentGroup).apply(this, arguments));
  }

  _createClass(AbstractComponentGroup, null, [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractComponentGroup), "propTypes", this), {
        enabledComponentGroups: _propTypes.default.instanceOf(Set).isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractLayoutComponentChild.defaultProps}.
     *
     * @return {Object}
     * @property {Set} enabledComponentGroups Set of enabled componentgroups.
     *    _Provided automatically by the parent component_.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractComponentGroup), "defaultProps", this), {
        enabledComponentGroups: null
      });
    }
  }]);

  _inherits(AbstractComponentGroup, _AbstractLayoutCompon);

  return AbstractComponentGroup;
}(_AbstractLayoutComponentChild.default);

exports.default = AbstractComponentGroup;