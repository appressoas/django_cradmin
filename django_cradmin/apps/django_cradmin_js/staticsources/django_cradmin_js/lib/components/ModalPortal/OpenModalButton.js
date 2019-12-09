"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _Modal = _interopRequireDefault(require("./Modal"));

var constants = _interopRequireWildcard(require("./constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OpenModalButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(OpenModalButton, _React$Component);

  _createClass(OpenModalButton, null, [{
    key: "propTypes",
    get: function get() {
      return {
        htmlTag: _propTypes.default.string,
        buttonClassName: _propTypes.default.string,
        buttonContents: _propTypes.default.any,
        modalClosedCallback: _propTypes.default.func,
        modalOpenedCallback: _propTypes.default.func,
        closeOnBackdropClick: _propTypes.default.bool,
        modalContentsComponent: _propTypes.default.func.isRequired,
        modalContentsComponentProps: _propTypes.default.object,
        modalEventInterceptTypes: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        isDisabled: _propTypes.default.bool,
        extraButtonAttributes: _propTypes.default.object,
        modalLocationId: _propTypes.default.string.isRequired,
        modalOpen: _propTypes.default.bool.isRequired,
        modalBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        htmlTag: 'button',
        buttonClassName: 'button button--compact',
        buttonContents: 'Open modal',
        modalContentsComponent: null,
        modalClosedCallback: null,
        modalOpenedCallback: null,
        closeOnBackdropClick: false,
        modalContentsComponentProps: {},
        modalEventInterceptTypes: [],
        isDisabled: false,
        extraButtonAttributes: {},
        modalLocationId: constants.MODAL_PLACEHOLDER_ID,
        modalOpen: false,
        modalBemVariants: []
      };
    }
  }]);

  function OpenModalButton(props) {
    var _this;

    _classCallCheck(this, OpenModalButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OpenModalButton).call(this, props));
    _this.logger = new _LoggerSingleton.default().getLogger(_this.name);
    _this.state = {
      showModal: _this.props.modalOpen
    };
    _this.openModal = _this.openModal.bind(_assertThisInitialized(_this));
    _this.closeModal = _this.closeModal.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(OpenModalButton, [{
    key: "openModal",
    value: function openModal() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (event !== null && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }

      if (event !== null && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }

      if (this.props.isDisabled) {
        return;
      }

      this.setState({
        showModal: true
      }, this.props.modalOpenedCallback);
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      var _this2 = this;

      this.setState({
        showModal: false
      }, function () {
        if (_this2.props.modalClosedCallback !== null) {
          _this2.props.modalClosedCallback();
        }
      });
    }
  }, {
    key: "renderOpenModalButton",
    value: function renderOpenModalButton() {
      var TagName = this.props.htmlTag;

      var props = _objectSpread({
        key: 'magic-portal-modal button',
        tabIndex: '0',
        className: this.props.buttonClassName,
        onClick: this.openModal,
        disabled: this.props.isDisabled
      }, this.props.extraButtonAttributes);

      if (this.props.htmlTag === 'button') {
        props.type = 'button';
      } else {
        props.role = 'button';
      }

      return _react.default.createElement(TagName, props, this.props.buttonContents);
    }
  }, {
    key: "renderModal",
    value: function renderModal() {
      if (!this.state.showModal) {
        return null;
      }

      var props = {
        modalLocationId: this.props.modalLocationId,
        modalBemVariants: this.props.modalBemVariants,
        modalContentsComponent: this.props.modalContentsComponent,
        modalContentsComponentProps: this.props.modalContentsComponentProps,
        closeOnBackdropClick: this.props.closeOnBackdropClick,
        closeModalCallback: this.closeModal
      };
      return _react.default.createElement(_Modal.default, _extends({
        key: 'magic-portal modal'
      }, props));
    }
  }, {
    key: "render",
    value: function render() {
      return [this.renderModal(), this.renderOpenModalButton()];
    }
  }]);

  return OpenModalButton;
}(_react.default.Component);

exports.default = OpenModalButton;