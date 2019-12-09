"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Abstract base class for rendering a ``searchinput__button``.
 *
 * See {@link AbstractSearchInputButton.defaultProps} for documentation for
 * props and their defaults.
 */
var AbstractSearchInputButton =
/*#__PURE__*/
function (_React$Component) {
  function AbstractSearchInputButton() {
    _classCallCheck(this, AbstractSearchInputButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractSearchInputButton).apply(this, arguments));
  }

  _createClass(AbstractSearchInputButton, [{
    key: "renderIcon",
    value: function renderIcon() {
      return _react.default.createElement("span", {
        className: this.fullIconClassName,
        "aria-hidden": "true"
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("button", {
        type: "button",
        className: this.className,
        title: this.label,
        onClick: this.props.onClick,
        onFocus: this.props.onFocus,
        onBlur: this.props.onBlur,
        "aria-hidden": this.props.ariaHidden,
        tabIndex: this.props.tabIndex
      }, this.renderIcon());
    }
  }, {
    key: "className",
    get: function get() {
      return 'searchinput__button';
    }
  }, {
    key: "iconClassName",
    get: function get() {
      throw new Error('iconClassName must be overridden in subclasses.');
    }
  }, {
    key: "label",
    get: function get() {
      throw new Error('label must be overridden in subclasses.');
    }
  }, {
    key: "fullIconClassName",
    get: function get() {
      return "searchinput__buttonicon ".concat(this.iconClassName);
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return {
        onClick: _propTypes.default.func.isRequired,
        onFocus: _propTypes.default.func.isRequired,
        onBlur: _propTypes.default.func.isRequired,
        ariaHidden: _propTypes.default.bool.isRequired,
        tabIndex: _propTypes.default.number.isRequired
      };
    }
    /**
     * Get default props.
     *
     * @return {Object}
     * @property {func} onClick On click callback.
     * @property {func} onFocus On focus callback.
     * @property {func} onBlur On blur callback.
     * @property {bool} ariaHidden Is this button hidden to screenreaders?
     *    Defaults to false.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return {
        onClick: null,
        onFocus: null,
        onBlur: null,
        ariaHidden: false,
        tabIndex: 0
      };
    }
  }]);

  _inherits(AbstractSearchInputButton, _React$Component);

  return AbstractSearchInputButton;
}(_react.default.Component);

exports.default = AbstractSearchInputButton;