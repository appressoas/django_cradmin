"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

var _moment = _interopRequireDefault(require("moment/moment"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var AbstractOpenPicker =
/*#__PURE__*/
function (_React$Component) {
  _createClass(AbstractOpenPicker, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        momentObjectFormat: null,
        openButtonEmptyLabel: gettext.pgettext('datetimepicker', 'Select'),
        includeNowButton: true,
        nowButtonLabel: null,
        onOpen: null,
        onChange: null,
        wrapperBemVariants: ['xs'],
        buttonBarBemVariants: ['nomargin'],
        modalDomId: null,
        ariaDescribedByDomId: null,
        domIdPrefix: null,
        isOpen: false
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any,
        momentObjectFormat: _propTypes.default.string.isRequired,
        openButtonEmptyLabel: _propTypes.default.string.isRequired,
        includeNowButton: _propTypes.default.bool,
        nowButtonLabel: _propTypes.default.string.isRequired,
        onOpen: _propTypes.default.func.isRequired,
        onChange: _propTypes.default.func.isRequired,
        wrapperBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        modalDomId: _propTypes.default.string,
        ariaDescribedByDomId: _propTypes.default.string.isRequired,
        domIdPrefix: _propTypes.default.string.isRequired,
        isOpen: _propTypes.default.bool.isRequired
      };
    }
  }]);

  function AbstractOpenPicker(props) {
    var _this;

    _classCallCheck(this, AbstractOpenPicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractOpenPicker).call(this, props));
    _this.onNowButtonClick = _this.onNowButtonClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.openButtonRef = _react.default.createRef();
    return _this;
  }

  _createClass(AbstractOpenPicker, [{
    key: "onNowButtonClick",
    value: function onNowButtonClick() {
      this.props.onChange((0, _moment.default)());
      this.openButtonRef.focus();
    }
  }, {
    key: "makeButtonClassName",
    value: function makeButtonClassName() {
      var bemVariants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return _BemUtilities.default.buildBemElement(this.buttonBarBemBlock, 'button', bemVariants);
    }
  }, {
    key: "renderIcon",
    value: function renderIcon(name) {
      var bemVariants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var className = _BemUtilities.default.addVariants('cricon', [name].concat(_toConsumableArray(bemVariants)));

      return _react.default.createElement("span", {
        className: className,
        "aria-hidden": "true"
      });
    }
  }, {
    key: "renderOpenButtonLabel",
    value: function renderOpenButtonLabel() {
      return this.openButtonLabelText;
    }
  }, {
    key: "renderOpenButtonIcon",
    value: function renderOpenButtonIcon() {
      return _react.default.createElement("span", null, this.renderIcon('calendar'), ' ');
    }
  }, {
    key: "renderOpenButton",
    value: function renderOpenButton() {
      return _react.default.createElement("button", this.openButtonProps, this.renderOpenButtonIcon(), this.renderOpenButtonLabel());
    }
  }, {
    key: "renderOpenButtonAriaDescribedBy",
    value: function renderOpenButtonAriaDescribedBy() {
      return _react.default.createElement("span", {
        id: this.openButtonAriaDescribedByDomId,
        className: "screenreader-only",
        key: 'aria-describedby'
      }, this.openButtonAriaDescribedByText);
    }
  }, {
    key: "renderNowButtonLabel",
    value: function renderNowButtonLabel() {
      return this.props.nowButtonLabel;
    }
  }, {
    key: "renderNowButton",
    value: function renderNowButton() {
      return _react.default.createElement("button", {
        key: 'nowButton',
        type: 'button',
        className: this.makeButtonClassName(['fill', 'no-grow']),
        onClick: this.onNowButtonClick,
        "aria-describedby": this.props.ariaDescribedByDomId
      }, this.renderNowButtonLabel());
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      var buttons = [this.renderOpenButton()];

      if (this.props.includeNowButton) {
        buttons.push(this.renderNowButton());
      }

      return buttons;
    }
  }, {
    key: "renderButtonBar",
    value: function renderButtonBar() {
      return _react.default.createElement("div", {
        className: this.buttonBarClassName
      }, this.renderButtons());
    }
  }, {
    key: "focus",
    value: function focus() {
      this.openButtonRef.current.focus();
    }
  }, {
    key: "render",
    value: function render() {
      return [this.renderOpenButtonAriaDescribedBy(), _react.default.createElement("div", {
        className: this.wrapperClassName,
        key: 'buttonBarWrapper'
      }, this.renderButtonBar())];
    }
  }, {
    key: "openButtonAriaDescribedByDomId",
    get: function get() {
      return "".concat(this.props.domIdPrefix, "_openPicker_openButton");
    }
  }, {
    key: "wrapperBemBlock",
    get: function get() {
      return 'max-width';
    }
  }, {
    key: "wrapperClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.wrapperBemBlock, this.props.wrapperBemVariants);
    }
  }, {
    key: "buttonBarBemBlock",
    get: function get() {
      return 'buttonbar';
    }
  }, {
    key: "buttonBarClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.buttonBarBemBlock, this.props.buttonBarBemVariants);
    }
  }, {
    key: "openButtonLabelText",
    get: function get() {
      if (this.props.momentObject === null) {
        return this.props.openButtonEmptyLabel;
      }

      return this.props.momentObject.format(this.props.momentObjectFormat);
    }
  }, {
    key: "openButtonAriaLabel",
    get: function get() {
      var expandedState = gettext.pgettext('datetimepicker openButton', 'collapsed');

      if (this.props.isOpen) {
        expandedState = gettext.pgettext('datetimepicker openButton', 'expanded');
      }

      var ariaExtra = gettext.gettext('Calendar picker toggle button');
      return "".concat(this.openButtonLabelText, ". ").concat(ariaExtra, " - ").concat(expandedState);
    }
  }, {
    key: "openButtonProps",
    get: function get() {
      return {
        key: 'openButton',
        ref: this.openButtonRef,
        type: 'button',
        className: this.makeButtonClassName(['input-outlined', 'grow-2', 'width-xsmall']),
        onClick: this.props.onOpen,
        'aria-label': this.openButtonAriaLabel,
        'aria-describedby': "".concat(this.props.ariaDescribedByDomId, " ").concat(this.openButtonAriaDescribedByDomId)
      };
    }
  }, {
    key: "openButtonAriaDescribedByText",
    get: function get() {
      if (this.props.isOpen) {
        return gettext.gettext('You are currently on an expanded calendar picker toggle button. Use the focus change key (tab) to go to the calendar picker. Click the button to collapse/hide the calendar picker.');
      } else {
        return gettext.gettext('You are currently on an collapsed calendar picker toggle button. Click the button to expand the calendar picker.');
      }
    }
  }]);

  _inherits(AbstractOpenPicker, _React$Component);

  return AbstractOpenPicker;
}(_react.default.Component);

exports.default = AbstractOpenPicker;