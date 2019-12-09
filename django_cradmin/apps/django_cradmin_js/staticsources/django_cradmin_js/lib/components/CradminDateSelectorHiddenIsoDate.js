"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

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

var CradminDateSelectorHiddenIsoDate =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminDateSelectorHiddenIsoDate, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      return {
        day: this.props.initialDay,
        month: this.props.initialMonth,
        year: this.props.initialYear
      };
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        inputType: 'hidden',
        inputName: null,
        initialDay: null,
        initialMonth: null,
        initialYear: null
      };
    }
  }]);

  function CradminDateSelectorHiddenIsoDate(props) {
    var _this;

    _classCallCheck(this, CradminDateSelectorHiddenIsoDate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelectorHiddenIsoDate).call(this, props));
    _this._name = "django_cradmin.components.CradminDateSelectorHiddenIsoDate.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminDateSelectorHiddenIsoDate');
    _this.state = _this.makeInitialState();
    _this._onDayValueChangeSignal = _this._onDayValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onMonthValueChangeSignal = _this._onMonthValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onYearValueChangeSignal = _this._onYearValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminDateSelectorHiddenIsoDate, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".DayValueChange"), this._name, this._onDayValueChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".MonthValueChange"), this._name, this._onMonthValueChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".YearValueChange"), this._name, this._onYearValueChangeSignal);
    }
  }, {
    key: "isInvalid",
    value: function isInvalid() {
      return this.state.day == null || this.state.year == null || this.state.month == null;
    }
  }, {
    key: "makeValueFromStateObject",
    value: function makeValueFromStateObject() {
      var date = new Date(Date.UTC(this.state.year, this.state.month, this.state.day));
      return date.toISOString().split('T')[0];
    }
  }, {
    key: "_onDayValueChangeSignal",
    value: function _onDayValueChangeSignal(receivedSignalInfo) {
      this.setState({
        day: receivedSignalInfo.data
      });
    }
  }, {
    key: "_onMonthValueChangeSignal",
    value: function _onMonthValueChangeSignal(receivedSignalInfo) {
      this.setState({
        month: receivedSignalInfo.data
      });
    }
  }, {
    key: "_onYearValueChangeSignal",
    value: function _onYearValueChangeSignal(receivedSignalInfo) {
      this.setState({
        year: receivedSignalInfo.data
      });
    }
  }, {
    key: "render",
    value: function render() {
      var value = '';

      if (!this.isInvalid()) {
        value = this.makeValueFromStateObject();
      }

      return _react.default.createElement("input", {
        type: this.props.inputType,
        name: this.props.inputName,
        value: value,
        readOnly: true
      });
    }
  }]);

  _inherits(CradminDateSelectorHiddenIsoDate, _React$Component);

  return CradminDateSelectorHiddenIsoDate;
}(_react.default.Component);

exports.default = CradminDateSelectorHiddenIsoDate;