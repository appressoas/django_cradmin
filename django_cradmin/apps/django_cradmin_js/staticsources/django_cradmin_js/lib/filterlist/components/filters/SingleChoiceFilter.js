"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilter2 = _interopRequireDefault(require("./AbstractFilter"));

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

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
 * See {@link SingleChoiceFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "SingleChoiceFilter",
 *    "props": {
 *      "name": "size",
 *      "label": "Size?",
 *      "choices": [
 *        {"value": "l", "label": "Large"},
 *        {"value": "m", "label": "Medium"},
 *        {"value": "s", "label": "Small"},
 *      ]
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "SingleChoiceFilter",
 *    "initialValue": "l",
 *    "props": {
 *      "name": "size",
 *      "label": "Size?",
 *      "choices": [
 *        {"value": "l", "label": "Large"},
 *        {"value": "m", "label": "Medium"},
 *        {"value": "s", "label": "Small"},
 *      ]
 *    }
 * }
 */
var SingleChoiceFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  function SingleChoiceFilter() {
    _classCallCheck(this, SingleChoiceFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(SingleChoiceFilter).apply(this, arguments));
  }

  _createClass(SingleChoiceFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(SingleChoiceFilter.prototype), "setupBoundMethods", this).call(this);

      this.onChange = this.onChange.bind(this);
    }
    /**
     * Convert option value to option value.
     *
     * Just returns the provided value by default, but may be useful in subclasses.
     *
     * @param optionValue
     * @returns {*}
     */

  }, {
    key: "optionValueToPropValue",
    value: function optionValueToPropValue(optionValue) {
      return optionValue;
    }
    /**
     * Convert prop value to option value.
     *
     * Just returns the provided value by default, but may be useful in subclasses.
     *
     * @param propValue
     * @returns {*}
     */

  }, {
    key: "propValueToOptionValue",
    value: function propValueToOptionValue(propValue) {
      return propValue;
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
    key: "renderOption",
    value: function renderOption(choice) {
      return _react.default.createElement("option", {
        key: choice.value,
        value: choice.value
      }, choice.label);
    }
  }, {
    key: "renderOptions",
    value: function renderOptions() {
      var renderedOptions = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.choices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var choice = _step.value;
          renderedOptions.push(this.renderOption(choice));
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

      return renderedOptions;
    }
  }, {
    key: "renderSelect",
    value: function renderSelect() {
      return _react.default.createElement("select", {
        disabled: this.props.disabled,
        "aria-label": this.label,
        onChange: this.onChange,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        value: this.propValueToOptionValue(this.props.value),
        key: 'select'
      }, this.renderOptions());
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
        className: this.className
      }, this.renderLabelContent());
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
  }], [{
    key: "filterHttpRequest",
    value: function filterHttpRequest(httpRequest, name, value) {
      if (value === null) {
        return;
      }

      _get(_getPrototypeOf(SingleChoiceFilter), "filterHttpRequest", this).call(this, httpRequest, name, value);
    }
  }, {
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(SingleChoiceFilter), "propTypes", this), {
        label: _propTypes.default.string.isRequired,
        value: _propTypes.default.string,
        disabled: _propTypes.default.bool.isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string),
        choices: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
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
      return _objectSpread({}, _get(_getPrototypeOf(SingleChoiceFilter), "defaultProps", this), {
        value: null,
        label: null,
        bemBlock: 'select',
        bemVariants: ['outlined'],
        disabled: false,
        options: null
      });
    }
  }]);

  _inherits(SingleChoiceFilter, _AbstractFilter);

  return SingleChoiceFilter;
}(_AbstractFilter2.default);

exports.default = SingleChoiceFilter;