"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHotkeys = require("react-hotkeys");

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

var CradminFilterCheckbox =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminFilterCheckbox, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        label: '',
        filterKey: null,
        initialValue: false,
        checkedLabel: '',
        uncheckedLabel: '',
        className: 'checkbox  checkbox--block',
        indicatorClassName: 'checkbox__control-indicator',
        signalNameSpace: null
      };
    }
  }]);

  function CradminFilterCheckbox(props) {
    var _this;

    _classCallCheck(this, CradminFilterCheckbox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminFilterCheckbox).call(this, props));
    _this._name = "django_cradmin.components.CradminFilterCheckbox.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminFilterCheckbox');

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    if (_this.props.filterKey == null) {
      throw new Error('The filterKey prop is required.');
    }

    _this._onDataListInitializedSignal = _this._onDataListInitializedSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onChange = _this._onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFiltersChangeSignal = _this._onFiltersChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocus = _this._onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onBlur = _this._onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      value: _this.props.initialValue
    };

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminFilterCheckbox, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".DataListInitialized"), this._name, this._onDataListInitializedSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FiltersChange"), this._name, this._onFiltersChangeSignal);
    }
  }, {
    key: "_setValueFromFiltersMap",
    value: function _setValueFromFiltersMap(filtersMap) {
      var newValue = filtersMap.get(this.props.filterKey);

      if (newValue == undefined) {
        newValue = false;
      }

      if (newValue != this.state.value) {
        this.setState({
          value: newValue
        });
      }
    }
  }, {
    key: "_onDataListInitializedSignal",
    value: function _onDataListInitializedSignal(receivedSignalInfo) {
      var state = receivedSignalInfo.data;

      this._setValueFromFiltersMap(state.filtersMap);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_onChange",
    value: function _onChange(event) {
      event.preventDefault();
      var filtersMapPatch = new Map();
      filtersMapPatch.set(this.props.filterKey, !this.state.value);
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".PatchFilters"), filtersMapPatch);
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
    key: "_onFiltersChangeSignal",
    value: function _onFiltersChangeSignal(receivedSignalInfo) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      var filtersMap = receivedSignalInfo.data;

      this._setValueFromFiltersMap(filtersMap);
    }
  }, {
    key: "renderLabel",
    value: function renderLabel() {
      return this.props.label;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("label", {
        className: this.props.className
      }, _react.default.createElement("input", {
        type: "checkbox",
        checked: this.state.value,
        onChange: this._onChange,
        onFocus: this._onFocus,
        onBlur: this._onBlur
      }), _react.default.createElement("span", {
        className: this.props.indicatorClassName
      }), this.renderLabel());
    }
  }]);

  _inherits(CradminFilterCheckbox, _React$Component);

  return CradminFilterCheckbox;
}(_react.default.Component);

exports.default = CradminFilterCheckbox;