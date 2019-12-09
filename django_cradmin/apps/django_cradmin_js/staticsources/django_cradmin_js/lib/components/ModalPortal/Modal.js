"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var constants = _interopRequireWildcard(require("./constants"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ErrorBoundary = _interopRequireDefault(require("../ErrorBoundary"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Modal =
/*#__PURE__*/
function (_React$Component) {
  _createClass(Modal, null, [{
    key: "propTypes",
    get: function get() {
      return {
        modalLocationId: _propTypes.default.string.isRequired,
        modalContentsComponent: _propTypes.default.func.isRequired,
        modalContentsComponentProps: _propTypes.default.object,
        closeOnBackdropClick: _propTypes.default.bool.isRequired,
        closeModalCallback: _propTypes.default.func.isRequired,
        modalBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        modalLocationId: constants.MODAL_PLACEHOLDER_ID,
        closeOnBackdropClick: false,
        modalContentsComponentProps: {},
        modalBemVariants: []
      };
    }
  }]);

  function Modal(props) {
    var _this;

    _classCallCheck(this, Modal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Modal).call(this, props));
    _this._modalLocation = null;
    _this.element = document.createElement('div');
    _this.backdropClick = _this.backdropClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.modalLocation) {
        return;
      }

      this.modalLocation.appendChild(this.element);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.modalLocation) {
        return;
      }

      this.modalLocation.removeChild(this.element);
    }
  }, {
    key: "backdropClick",
    value: function backdropClick() {
      if (this.props.closeOnBackdropClick) {
        this.props.closeModalCallback();
      }
    }
  }, {
    key: "renderContents",
    value: function renderContents() {
      var Contents = this.props.modalContentsComponent;
      return _react.default.createElement("div", {
        className: this.modalClassName
      }, _react.default.createElement("div", {
        className: 'modal__backdrop',
        onClick: this.backdropClick
      }), _react.default.createElement("div", {
        className: 'modal__content'
      }, _react.default.createElement(_ErrorBoundary.default, {
        name: 'OpenModalButton'
      }, _react.default.createElement(Contents, _extends({
        closeModalCallback: this.props.closeModalCallback
      }, this.props.modalContentsComponentProps)))));
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.modalLocation || !this.element) {
        console.error('Cannot open modal without valid portalLocation and valid element.');
        return null;
      }

      return _reactDom.default.createPortal(this.renderContents(), this.element);
    }
  }, {
    key: "baseModalClassName",
    get: function get() {
      return 'modal';
    }
  }, {
    key: "modalClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.baseModalClassName, this.props.modalBemVariants);
    }
  }, {
    key: "modalLocation",
    get: function get() {
      if (this._modalLocation === null) {
        this._modalLocation = document.getElementById(this.props.modalLocationId);
      }

      return this._modalLocation;
    }
  }]);

  _inherits(Modal, _React$Component);

  return Modal;
}(_react.default.Component);

exports.default = Modal;