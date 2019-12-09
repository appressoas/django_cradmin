"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _react = _interopRequireDefault(require("react"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _DateCalendar = _interopRequireDefault(require("./DateCalendar"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DatePickerToolbar = _interopRequireDefault(require("./DatePickerToolbar"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

var _MomentRange = _interopRequireDefault(require("../../utilities/MomentRange"));

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

var DatePicker =
/*#__PURE__*/
function (_React$Component) {
  function DatePicker() {
    _classCallCheck(this, DatePicker);

    return _possibleConstructorReturn(this, _getPrototypeOf(DatePicker).apply(this, arguments));
  }

  _createClass(DatePicker, [{
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
    key: "renderDatePicker",
    value: function renderDatePicker() {
      var DatePickerComponent = this.datePickerComponentClass;
      return _react.default.createElement(DatePickerComponent, this.datePickerComponentProps);
    }
  }, {
    key: "renderPicker",
    value: function renderPicker() {
      return this.renderDatePicker();
    }
  }, {
    key: "renderToolbar",
    value: function renderToolbar() {
      var ToolbarComponent = this.toolbarComponentClass;
      return _react.default.createElement(ToolbarComponent, this.toolbarComponentProps);
    }
  }, {
    key: "makeShortcutButtonClassName",
    value: function makeShortcutButtonClassName() {
      var bemVariants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return _BemUtilities.default.buildBemElement('buttonbar', 'button', [bemVariants].concat(['compact']));
    }
  }, {
    key: "renderTodayButtonLabel",
    value: function renderTodayButtonLabel() {
      return gettext.gettext('Today');
    }
  }, {
    key: "renderTodayButton",
    value: function renderTodayButton() {
      if (!this.shouldRenderTodayButton) {
        return null;
      }

      return _react.default.createElement("button", {
        type: 'button',
        key: 'todayButton',
        className: this.makeShortcutButtonClassName(),
        onClick: this.onClickTodayButton.bind(this)
      }, this.renderTodayButtonLabel());
    }
  }, {
    key: "renderClearButtonLabel",
    value: function renderClearButtonLabel() {
      return gettext.pgettext('clear date field', 'Clear');
    }
  }, {
    key: "renderClearButton",
    value: function renderClearButton() {
      if (!this.shouldRenderClearButton) {
        return null;
      }

      return _react.default.createElement("button", {
        type: 'button',
        key: 'clearButton',
        className: this.makeShortcutButtonClassName(),
        onClick: this.onClickClearButton.bind(this)
      }, this.renderClearButtonLabel());
    }
  }, {
    key: "_removeNulls",
    value: function _removeNulls(itemArray) {
      var result = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = itemArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (item !== null) {
            result.push(item);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return result;
    }
  }, {
    key: "renderShortcutButtons",
    value: function renderShortcutButtons() {
      return [this.renderTodayButton(), this.renderClearButton()];
    }
  }, {
    key: "renderShortcutButtonBar",
    value: function renderShortcutButtonBar() {
      var renderedShortcutButtons = this._removeNulls(this.renderShortcutButtons());

      if (renderedShortcutButtons.length === 0) {
        return null;
      }

      return _react.default.createElement("div", {
        key: 'shortcutButtonBar',
        className: 'text-center'
      }, _react.default.createElement("div", {
        className: 'buttonbar buttonbar--inline'
      }, renderedShortcutButtons));
    }
  }, {
    key: "render",
    value: function render() {
      return [this.renderToolbar(), this.renderPicker(), this.props.includeShortcuts ? this.renderShortcutButtonBar() : null];
    }
  }, {
    key: "onPrevMonth",
    value: function onPrevMonth(e) {
      e.preventDefault();
      var momentObject = this.getMoment().clone();
      this.props.onChange(momentObject.subtract(1, 'month'));
    }
  }, {
    key: "onNextMonth",
    value: function onNextMonth(e) {
      e.preventDefault();
      var momentObject = this.getMoment().clone();
      this.props.onChange(momentObject.add(1, 'month'));
    }
  }, {
    key: "onClickTodayButton",
    value: function onClickTodayButton() {
      var today = (0, _moment.default)();
      var momentObject = this.getMoment().clone();
      momentObject.year(today.year());
      momentObject.month(today.month());
      momentObject.date(today.date());
      this.props.onChange(momentObject);
    }
  }, {
    key: "onClickClearButton",
    value: function onClickClearButton() {
      this.props.onChange(null, true, true);
    }
  }, {
    key: "onDaySelect",
    value: function onDaySelect(dayMomentObject) {
      this.props.onChange(this.props.momentRange.getClosestValid(dayMomentObject), true, false);
    }
  }, {
    key: "onMonthSelect",
    value: function onMonthSelect(monthNumber) {
      var momentObject = this.getMoment().clone().month(monthNumber);
      momentObject = this.props.momentRange.getClosestValid(momentObject);
      this.props.onChange(momentObject);
    }
  }, {
    key: "onYearSelect",
    value: function onYearSelect(year) {
      var momentObject = this.getMoment().clone().year(year);
      momentObject = this.props.momentRange.getClosestValid(momentObject);
      this.props.onChange(momentObject);
    }
  }, {
    key: "datePickerComponentClass",
    get: function get() {
      return _DateCalendar.default;
    }
  }, {
    key: "datePickerComponentProps",
    get: function get() {
      return {
        key: 'datePicker',
        momentObject: this.props.momentObject,
        initialFocusMomentObject: this.props.initialFocusMomentObject,
        onDaySelect: this.onDaySelect.bind(this),
        momentRange: this.props.momentRange,
        ariaDescribedByDomId: this.props.ariaDescribedByDomId
      };
    }
  }, {
    key: "toolbarComponentClass",
    get: function get() {
      return _DatePickerToolbar.default;
    }
  }, {
    key: "toolbarComponentProps",
    get: function get() {
      return {
        key: 'toolbar',
        onPrevMonth: this.onPrevMonth.bind(this),
        onNextMonth: this.onNextMonth.bind(this),
        onMonthSelect: this.onMonthSelect.bind(this),
        onYearSelect: this.onYearSelect.bind(this),
        momentObject: this.getMoment(),
        momentRange: this.props.momentRange,
        ariaDescribedByDomId: this.props.ariaDescribedByDomId
      };
    }
  }, {
    key: "shouldRenderTodayButton",
    get: function get() {
      return this.props.includeTodayButton;
    }
  }, {
    key: "shouldRenderClearButton",
    get: function get() {
      if (!this.props.includeClearButton) {
        return false;
      }

      return this.props.momentObject !== null;
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        initialFocusMomentObject: (0, _moment.default)(),
        onChange: null,
        includeShortcuts: true,
        includeTodayButton: true,
        includeClearButton: true,
        momentRange: _MomentRange.default.defaultForDatetimeSelect(),
        ariaDescribedByDomId: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any,
        initialFocusMomentObject: _propTypes.default.any.isRequired,
        onChange: _propTypes.default.func.isRequired,
        includeShortcuts: _propTypes.default.bool,
        momentRange: _propTypes.default.instanceOf(_MomentRange.default).isRequired,
        ariaDescribedByDomId: _propTypes.default.string.isRequired
      };
    }
  }]);

  _inherits(DatePicker, _React$Component);

  return DatePicker;
}(_react.default.Component);

exports.default = DatePicker;