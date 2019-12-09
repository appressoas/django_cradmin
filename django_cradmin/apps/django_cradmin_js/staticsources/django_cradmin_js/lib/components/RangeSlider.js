"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BemUtilities = _interopRequireDefault(require("../utilities/BemUtilities"));

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

var RangeSlider =
/*#__PURE__*/
function (_React$Component) {
  function RangeSlider() {
    _classCallCheck(this, RangeSlider);

    return _possibleConstructorReturn(this, _getPrototypeOf(RangeSlider).apply(this, arguments));
  }

  _createClass(RangeSlider, [{
    key: "handleChange",
    value: function handleChange(e) {
      var value = parseInt(e.target.value, 10);
      this.props.onChange(value);
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("input", {
        type: 'range',
        className: this.className,
        min: this.props.min,
        max: this.props.max,
        value: this.props.value,
        onChange: this.handleChange.bind(this)
      });
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        bemBlock: 'range-input',
        bemVariants: [],
        min: 0,
        max: null,
        value: 0,
        onChange: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        min: _propTypes.default.number.isRequired,
        max: _propTypes.default.number.isRequired,
        value: _propTypes.default.number.isRequired,
        onChange: _propTypes.default.func.isRequired
      };
    }
  }]);

  _inherits(RangeSlider, _React$Component);

  return RangeSlider;
}(_react.default.Component);

exports.default = RangeSlider;