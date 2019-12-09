"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _DatePicker = _interopRequireDefault(require("./DatePicker"));

var _TimePicker = _interopRequireDefault(require("./TimePicker"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _moment = _interopRequireDefault(require("moment/moment"));

var _MomentRange = _interopRequireDefault(require("../../utilities/MomentRange"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DateTimePicker =
/*#__PURE__*/
function (_React$Component) {
  _createClass(DateTimePicker, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        initialFocusMomentObject: (0, _moment.default)(),
        showSeconds: false,
        includeShortcuts: true,
        dateIconClassName: 'cricon cricon--calendar-grid',
        timeIconClassName: 'cricon cricon--clock',
        dateButtonLabel: gettext.gettext('Date'),
        timeButtonLabel: gettext.gettext('Time'),
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
        showSeconds: _propTypes.default.bool.isRequired,
        includeShortcuts: _propTypes.default.bool.isRequired,
        dateIconClassName: _propTypes.default.string.isRequired,
        timeIconClassName: _propTypes.default.string.isRequired,
        dateButtonLabel: _propTypes.default.string.isRequired,
        timeButtonLabel: _propTypes.default.string.isRequired,
        momentRange: _propTypes.default.instanceOf(_MomentRange.default).isRequired,
        ariaDescribedByDomId: _propTypes.default.string.isRequired
      };
    }
  }]);

  function DateTimePicker(props) {
    var _this;

    _classCallCheck(this, DateTimePicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateTimePicker).call(this, props));
    _this.state = {
      tabName: 'date'
    };
    return _this;
  }

  _createClass(DateTimePicker, [{
    key: "makeTabButtonClassName",
    value: function makeTabButtonClassName(tabName) {
      var bemVariants = [];

      if (tabName === this.state.tabName) {
        bemVariants.push('secondary-fill');
      } else {
        bemVariants.push('secondary');
      }

      return _BemUtilities.default.buildBemElement('buttonbar', 'button', bemVariants);
    }
  }, {
    key: "renderDatePicker",
    value: function renderDatePicker() {
      return _react.default.createElement(_DatePicker.default, {
        key: 'datePicker',
        momentObject: this.props.momentObject,
        initialFocusMomentObject: this.props.initialFocusMomentObject,
        includeShortcuts: this.props.includeShortcuts,
        onChange: this.props.onChange,
        momentRange: this.props.momentRange,
        ariaDescribedByDomId: this.props.ariaDescribedByDomId
      });
    }
  }, {
    key: "renderTimePicker",
    value: function renderTimePicker() {
      return _react.default.createElement(_TimePicker.default, {
        key: 'timePicker',
        momentObject: this.props.momentObject,
        initialFocusMomentObject: this.props.initialFocusMomentObject,
        showSeconds: this.props.showSeconds,
        includeShortcuts: this.props.includeShortcuts,
        onChange: this.props.onChange,
        momentRange: this.props.momentRange,
        ariaDescribedByDomId: this.props.ariaDescribedByDomId
      });
    }
  }, {
    key: "renderPicker",
    value: function renderPicker() {
      if (this.state.tabName === 'date') {
        return this.renderDatePicker();
      } else {
        return this.renderTimePicker();
      }
    }
  }, {
    key: "renderTabButton",
    value: function renderTabButton(tabName, label, iconClassName) {
      return _react.default.createElement("button", {
        className: this.makeTabButtonClassName(tabName),
        onClick: this.handleClickTab.bind(this, tabName)
      }, _react.default.createElement("span", {
        className: iconClassName,
        "aria-hidden": "true"
      }), ' ', label);
    }
  }, {
    key: "renderTabs",
    value: function renderTabs() {
      return _react.default.createElement("div", {
        key: 'tabs',
        className: this.tabsClassName
      }, this.renderTabButton('date', this.props.dateButtonLabel, this.props.dateIconClassName), this.renderTabButton('time', this.props.timeButtonLabel, this.props.timeIconClassName));
    }
  }, {
    key: "render",
    value: function render() {
      return [this.renderTabs(), this.renderPicker()];
    }
  }, {
    key: "handleClickTab",
    value: function handleClickTab(tabName, e) {
      e.preventDefault();
      this.setState({
        tabName: tabName
      });
    }
  }, {
    key: "tabsClassName",
    get: function get() {
      return _BemUtilities.default.addVariants('buttonbar', ['stretch', 'tinymargin']);
    }
  }]);

  _inherits(DateTimePicker, _React$Component);

  return DateTimePicker;
}(_react.default.Component);

exports.default = DateTimePicker;