"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BemUtilities = _interopRequireDefault(require("../utilities/BemUtilities"));

var is = _interopRequireWildcard(require("is_js"));

var _UniqueDomIdSingleton = _interopRequireDefault(require("ievv_jsbase/lib/dom/UniqueDomIdSingleton"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AbstractHtml5DatetimeInput =
/*#__PURE__*/
function (_React$Component) {
  _createClass(AbstractHtml5DatetimeInput, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        value: null,
        bemBlock: 'searchinput',
        bemVariants: ['outlined'],
        buttonIconBemVariants: ['close'],
        errorBemVariants: ['error'],
        messageBemBlock: 'message',
        messageErrorBemVariants: ['error'],
        messageInfoBemVariants: ['info'],
        onChange: null,
        ariaLabel: null,
        ariaLabelledBy: null,
        ariaDescribedBy: null,
        clearButtonTitle: gettext.pgettext('cradmin html5 datetime selector', 'Clear'),
        min: null,
        max: null,
        readOnly: false,
        required: false,
        extraClassNames: '',
        inputName: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        value: _propTypes.default.string,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        buttonIconBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        clearButtonTitle: _propTypes.default.string.isRequired,
        errorBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        messageBemBlock: _propTypes.default.string.isRequired,
        messageErrorBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        messageInfoBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        onChange: _propTypes.default.func,
        ariaLabel: _propTypes.default.string,
        ariaLabelledBy: _propTypes.default.string,
        ariaDescribedBy: _propTypes.default.string,
        min: _propTypes.default.string,
        max: _propTypes.default.string,
        readOnly: _propTypes.default.bool.isRequired,
        required: _propTypes.default.bool.isRequired,
        extraClassNames: _propTypes.default.string,
        inputName: _propTypes.default.string
      };
    }
  }]);

  function AbstractHtml5DatetimeInput(props) {
    var _this;

    _classCallCheck(this, AbstractHtml5DatetimeInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractHtml5DatetimeInput).call(this, props));
    _this.messageDomId = new _UniqueDomIdSingleton.default().generate();
    _this.state = _this.makeInitialState();

    _this.setupBoundFunctions();

    return _this;
  }

  _createClass(AbstractHtml5DatetimeInput, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      return {
        value: this.makeValidInputFieldValue(this.props.value || ''),
        isBlurred: false
      };
    }
  }, {
    key: "setupBoundFunctions",
    value: function setupBoundFunctions() {
      this.onChange = this.onChange.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onFocus = this.onFocus.bind(this);
      this.handleClearClick = this.handleClearClick.bind(this);
    }
  }, {
    key: "parseInputValue",
    value: function parseInputValue(stringValue) {
      throw new Error('parseInputValue must be implemented in subclass');
    }
  }, {
    key: "handleChange",
    value: function handleChange(stringValue) {
      throw new Error('handleChange must be implemented in subclass');
    }
  }, {
    key: "handleClearClick",
    value: function handleClearClick() {
      this.handleChange('');
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      this.handleChange(e.target.value);
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      throw new Error('onBlur must be implemented in subclass');
    }
  }, {
    key: "onFocus",
    value: function onFocus() {
      this.setState({
        isBlurred: false
      });
    }
  }, {
    key: "getInputType",
    value: function getInputType() {
      throw new Error('getInputType must be implemented in subclass');
    }
  }, {
    key: "browserFullySupportsDateInput",
    value: function browserFullySupportsDateInput() {
      // NOTE: This can be simplified, but is not for readability
      // return false
      if (is.chrome() || is.firefox() || is.opera() || is.edge()) {
        return true;
      }

      if (is.safari() && !is.desktop()) {
        return true;
      }

      return false;
    }
  }, {
    key: "makeValidInputFieldValue",
    value: function makeValidInputFieldValue() {
      throw new Error('makeValidInputFieldValue must be implemented in subclass');
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      throw new Error('renderInput must be implemented in subclass');
    }
  }, {
    key: "hasValidInput",
    value: function hasValidInput() {
      var currentValue = this.state.value;

      if (!currentValue) {
        return true;
      }

      var parseResult = this.parseInputValue(currentValue);
      return parseResult.isValid;
    }
  }, {
    key: "renderInvalidInputText",
    value: function renderInvalidInputText() {
      throw new Error('renderInvalidInputText must be implemented in subclass');
    }
  }, {
    key: "renderInvalidInputMessage",
    value: function renderInvalidInputMessage() {
      return _react.default.createElement("p", {
        className: this.messageClassName,
        id: this.messageDomId
      }, this.renderInvalidInputText());
    }
  }, {
    key: "renderErrors",
    value: function renderErrors() {
      if (this.hasValidInput()) {
        return null;
      }

      return this.renderInvalidInputMessage();
    }
  }, {
    key: "renderWrappedInput",
    value: function renderWrappedInput() {
      return _react.default.createElement("div", {
        className: this.wrapperClassName
      }, _react.default.createElement("span", {
        className: this.bodyClassName
      }, this.renderInput()), _react.default.createElement("button", {
        type: 'button',
        className: this.buttonClassName,
        title: this.props.clearButtonTitle,
        onClick: this.handleClearClick
      }, _react.default.createElement("span", {
        className: this.buttonIconClassName,
        "aria-hidden": true
      })));
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(_react.default.Fragment, null, this.renderWrappedInput(), this.renderErrors());
    }
  }, {
    key: "inputFormat",
    get: function get() {
      throw new Error('inputFormat must be implemented in subclass');
    }
  }, {
    key: "wrapperClassName",
    get: function get() {
      var bemVariants = this.props.bemVariants;

      if (!this.hasValidInput()) {
        bemVariants = this.props.errorBemVariants;
      }

      return "".concat(_BemUtilities.default.buildBemBlock(this.props.bemBlock, bemVariants), " ").concat(this.props.extraClassNames);
    }
  }, {
    key: "bodyClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'body');
    }
  }, {
    key: "inputClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'input');
    }
  }, {
    key: "buttonClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'button');
    }
  }, {
    key: "buttonIconClassName",
    get: function get() {
      var buttonIconClass = _BemUtilities.default.buildBemElement(this.props.bemBlock, 'buttonicon');

      var crIconClass = _BemUtilities.default.buildBemBlock('cricon', this.props.buttonIconBemVariants);

      return "".concat(buttonIconClass, " ").concat(crIconClass);
    }
  }, {
    key: "messageClassName",
    get: function get() {
      var bemVariants = this.props.messageInfoBemVariants;

      if (this.state.isBlurred) {
        bemVariants = this.props.messageErrorBemVariants;
      }

      return _BemUtilities.default.buildBemBlock(this.props.messageBemBlock, bemVariants);
    }
  }, {
    key: "inputType",
    get: function get() {
      if (this.browserFullySupportsDateInput()) {
        return this.getInputType();
      }

      return 'text';
    }
  }, {
    key: "humanReadableInputFormat",
    get: function get() {
      throw new Error('humanReadableInputFormat must be implemented in subclass');
    }
  }, {
    key: "placeholder",
    get: function get() {
      if (this.browserFullySupportsDateInput()) {
        return null;
      }

      return this.humanReadableInputFormat;
    }
  }, {
    key: "inputProps",
    get: function get() {
      var ariaDescribedByArray = [];
      var props = {
        type: this.inputType,
        placeholder: this.placeholder,
        min: this.props.min,
        max: this.props.max,
        value: this.state.value,
        readOnly: this.props.readOnly,
        required: this.props.required,
        'aria-label': this.props.ariaLabel,
        'aria-labelledby': this.props.ariaLabelledBy,
        onChange: this.onChange,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        className: this.inputClassName,
        name: this.props.inputName
      };

      if (!this.hasValidInput()) {
        ariaDescribedByArray.push(this.messageDomId);

        if (this.state.isBlurred) {
          props['aria-invalid'] = true;
        }
      }

      if (this.props.ariaDescribedBy) {
        ariaDescribedByArray.push(this.props.ariaDescribedBy);
      }

      if (ariaDescribedByArray.length > 0) {
        props['aria-describedby'] = ariaDescribedByArray.join(' ');
      }

      return props;
    }
  }]);

  _inherits(AbstractHtml5DatetimeInput, _React$Component);

  return AbstractHtml5DatetimeInput;
}(_react.default.Component);

exports.default = AbstractHtml5DatetimeInput;