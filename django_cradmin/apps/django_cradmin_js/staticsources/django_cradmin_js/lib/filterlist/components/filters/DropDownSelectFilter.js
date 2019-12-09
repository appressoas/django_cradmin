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
 * DropDown filter where you can select different values.
 *
 * See {@link DropDownSelectFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "DropDownSelectFilter",
 *    "props": {
 *      "options": [
 *        {
 *          "label": "Show all",
 *          "value": "all"
 *        }, {
 *          "label": "Evil only",
 *          "value": "evil"
 *        }, {
 *          "label": "Gods only",
 *          "value": "gods"
 *        }
 *      ],
 *      "value": "all"
 *    }
 * }
 */
var DropDownSelectFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  function DropDownSelectFilter() {
    _classCallCheck(this, DropDownSelectFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(DropDownSelectFilter).apply(this, arguments));
  }

  _createClass(DropDownSelectFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(DropDownSelectFilter.prototype), "setupBoundMethods", this).call(this);

      this.onChange = this.onChange.bind(this);
    }
  }, {
    key: "onChange",
    value: function onChange(event) {
      this.setFilterValue(event.target.value);
    }
  }, {
    key: "renderOptions",
    value: function renderOptions() {
      var options = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var option = _step.value;
          options.push(_react.default.createElement("option", {
            value: option.value,
            key: option.value
          }, option.label));
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

      return options;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("p", {
        className: this.props.wrapperClassName
      }, this.props.label, _react.default.createElement("label", {
        className: this.className
      }, _react.default.createElement("select", {
        value: this.value,
        onChange: this.onChange,
        onFocus: this.onFocus,
        onBlur: this.onBlur
      }, this.renderOptions())));
    }
  }, {
    key: "bemBlock",
    get: function get() {
      return 'select';
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "value",
    get: function get() {
      return this.props.value === null ? '' : this.props.value;
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(DropDownSelectFilter), "propTypes", this), {
        options: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
        value: _propTypes.default.any,
        wrapperClassName: _propTypes.default.string.isRequired,
        label: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      });
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
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(DropDownSelectFilter), "defaultProps", this), {
        options: [],
        value: '',
        label: '',
        wrapperClassName: 'label',
        bemVariants: ['outlined', 'block']
      });
    }
  }]);

  _inherits(DropDownSelectFilter, _AbstractFilter);

  return DropDownSelectFilter;
}(_AbstractFilter2.default);

exports.default = DropDownSelectFilter;