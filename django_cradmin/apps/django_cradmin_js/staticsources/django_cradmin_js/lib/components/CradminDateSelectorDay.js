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

var CradminDateSelectorDay =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminDateSelectorDay, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        extraSelectAttributes: {},
        labelText: window.gettext('Day'),
        initialYear: null,
        initialMonth: null,
        initialValue: 0
      };
    }
  }]);

  function CradminDateSelectorDay(props) {
    var _this;

    _classCallCheck(this, CradminDateSelectorDay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelectorDay).call(this, props));
    _this._name = "django_cradmin.components.CradminDateSelectorDay.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminDateSelectorDay');
    _this.state = {
      value: _this.props.initialValue,
      year: _this.props.initialYear,
      month: _this.props.initialMonth,
      disabled: true
    };
    _this.state.daysInMonth = _this._calculateDaysInMonth(_this.state)['daysInMonth'];
    _this._handleDayChange = _this._handleDayChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onMonthValueChangeSignal = _this._onMonthValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onYearValueChangeSignal = _this._onYearValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._postInit = _this._postInit.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this._initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminDateSelectorDay, [{
    key: "_initializeSignalHandlers",
    value: function _initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".initializeValues"), this._name, this._postInit);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".MonthValueChange"), this._name, this._onMonthValueChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".YearValueChange"), this._name, this._onYearValueChangeSignal);
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
    key: "_calculateDaysInMonth",
    value: function _calculateDaysInMonth(stateObject) {
      var daysInMonth = 31;
      var value = 0;

      if (stateObject.year != null && stateObject.month != null) {
        var date = new Date(Date.UTC(stateObject.year, stateObject.month + 1, 0));
        daysInMonth = date.getUTCDate();
      }

      if (stateObject.value != null) {
        value = stateObject.value;
      }

      return {
        daysInMonth: daysInMonth,
        value: value <= daysInMonth ? value : daysInMonth
      };
    }
  }, {
    key: "_updateDate",
    value: function _updateDate() {
      var _this2 = this;

      this.setState(function (prevState, props) {
        return _this2._calculateDaysInMonth(prevState);
      });

      if (this.logger.isDebug) {
        this.logger.debug("Updated year/month. State is now:\n\tdaysInMonth: ".concat(this.state.daysInMonth, "\n\tvalue: ").concat(this.state.value));
      }
    }
  }, {
    key: "_onMonthValueChangeSignal",
    value: function _onMonthValueChangeSignal(receivedSignalInfo) {
      this.setState({
        month: receivedSignalInfo.data
      });

      this._updateDate();
    }
  }, {
    key: "_onYearValueChangeSignal",
    value: function _onYearValueChangeSignal(receivedSignalInfo) {
      this.setState({
        year: receivedSignalInfo.data
      });

      this._updateDate();
    }
  }, {
    key: "_sendDateUpdateSignal",
    value: function _sendDateUpdateSignal(newDay) {
      var _this3 = this;

      if (newDay == 0) {
        newDay = null;
      }

      this.setState({
        value: newDay
      });
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".DayValueChange"), newDay, function (info) {
        if (_this3.logger.isDebug) {
          _this3.logger.debug("Update day: \n\tNew day: ".concat(newDay, "\n\t").concat(info));
        }
      });
    }
  }, {
    key: "_handleDayChange",
    value: function _handleDayChange(event) {
      var newDay = event.target.value;

      this._sendDateUpdateSignal(newDay);
    }
  }, {
    key: "render",
    value: function render() {
      var dayOptions = [_react.default.createElement("option", {
        key: "".concat(this._name, ".dayOption.0"),
        value: 0
      }, this.props.labelText)];

      for (var day = 1; day <= this.state.daysInMonth; day++) {
        dayOptions.push(_react.default.createElement("option", {
          key: "".concat(this._name, ".dayOption.").concat(day),
          value: day
        }, day));
      }

      return _react.default.createElement("select", _extends({
        value: this.state.value || 0,
        onChange: this._handleDayChange
      }, this.props.extraSelectAttributes), dayOptions);
    }
  }]);

  _inherits(CradminDateSelectorDay, _React$Component);

  return CradminDateSelectorDay;
}(_react.default.Component);

exports.default = CradminDateSelectorDay;