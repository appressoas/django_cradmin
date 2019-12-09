"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _moment = _interopRequireDefault(require("moment"));

var _range = _interopRequireDefault(require("lodash/range"));

var _chunk = _interopRequireDefault(require("lodash/chunk"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

var DateCalendar =
/*#__PURE__*/
function (_React$Component) {
  function DateCalendar() {
    _classCallCheck(this, DateCalendar);

    return _possibleConstructorReturn(this, _getPrototypeOf(DateCalendar).apply(this, arguments));
  }

  _createClass(DateCalendar, [{
    key: "getMoment",
    value: function getMoment() {
      var momentObject = null;

      if (this.props.momentObject === null) {
        momentObject = this.props.initialFocusMomentObject.clone();
      } else {
        momentObject = this.props.momentObject.clone();
      }

      return momentObject;
    }
  }, {
    key: "isValidDay",
    value: function isValidDay(dayMomentObject) {
      return this.props.momentRange.contains(dayMomentObject);
    }
  }, {
    key: "makeDayButtonClassName",
    value: function makeDayButtonClassName(dayMomentObject) {
      var bemVariants = [];

      if (!dayMomentObject.isSame(this.getMoment(), 'month')) {
        bemVariants.push('muted');
      } else if (this.props.momentObject !== null && this.props.momentObject.isSame(dayMomentObject, 'day')) {
        bemVariants.push('selected');
      } else {
        var now = (0, _moment.default)();

        if (dayMomentObject.isSame(now, 'day')) {
          bemVariants.push('today');
        }
      }

      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'daybutton', bemVariants);
    }
  }, {
    key: "makeDayClassName",
    value: function makeDayClassName(dayMomentObject) {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'day');
    }
  }, {
    key: "renderDayButtonAriaLabel",
    value: function renderDayButtonAriaLabel(dayMomentObject) {
      return gettext.interpolate(gettext.gettext('Select %(date)s'), {
        date: dayMomentObject.format('LL')
      }, true);
    }
  }, {
    key: "renderDayButtonLabel",
    value: function renderDayButtonLabel(dayMomentObject) {
      return dayMomentObject.format('D');
    }
  }, {
    key: "renderDayButton",
    value: function renderDayButton(dayMomentObject) {
      var _this = this;

      return _react.default.createElement("button", {
        tabIndex: 0,
        className: this.makeDayButtonClassName(dayMomentObject),
        "aria-label": this.renderDayButtonAriaLabel(dayMomentObject),
        "aria-describedby": this.props.ariaDescribedByDomId,
        disabled: !this.isValidDay(dayMomentObject),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.props.onDaySelect(dayMomentObject);
        }
      }, this.renderDayButtonLabel(dayMomentObject));
    }
  }, {
    key: "renderDay",
    value: function renderDay(dayMomentObject) {
      return _react.default.createElement("div", {
        key: dayMomentObject.format(),
        className: this.makeDayClassName(dayMomentObject)
      }, this.renderDayButton(dayMomentObject));
    }
  }, {
    key: "renderDaysInWeek",
    value: function renderDaysInWeek(daysInWeek, year, month, week) {
      var _this2 = this;

      return daysInWeek.map(function (day) {
        var realMonth = month;
        var realYear = year;

        if (week === 0 && day > 7) {
          realMonth -= 1;
        } else if (week >= 4 && day <= 14) {
          realMonth += 1;
        }

        if (realMonth > 11) {
          realYear += 1;
          realMonth = 0;
        }

        if (realMonth < 0) {
          realYear -= 1;
          realMonth = 11;
        }

        var dayMomentObject = (0, _moment.default)({
          year: realYear,
          month: realMonth,
          day: day
        });

        if (dayMomentObject.format() === 'Invalid date') {
          console.log('CRAP', year, realMonth, day);
        }

        return _this2.renderDay(dayMomentObject);
      });
    }
  }, {
    key: "renderWeek",
    value: function renderWeek(daysInWeek, year, month, week) {
      return _react.default.createElement("div", {
        key: week,
        className: this.weekClassName
      }, this.renderDaysInWeek(daysInWeek, year, month, week));
    }
  }, {
    key: "renderWeeks",
    value: function renderWeeks() {
      var _this3 = this;

      var momentObject = this.getMoment();
      var firstDayOfWeek = momentObject.localeData().firstDayOfWeek();
      var endOfPreviousMonth = momentObject.clone().subtract(1, 'month').endOf('month').date();
      var startDayOfCurrentMonth = momentObject.clone().date(1).day();
      var endOfCurrentMonth = momentObject.clone().endOf('month').date();
      var year = momentObject.year();
      var month = momentObject.month();
      var days = [].concat((0, _range.default)(endOfPreviousMonth - startDayOfCurrentMonth + firstDayOfWeek + 1, endOfPreviousMonth + 1), (0, _range.default)(1, endOfCurrentMonth + 1), (0, _range.default)(1, 42 - endOfCurrentMonth - startDayOfCurrentMonth + firstDayOfWeek + 1));
      return (0, _chunk.default)(days, 7).map(function (daysInWeek, week) {
        return _this3.renderWeek(daysInWeek, year, month, week);
      });
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      return _react.default.createElement("div", {
        className: this.bodyClassName
      }, this.renderWeeks());
    }
  }, {
    key: "renderHeaderRowContent",
    value: function renderHeaderRowContent() {
      var _this4 = this;

      var momentObject = this.getMoment();
      var firstDayOfWeek = momentObject.localeData().firstDayOfWeek();
      var weekdays = momentObject.localeData().weekdaysShort();
      weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
      return weekdays.map(function (weekday, index) {
        return _react.default.createElement("div", {
          key: index,
          className: _this4.headerDayClassName
        }, weekday);
      });
    }
  }, {
    key: "renderHeaderRow",
    value: function renderHeaderRow() {
      return _react.default.createElement("div", {
        className: this.headerRowClassName
      }, this.renderHeaderRowContent());
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      return _react.default.createElement("div", {
        className: this.headerClassName
      }, this.renderHeaderRow());
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.className
      }, this.renderHeader(), this.renderBody());
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "headerClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'header');
    }
  }, {
    key: "headerRowClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'header-row');
    }
  }, {
    key: "headerDayClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'header-day');
    }
  }, {
    key: "bodyClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'body');
    }
  }, {
    key: "weekClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'week');
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        initialFocusMomentObject: (0, _moment.default)(),
        bemBlock: 'calendar-month',
        bemVariants: [],
        onDaySelect: null,
        ariaDescribedByDomId: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any,
        initialFocusMomentObject: _propTypes.default.any.isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        onDaySelect: _propTypes.default.func.isRequired,
        ariaDescribedByDomId: _propTypes.default.string.isRequired
      };
    }
  }]);

  _inherits(DateCalendar, _React$Component);

  return DateCalendar;
}(_react.default.Component);

exports.default = DateCalendar;