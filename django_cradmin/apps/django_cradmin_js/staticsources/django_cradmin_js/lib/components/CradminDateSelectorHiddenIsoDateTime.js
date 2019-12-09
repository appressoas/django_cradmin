"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _CradminDateSelectorHiddenIsoDate = _interopRequireDefault(require("./CradminDateSelectorHiddenIsoDate"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

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

var CradminDateSelectorHiddenIsoDateTime =
/*#__PURE__*/
function (_CradminDateSelectorH) {
  function CradminDateSelectorHiddenIsoDateTime() {
    _classCallCheck(this, CradminDateSelectorHiddenIsoDateTime);

    return _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelectorHiddenIsoDateTime).apply(this, arguments));
  }

  _createClass(CradminDateSelectorHiddenIsoDateTime, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      var initialState = _get(_getPrototypeOf(CradminDateSelectorHiddenIsoDateTime.prototype), "makeInitialState", this).call(this);

      initialState.hour = this.props.initialHour;
      initialState.minute = this.props.initialMinute;
      return initialState;
    }
  }, {
    key: "makeValueFromStateObject",
    value: function makeValueFromStateObject() {
      var date = new Date(Date.UTC(this.state.year, this.state.month, this.state.day, this.state.hour, this.state.minute));
      return date.toISOString().split('.')[0].replace('T', ' ');
    }
  }, {
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      _get(_getPrototypeOf(CradminDateSelectorHiddenIsoDateTime.prototype), "initializeSignalHandlers", this).call(this);

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
  }], [{
    key: "defaultProps",
    get: function get() {
      var defaultProps = _get(_getPrototypeOf(CradminDateSelectorHiddenIsoDateTime), "defaultProps", this);

      defaultProps.initialHour = 0;
      defaultProps.initialMinute = 0;
      return defaultProps;
    }
  }]);

  _inherits(CradminDateSelectorHiddenIsoDateTime, _CradminDateSelectorH);

  return CradminDateSelectorHiddenIsoDateTime;
}(_CradminDateSelectorHiddenIsoDate.default);

exports.default = CradminDateSelectorHiddenIsoDateTime;