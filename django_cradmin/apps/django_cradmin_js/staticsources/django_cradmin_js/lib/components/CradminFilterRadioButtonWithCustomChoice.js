"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _CradminFilterRadioButton = _interopRequireDefault(require("./CradminFilterRadioButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var CradminFilterRadioButtonWithCustomChoice =
/*#__PURE__*/
function (_CradminFilterRadioBu) {
  _createClass(CradminFilterRadioButtonWithCustomChoice, null, [{
    key: "defaultProps",
    get: function get() {
      var superProps = _get(_getPrototypeOf(CradminFilterRadioButtonWithCustomChoice), "defaultProps", this);

      var props = {
        customInputChangeDelay: 250,
        customInputExtraProps: {},
        customInputType: "text",
        customInputPlaceHolder: "",
        customInputLabelClassName: "label",
        customInputClassName: "input input--inline-xxsmall",
        customInputLabel: null,
        customInputSuffix: "",
        customInputPrefix: ""
      };
      return Object.assign({}, superProps, props);
    }
  }]);

  function CradminFilterRadioButtonWithCustomChoice(props) {
    var _this;

    _classCallCheck(this, CradminFilterRadioButtonWithCustomChoice);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminFilterRadioButtonWithCustomChoice).call(this, props));
    _this._name = "django_cradmin.components.CradminFilterRadioButtonWithCustomChoice.".concat(_this.props.signalNameSpace);
    _this._onCustomInputChange = _this._onCustomInputChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(CradminFilterRadioButtonWithCustomChoice, [{
    key: "_validateProps",
    value: function _validateProps() {
      _get(_getPrototypeOf(CradminFilterRadioButtonWithCustomChoice.prototype), "_validateProps", this).call(this);

      if (this.props.customInputLabel == null) {
        throw Error("customInputLabel is a required property!");
      }
    }
  }, {
    key: "_onCustomInputChange",
    value: function _onCustomInputChange(event) {
      var _this2 = this;

      this._cancelInputTimeout();

      this.setState({
        selectedValue: event.target.value
      });
      this.changeToValue = event.target.value;
      this._customInputTimeoutId = window.setTimeout(function () {
        _this2._sendChangeSignal();
      }, this.props.customInputTimeoutDelay);
    }
  }, {
    key: "_cancelInputTimeout",
    value: function _cancelInputTimeout() {
      if (this._customInputTimeoutId != undefined) {
        window.clearTimeout(this._customInputTimeoutId);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.props.wrapperClassName
      }, this.getRenderOptions(), _react.default.createElement("label", {
        className: this.props.customInputLabelClassName
      }, this.props.customInputLabel, _react.default.createElement("input", {
        type: this.props.customInputType,
        className: this.props.customInputClassName,
        placeholder: this.props.customInputPlaceHolder,
        onChange: this._onCustomInputChange,
        onBlur: this._onBlur,
        onFocus: this._onFocus,
        value: this.state.selectedValue
      })));
    }
  }]);

  _inherits(CradminFilterRadioButtonWithCustomChoice, _CradminFilterRadioBu);

  return CradminFilterRadioButtonWithCustomChoice;
}(_CradminFilterRadioButton.default);

exports.default = CradminFilterRadioButtonWithCustomChoice;