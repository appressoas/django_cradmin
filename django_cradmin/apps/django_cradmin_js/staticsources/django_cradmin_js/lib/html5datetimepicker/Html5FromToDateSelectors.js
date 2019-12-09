"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Html5DateInput = _interopRequireDefault(require("./Html5DateInput"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Html5FromToDateSelectors =
/*#__PURE__*/
function (_React$Component) {
  _createClass(Html5FromToDateSelectors, null, [{
    key: "propTypes",
    get: function get() {
      return {
        fromDateValue: _propTypes.default.string.isRequired,
        toDateValue: _propTypes.default.string.isRequired,
        commonDateOptions: _propTypes.default.shape({}).isRequired,
        onChange: _propTypes.default.func.isRequired,
        isExpandedInitially: _propTypes.default.bool.isRequired,
        displayExpandToggle: _propTypes.default.bool.isRequired,
        label: _propTypes.default.string.isRequired,
        expandedLabel: _propTypes.default.string,
        expandToggleLabel: _propTypes.default.string.isRequired,
        toDateExpandedLabel: _propTypes.default.string.isRequired,
        fromDateExpandedLabel: _propTypes.default.string.isRequired
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        fromDateValue: '',
        toDateValue: '',
        label: null,
        expandedLabel: null,
        commonDateOptions: {},
        isExpandedInitially: false,
        displayExpandToggle: true,
        expandToggleLabel: gettext.pgettext('cradmin html5 from to date selector', 'Display to-date?'),
        toDateExpandedLabel: gettext.pgettext('cradmin html5 from to date selector', 'To date'),
        fromDateExpandedLabel: gettext.pgettext('cradmin html5 from to date selector', 'From date')
      };
    }
  }]);

  function Html5FromToDateSelectors(props) {
    var _this;

    _classCallCheck(this, Html5FromToDateSelectors);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Html5FromToDateSelectors).call(this, props));
    _this.state = _this.getInitialState();

    _this.setupBoundFunctions();

    return _this;
  }
  /* initialization functions */


  _createClass(Html5FromToDateSelectors, [{
    key: "getInitiallyExpanded",
    value: function getInitiallyExpanded() {
      if (this.props.isExpandedInitially) {
        return true;
      } else if (this.props.fromDateValue !== this.props.toDateValue) {
        return true;
      }

      return false;
    }
  }, {
    key: "getInitialState",
    value: function getInitialState() {
      return {
        isExpanded: this.getInitiallyExpanded(),
        invalidRangeAttempted: false
      };
    }
  }, {
    key: "setupBoundFunctions",
    value: function setupBoundFunctions() {
      this.handleDateChange = this.handleDateChange.bind(this);
      this.handleShowToDateChange = this.handleShowToDateChange.bind(this);
      this.reset = this.reset.bind(this);
    }
  }, {
    key: "handleDateChange",
    value: function handleDateChange(valueKey, value) {
      var fromDate = valueKey === 'fromDate' ? value : this.props.fromDateValue;
      var toDate = valueKey === 'toDate' ? value : this.props.toDateValue;

      if (fromDate && toDate && this.state.isExpanded) {
        var momentFromDate = (0, _moment.default)(fromDate);
        var momentToDate = (0, _moment.default)(toDate);

        if (momentFromDate > momentToDate) {
          this.setState({
            invalidRangeAttempted: true
          });
          return;
        }
      }

      if (this.state.invalidRangeAttempted) {
        this.setState({
          invalidRangeAttempted: false
        });
      }

      if (this.state.isExpanded) {
        this.props.onChange(fromDate, toDate);
      } else {
        this.props.onChange(fromDate, fromDate);
      }
    }
  }, {
    key: "handleShowToDateChange",
    value: function handleShowToDateChange(event) {
      var _this2 = this;

      this.setState({
        isExpanded: event.target.checked
      }, function () {
        var fromDate = _this2.props.fromDateValue || '';

        _this2.props.onChange(fromDate, fromDate, true);
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.props.onChange('', '', true);
    }
  }, {
    key: "renderFromDateField",

    /* Render functions */
    value: function renderFromDateField() {
      return _react.default.createElement(_Html5DateInput.default, this.fromDateOptions);
    }
  }, {
    key: "renderToDateField",
    value: function renderToDateField() {
      return _react.default.createElement(_Html5DateInput.default, this.toDateOptions);
    }
  }, {
    key: "renderShowToFieldCheckbox",
    value: function renderShowToFieldCheckbox() {
      if (!this.props.displayExpandToggle) {
        return null;
      }

      return _react.default.createElement("label", {
        className: "checkbox  checkbox--block"
      }, _react.default.createElement("input", {
        type: "checkbox",
        checked: this.state.isExpanded,
        onChange: this.handleShowToDateChange
      }), _react.default.createElement("span", {
        className: "checkbox__control-indicator"
      }), this.expandToggleLabel);
    }
  }, {
    key: "renderInvalidRangeError",
    value: function renderInvalidRangeError() {
      if (!this.state.invalidRangeAttempted) {
        return null;
      }

      return _react.default.createElement("p", {
        className: 'message message--error'
      }, this.invalidRangeErrorMsg);
    }
  }, {
    key: "renderIfExpandedLabel",
    value: function renderIfExpandedLabel(labelText) {
      if (!this.state.isExpanded) {
        return null;
      }

      return _react.default.createElement("label", {
        className: 'label label--small label--muted',
        "aria-hidden": true
      }, labelText);
    }
  }, {
    key: "renderLabel",
    value: function renderLabel() {
      return _react.default.createElement("label", {
        className: 'label'
      }, this.label);
    }
  }, {
    key: "renderToDateLayout",
    value: function renderToDateLayout() {
      if (!this.state.isExpanded) {
        return null;
      }

      return _react.default.createElement("div", {
        className: 'fieldwrapper-line__item fieldwrapper-line__item--width-small'
      }, _react.default.createElement("div", {
        className: 'fieldwrapper fieldwrapper--compact'
      }, this.renderIfExpandedLabel(this.toDateExpandedLabel), this.renderToDateField()));
    }
  }, {
    key: "renderDateFields",
    value: function renderDateFields() {
      return _react.default.createElement("div", {
        className: 'fieldwrapper-line'
      }, _react.default.createElement("div", {
        className: 'fieldwrapper-line__item fieldwrapper-line__item--width-small'
      }, _react.default.createElement("div", {
        className: 'fieldwrapper fieldwrapper--compact'
      }, this.renderIfExpandedLabel(this.fromDateExpandedLabel), this.renderFromDateField())), this.renderToDateLayout());
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "fieldwrapper"
      }, this.renderLabel(), this.renderDateFields(), this.renderShowToFieldCheckbox(), this.renderInvalidRangeError());
    }
  }, {
    key: "commonDateOptions",
    get: function get() {
      return _objectSpread({}, this.props.commonDateOptions);
    }
  }, {
    key: "fromDateMin",
    get: function get() {
      return null;
    }
  }, {
    key: "fromDateMax",
    get: function get() {
      if (!this.state.isExpanded) {
        return null;
      }

      return this.props.toDateValue;
    }
  }, {
    key: "fromDateOptions",
    get: function get() {
      var _this3 = this;

      return _objectSpread({}, this.commonDateOptions, {
        value: this.props.fromDateValue,
        min: this.fromDateMin,
        max: this.fromDateMax,
        onChange: function onChange(value) {
          _this3.handleDateChange('fromDate', value);
        },
        ariaLabel: this.ariaFromLabel
      });
    }
  }, {
    key: "toDateMin",
    get: function get() {
      if (!this.state.isExpanded) {
        return null;
      }

      return this.props.fromDateValue;
    }
  }, {
    key: "toDateMax",
    get: function get() {
      return null;
    }
  }, {
    key: "toDateOptions",
    get: function get() {
      var _this4 = this;

      return _objectSpread({}, this.commonDateOptions, {
        value: this.props.toDateValue,
        min: this.toDateMin,
        max: this.toDateMax,
        onChange: function onChange(value) {
          _this4.handleDateChange('toDate', value);
        },
        ariaLabel: this.ariaToLabel
      });
    }
  }, {
    key: "collapsedLabel",
    get: function get() {
      return this.props.label;
    }
  }, {
    key: "expandedLabel",
    get: function get() {
      if (this.props.expandedLabel) {
        return this.props.expandedLabel;
      }

      return this.collapsedLabel;
    }
  }, {
    key: "label",
    get: function get() {
      if (this.state.isExpanded) {
        return this.expandedLabel;
      }

      return this.collapsedLabel;
    }
  }, {
    key: "toDateExpandedLabel",
    get: function get() {
      return this.props.toDateExpandedLabel;
    }
  }, {
    key: "fromDateExpandedLabel",
    get: function get() {
      return this.props.fromDateExpandedLabel;
    }
  }, {
    key: "expandToggleLabel",
    get: function get() {
      return this.props.expandToggleLabel;
    }
  }, {
    key: "invalidRangeErrorMsg",
    get: function get() {
      return gettext.pgettext('cradmin html5 from to date selector', 'To date cannot be before from date');
    }
  }, {
    key: "ariaToLabel",
    get: function get() {
      return "".concat(this.expandedLabel, ": ").concat(this.toDateExpandedLabel);
    }
  }, {
    key: "ariaFromLabel",
    get: function get() {
      if (this.state.isExpanded) {
        return "".concat(this.expandedLabel, ": ").concat(this.fromDateExpandedLabel);
      }

      return this.collapsedLabel;
    }
  }]);

  _inherits(Html5FromToDateSelectors, _React$Component);

  return Html5FromToDateSelectors;
}(_react.default.Component);

exports.default = Html5FromToDateSelectors;