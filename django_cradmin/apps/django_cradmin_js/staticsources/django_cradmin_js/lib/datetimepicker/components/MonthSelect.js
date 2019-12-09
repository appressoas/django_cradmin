"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

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

var MonthSelect =
/*#__PURE__*/
function (_React$Component) {
  function MonthSelect() {
    _classCallCheck(this, MonthSelect);

    return _possibleConstructorReturn(this, _getPrototypeOf(MonthSelect).apply(this, arguments));
  }

  _createClass(MonthSelect, [{
    key: "isValidMonth",
    value: function isValidMonth(monthMomentObject) {
      return this.props.momentRange.contains(monthMomentObject);
    }
  }, {
    key: "renderMonthAriaLabel",
    value: function renderMonthAriaLabel(monthMomentObject) {
      return monthMomentObject.format('MMMM YYYY');
    }
  }, {
    key: "renderMonthLabel",
    value: function renderMonthLabel(monthMomentObject) {
      return monthMomentObject.format('MMM');
    }
  }, {
    key: "renderMonth",
    value: function renderMonth(monthMomentObject) {
      return _react.default.createElement("option", {
        key: monthMomentObject.format(),
        value: monthMomentObject.month(),
        disabled: !this.isValidMonth(monthMomentObject),
        "aria-label": this.renderMonthAriaLabel(monthMomentObject)
      }, this.renderMonthLabel(monthMomentObject));
    }
  }, {
    key: "makeMomentForMonthNumber",
    value: function makeMomentForMonthNumber(monthNumber) {
      return this.props.momentObject.clone().month(monthNumber);
    }
  }, {
    key: "renderMonths",
    value: function renderMonths() {
      var renderedMonths = [];
      var monthNumber = 0;

      while (monthNumber < 12) {
        var monthMomentObject = this.makeMomentForMonthNumber(monthNumber);
        renderedMonths.push(this.renderMonth(monthMomentObject));
        monthNumber++;
      }

      return renderedMonths;
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var value = parseInt(e.target.value, 10);

      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("label", {
        className: this.className
      }, _react.default.createElement("select", {
        "aria-label": this.props.ariaLabel,
        value: this.selectedMonth,
        onChange: this.handleChange.bind(this),
        "aria-describedby": this.props.ariaDescribedByDomId
      }, this.renderMonths()));
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "selectedMonth",
    get: function get() {
      return this.props.momentObject.month();
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        bemBlock: 'select',
        bemVariants: ['outlined', 'size-xsmall', 'width-xxsmall'],
        ariaLabel: gettext.gettext('Month'),
        momentObject: null,
        momentRange: null,
        onChange: null,
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
        ariaLabel: _propTypes.default.string.isRequired,
        onChange: _propTypes.default.func,
        ariaDescribedByDomId: _propTypes.default.string.isRequired
      };
    }
  }]);

  _inherits(MonthSelect, _React$Component);

  return MonthSelect;
}(_react.default.Component);

exports.default = MonthSelect;