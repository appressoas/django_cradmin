"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _EmptyBooleanFilter2 = _interopRequireDefault(require("./EmptyBooleanFilter"));

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
 * Works just like {@link EmptyBooleanFilter}, but the filter is wrapped
 * in a paragraph with a label after the
 *
 * See {@link TightLabeledEmptyBooleanFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "TightLabeledEmptyBooleanFilter",
 *    "props": {
 *      "name": "include_disabled_users",
 *      "label": "Include disabled users?"
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "TightLabeledEmptyBooleanFilter",
 *    "initialValue": true,
 *    "props": {
 *      "name": "include_disabled_users",
 *      "label": "Include disabled users?"
 *    }
 * }
 *
 * @example <caption>Spec - with custom labels</caption>
 * {
 *    "component": "TightLabeledEmptyBooleanFilter",
 *    "initialValue": true,
 *    "props": {
 *      "name": "include_disabled_users",
 *      "label": "Include disabled users?",
 *      "emptyLabel": "Any",
 *      "trueLabel": "Please do",
 *      "falseLabel": "Please do not"
 *    }
 * }
 */
var TightLabeledEmptyBooleanFilter =
/*#__PURE__*/
function (_EmptyBooleanFilter) {
  function TightLabeledEmptyBooleanFilter() {
    _classCallCheck(this, TightLabeledEmptyBooleanFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(TightLabeledEmptyBooleanFilter).apply(this, arguments));
  }

  _createClass(TightLabeledEmptyBooleanFilter, [{
    key: "renderAfterSelectLabelText",
    value: function renderAfterSelectLabelText() {
      return _react.default.createElement("span", {
        key: 'labelText'
      }, this.props.label);
    } // renderLabelContent () {
    //   const content = super.renderLabelContent()
    //   content.push(this.renderAfterSelectLabelText())
    //   return content
    // }

  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("p", {
        className: this.props.wrapperClassName
      }, _get(_getPrototypeOf(TightLabeledEmptyBooleanFilter.prototype), "render", this).call(this), ' ', this.renderAfterSelectLabelText());
    }
  }, {
    key: "ariaLabel",
    get: function get() {
      if (this.props.ariaLabel === null) {
        return this.props.label;
      }

      return this.props.ariaLabel;
    }
  }], [{
    key: "propTypes",
    get: function get() {
      var propTypes = _get(_getPrototypeOf(TightLabeledEmptyBooleanFilter), "propTypes", this);

      propTypes.label = _propTypes.default.string.isRequired;
      propTypes.wrapperClassName = _propTypes.default.string;
      propTypes.ariaLabel = _propTypes.default.string;
      return propTypes;
    }
    /**
     * Get default props. Extends the default props
     * from {@link EmptyBooleanFilter.defaultProps}.
     *
     * @return {Object}
     * @property {string} label The label shown after the select element.
     *    **Can be used in spec**.
     * @property {string} ariaLabel The aria label of the select element.
     *    Defaults to ``label``.
     *    **Can be used in spec**.
     * @property {bool} value Must be true, false or null.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      var defaultProps = _get(_getPrototypeOf(TightLabeledEmptyBooleanFilter), "defaultProps", this);

      defaultProps.ariaLabel = null;
      defaultProps.label = null;
      defaultProps.className = 'select select--outlined select--size-xsmall select--width-xxsmall';
      defaultProps.wrapperClassName = 'paragraph paragraph--xtight';
      return defaultProps;
    }
  }]);

  _inherits(TightLabeledEmptyBooleanFilter, _EmptyBooleanFilter);

  return TightLabeledEmptyBooleanFilter;
}(_EmptyBooleanFilter2.default);

exports.default = TightLabeledEmptyBooleanFilter;