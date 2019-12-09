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

var CradminDateSelectorMonth =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminDateSelectorMonth, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        extraSelectAttributes: {},
        labelText: window.gettext('Month'),
        monthLabels: [window.pgettext('month shortname', 'Jan'), window.pgettext('month shortname', 'Feb'), window.pgettext('month shortname', 'Mar'), window.pgettext('month shortname', 'Apr'), window.pgettext('month shortname', 'May'), window.pgettext('month shortname', 'Jun'), window.pgettext('month shortname', 'Jul'), window.pgettext('month shortname', 'Aug'), window.pgettext('month shortname', 'Sep'), window.pgettext('month shortname', 'Oct'), window.pgettext('month shortname', 'Nov'), window.pgettext('month shortname', 'Des')],
        useLabels: true,
        initialValue: new Date().getUTCMonth()
      };
    }
  }]);

  function CradminDateSelectorMonth(props) {
    var _this;

    _classCallCheck(this, CradminDateSelectorMonth);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelectorMonth).call(this, props));
    _this._name = "django_cradmin.components.CradminDateSelectorMonth.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminDateSelectorMonth');
    _this._handleMonthChange = _this._handleMonthChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._postInit = _this._postInit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      value: 0,
      disabled: true
    };

    if (!_this.props.useLabels) {
      _this.props.monthLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }

    _this._initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminDateSelectorMonth, [{
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

      this.logger.debug("month, afterinitializeall...");
      this.setState({
        disabled: false
      });

      this._sendDateUpdateSignal(this.props.initialValue);
    }
  }, {
    key: "_sendDateUpdateSignal",
    value: function _sendDateUpdateSignal(newMonth) {
      var _this2 = this;

      this.setState({
        value: newMonth
      });

      if (newMonth <= 0) {
        newMonth = null;
      } else {
        newMonth--;
      }

      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".MonthValueChange"), newMonth, function (info) {
        if (_this2.logger.isDebug) {
          _this2.logger.debug("Update month: \n\tNew month: ".concat(newMonth, "\n\t").concat(info));
        }
      });
    }
  }, {
    key: "_handleMonthChange",
    value: function _handleMonthChange(event) {
      var newMonth = event.target.value;

      this._sendDateUpdateSignal(newMonth);
    }
  }, {
    key: "renderOptions",
    value: function renderOptions() {
      if (this.state.disabled) {
        return [];
      }

      var monthOptions = [_react.default.createElement("option", {
        key: "".concat(this._name, ".monthOption.0"),
        value: 0
      }, this.props.labelText)];

      for (var monthNumber = 1; monthNumber <= this.props.monthLabels.length; monthNumber++) {
        monthOptions.push(_react.default.createElement("option", {
          key: "".concat(this._name, ".monthOption.").concat(monthNumber),
          value: monthNumber
        }, this.props.monthLabels[monthNumber - 1]));
      }

      return monthOptions;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("select", _extends({
        value: this.state.value || 0,
        onChange: this._handleMonthChange,
        disabled: this.state.disabled
      }, this.props.extraSelectAttributes), this.renderOptions());
    }
  }]);

  _inherits(CradminDateSelectorMonth, _React$Component);

  return CradminDateSelectorMonth;
}(_react.default.Component);

exports.default = CradminDateSelectorMonth;