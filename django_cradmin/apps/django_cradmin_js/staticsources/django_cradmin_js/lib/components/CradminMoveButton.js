"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _DomUtilities = _interopRequireDefault(require("../utilities/DomUtilities"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var CradminMoveButton =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminMoveButton, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        iconClassName: '',
        className: 'button',
        moveDirection: null,
        itemIndex: null,
        signalNameSpace: null,
        ariaLabel: ''
      };
    }
  }]);

  function CradminMoveButton(props) {
    var _this;

    _classCallCheck(this, CradminMoveButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminMoveButton).call(this, props));
    _this._name = "django_cradmin.components.MoveButton.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.MoveButton');

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    if (_this.props.moveDirection == null) {
      throw new Error('The moveDirection prop is required.');
    }

    if (_this.props.itemIndex == null) {
      throw new Error('The itemIndex prop is required.');
    }

    _this.signalHandler = new _SignalHandlerSingleton.default();
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(CradminMoveButton, [{
    key: "onClick",
    value: function onClick(event) {
      event.preventDefault();
      this.signalHandler.send("".concat(this.props.signalNameSpace, ".SortableHtmlList.MoveItem").concat(this.props.moveDirection), {
        itemIndex: this.props.itemIndex
      });
    }
  }, {
    key: "renderButtonContent",
    value: function renderButtonContent() {
      return _react.default.createElement("span", {
        className: this.props.iconClassName,
        "aria-hidden": "true"
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("button", {
        type: "button",
        className: this.props.className,
        onClick: this.onClick,
        "aria-label": this.props.ariaLabel
      }, this.renderButtonContent());
    }
  }]);

  _inherits(CradminMoveButton, _React$Component);

  return CradminMoveButton;
}(_react.default.Component);

exports.default = CradminMoveButton;