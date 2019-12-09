"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

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

var CradminDateSelectorYear =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminDateSelectorYear, null, [{
    key: "defaultProps",
    get: function get() {
      var currentYear = new Date().getUTCFullYear();
      return {
        signalNameSpace: null,
        extraSelectAttributes: {},
        labelText: window.gettext('Year'),
        minYear: currentYear - 10,
        maxYear: currentYear + 50,
        initialValue: null
      };
    }
  }]);

  function CradminDateSelectorYear(props) {
    var _this;

    _classCallCheck(this, CradminDateSelectorYear);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelectorYear).call(this, props));
    _this._name = "django_cradmin.components.CradminDateSelectorYear.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminDateSelectorYear');
    _this._handleYearChange = _this._handleYearChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._postInit = _this._postInit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      value: 0,
      disabled: true
    };

    _this._initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminDateSelectorYear, [{
    key: "_initializeSignalHandlers",
    value: function _initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".initializeValues"), this._name, this._postInit);
    }
  }, {
    key: "_postInit",
    value: function _postInit() {
      if (!this.state.disabled) {
        return;
      }

      this.setState({
        disabled: false
      });

      this._sendDateUpdateSignal(this.props.initialValue);
    }
  }, {
    key: "_sendDateUpdateSignal",
    value: function _sendDateUpdateSignal(newYear) {
      var _this2 = this;

      this.setState({
        value: newYear
      });

      if (newYear == 0) {
        newYear = null;
      }

      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".YearValueChange"), newYear, function (info) {
        if (_this2.logger.isDebug) {
          _this2.logger.debug("Update year: \n\tNew year: ".concat(newYear, "\n\t").concat(info));
        }
      });
    }
  }, {
    key: "_handleYearChange",
    value: function _handleYearChange(event) {
      var newYear = event.target.value;

      this._sendDateUpdateSignal(newYear);
    }
  }, {
    key: "renderOptions",
    value: function renderOptions() {
      if (this.state.disabled) {
        return [];
      }

      var yearOptions = [_react.default.createElement("option", {
        key: "".concat(this._name, ".yearOption.0"),
        value: 0
      }, this.props.labelText)];

      for (var year = this.props.minYear; year <= this.props.maxYear; year++) {
        yearOptions.push(_react.default.createElement("option", {
          key: "".concat(this._name, ".yearOption.").concat(year),
          value: year
        }, year));
      }

      return yearOptions;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("select", _extends({
        value: this.state.value || 0,
        onChange: this._handleYearChange,
        disabled: this.state.disabled
      }, this.props.extraSelectAttributes), this.renderOptions());
    }
  }]);

  _inherits(CradminDateSelectorYear, _React$Component);

  return CradminDateSelectorYear;
}(_react.default.Component);

exports.default = CradminDateSelectorYear;