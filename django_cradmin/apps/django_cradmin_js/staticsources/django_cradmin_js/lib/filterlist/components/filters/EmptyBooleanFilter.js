"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilter2 = _interopRequireDefault(require("./AbstractFilter"));

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

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Empty or boolean filter - users can select between "empty" or "true" or "false".
 *
 * See {@link EmptyBooleanFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "EmptyBooleanFilter",
 *    "props": {
 *      "name": "include_disabled_users",
 *      "label": "Include disabled users?"
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "EmptyBooleanFilter",
 *    "initialValue": true,
 *    "props": {
 *      "name": "include_disabled_users",
 *      "ariaLabel": "Include disabled users?"
 *    }
 * }
 *
 * @example <caption>Spec - with custom labels</caption>
 * {
 *    "component": "EmptyBooleanFilter",
 *    "initialValue": true,
 *    "props": {
 *      "name": "include_disabled_users",
 *      "ariaLabel": "Include disabled users?",
 *      "emptyLabel": "Any",
 *      "trueLabel": "Please do",
 *      "falseLabel": "Please do not"
 *    }
 * }
 */
var EmptyBooleanFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  function EmptyBooleanFilter() {
    _classCallCheck(this, EmptyBooleanFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmptyBooleanFilter).apply(this, arguments));
  }

  _createClass(EmptyBooleanFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(EmptyBooleanFilter.prototype), "setupBoundMethods", this).call(this);

      this.onChange = this.onChange.bind(this);
    }
  }, {
    key: "optionValueToPropValue",
    value: function optionValueToPropValue(optionValue) {
      switch (optionValue) {
        case 'empty':
          return null;

        case 'true':
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "propValueToOptionValue",
    value: function propValueToOptionValue(value) {
      if (value === null) {
        return 'null';
      } else if (value) {
        return true;
      }

      return false;
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      if (this.props.disabled) {
        return;
      }

      this.setFilterValue(this.optionValueToPropValue(e.target.value));
    }
  }, {
    key: "renderSelect",
    value: function renderSelect() {
      return _react.default.createElement("select", {
        disabled: this.props.disabled,
        "aria-label": this.ariaLabel,
        onChange: this.onChange,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        value: this.propValueToOptionValue(this.props.value),
        key: 'select'
      }, _react.default.createElement("option", {
        value: 'empty'
      }, this.props.emptyLabel), _react.default.createElement("option", {
        value: 'true'
      }, this.props.trueLabel), _react.default.createElement("option", {
        value: 'false'
      }, this.props.falseLabel));
    }
  }, {
    key: "renderLabelContent",
    value: function renderLabelContent() {
      return [this.renderSelect()];
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("label", {
        className: this.props.className
      }, this.renderLabelContent());
    }
  }, {
    key: "ariaLabel",
    get: function get() {
      return this.props.ariaLabel;
    }
  }], [{
    key: "filterHttpRequest",
    value: function filterHttpRequest(httpRequest, name, value) {
      if (value === null) {
        return;
      }

      _get(_getPrototypeOf(EmptyBooleanFilter), "filterHttpRequest", this).call(this, httpRequest, name, value);
    }
  }, {
    key: "setInQueryString",
    value: function setInQueryString(queryString, name, value) {
      if (value === null) {
        queryString.remove(name);
      } else {
        queryString.setSmart(name, value);
      }
    }
  }, {
    key: "getValueFromQueryString",
    value: function getValueFromQueryString(queryString, name) {
      var value = queryString.get(name, null);

      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      }

      return null;
    }
  }, {
    key: "propTypes",
    get: function get() {
      var propTypes = _get(_getPrototypeOf(EmptyBooleanFilter), "propTypes", this);

      propTypes.ariaLabel = _propTypes.default.string.isRequired;
      propTypes.emptyLabel = _propTypes.default.string.isRequired;
      propTypes.trueLabel = _propTypes.default.string.isRequired;
      propTypes.falseLabel = _propTypes.default.string.isRequired;
      propTypes.value = _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.string]);
      propTypes.disabled = _propTypes.default.bool;
      return propTypes;
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractFilter.defaultProps}.
     *
     * @return {Object}
     * @property {string} ariaLabel The aria label of the select element.
     *    **Can be used in spec**.
     * @property {bool} value Must be true, false or null.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      var defaultProps = _get(_getPrototypeOf(EmptyBooleanFilter), "defaultProps", this);

      defaultProps.value = null;
      defaultProps.ariaLabel = null;
      defaultProps.className = 'select select--outlined';
      defaultProps.emptyLabel = '---';
      defaultProps.trueLabel = gettext.gettext('Yes');
      defaultProps.falseLabel = gettext.gettext('No');
      defaultProps.disabled = false;
      return defaultProps;
    }
  }]);

  _inherits(EmptyBooleanFilter, _AbstractFilter);

  return EmptyBooleanFilter;
}(_AbstractFilter2.default);

exports.default = EmptyBooleanFilter;