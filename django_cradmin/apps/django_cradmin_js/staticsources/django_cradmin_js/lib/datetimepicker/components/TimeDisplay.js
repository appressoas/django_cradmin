"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

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

var TimeDisplay =
/*#__PURE__*/
function (_React$Component) {
  function TimeDisplay() {
    _classCallCheck(this, TimeDisplay);

    return _possibleConstructorReturn(this, _getPrototypeOf(TimeDisplay).apply(this, arguments));
  }

  _createClass(TimeDisplay, [{
    key: "renderSeparator",
    value: function renderSeparator(key) {
      return _react.default.createElement("span", {
        key: key,
        className: this.separatorClassName
      }, ":");
    }
  }, {
    key: "renderNumber",
    value: function renderNumber(key, number) {
      return _react.default.createElement("span", {
        key: key,
        className: this.numberClassName
      }, number);
    }
  }, {
    key: "renderHours",
    value: function renderHours() {
      return this.renderNumber('hours', this.props.momentObject.format('HH'));
    }
  }, {
    key: "renderMinutes",
    value: function renderMinutes() {
      return this.renderNumber('minutes', this.props.momentObject.format('mm'));
    }
  }, {
    key: "renderSeconds",
    value: function renderSeconds() {
      return this.renderNumber('seconds', this.props.momentObject.format('ss'));
    }
  }, {
    key: "renderNumbers",
    value: function renderNumbers() {
      var renderedNumbers = [this.renderHours(), this.renderSeparator('separator1'), this.renderMinutes()];

      if (this.props.showSeconds) {
        renderedNumbers.push(this.renderSeparator('separator2'));
        renderedNumbers.push(this.renderSeconds());
      }

      return renderedNumbers;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("span", {
        className: this.className
      }, this.renderNumbers());
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "separatorClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'separator');
    }
  }, {
    key: "numberClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'number');
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        showSeconds: false,
        bemBlock: 'timedisplay',
        bemVariants: []
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any.isRequired,
        showSeconds: _propTypes.default.bool.isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      };
    }
  }]);

  _inherits(TimeDisplay, _React$Component);

  return TimeDisplay;
}(_react.default.Component);

exports.default = TimeDisplay;