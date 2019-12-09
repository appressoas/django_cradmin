"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilter2 = _interopRequireDefault(require("./AbstractFilter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
 * Checkbox filter that toggles a boolean.
 *
 * See {@link CheckboxBooleanFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "CheckboxBooleanFilter",
 *    "props": {
 *      "name": "include_disabled_users",
 *      "label": "Include disabled users?"
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "CheckboxBooleanFilter",
 *    "initialValue": true,
 *    "props": {
 *      "name": "include_disabled_users",
 *      "label": "Include disabled users?"
 *    }
 * }
 */
var CheckboxBooleanFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  function CheckboxBooleanFilter() {
    _classCallCheck(this, CheckboxBooleanFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(CheckboxBooleanFilter).apply(this, arguments));
  }

  _createClass(CheckboxBooleanFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(CheckboxBooleanFilter.prototype), "setupBoundMethods", this).call(this);

      this.onChange = this.onChange.bind(this);
    }
  }, {
    key: "onChange",
    value: function onChange() {
      this.setFilterValue(!this.props.value);
    }
  }, {
    key: "renderLabel",
    value: function renderLabel() {
      return this.props.label;
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      return _react.default.createElement("input", {
        type: "checkbox",
        checked: this.props.value,
        onChange: this.onChange,
        onFocus: this.onFocus,
        onBlur: this.onBlur
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("label", {
        className: this.labelClassName
      }, this.renderInput(), _react.default.createElement("span", {
        className: this.indicatorClassName
      }), this.renderLabel());
    }
  }, {
    key: "indicatorClassName",
    get: function get() {
      return 'checkbox__control-indicator';
    }
  }, {
    key: "labelClassName",
    get: function get() {
      return 'checkbox checkbox--block';
    }
  }], [{
    key: "getValueFromQueryString",
    value: function getValueFromQueryString(queryString, name) {
      var value = queryString.getSmart(name);

      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      }

      return null;
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractFilter.defaultProps}.
     *
     * @return {Object}
     * @property {string} label The label of the checkbox.
     *    **Can be used in spec**.
     */

  }, {
    key: "propTypes",
    get: function get() {
      var propTypes = _get(_getPrototypeOf(CheckboxBooleanFilter), "propTypes", this);

      propTypes.label = _propTypes.default.string.isRequired;
      propTypes.value = _propTypes.default.bool.isRequired;
      return propTypes;
    }
  }, {
    key: "defaultProps",
    get: function get() {
      var defaultProps = _get(_getPrototypeOf(CheckboxBooleanFilter), "defaultProps", this);

      defaultProps.value = false;
      return defaultProps;
    }
  }]);

  _inherits(CheckboxBooleanFilter, _AbstractFilter);

  return CheckboxBooleanFilter;
}(_AbstractFilter2.default);

exports.default = CheckboxBooleanFilter;