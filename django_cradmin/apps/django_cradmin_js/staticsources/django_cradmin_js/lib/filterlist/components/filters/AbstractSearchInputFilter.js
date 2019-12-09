"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilter2 = _interopRequireDefault(require("./AbstractFilter"));

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

var _SearchInputClearButton = _interopRequireDefault(require("./components/SearchInputClearButton"));

var _AriaDescribedByTarget = _interopRequireDefault(require("../../../components/AriaDescribedByTarget"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

// import { KEYBOARD_NAVIGATION_GROUP_KEY_UP_DOWN } from '../../filterListConstants'

/**
 * Abstract base class for filters.
 *
 * See {@link AbstractSearchInputFilter.defaultProps} for documentation for
 * props and their defaults.
 */
var AbstractSearchInputFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  _createClass(AbstractSearchInputFilter, null, [{
    key: "filterHttpRequest",
    value: function filterHttpRequest(httpRequest, name, value) {
      httpRequest.urlParser.queryString.set(name, value || '');
    } // static getKeyboardNavigationGroups (componentSpec) {
    //   return [KEYBOARD_NAVIGATION_GROUP_KEY_UP_DOWN]
    // }

  }, {
    key: "propTypes",
    get: function get() {
      return Object.assign({}, {
        label: _propTypes.default.string.isRequired,
        labelIsScreenreaderOnly: _propTypes.default.bool.isRequired,
        labelBemBlock: _propTypes.default.string.isRequired,
        labelBemVariants: _propTypes.default.arrayOf(_propTypes.default.string),
        placeholder: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
        fieldWrapperBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        value: _propTypes.default.string,
        searchInputExtraAriaDescription: _propTypes.default.string
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractFilter.defaultProps}.
     *
     * @return {Object}
     * @property {[string]|string} placeholder A placeholder string,
     *    or an array of placeholder strings.
     *    **Can be used in spec**.
     * @property {string} label A required label for the search field.
     *    Defaults null, but you have to set it (for accessibility compliancy).
     *    Use the `labelIsScreenreaderOnly` prop to make the label only visible
     *    to screenreaders.
     *    **Can be used in spec**.
     * @property {string} labelIsScreenreaderOnly Make the label only visible to
     *    screenreaders. Defaults to ``false``.
     *    **Can be used in spec**.
     * @property {string} labelBemBlock BEM block for the label.
     *    Defaults to "label".
     *    **Can be used in spec**.
     * @property {[]} labelBemVariants BEM variants for the label.
     *    Defaults to empty array.
     *    **Can be used in spec**.
     * @property {[string]} fieldWrapperBemVariants Array of BEM variants
     *    for the field wrapper element.
     *    Defaults to `['outlined']`.
     *    **Can be used in spec**.
     * @property {string} value The value as a string.
     *    _Provided automatically by the parent component_.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractSearchInputFilter), "defaultProps", this), {
        placeholder: '',
        label: gettext.gettext('Search'),
        labelIsScreenreaderOnly: false,
        labelBemBlock: 'label',
        labelBemVariants: [],
        fieldWrapperBemVariants: ['outlined'],
        value: '',
        searchInputExtraAriaDescription: null
      });
    }
  }]);

  function AbstractSearchInputFilter(props) {
    var _this;

    _classCallCheck(this, AbstractSearchInputFilter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractSearchInputFilter).call(this, props));
    _this.placeholderRotateTimeoutId = null;
    return _this;
  }

  _createClass(AbstractSearchInputFilter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _get(_getPrototypeOf(AbstractSearchInputFilter.prototype), "componentDidMount", this).call(this);

      if (this.placeholderIsRotatable()) {
        this.queuePlaceholderRotation();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cancelPlaceholderRotation();
    }
  }, {
    key: "getInitialState",
    value: function getInitialState() {
      return {
        currentPlaceholderIndex: 0
      };
    }
  }, {
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(AbstractSearchInputFilter.prototype), "setupBoundMethods", this).call(this);

      this.onChange = this.onChange.bind(this);
      this.onClickClearButton = this.onClickClearButton.bind(this);
      this.rotatePlaceholder = this.rotatePlaceholder.bind(this);
    }
  }, {
    key: "placeholderIsRotatable",
    value: function placeholderIsRotatable() {
      return Array.isArray(this.props.placeholder) && this.props.placeholder.length > 1;
    }
  }, {
    key: "cancelPlaceholderRotation",
    value: function cancelPlaceholderRotation() {
      if (this.placeholderRotateTimeoutId !== null) {
        window.clearTimeout(this.placeholderRotateTimeoutId);
      }
    }
  }, {
    key: "queuePlaceholderRotation",
    value: function queuePlaceholderRotation() {
      this.cancelPlaceholderRotation();
      this.placeholderRotateTimeoutId = window.setTimeout(this.rotatePlaceholder, this.placeholderRotateIntervalMilliseconds);
    }
  }, {
    key: "rotatePlaceholder",
    value: function rotatePlaceholder() {
      var currentPlaceholderIndex = this.state.currentPlaceholderIndex + 1;

      if (currentPlaceholderIndex >= this.placeholderArray.length) {
        currentPlaceholderIndex = 0;
      }

      this.setState({
        currentPlaceholderIndex: currentPlaceholderIndex
      });
      this.queuePlaceholderRotation();
    } //
    //
    // Search text value change
    //
    //

  }, {
    key: "onChange",
    value: function onChange(event) {
      var searchString = event.target.value;
      this.setFilterValue(searchString);
    }
  }, {
    key: "onClickClearButton",
    value: function onClickClearButton() {
      var _this2 = this;

      this.setFilterValue('');
      window.setTimeout(function () {
        _this2.getSearchInputRef().focus();
      }, 100);
    } //
    //
    // Rendering
    //
    //

  }, {
    key: "getSearchInputRef",
    value: function getSearchInputRef() {
      return this._searchInputRef;
    }
  }, {
    key: "renderLabelText",
    value: function renderLabelText() {
      if (this.props.label) {
        return _react.default.createElement("span", {
          className: this.labelTextClassName
        }, this.props.label);
      }

      return null;
    }
  }, {
    key: "renderClearButton",
    value: function renderClearButton() {
      return _react.default.createElement(_SearchInputClearButton.default, {
        key: 'clear-button',
        onClick: this.onClickClearButton,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        ariaHidden: true
      });
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      throw new Error('renderButtons() must be overridden in subclasses');
    }
  }, {
    key: "renderSearchInputExtraAriaDescribedBy",
    value: function renderSearchInputExtraAriaDescribedBy() {
      if (this.props.searchInputExtraAriaDescription === null) {
        return null;
      }

      return _react.default.createElement(_AriaDescribedByTarget.default, {
        domId: this.searchInputExtraAriaDescribedByDomId,
        message: this.props.searchInputExtraAriaDescription,
        key: 'searchInput extra aria-describedby'
      });
    }
  }, {
    key: "renderSearchInputField",
    value: function renderSearchInputField(extraProps) {
      var _this3 = this;

      var allExtraProps = _objectSpread({}, extraProps, this.ariaProps);

      return _react.default.createElement("input", _extends({}, allExtraProps, {
        key: 'search input',
        type: "text",
        ref: function ref(input) {
          _this3._searchInputRef = input;
        },
        id: this.inputFieldDomId,
        "aria-describedby": this.searchInputAriaDescribedByDomIds,
        placeholder: this.placeholder,
        className: this.inputClassName,
        value: this.stringValue,
        onChange: this.onChange,
        onBlur: this.onBlur,
        onFocus: this.onFocus
      }));
    }
  }, {
    key: "renderSearchInput",
    value: function renderSearchInput() {
      var extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return [this.renderSearchInputExtraAriaDescribedBy(), this.renderSearchInputField(extraProps)];
    }
  }, {
    key: "renderBodyContent",
    value: function renderBodyContent() {
      return this.renderSearchInput();
    }
  }, {
    key: "renderFieldWrapper",
    value: function renderFieldWrapper() {
      return _react.default.createElement("div", {
        className: this.fieldWrapperClassName,
        key: "".concat(this.props.name, "-fieldwrapper")
      }, _react.default.createElement("span", {
        className: this.bodyClassName
      }, this.renderBodyContent()), this.renderButtons());
    }
  }, {
    key: "renderIf",
    value: function renderIf(shouldRender, content) {
      if (shouldRender) {
        return content;
      }

      return null;
    }
  }, {
    key: "renderLabel",
    value: function renderLabel(includeFieldWrapper) {
      var labelProps = {
        key: "".concat(this.props.name, "-label"),
        id: this.labelDomId,
        className: this.labelClassName,
        htmlFor: this.inputFieldDomId
      };
      return _react.default.createElement("label", labelProps, this.renderLabelText(), this.renderIf(includeFieldWrapper, this.renderFieldWrapper()));
    }
  }, {
    key: "render",
    value: function render() {
      return [this.renderLabel(false), this.renderFieldWrapper()];
    }
  }, {
    key: "stringValue",
    get: function get() {
      return this.props.value || '';
    } //
    //
    // Rotating placeholder
    //
    //

  }, {
    key: "placeholderArray",
    get: function get() {
      if (Array.isArray(this.props.placeholder)) {
        return this.props.placeholder;
      }

      return [this.props.placeholder];
    }
  }, {
    key: "placeholderRotateIntervalMilliseconds",
    get: function get() {
      return 2000;
    }
  }, {
    key: "placeholder",
    get: function get() {
      if (Array.isArray(this.props.placeholder)) {
        if (this.props.placeholder.length === 0) {
          return '';
        }

        return this.props.placeholder[this.state.currentPlaceholderIndex];
      }

      return this.props.placeholder;
    }
  }, {
    key: "labelClassName",
    get: function get() {
      if (this.props.labelIsScreenreaderOnly) {
        return 'screenreader-only';
      }

      return _BemUtilities.default.addVariants(this.props.labelBemBlock, this.props.labelBemVariants);
    }
  }, {
    key: "fieldWrapperClassName",
    get: function get() {
      return _BemUtilities.default.addVariants('searchinput', this.props.fieldWrapperBemVariants);
    }
  }, {
    key: "bodyClassName",
    get: function get() {
      return 'searchinput__body';
    }
  }, {
    key: "inputClassName",
    get: function get() {
      return 'searchinput__input';
    }
  }, {
    key: "labelTextClassName",
    get: function get() {
      if (process.env.NODE_ENV === 'test') {
        return 'test-label-text';
      }

      return null;
    }
  }, {
    key: "inputFieldDomId",
    get: function get() {
      return this.makeDomId('inputField');
    }
  }, {
    key: "labelDomId",
    get: function get() {
      return this.makeDomId('label');
    }
  }, {
    key: "searchInputExtraAriaDescribedByDomId",
    get: function get() {
      return this.makeDomId('searchInputExtraAriaDescribedBy');
    }
  }, {
    key: "searchInputAriaDescribedByDomIds",
    get: function get() {
      if (this.props.searchInputExtraAriaDescription !== null) {
        return this.searchInputExtraAriaDescribedByDomId;
      }

      return null;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps() {
      return {
        currentPlaceholderIndex: 0
      };
    }
  }]);

  _inherits(AbstractSearchInputFilter, _AbstractFilter);

  return AbstractSearchInputFilter;
}(_AbstractFilter2.default);

exports.default = AbstractSearchInputFilter;