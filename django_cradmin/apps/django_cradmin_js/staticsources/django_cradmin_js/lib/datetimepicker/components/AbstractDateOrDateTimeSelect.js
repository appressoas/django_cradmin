"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _moment = _interopRequireDefault(require("moment"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _UniqueDomIdSingleton = _interopRequireDefault(require("ievv_jsbase/lib/dom/UniqueDomIdSingleton"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var AbstractDateOrDateTimeSelect =
/*#__PURE__*/
function (_React$Component) {
  _createClass(AbstractDateOrDateTimeSelect, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        initialFocusMomentObject: (0, _moment.default)(),
        bemBlock: 'datetimepicker',
        bemVariants: [],
        selectedPreviewFormat: null,
        bodyBemVariants: [],
        onChange: null,
        pickerProps: {},
        ariaLabel: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any,
        initialFocusMomentObject: _propTypes.default.any.isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        selectedPreviewFormat: _propTypes.default.string.isRequired,
        bodyBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        onChange: _propTypes.default.func,
        pickerProps: _propTypes.default.object.isRequired,
        ariaLabel: _propTypes.default.string
      };
    }
  }]);

  function AbstractDateOrDateTimeSelect(props) {
    var _this;

    _classCallCheck(this, AbstractDateOrDateTimeSelect);

    if (props.initialFocusMomentObject === null && props.momentObject !== null) {
      props.initialFocusMomentObject = props.momentObject.clone();
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractDateOrDateTimeSelect).call(this, props));
    _this.state = _this.makeInitialState();
    _this.setDraftMomentObject = _this.setDraftMomentObject.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.triggerOnChange = _this.triggerOnChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.domIdPrefix = new _UniqueDomIdSingleton.default().generate();
    return _this;
  }

  _createClass(AbstractDateOrDateTimeSelect, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      return {
        initialPropsMomentClone: this.props.momentObject,
        draftMomentObject: this.props.momentObject === null ? null : this.props.momentObject.clone()
      };
    }
  }, {
    key: "triggerOnChange",
    //
    // Event handling and setting of selected datetime
    //
    value: function triggerOnChange(momentObject) {
      var _this2 = this;

      var onComplete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState({
        draftMomentObject: momentObject
      }, function () {
        if (_this2.props.onChange !== null) {
          _this2.props.onChange(momentObject);
        }

        if (onComplete !== null) {
          onComplete();
        }
      });
    }
  }, {
    key: "setDraftMomentObject",
    value: function setDraftMomentObject(draftMomentObject) {
      var isCompleteDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var isCompleteDateTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      throw new Error('Must override setDraftMomentObject()');
    } //
    // Easily overridable component props
    //

  }, {
    key: "renderAriaDescribedBy",
    value: function renderAriaDescribedBy() {
      return _react.default.createElement("span", {
        id: this.ariaDescribedByDomId,
        className: "screenreader-only",
        key: 'aria-describedby'
      }, this.ariaDescribedByText);
    }
  }, {
    key: "renderSelectedPreview",
    value: function renderSelectedPreview() {
      if (this.state.draftMomentObject === null) {
        return null;
      }

      return _react.default.createElement("p", {
        key: 'preview',
        className: this.previewClassName
      }, this.draftMomentObjectPreviewFormatted);
    }
  }, {
    key: "renderPicker",
    value: function renderPicker() {
      var PickerComponent = this.pickerComponentClass;
      return _react.default.createElement(PickerComponent, _extends({
        key: 'picker'
      }, this.pickerComponentProps));
    }
  }, {
    key: "renderBodyContent",
    value: function renderBodyContent() {
      return [this.renderPicker(), this.renderSelectedPreview()];
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      return _react.default.createElement("div", {
        key: 'body',
        className: this.bodyClassName
      }, this.renderBodyContent());
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      return [this.renderBody()];
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.className
      }, this.renderAriaDescribedBy(), this.renderContent());
    }
  }, {
    key: "ariaLabel",
    get: function get() {
      return this.props.ariaLabel;
    }
  }, {
    key: "ariaDescribedByDomId",
    get: function get() {
      return "".concat(this.domIdPrefix, "_describedby");
    }
  }, {
    key: "selectType",
    get: function get() {
      throw new Error('The selectType getter must be overridden in subclasses');
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "bodyClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'body', this.props.bodyBemVariants);
    }
  }, {
    key: "previewClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'preview');
    }
  }, {
    key: "pickerComponentClass",
    get: function get() {
      throw new Error('Must override pickerComponentClass getter');
    }
  }, {
    key: "pickerComponentProps",
    get: function get() {
      return _objectSpread({}, this.props.pickerProps, {
        momentObject: this.state.draftMomentObject,
        initialFocusMomentObject: this.props.initialFocusMomentObject,
        onChange: this.setDraftMomentObject,
        ariaDescribedByDomId: this.ariaDescribedByDomId
      });
    }
  }, {
    key: "draftMomentObjectPreviewFormatted",
    get: function get() {
      if (this.state.draftMomentObject === null) {
        return '';
      }

      return this.state.draftMomentObject.format(this.props.selectedPreviewFormat);
    }
  }, {
    key: "momentObjectPreviewFormatted",
    get: function get() {
      if (this.props.momentObject === null) {
        return '';
      }

      return this.props.momentObject.format(this.props.selectedPreviewFormat);
    } //
    // Rendering
    //

  }, {
    key: "noValueSelectedAriaText",
    get: function get() {
      return gettext.gettext('No value selected');
    }
  }, {
    key: "selectedValueAriaText",
    get: function get() {
      return gettext.interpolate(gettext.gettext('Currently selected value: %(currentValue)s'), {
        currentValue: this.momentObjectPreviewFormatted
      }, true);
    }
  }, {
    key: "ariaDescribedByText",
    get: function get() {
      if (this.props.momentObject === null) {
        return "".concat(this.ariaLabel, " - ").concat(this.noValueSelectedAriaText);
      }

      return "".concat(this.ariaLabel, " - ").concat(this.selectedValueAriaText, ".");
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.momentObject === null && prevState.initialPropsMomentClone === null) {
        return null;
      }

      if (nextProps.momentObject !== null && prevState.initialPropsMomentClone !== null && prevState.initialPropsMomentClone.isSame(nextProps.momentObject)) {
        return null;
      }

      var nextObject = nextProps.momentObject === null ? null : nextProps.momentObject.clone();
      return {
        initialPropsMomentClone: nextObject,
        draftMomentObject: nextObject
      };
    }
  }]);

  _inherits(AbstractDateOrDateTimeSelect, _React$Component);

  return AbstractDateOrDateTimeSelect;
}(_react.default.Component);

exports.default = AbstractDateOrDateTimeSelect;