"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _AbstractDateOrDateTimeSelect = _interopRequireDefault(require("./AbstractDateOrDateTimeSelect"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var AbstractModalDateOrDateTimeSelect =
/*#__PURE__*/
function (_AbstractDateOrDateTi) {
  _createClass(AbstractModalDateOrDateTimeSelect, null, [{
    key: "defaultProps",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(AbstractModalDateOrDateTimeSelect), "defaultProps", this), {
        bemVariants: ['modal'],
        bodyBemVariants: ['modal'],
        useButtonBemBlock: 'button',
        useButtonBemVariants: ['block', 'primary'],
        noneSelectedButtonLabel: null,
        title: null,
        useButtonLabel: gettext.pgettext('datetimepicker', 'Use'),
        openButtonEmptyLabel: gettext.pgettext('datetimepicker', 'Select'),
        openPickerProps: {}
      });
    }
  }, {
    key: "propTypes",
    get: function get() {
      return Object.assign({}, {
        noneSelectedButtonLabel: _propTypes.default.string,
        title: _propTypes.default.string.isRequired,
        useButtonLabel: _propTypes.default.string.isRequired,
        openButtonEmptyLabel: _propTypes.default.string.isRequired,
        openPickerProps: _propTypes.default.object.isRequired
      });
    }
  }]);

  function AbstractModalDateOrDateTimeSelect(props) {
    var _this;

    _classCallCheck(this, AbstractModalDateOrDateTimeSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractModalDateOrDateTimeSelect).call(this, props));
    _this.onOpenButtonClick = _this.onOpenButtonClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onCloseButtonClick = _this.onCloseButtonClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onUseButtonClick = _this.onUseButtonClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.useButtonRef = _react.default.createRef();
    _this.openPickerComponentRef = _react.default.createRef();
    return _this;
  }

  _createClass(AbstractModalDateOrDateTimeSelect, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      return Object.assign({}, _get(_getPrototypeOf(AbstractModalDateOrDateTimeSelect.prototype), "makeInitialState", this).call(this), {
        isOpen: false
      });
    }
  }, {
    key: "onCompleteMomentObjectSelected",
    value: function onCompleteMomentObjectSelected() {
      if (this.selectType === 'date') {
        this.triggerOnChange(this.state.draftMomentObject);
      }
    }
  }, {
    key: "postSetDraftMomentObject",
    value: function postSetDraftMomentObject() {
      var isCompleteDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var isCompleteDateTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.selectType === 'date') {
        if (isCompleteDate || isCompleteDateTime) {
          this.onCompleteMomentObjectSelected();
        }
      } else if (this.selectType === 'datetime') {
        if (isCompleteDateTime) {
          this.onCompleteMomentObjectSelected();
        }
      }
    }
  }, {
    key: "setDraftMomentObject",
    value: function setDraftMomentObject(draftMomentObject) {
      var _this2 = this;

      var isCompleteDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var isCompleteDateTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.setState({
        draftMomentObject: draftMomentObject
      }, function () {
        _this2.postSetDraftMomentObject(isCompleteDate, isCompleteDateTime);
      });
    }
  }, {
    key: "triggerOnChange",
    value: function triggerOnChange(momentObject) {
      var _this3 = this;

      var onComplete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _get(_getPrototypeOf(AbstractModalDateOrDateTimeSelect.prototype), "triggerOnChange", this).call(this, momentObject, function () {
        _this3.setState({
          isOpen: false
        }, function () {
          _this3.openPickerComponentRef.current.focus();

          if (onComplete) {
            onComplete();
          }
        });
      });
    }
  }, {
    key: "onUseButtonClick",
    value: function onUseButtonClick() {
      this.triggerOnChange(this.state.draftMomentObject);
    }
  }, {
    key: "onOpenButtonClick",
    value: function onOpenButtonClick() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }, {
    key: "onCloseButtonClick",
    value: function onCloseButtonClick() {
      this.setState({
        isOpen: false
      });
    }
  }, {
    key: "renderOpenPicker",
    value: function renderOpenPicker() {
      var OpenPickerComponent = this.openPickerComponentClass;
      return _react.default.createElement(OpenPickerComponent, this.openPickerComponentProps);
    }
  }, {
    key: "renderCloseButton",
    value: function renderCloseButton() {
      return _react.default.createElement("div", {
        className: this.closeButtonClassName,
        key: 'closeButton'
      }, _react.default.createElement("button", {
        type: "button",
        title: this.closeButtonTitle,
        onClick: this.onCloseButtonClick,
        "aria-describedby": this.ariaDescribedByDomId
      }, _react.default.createElement("span", {
        className: this.closeButtonIconClassName,
        "aria-hidden": "true"
      })));
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      if (this.props.title === null) {
        return null;
      }

      return _react.default.createElement("div", {
        key: 'title',
        className: this.titleClassName,
        "aria-hidden": true
      }, this.props.title);
    }
  }, {
    key: "renderUseButtonLabel",
    value: function renderUseButtonLabel() {
      return this.props.useButtonLabel;
    }
  }, {
    key: "renderUseButton",
    value: function renderUseButton() {
      if (this.state.draftMomentObject === null || this.selectType !== 'datetime') {
        return null;
      }

      return _react.default.createElement("button", this.useButtonProps, this.renderUseButtonLabel());
    }
  }, {
    key: "renderBodyContent",
    value: function renderBodyContent() {
      return [this.renderCloseButton(), this.renderTitle()].concat(_toConsumableArray(_get(_getPrototypeOf(AbstractModalDateOrDateTimeSelect.prototype), "renderBodyContent", this).call(this)), [this.renderUseButton()]);
    }
  }, {
    key: "renderBackdrop",
    value: function renderBackdrop() {
      return _react.default.createElement("div", {
        key: 'backdrop',
        className: this.backdropClassName,
        onClick: this.onCloseButtonClick
      });
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      return [this.renderBackdrop()].concat(_toConsumableArray(_get(_getPrototypeOf(AbstractModalDateOrDateTimeSelect.prototype), "renderContent", this).call(this)));
    }
  }, {
    key: "renderModal",
    value: function renderModal() {
      if (this.state.isOpen) {
        return _react.default.createElement("div", {
          className: this.className,
          "aria-live": 'assertive',
          id: this.modalDomId,
          key: 'modal'
        }, this.renderContent());
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      return [this.renderAriaDescribedBy(), this.renderOpenPicker(), this.renderModal()];
    }
  }, {
    key: "ariaLabel",
    get: function get() {
      return this.props.ariaLabel ? this.props.ariaLabel : this.props.title;
    }
  }, {
    key: "useButtonClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.useButtonBemBlock, this.props.useButtonBemVariants);
    }
  }, {
    key: "backdropClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'backdrop');
    }
  }, {
    key: "titleClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'title');
    }
  }, {
    key: "closeButtonClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'close');
    }
  }, {
    key: "closeButtonTitle",
    get: function get() {
      return gettext.gettext('Close');
    }
  }, {
    key: "closeButtonIconClassName",
    get: function get() {
      return 'cricon cricon--close';
    }
  }, {
    key: "modalDomId",
    get: function get() {
      return "".concat(this.domIdPrefix, "_modal");
    }
  }, {
    key: "openPickerComponentProps",
    get: function get() {
      return _objectSpread({}, this.props.openPickerProps, {
        key: 'openPicker',
        ref: this.openPickerComponentRef,
        momentObject: this.props.momentObject,
        isOpen: this.state.isOpen,
        domIdPrefix: this.domIdPrefix,
        onOpen: this.onOpenButtonClick,
        onChange: this.triggerOnChange,
        modalDomId: this.modalDomId,
        ariaDescribedByDomId: this.ariaDescribedByDomId
      });
    }
  }, {
    key: "openPickerComponentClass",
    get: function get() {
      throw new Error('The openPickerComponentClass getter must be implemented in subclasses');
    }
  }, {
    key: "useButtonProps",
    get: function get() {
      return {
        key: 'useButton',
        ref: this.useButtonRef,
        type: 'button',
        className: this.useButtonClassName,
        onClick: this.onUseButtonClick
      };
    }
  }]);

  _inherits(AbstractModalDateOrDateTimeSelect, _AbstractDateOrDateTi);

  return AbstractModalDateOrDateTimeSelect;
}(_AbstractDateOrDateTimeSelect.default);

exports.default = AbstractModalDateOrDateTimeSelect;