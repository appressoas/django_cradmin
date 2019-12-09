"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _CradminDateSelectorYear = _interopRequireDefault(require("./CradminDateSelectorYear"));

var _CradminDateSelectorMonth = _interopRequireDefault(require("./CradminDateSelectorMonth"));

var _CradminDateSelectorDay = _interopRequireDefault(require("./CradminDateSelectorDay"));

var _CradminDateSelectorHour = _interopRequireDefault(require("./CradminDateSelectorHour"));

var _CradminDateSelectorMinute = _interopRequireDefault(require("./CradminDateSelectorMinute"));

var _CradminDateSelectorHiddenIsoDate = _interopRequireDefault(require("./CradminDateSelectorHiddenIsoDate"));

var _CradminDateSelectorHiddenIsoDateTime = _interopRequireDefault(require("./CradminDateSelectorHiddenIsoDateTime"));

var _CradminDateSelectorHiddenIsoTime = _interopRequireDefault(require("./CradminDateSelectorHiddenIsoTime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var CradminDateSelector =
/*#__PURE__*/
function (_React$Component) {
  function CradminDateSelector() {
    _classCallCheck(this, CradminDateSelector);

    return _possibleConstructorReturn(this, _getPrototypeOf(CradminDateSelector).apply(this, arguments));
  }

  _createClass(CradminDateSelector, [{
    key: "renderResultField",
    value: function renderResultField() {
      if (this.props.includeDate && this.props.includeTime) {
        return _react.default.createElement(_CradminDateSelectorHiddenIsoDateTime.default, _extends({
          signalNameSpace: this.props.signalNameSpace,
          initialDay: this.props.initialDay,
          initialMonth: this.props.initialMonth,
          initialYear: this.props.initialYear,
          initialHour: this.props.initialHour,
          initialMinute: this.props.initialMinute
        }, this.props.resultFieldProps));
      } else if (this.props.includeDate) {
        return _react.default.createElement(_CradminDateSelectorHiddenIsoDate.default, _extends({
          signalNameSpace: this.props.signalNameSpace,
          initialDay: this.props.initialDay,
          initialMonth: this.props.initialMonth,
          initialYear: this.props.initialYear
        }, this.props.resultFieldProps));
      } else {
        return _react.default.createElement(_CradminDateSelectorHiddenIsoTime.default, _extends({
          signalNameSpace: this.props.signalNameSpace,
          initialHour: this.props.initialHour,
          initialMinute: this.props.initialMinute
        }, this.props.resultFieldProps));
      }
    }
  }, {
    key: "renderDayComponent",
    value: function renderDayComponent() {
      return _react.default.createElement("label", {
        key: "day",
        className: "dateinput__select"
      }, _react.default.createElement(_CradminDateSelectorDay.default, _extends({
        signalNameSpace: this.props.signalNameSpace,
        initialValue: this.props.initialDay
      }, this.props.dayFieldProps)));
    }
  }, {
    key: "renderMonthComponent",
    value: function renderMonthComponent() {
      return _react.default.createElement("label", {
        key: "month",
        className: "dateinput__select"
      }, _react.default.createElement(_CradminDateSelectorMonth.default, _extends({
        signalNameSpace: this.props.signalNameSpace,
        initialValue: this.props.initialMonth
      }, this.props.monthFieldProps)));
    }
  }, {
    key: "renderYearComponent",
    value: function renderYearComponent() {
      return _react.default.createElement("label", {
        key: "year",
        className: "dateinput__select"
      }, _react.default.createElement(_CradminDateSelectorYear.default, _extends({
        signalNameSpace: this.props.signalNameSpace,
        initialValue: this.props.initialYear
      }, this.props.yearFieldProps)));
    }
  }, {
    key: "renderDateComponents",
    value: function renderDateComponents() {
      var dateComponents = [];

      if (this.props.monthBeforeDay) {
        dateComponents = [this.renderMonthComponent(), this.renderDayComponent()];
      } else {
        dateComponents = [this.renderDayComponent(), this.renderMonthComponent()];
      }

      dateComponents.push(this.renderYearComponent());
      return dateComponents;
    }
  }, {
    key: "renderDateGroup",
    value: function renderDateGroup() {
      return _react.default.createElement("div", {
        key: "date",
        className: "dateinput__group"
      }, this.renderDateComponents());
    }
  }, {
    key: "renderHourComponent",
    value: function renderHourComponent() {
      return _react.default.createElement(_CradminDateSelectorHour.default, _extends({
        key: "hour",
        signalNameSpace: this.props.signalNameSpace,
        initialValue: this.props.initialHour
      }, this.props.hourFieldProps));
    }
  }, {
    key: "renderHourMinuteSeparatorComponent",
    value: function renderHourMinuteSeparatorComponent() {
      return _react.default.createElement("span", {
        key: "hourminuteseparator",
        className: "dateinput__separator"
      }, ":");
    }
  }, {
    key: "renderMinuteComponent",
    value: function renderMinuteComponent() {
      return _react.default.createElement(_CradminDateSelectorMinute.default, _extends({
        key: "minute",
        signalNameSpace: this.props.signalNameSpace,
        initialValue: this.props.initialMinute
      }, this.props.minuteFieldProps));
    }
  }, {
    key: "renderTimeComponents",
    value: function renderTimeComponents() {
      return [this.renderHourComponent(), this.renderHourMinuteSeparatorComponent(), this.renderMinuteComponent()];
    }
  }, {
    key: "renderTimeGroup",
    value: function renderTimeGroup() {
      return _react.default.createElement("label", {
        key: "time",
        className: "dateinput__group"
      }, this.renderTimeComponents());
    }
  }, {
    key: "renderGroups",
    value: function renderGroups() {
      var groups = [];

      if (this.props.includeDate) {
        groups.push(this.renderDateGroup());
      }

      if (this.props.includeTime) {
        groups.push(this.renderTimeGroup());
      }

      return groups;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "dateinput"
      }, this.renderGroups(), this.renderResultField());
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        includeDate: true,
        includeTime: false,
        monthBeforeDay: false,
        resultFieldProps: {},
        dayFieldProps: {},
        monthFieldProps: {},
        yearFieldProps: {},
        hourFieldProps: {},
        minuteFieldProps: {},
        initialDay: null,
        initialMonth: null,
        initialYear: new Date().getUTCFullYear(),
        initialMinute: 0,
        initialHour: 0
      };
    }
  }]);

  _inherits(CradminDateSelector, _React$Component);

  return CradminDateSelector;
}(_react.default.Component);

exports.default = CradminDateSelector;