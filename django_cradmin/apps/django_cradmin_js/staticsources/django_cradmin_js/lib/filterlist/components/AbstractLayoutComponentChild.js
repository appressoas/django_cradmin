"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilterListChild = _interopRequireDefault(require("./AbstractFilterListChild"));

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
 * Abstract base class for components that is rendered as children
 * of a {@link AbstractLayout}.
 *
 * See {@link AbstractLayoutComponentChild.defaultProps} for documentation for
 * props and their defaults.
 */
var AbstractLayoutComponentChild =
/*#__PURE__*/
function (_AbstractFilterListCh) {
  function AbstractLayoutComponentChild() {
    _classCallCheck(this, AbstractLayoutComponentChild);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractLayoutComponentChild).apply(this, arguments));
  }

  _createClass(AbstractLayoutComponentChild, null, [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractLayoutComponentChild), "propTypes", this), {
        location: _propTypes.default.string.isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractFilterListChild.defaultProps}.
     *
     * @return {Object}
     * @property {string} location The location where the component is rendered.
     *    In advanced cases, you may want to render the component
     *    differently depending on the location, but this is generally
     *    not recommended for reusable components.
     *
     *    Will normally be one of {@link RENDER_LOCATION_LEFT},
     *    {@link RENDER_LOCATION_RIGHT}, {@link RENDER_LOCATION_TOP},
     *    {@link RENDER_LOCATION_BOTTOM} or {@link RENDER_LOCATION_CENTER},
     *    but layout components (see {@link AbstractLayout}) may define
     *    their own locations.
     *
     *    This is required, and defaults to `null`.
     *    **Can be used in spec**.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(AbstractLayoutComponentChild), "defaultProps", this), {
        location: null
      });
    }
  }]);

  _inherits(AbstractLayoutComponentChild, _AbstractFilterListCh);

  return AbstractLayoutComponentChild;
}(_AbstractFilterListChild.default);

exports.default = AbstractLayoutComponentChild;