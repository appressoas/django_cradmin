"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHotkeys = require("react-hotkeys");

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

var CradminLoadMoreButton =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminLoadMoreButton, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        label: 'Load more',
        className: 'button',
        signalNameSpace: null,
        useHotKeys: false,
        disableTabNavigation: false
      };
    }
  }]);

  function CradminLoadMoreButton(props) {
    var _this;

    _classCallCheck(this, CradminLoadMoreButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminLoadMoreButton).call(this, props));
    _this._name = "django_cradmin.components.CradminLoadMoreButton.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminLoadMoreButton');

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    _this._onClick = _this._onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onLoadingStateChangeSignal = _this._onLoadingStateChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnLoadMoreButtonSignal = _this._onFocusOnLoadMoreButtonSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocus = _this._onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onBlur = _this._onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      isLoading: false
    };

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminLoadMoreButton, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".LoadingStateChange"), this._name, this._onLoadingStateChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnLoadMoreButton"), this._name, this._onFocusOnLoadMoreButtonSignal);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_onClick",
    value: function _onClick(event) {
      event.preventDefault();

      if (!this.state.isLoading) {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".LoadMore"));
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".LoadMoreButtonClick"));
      }
    }
  }, {
    key: "_onFocus",
    value: function _onFocus(event) {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Focus"));
    }
  }, {
    key: "_onBlur",
    value: function _onBlur(event) {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Blur"));
    }
  }, {
    key: "_onLoadingStateChangeSignal",
    value: function _onLoadingStateChangeSignal(receivedSignalInfo) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      this.setState({
        isLoading: receivedSignalInfo.data
      });
    }
  }, {
    key: "_onFocusOnLoadMoreButtonSignal",
    value: function _onFocusOnLoadMoreButtonSignal(receivedSignalInfo) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);

      _DomUtilities.default.forceFocus(this._buttonDomElement);
    }
  }, {
    key: "_onUpKey",
    value: function _onUpKey() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".LoadMoreUpKey"));
    }
  }, {
    key: "_onDownKey",
    value: function _onDownKey() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".LoadMoreDownKey"));
    }
  }, {
    key: "_onEscapeKey",
    value: function _onEscapeKey() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".LoadMoreEscapeKey"));
    }
  }, {
    key: "getTabIndex",
    value: function getTabIndex() {
      if (this.props.disableTabNavigation) {
        return "-1";
      } else {
        return "0";
      }
    }
  }, {
    key: "renderButtonContent",
    value: function renderButtonContent() {
      return this.props.label;
    }
  }, {
    key: "renderButton",
    value: function renderButton() {
      var _this2 = this;

      return _react.default.createElement("button", {
        type: "button",
        ref: function ref(input) {
          _this2._buttonDomElement = input;
        },
        className: this.props.className,
        value: this.state.searchString,
        onClick: this._onClick,
        onFocus: this._onFocus,
        onBlur: this._onBlur,
        tabIndex: this.getTabIndex()
      }, this.renderButtonContent());
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.useHotKeys) {
        return _react.default.createElement(_reactHotkeys.HotKeys, {
          keyMap: this.hotKeysMap,
          handlers: this.hotKeysHandlers
        }, this.renderButton());
      } else {
        return this.renderButton();
      }
    }
  }, {
    key: "hotKeysMap",
    get: function get() {
      return {
        'upKey': ['up'],
        'downKey': ['down'],
        'escapeKey': ['escape']
      };
    }
  }, {
    key: "hotKeysHandlers",
    get: function get() {
      var _this3 = this;

      return {
        'upKey': function upKey(event) {
          event.preventDefault();

          _this3._onUpKey();
        },
        'downKey': function downKey(event) {
          event.preventDefault();

          _this3._onDownKey();
        },
        'escapeKey': function escapeKey(event) {
          event.preventDefault();

          _this3._onEscapeKey();
        }
      };
    }
  }]);

  _inherits(CradminLoadMoreButton, _React$Component);

  return CradminLoadMoreButton;
}(_react.default.Component);

exports.default = CradminLoadMoreButton;