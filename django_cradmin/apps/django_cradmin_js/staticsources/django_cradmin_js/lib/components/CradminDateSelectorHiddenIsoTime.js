"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _NumberFormat = _interopRequireDefault(require("../utilities/NumberFormat"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var CradminDateSelectorHiddenIsoTime =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminDateSelectorHiddenIsoTime, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        inputType: 'hidden',
        inputName: null,
        initialHour: 0,
        initialMinute: 0
      };
    }
  }]);

  function CradminDateSelectorHiddenIsoTime(props) {
    var _this;

    _classCallCheck(this, CradminDateSelectorHiddenIsoTime);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelectorHiddenIsoTime).call(this, props));
    _this._name = "django_cradmin.components.CradminDateSelectorHiddenIsoTime.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminDateSelectorHiddenIsoTime');
    _this.state = {
      hour: _this.props.initialHour,
      minute: _this.props.initialMinute
    };
    _this.state.value = _this._formatStateAsFieldValue();
    _this._onHourValueChangeSignal = _this._onHourValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onMinuteValueChangeSignal = _this._onMinuteValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminDateSelectorHiddenIsoTime, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      this._onHourValueChangeSignal = this._onHourValueChangeSignal.bind(this);
      this._onMinuteValueChangeSignal = this._onMinuteValueChangeSignal.bind(this);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".HourValueChange"), this._name, this._onHourValueChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".MinuteValueChange"), this._name, this._onMinuteValueChangeSignal);
    }
  }, {
    key: "_onHourValueChangeSignal",
    value: function _onHourValueChangeSignal(receivedSignalInfo) {
      this.setState({
        hour: receivedSignalInfo.data
      });
    }
  }, {
    key: "_onMinuteValueChangeSignal",
    value: function _onMinuteValueChangeSignal(receivedSignalInfo) {
      this.setState({
        minute: receivedSignalInfo.data
      });
    }
  }, {
    key: "_formatTimeNumber",
    value: function _formatTimeNumber(number) {
      number = parseInt(number, 10);

      if (isNaN(number)) {
        number = 0;
      }

      return _NumberFormat.default.zeroPaddedString(number);
    }
  }, {
    key: "_formatStateAsFieldValue",
    value: function _formatStateAsFieldValue() {
      return "".concat(this._formatTimeNumber(this.state.hour), ":").concat(this._formatTimeNumber(this.state.minute));
    }
  }, {
    key: "render",
    value: function render() {
      var value = this._formatStateAsFieldValue();

      return _react.default.createElement("input", {
        type: this.props.inputType,
        name: this.props.inputName,
        value: value,
        readOnly: true
      });
    }
  }]);

  _inherits(CradminDateSelectorHiddenIsoTime, _React$Component);

  return CradminDateSelectorHiddenIsoTime;
}(_react.default.Component);

exports.default = CradminDateSelectorHiddenIsoTime;