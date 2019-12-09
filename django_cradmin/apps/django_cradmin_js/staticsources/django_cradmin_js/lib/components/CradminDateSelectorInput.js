"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _NumberFormat = _interopRequireDefault(require("../utilities/NumberFormat"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var CradminDateSelectorInput =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminDateSelectorInput, [{
    key: "_formatValue",
    value: function _formatValue(value) {
      if (isNaN(value)) {
        return '00';
      } else {
        return _NumberFormat.default.zeroPaddedString(value);
      }
    }
  }, {
    key: "signalName",
    get: function get() {
      throw new Error("Must be implemented in subclasses");
    }
  }, {
    key: "minValue",
    get: function get() {
      return 0;
    }
  }, {
    key: "maxValue",
    get: function get() {
      throw new Error("Must be implemented in subclasses");
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        inputClassName: 'dateinput__input',
        inputType: 'number',
        placeholder: '00',
        extraInputAttributes: {},
        initialValue: 0
      };
    }
  }]);

  function CradminDateSelectorInput(props) {
    var _this;

    _classCallCheck(this, CradminDateSelectorInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelectorInput).call(this, props));
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminDateSelectorInput');
    _this.state = {
      value: _this._formatValue(_this.props.initialValue)
    };
    _this._handleValueChange = _this._handleValueChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._handleClick = _this._handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(CradminDateSelectorInput, [{
    key: "_sendDateUpdateSignal",
    value: function _sendDateUpdateSignal(newValue) {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".").concat(this.signalName), newValue);
    }
  }, {
    key: "_handleValueChange",
    value: function _handleValueChange(event) {
      var stringValue = event.target.value.trim();
      var numericValue = parseInt(stringValue, 10);

      if (isNaN(numericValue)) {
        numericValue = 0;
      }

      if (numericValue > this.maxValue) {
        numericValue = this.maxValue;
      } else if (numericValue < this.minValue) {
        numericValue = this.minValue;
      }

      this.setState({
        value: this._formatValue(numericValue)
      });

      this._sendDateUpdateSignal(numericValue);
    }
  }, {
    key: "_handleClick",
    value: function _handleClick(event) {
      this._inputElement.select();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("input", _extends({
        value: this.state.value || "",
        ref: function ref(input) {
          _this2._inputElement = input;
        },
        type: this.props.inputType,
        min: this.minValue,
        max: this.maxValue,
        step: "1",
        onChange: this._handleValueChange,
        className: this.props.inputClassName,
        placeholder: this.props.placeholder,
        onClick: this._handleClick
      }, this.props.extraInputAttributes));
    }
  }]);

  _inherits(CradminDateSelectorInput, _React$Component);

  return CradminDateSelectorInput;
}(_react.default.Component);

exports.default = CradminDateSelectorInput;