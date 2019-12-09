"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _ModalClose = _interopRequireDefault(require("./ModalClose"));

var _ErrorBoundary = _interopRequireDefault(require("../ErrorBoundary"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var ModalContentsBase =
/*#__PURE__*/
function (_React$Component) {
  function ModalContentsBase() {
    _classCallCheck(this, ModalContentsBase);

    return _possibleConstructorReturn(this, _getPrototypeOf(ModalContentsBase).apply(this, arguments));
  }

  _createClass(ModalContentsBase, [{
    key: "renderCloseButton",
    value: function renderCloseButton() {
      return _react.default.createElement(_ModalClose.default, this.closeButtonProps);
    }
  }, {
    key: "renderCloseButtonIfEnabled",
    value: function renderCloseButtonIfEnabled() {
      if (this.includeCloseButton) {
        return this.renderCloseButton();
      }

      return null;
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      console.error('renderBody should be overridden by subclasses!');
      return null;
    }
  }, {
    key: "renderTitleText",
    value: function renderTitleText() {
      console.error('renderTitleText should be overridden by subclasses!');
      return null;
    }
  }, {
    key: "renderTitleContent",
    value: function renderTitleContent() {
      return _react.default.createElement("h2", {
        className: this.props.headerClassName
      }, this.renderTitleText());
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return _react.default.createElement("div", {
        className: 'modal__title',
        key: 'title'
      }, this.renderTitleContent());
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(_react.default.Fragment, null, this.renderCloseButtonIfEnabled(), this.renderTitle(), _react.default.createElement(_ErrorBoundary.default, {
        key: 'body error boundary',
        name: 'modal content'
      }, this.renderBody()));
    }
  }, {
    key: "closeButtonProps",
    get: function get() {
      return {
        key: 'close button',
        closeModalCallback: this.props.closeModalCallback,
        buttonTitle: this.props.closeButtonTitle
      };
    }
  }, {
    key: "includeCloseButton",
    get: function get() {
      return this.props.includeCloseButton;
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return {
        closeModalCallback: _propTypes.default.func.isRequired,
        headerClassName: _propTypes.default.string.isRequired,
        includeCloseButton: _propTypes.default.bool.isRequired,
        closeButtonTitle: _propTypes.default.string.isRequired
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        closeModalCallback: null,
        headerClassName: 'h3',
        includeCloseButton: true,
        closeButtonTitle: gettext.gettext('Close')
      };
    }
  }]);

  _inherits(ModalContentsBase, _React$Component);

  return ModalContentsBase;
}(_react.default.Component);

exports.default = ModalContentsBase;