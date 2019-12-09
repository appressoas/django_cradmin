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

var YearSelect =
/*#__PURE__*/
function (_React$Component) {
  function YearSelect() {
    _classCallCheck(this, YearSelect);

    return _possibleConstructorReturn(this, _getPrototypeOf(YearSelect).apply(this, arguments));
  }

  _createClass(YearSelect, [{
    key: "renderYear",
    value: function renderYear(year) {
      return _react.default.createElement("option", {
        key: year,
        value: year,
        "aria-label": year,
        "aria-describedby": this.props.ariaDescribedByDomId
      }, year);
    }
  }, {
    key: "renderYears",
    value: function renderYears() {
      var year = this.minYear;
      var renderedYears = [];

      while (year <= this.maxYear) {
        renderedYears.push(this.renderYear(year));
        year += 1;
      }

      return renderedYears;
    }
  }, {
    key: "handleSelectChange",
    value: function handleSelectChange(e) {
      var value = parseInt(e.target.value, 10);

      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: "handleInputChange",
    value: function handleInputChange(e) {
      var value = parseInt(e.target.value, 10);

      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: "shouldRenderAsSelect",
    value: function shouldRenderAsSelect() {
      return this.maxYear - this.minYear <= this.props.renderAsInputThreshold;
    }
  }, {
    key: "renderAsSelect",
    value: function renderAsSelect() {
      return _react.default.createElement("label", {
        className: this.selectClassName
      }, _react.default.createElement("select", {
        "aria-label": this.props.ariaLabel,
        value: this.selectedYear,
        onChange: this.handleSelectChange.bind(this),
        "aria-describedby": this.props.ariaDescribedByDomId
      }, this.renderYears()));
    }
  }, {
    key: "renderAsInput",
    value: function renderAsInput() {
      return _react.default.createElement("input", {
        className: this.inputClassName,
        onChange: this.handleInputChange.bind(this),
        value: this.selectedYear,
        "aria-describedby": this.props.ariaDescribedByDomId
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.shouldRenderAsSelect()) {
        return this.renderAsSelect();
      }

      return this.renderAsInput();
    }
  }, {
    key: "selectClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.selectBemBlock, this.props.selectBemVariants);
    }
  }, {
    key: "inputClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.inputBemBlock, this.props.inputBemVariants);
    }
  }, {
    key: "minYear",
    get: function get() {
      return this.props.momentRange.start.year();
    }
  }, {
    key: "maxYear",
    get: function get() {
      return this.props.momentRange.end.year();
    }
  }, {
    key: "selectedYear",
    get: function get() {
      return this.props.momentObject.year();
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        selectBemBlock: 'select',
        selectBemVariants: ['outlined', 'size-xsmall', 'width-xxsmall'],
        inputBemBlock: 'input',
        inputBemVariants: ['outlined', 'inline', 'size-xsmall', 'width-xxsmall'],
        ariaLabel: gettext.gettext('Year'),
        momentObject: null,
        momentRange: null,
        onChange: null,
        renderAsInputThreshold: 200,
        ariaDescribedByDomId: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any.isRequired,
        momentRange: _propTypes.default.instanceOf(_MomentRange.default).isRequired,
        selectBemBlock: _propTypes.default.string.isRequired,
        selectBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        ariaLabel: _propTypes.default.string.isRequired,
        onChange: _propTypes.default.func,
        ariaDescribedByDomId: _propTypes.default.string.isRequired
      };
    }
  }]);

  _inherits(YearSelect, _React$Component);

  return YearSelect;
}(_react.default.Component);

exports.default = YearSelect;