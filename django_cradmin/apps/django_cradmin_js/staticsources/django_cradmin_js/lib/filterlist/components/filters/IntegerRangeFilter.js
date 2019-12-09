"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _AbstractFilter2 = _interopRequireDefault(require("./AbstractFilter"));

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Single choice filter.
 *
 * See {@link IntegerRangeFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": IntegerRangeFilter,
 *    "props": {
 *       "name": "range",
 *       "label": "Range"
 * }
 *
 * @example <caption>Spec - with custom labels etc</caption>
 * {
 *    "component": IntegerRangeFilter,
 *    "props": {
 *       "fromPlaceholderText": "from",
 *       "toPlaceholderText": "to",
 *       "fromAriaLabel": "from",
 *       "toAriaLabel": "from",
 *       "name": "range",
 *       "label": "Range"
 * }
 */

/**
 * Integer range filter.
 *
 * See {@link IntegerRangeFilter.defaultProps} for documentation for props and
 * their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 */
var IntegerRangeFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  function IntegerRangeFilter() {
    _classCallCheck(this, IntegerRangeFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(IntegerRangeFilter).apply(this, arguments));
  }

  _createClass(IntegerRangeFilter, [{
    key: "getInitialState",
    value: function getInitialState() {
      return {
        fromValue: '',
        toValue: ''
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(_getPrototypeOf(IntegerRangeFilter.prototype), "componentDidMount", this).call(this);

      if (this.props.value) {
        this.setState(this.props.value);
      }
    }
  }, {
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(IntegerRangeFilter.prototype), "setupBoundMethods", this).call(this);

      this.onChangeFrom = this.onChangeFrom.bind(this);
      this.onChangeTo = this.onChangeTo.bind(this);
    }
  }, {
    key: "parseValue",
    value: function parseValue(value) {
      // We need to return empty string since the input value is bound to the react state values.
      // Input value can not be null.
      if (value === null || value === '') {
        return '';
      } else {
        var parsedValue = Number.parseInt(value, 10);

        if (!Number.isInteger(parsedValue)) {
          return '';
        }

        return parsedValue;
      }
    }
  }, {
    key: "onChangeFrom",
    value: function onChangeFrom(e) {
      var _this = this;

      if (this.props.disabled) {
        return;
      }

      this.setState({
        fromValue: this.parseValue(e.target.value)
      }, function () {
        _this.setFilterValue(_this.state);
      });
    }
  }, {
    key: "onChangeTo",
    value: function onChangeTo(e) {
      var _this2 = this;

      if (this.props.disabled) {
        return;
      }

      this.setState({
        toValue: this.parseValue(e.target.value)
      }, function () {
        _this2.setFilterValue(_this2.state);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "fieldwrapper"
      }, _react.default.createElement("label", {
        id: this.labelDomId,
        htmlFor: this.fromInputDomId,
        className: 'label',
        "aria-hidden": true
      }, this.label), _react.default.createElement("input", {
        id: this.fromInputDomId,
        "aria-label": this.fromAriaLabel,
        type: "number",
        placeholder: this.fromPlaceholderText,
        className: this.inputClassName,
        value: this.state.fromValue,
        onChange: this.onChangeFrom,
        key: 'from'
      }), ' ', _react.default.createElement("input", {
        "aria-label": this.toAriaLabel,
        type: "number",
        placeholder: this.toPlaceholderText,
        className: this.inputClassName,
        value: this.state.toValue,
        onChange: this.onChangeTo,
        key: 'to'
      }));
    }
  }, {
    key: "label",
    get: function get() {
      return this.props.label;
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.buildBemBlock(this.props.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "inputClassName",
    get: function get() {
      return 'input input--inline input--width-xxsmall input--size-xsmall input--outlined';
    }
  }, {
    key: "labelDomId",
    get: function get() {
      return "".concat(this.props.domIdPrefix, "_input");
    }
  }, {
    key: "fromInputDomId",
    get: function get() {
      return "".concat(this.props.domIdPrefix, "_from_input");
    }
  }, {
    key: "fromAriaLabel",
    get: function get() {
      if (this.props.fromAriaLabel) {
        return this.props.fromAriaLabel;
      }

      return "".concat(this.props.label, " (").concat(gettext.pgettext('integer range filter', 'from'), ")");
    }
  }, {
    key: "toAriaLabel",
    get: function get() {
      if (this.props.toAriaLabel) {
        return this.props.toAriaLabel;
      }

      return "".concat(this.props.label, " (").concat(gettext.pgettext('integer range filter', 'to'), ")");
    }
  }, {
    key: "fromPlaceholderText",
    get: function get() {
      if (this.props.fromPlaceholderText) {
        return this.props.fromPlaceholderText;
      }

      return gettext.pgettext('integer range filter placeholder from', 'from');
    }
  }, {
    key: "toPlaceholderText",
    get: function get() {
      if (this.props.toPlaceholderText) {
        return this.props.toPlaceholderText;
      }

      return gettext.pgettext('integer range filter placeholder to', 'to');
    }
  }], [{
    key: "filterHttpRequest",
    value: function filterHttpRequest(httpRequest, name, value) {
      if (value === null) {
        return null;
      }

      if (value.fromValue === '' && value.toValue === '') {
        return;
      }

      httpRequest.urlParser.queryString.set("".concat(name, "_from"), value.fromValue);
      httpRequest.urlParser.queryString.set("".concat(name, "_to"), value.toValue);
    }
  }, {
    key: "setInQueryString",
    value: function setInQueryString(queryString, name, value) {
      if (value === null) {
        queryString.remove(name);
      } else {
        queryString.setSmart(name, [value.fromValue, value.toValue].toString());
      }
    }
  }, {
    key: "getValueFromQueryString",
    value: function getValueFromQueryString(queryString, name) {
      var value = queryString.getSmart(name, null);

      if (value) {
        var resultValue = {};
        value = value.split(',');
        resultValue.fromValue = value[0];
        resultValue.toValue = value[1];
        return resultValue;
      }
    }
  }, {
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(IntegerRangeFilter), "propTypes", this), {
        label: _propTypes.default.string.isRequired,
        value: _propTypes.default.object,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string)
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractFilter.defaultProps}.
     *
     * @return {Object}
     * @property {string} label The aria label of the select element.
     *    **Can be used in spec**.
     * @property {bool} disabled Is the filter disabled? Defaults to ``false``.
     * @property {[]} choices The choices for the filter as an array of objects,
     *    where each object must have ``value`` and ``label`` keys.
     * @property {string} value The value as a string.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(IntegerRangeFilter), "defaultProps", this), {
        value: null,
        label: null,
        bemBlock: 'input',
        bemVariants: ['outlined']
      });
    }
  }]);

  _inherits(IntegerRangeFilter, _AbstractFilter);

  return IntegerRangeFilter;
}(_AbstractFilter2.default);

exports.default = IntegerRangeFilter;