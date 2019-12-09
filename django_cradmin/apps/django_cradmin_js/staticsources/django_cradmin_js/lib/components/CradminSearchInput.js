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

var CradminSearchInput =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminSearchInput, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        changeDelay: 250,
        placeholder: 'Search ...',
        className: 'input input--outlined',
        autofocus: false,
        signalNameSpace: null
      };
    }
  }]);

  function CradminSearchInput(props) {
    var _this;

    _classCallCheck(this, CradminSearchInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminSearchInput).call(this, props));
    _this._name = "django_cradmin.components.CradminSearchInput.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminSearchInput');

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onDataListInitializedSignal = _this._onDataListInitializedSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onClearSearchFieldSignal = _this._onClearSearchFieldSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnSearchFieldSignal = _this._onFocusOnSearchFieldSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onMoveItemStartedSignal = _this._onMoveItemStartedSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onMoveItemCompleteSignal = _this._onMoveItemCompleteSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      searchString: '',
      disabled: false
    };

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminSearchInput, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".DataListInitialized"), this._name, this._onDataListInitializedSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".ClearSearchField"), this._name, this._onClearSearchFieldSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnSearchField"), this._name, this._onFocusOnSearchFieldSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".MoveItemStarted"), this._name, this._onMoveItemStartedSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".MoveItemComplete"), this._name, this._onMoveItemCompleteSignal);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_onMoveItemStartedSignal",
    value: function _onMoveItemStartedSignal() {
      this.setState({
        disabled: true
      });
    }
  }, {
    key: "_onMoveItemCompleteSignal",
    value: function _onMoveItemCompleteSignal() {
      this.setState({
        disabled: false
      });
    }
  }, {
    key: "_onDataListInitializedSignal",
    value: function _onDataListInitializedSignal(receivedSignalInfo) {
      this.setState({
        searchString: receivedSignalInfo.data.searchString
      });

      if (this.props.autofocus) {
        this.handleFocus();

        _DomUtilities.default.forceFocus(this._inputDomElement);
      }
    }
  }, {
    key: "_onClearSearchFieldSignal",
    value: function _onClearSearchFieldSignal(receivedSignalInfo) {
      this.setState({
        searchString: ''
      });

      this._sendChangeSignal();
    }
  }, {
    key: "_onFocusOnSearchFieldSignal",
    value: function _onFocusOnSearchFieldSignal(receivedSignalInfo) {
      _DomUtilities.default.forceFocus(this._inputDomElement);
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      var _this2 = this;

      this._cancelInputTimeout();

      var searchString = event.target.value;
      this.setState({
        searchString: searchString
      });
      this._timeoutId = window.setTimeout(function () {
        _this2._sendChangeSignal();
      }, this.props.changeDelay);

      if (searchString.length > 0) {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SearchValueChangeNotEmpty"), this.state.searchString);
      } else {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SearchValueChangeEmpty"), this.state.searchString);
      }
    }
  }, {
    key: "_cancelInputTimeout",
    value: function _cancelInputTimeout() {
      if (this._timeoutId != undefined) {
        window.clearTimeout(this._timeoutId);
      }
    }
  }, {
    key: "_sendChangeSignal",
    value: function _sendChangeSignal() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SearchValueChange"), this.state.searchString);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Focus"));
    }
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Blur"));
    }
  }, {
    key: "_onDownKey",
    value: function _onDownKey() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SearchDownKey"));
    }
  }, {
    key: "_onEnterKey",
    value: function _onEnterKey() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SearchEnterKey"));
    }
  }, {
    key: "_onEscapeKey",
    value: function _onEscapeKey() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SearchEscapeKey"));
    }
  }, {
    key: "renderInputField",
    value: function renderInputField() {
      var _this3 = this;

      return _react.default.createElement("input", {
        type: "search",
        disabled: this.state.disabled,
        ref: function ref(input) {
          _this3._inputDomElement = input;
        },
        placeholder: this.props.placeholder,
        className: this.props.className,
        value: this.state.searchString,
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(_reactHotkeys.HotKeys, {
        keyMap: this.hotKeysMap,
        handlers: this.hotKeysHandlers
      }, this.renderInputField());
    }
  }, {
    key: "hotKeysMap",
    get: function get() {
      return {
        'downKey': ['down'],
        'enterKey': ['enter'],
        'escapeKey': ['escape']
      };
    }
  }, {
    key: "hotKeysHandlers",
    get: function get() {
      var _this4 = this;

      return {
        'downKey': function downKey(event) {
          event.preventDefault();

          _this4._onDownKey();
        },
        'enterKey': function enterKey(event) {
          event.preventDefault();

          _this4._onEnterKey();
        },
        'escapeKey': function escapeKey(event) {
          event.preventDefault();

          _this4._onEscapeKey();
        }
      };
    }
  }]);

  _inherits(CradminSearchInput, _React$Component);

  return CradminSearchInput;
}(_react.default.Component);

exports.default = CradminSearchInput;