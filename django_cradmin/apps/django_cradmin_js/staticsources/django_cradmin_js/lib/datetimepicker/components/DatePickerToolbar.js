"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _YearSelect = _interopRequireDefault(require("./YearSelect"));

var _MonthSelect = _interopRequireDefault(require("./MonthSelect"));

var _MomentRange = _interopRequireDefault(require("../../utilities/MomentRange"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

var DatePickerToolbar =
/*#__PURE__*/
function (_React$Component) {
  function DatePickerToolbar() {
    _classCallCheck(this, DatePickerToolbar);

    return _possibleConstructorReturn(this, _getPrototypeOf(DatePickerToolbar).apply(this, arguments));
  }

  _createClass(DatePickerToolbar, [{
    key: "renderPrevMonthButtonAriaLabel",
    value: function renderPrevMonthButtonAriaLabel() {
      return gettext.interpolate(gettext.gettext('Select previous month (%(month)s)'), {
        month: this.prevMonthMoment.format('MMMM YYYY')
      }, true);
    }
  }, {
    key: "renderNextMonthButtonAriaLabel",
    value: function renderNextMonthButtonAriaLabel() {
      return gettext.interpolate(gettext.gettext('Select next month (%(month)s)'), {
        month: this.nextMonthMoment.format('MMMM YYYY')
      }, true);
    }
  }, {
    key: "isValidMonth",
    value: function isValidMonth(monthMomentObject) {
      return this.props.momentRange.contains(monthMomentObject);
    }
  }, {
    key: "renderPrevMonthButton",
    value: function renderPrevMonthButton() {
      return _react.default.createElement("button", {
        className: this.buttonClassName,
        title: this.props.leftButtonTitle,
        onClick: this.props.onPrevMonth,
        disabled: !this.isValidMonth(this.prevMonthMoment),
        "aria-label": this.renderPrevMonthButtonAriaLabel(),
        "aria-describedby": this.props.ariaDescribedByDomId
      }, _react.default.createElement("span", {
        className: this.leftButtonIconClassName,
        "aria-hidden": "true"
      }));
    }
  }, {
    key: "renderNextMonthButton",
    value: function renderNextMonthButton() {
      return _react.default.createElement("button", {
        className: this.buttonClassName,
        title: this.props.rightButtonTitle,
        onClick: this.props.onNextMonth,
        disabled: !this.isValidMonth(this.nextMonthMoment),
        "aria-label": this.renderNextMonthButtonAriaLabel(),
        "aria-describedby": this.props.ariaDescribedByDomId
      }, _react.default.createElement("span", {
        className: this.rightButtonIconClassName,
        "aria-hidden": "true"
      }));
    }
  }, {
    key: "renderYearSelect",
    value: function renderYearSelect() {
      var YearSelectComponent = this.yearSelectComponentClass;
      return _react.default.createElement(YearSelectComponent, _extends({
        key: 'yearSelect'
      }, this.yearSelectComponentProps));
    }
  }, {
    key: "renderMonthSelect",
    value: function renderMonthSelect() {
      var MonthSelectComponent = this.monthSelectComponentClass;
      return _react.default.createElement(MonthSelectComponent, _extends({
        key: 'monthSelect'
      }, this.monthSelectComponentProps));
    }
  }, {
    key: "renderCurrentDate",
    value: function renderCurrentDate() {
      return _react.default.createElement("span", null, this.renderMonthSelect(), ' ', this.renderYearSelect());
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.className
      }, this.renderPrevMonthButton(), this.renderCurrentDate(), this.renderNextMonthButton());
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "buttonClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'button', ['secondary']);
    }
  }, {
    key: "leftButtonIconClassName",
    get: function get() {
      return _BemUtilities.default.addVariants('cricon', this.props.buttonIconBemVariants.concat([this.props.leftButtonIcon]));
    }
  }, {
    key: "rightButtonIconClassName",
    get: function get() {
      return _BemUtilities.default.addVariants('cricon', this.props.buttonIconBemVariants.concat([this.props.rightButtonIcon]));
    }
  }, {
    key: "currentDateClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'label');
    }
  }, {
    key: "prevMonthMoment",
    get: function get() {
      return this.props.momentObject.clone().subtract(1, 'month');
    }
  }, {
    key: "nextMonthMoment",
    get: function get() {
      return this.props.momentObject.clone().add(1, 'month');
    }
  }, {
    key: "yearSelectComponentClass",
    get: function get() {
      return _YearSelect.default;
    }
  }, {
    key: "yearSelectComponentProps",
    get: function get() {
      return {
        momentObject: this.props.momentObject,
        momentRange: this.props.momentRange,
        onChange: this.props.onYearSelect,
        ariaDescribedByDomId: this.props.ariaDescribedByDomId
      };
    }
  }, {
    key: "monthSelectComponentClass",
    get: function get() {
      return _MonthSelect.default;
    }
  }, {
    key: "monthSelectComponentProps",
    get: function get() {
      return {
        momentObject: this.props.momentObject,
        momentRange: this.props.momentRange,
        onChange: this.props.onMonthSelect,
        ariaDescribedByDomId: this.props.ariaDescribedByDomId
      };
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        momentRange: null,
        bemBlock: 'paginator',
        bemVariants: [],
        buttonBemVariants: [],
        leftButtonIcon: 'chevron-left',
        rightButtonIcon: 'chevron-right',
        buttonIconBemVariants: [],
        leftButtonTitle: gettext.gettext('Previous'),
        rightButtonTitle: gettext.gettext('Next'),
        onPrevMonth: null,
        onNextMonth: null,
        onMonthSelect: null,
        onYearSelect: null,
        ariaDescribedByDomId: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any.isRequired,
        momentRange: _propTypes.default.instanceOf(_MomentRange.default).isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        buttonBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        leftButtonIcon: _propTypes.default.string.isRequired,
        rightButtonIcon: _propTypes.default.string.isRequired,
        buttonIconBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        leftButtonTitle: _propTypes.default.string.isRequired,
        rightButtonTitle: _propTypes.default.string.isRequired,
        onPrevMonth: _propTypes.default.func.isRequired,
        onNextMonth: _propTypes.default.func.isRequired,
        onMonthSelect: _propTypes.default.func.isRequired,
        onYearSelect: _propTypes.default.func.isRequired,
        ariaDescribedByDomId: _propTypes.default.string.isRequired
      };
    }
  }]);

  _inherits(DatePickerToolbar, _React$Component);

  return DatePickerToolbar;
}(_react.default.Component);

exports.default = DatePickerToolbar;