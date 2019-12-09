"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropDownDateFilter = exports.AbstractDateFilter = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilter2 = _interopRequireDefault(require("./AbstractFilter"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _DropdownDateSelect = _interopRequireDefault(require("../../../datetimepicker/components/DropdownDateSelect"));

var _moment = _interopRequireDefault(require("moment"));

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
 * Base class for date filters.
 */
var AbstractDateFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  function AbstractDateFilter() {
    _classCallCheck(this, AbstractDateFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractDateFilter).apply(this, arguments));
  }

  _createClass(AbstractDateFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(AbstractDateFilter.prototype), "setupBoundMethods", this).call(this);

      this.onChange = this.onChange.bind(this);
    }
  }, {
    key: "onChange",
    value: function onChange(momentObject) {
      var value = null;

      if (momentObject !== null) {
        value = momentObject.format(this.props.dateFormat);
      }

      this.setFilterValue(value);
    }
  }, {
    key: "renderDateSelect",
    value: function renderDateSelect() {
      var Component = this.dateSelectComponentClass;
      return _react.default.createElement(Component, this.dateSelectComponentProps);
    }
  }, {
    key: "renderLabelContent",
    value: function renderLabelContent() {
      return this.props.label;
    }
  }, {
    key: "renderLabel",
    value: function renderLabel() {
      return _react.default.createElement("label", {
        className: 'label'
      }, this.renderLabelContent());
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.props.wrapperClassName
      }, this.renderLabel(), this.renderDateSelect());
    }
  }, {
    key: "momentValue",
    get: function get() {
      if (this.props.value) {
        return (0, _moment.default)(this.props.value, this.props.dateFormat);
      }

      return null;
    }
  }, {
    key: "dateSelectComponentClass",
    get: function get() {
      throw new Error('dateSelectComponentClass getter must be overridden in subclasses');
    }
  }, {
    key: "dateSelectComponentProps",
    get: function get() {
      return {
        momentObject: this.momentValue,
        onChange: this.onChange,
        pickerProps: this.props.pickerProps
      };
    }
  }], [{
    key: "filterHttpRequest",
    value: function filterHttpRequest(httpRequest, name, value) {
      if (value === null || value === '') {
        return;
      }

      _get(_getPrototypeOf(AbstractDateFilter), "filterHttpRequest", this).call(this, httpRequest, name, value);
    }
  }, {
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractDateFilter), "propTypes", this), {
        dateFormat: _propTypes.default.string.isRequired,
        label: _propTypes.default.string.isRequired,
        wrapperClassName: _propTypes.default.string.isRequired,
        pickerProps: _propTypes.default.object.isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractFilter.defaultProps}.
     *
     * @return {Object}
     * @property {string} dateFormat A momentjs date format. Used to convert the value from and to momentjs object.
     *    Defaults to "YYYY-MM-DD" (iso format).
     * @property {string} label Label for the field.
     * @property {string} wrapperClassName CSS class name for the wrapper element.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractDateFilter), "defaultProps", this), {
        dateFormat: 'YYYY-MM-DD',
        label: null,
        wrapperClassName: 'fieldwrapper',
        pickerProps: {}
      });
    }
  }]);

  _inherits(AbstractDateFilter, _AbstractFilter);

  return AbstractDateFilter;
}(_AbstractFilter2.default);
/**
 * Date filter.
 *
 * See {@link DropDownDateFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "DropDownDateFilter",
 *    "props": {
 *      "name": "from_date",
 *      "label": "From date"
 *    }
 * }
 */


exports.AbstractDateFilter = AbstractDateFilter;

var DropDownDateFilter =
/*#__PURE__*/
function (_AbstractDateFilter) {
  function DropDownDateFilter() {
    _classCallCheck(this, DropDownDateFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(DropDownDateFilter).apply(this, arguments));
  }

  _createClass(DropDownDateFilter, [{
    key: "dateSelectComponentClass",
    get: function get() {
      return _DropdownDateSelect.default;
    }
  }, {
    key: "dateSelectComponentProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(DropDownDateFilter.prototype), "dateSelectComponentProps", this), {
        title: this.props.label,
        openPickerProps: this.props.openPickerProps
      });
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(DropDownDateFilter), "propTypes", this), {
        openPickerProps: _propTypes.default.object.isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractDateFilter.defaultProps}.
     *
     * @return {Object}
     * @property {bool} value Must be true, false or null.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(DropDownDateFilter), "defaultProps", this), {
        openPickerProps: {}
      });
    }
  }]);

  _inherits(DropDownDateFilter, _AbstractDateFilter);

  return DropDownDateFilter;
}(AbstractDateFilter);

exports.DropDownDateFilter = DropDownDateFilter;