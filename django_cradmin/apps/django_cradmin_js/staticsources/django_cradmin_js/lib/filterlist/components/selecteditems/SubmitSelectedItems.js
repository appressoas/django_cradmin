"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractSelectedItems = _interopRequireDefault(require("./AbstractSelectedItems"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

var _HiddenFieldRenderSelectedItems = _interopRequireDefault(require("./HiddenFieldRenderSelectedItems"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
 * Render a button for submitting selected items in a form
 * (a `<button type="submit">`).
 *
 * See {@link SubmitSelectedItems.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "SubmitSelectedItems",
 *    "props": {
 *       "formAction": "https://example.com/my/submit/view"
 *    }
 * }
 *
 * @example <caption>Spec - custom label</caption>
 * {
 *    "component": "SubmitSelectedItems",
 *    "props": {
 *       "formAction": "https://example.com/my/submit/view",
 *       "label": "Submit the selected items!"
 *    }
 * }
 *
 * @example <caption>Spec - custom min and max selected items</caption>
 * {
 *    "component": "SubmitSelectedItems",
 *    "props": {
 *       "formAction": "https://example.com/my/submit/view",
 *       "minSelectedItems": 2,
 *       "maxSelectedItems": 2
 *    }
 * }
 */
var SubmitSelectedItems =
/*#__PURE__*/
function (_AbstractSelectedItem) {
  function SubmitSelectedItems() {
    _classCallCheck(this, SubmitSelectedItems);

    return _possibleConstructorReturn(this, _getPrototypeOf(SubmitSelectedItems).apply(this, arguments));
  }

  _createClass(SubmitSelectedItems, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(SubmitSelectedItems.prototype), "setupBoundMethods", this).call(this);

      this.onClick = this.onClick.bind(this);
    }
  }, {
    key: "onClick",
    value: function onClick(listItemId) {
      this.props.childExposedApi.deselectItem(listItemId);
    }
  }, {
    key: "renderLabel",
    value: function renderLabel() {
      return this.props.label;
    }
  }, {
    key: "renderButton",
    value: function renderButton() {
      return _react.default.createElement("button", {
        type: "submit",
        key: "button",
        className: this.buttonClassName
      }, this.renderLabel());
    }
  }, {
    key: "renderHiddenFields",
    value: function renderHiddenFields() {
      var uniqueComponentKey = "".concat(this.props.uniqueComponentKey, "-HiddenFieldRenderSelectedItems");
      var domIdPrefix = "".concat(this.props.domIdPrefix, "-HiddenFieldRenderSelectedItems");
      return _react.default.createElement(_HiddenFieldRenderSelectedItems.default, {
        key: "hiddenFields",
        name: this.props.hiddenFieldName,
        debug: this.props.debug,
        selectedListItemsMap: this.props.selectedListItemsMap,
        childExposedApi: this.props.childExposedApi,
        uniqueComponentKey: uniqueComponentKey,
        domIdPrefix: domIdPrefix,
        location: this.props.location
      });
    }
  }, {
    key: "renderExtraHiddenField",
    value: function renderExtraHiddenField(fieldName, fieldValue) {
      var key = "extraHiddenField-".concat(fieldName);
      return _react.default.createElement("input", {
        key: key,
        type: "hidden",
        name: fieldName,
        defaultValue: fieldValue
      });
    }
  }, {
    key: "renderExtraHiddenFields",
    value: function renderExtraHiddenFields() {
      var renderedHiddenFields = [];

      var _arr = Object.keys(this.props.extraHiddenFields);

      for (var _i = 0; _i < _arr.length; _i++) {
        var fieldName = _arr[_i];
        renderedHiddenFields.push(this.renderExtraHiddenField(fieldName, this.props.extraHiddenFields[fieldName]));
      }

      return renderedHiddenFields;
    }
  }, {
    key: "renderFormContent",
    value: function renderFormContent() {
      return [this.renderHiddenFields(), this.renderButton()].concat(_toConsumableArray(this.renderExtraHiddenFields()));
    }
  }, {
    key: "renderForm",
    value: function renderForm() {
      return _react.default.createElement("form", {
        method: this.props.formMethod,
        action: this.props.formAction,
        className: this.formClassName
      }, this.renderFormContent());
    }
  }, {
    key: "render",
    value: function render() {
      var selectedItemCount = this.props.selectedListItemsMap.size;

      if (selectedItemCount === 0) {
        return null;
      }

      if (selectedItemCount < this.props.minSelectedItems) {
        return null;
      }

      if (this.props.maxSelectedItems !== null && selectedItemCount > this.props.maxSelectedItems) {
        return null;
      }

      return this.renderForm();
    }
  }, {
    key: "buttonBemBlock",
    get: function get() {
      return 'button';
    }
  }, {
    key: "buttonClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.buttonBemBlock, this.props.buttonBemVariants);
    }
  }, {
    key: "formClassName",
    get: function get() {
      return this.props.formClassName;
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign({}, {
        formAction: _propTypes.default.string.isRequired,
        formMethod: _propTypes.default.string.isRequired,
        hiddenFieldName: _propTypes.default.string.isRequired,
        debug: _propTypes.default.bool.isRequired,
        formClassName: _propTypes.default.string.isRequired,
        buttonBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        label: _propTypes.default.string.isRequired,
        minSelectedItems: _propTypes.default.number.isRequired,
        maxSelectedItems: _propTypes.default.number,
        extraHiddenFields: _propTypes.default.object.isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractSelectedItems.defaultProps}.
     *
     * @return {Object}
     * @property {string} formAction The form `action` attribute.
     *    This is required.
     *    **Must be provided in spec**.
     * @property {string} formMethod The form `method` attribute.
     *    This is required, and defaults to "POST".
     *    **Can be used in spec**.
     * @property {string} hiddenFieldName The name of the hidden field.
     *    This is required.
     *    **Must be provided in spec**.
     * @property {[string]} buttonBemVariants BEM variants for the selectable-list.
     *    **Can be used in spec**.
     * @property {number} minSelectedItems Minimum number of selected items
     *    required before the button is rendered.
     *    This is required, and defaults to `1`. Setting this to `0` will be
     *    the same as setting it to `1` since the button is never rendered
     *    if we have no selected items.
     *    **Can be used in spec**.
     * @property {number} minSelectedItems Maximum number of selected items
     *    required before the button is rendered. If this is `null`,
     *    the button is rendered as long as more than `minSelectedItems`
     *    is selected.
     *    This is not required (can be null), and defaults to `null`.
     *    **Can be used in spec**.
     * @property {bool} debug If this is `true`, we render input elements of
     *    type "text" instead of "hidden". Nice for debugging.
     *    Defaults to `false`.
     *    **Can be used in spec**.
     * @property {{}} extraHiddenFields Extra hidden fields. Object mapping
     *    field name to field value.
     *    Defaults to empty object (`{}`).
     *    **Can be used in spec**.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(SubmitSelectedItems), "defaultProps", this), {
        formAction: null,
        formMethod: 'POST',
        hiddenFieldName: null,
        debug: false,
        formClassName: 'paragraph',
        buttonBemVariants: [],
        minSelectedItems: 1,
        maxSelectedItems: null,
        label: window.gettext('Submit'),
        extraHiddenFields: {}
      });
    }
  }]);

  _inherits(SubmitSelectedItems, _AbstractSelectedItem);

  return SubmitSelectedItems;
}(_AbstractSelectedItems.default);

exports.default = SubmitSelectedItems;