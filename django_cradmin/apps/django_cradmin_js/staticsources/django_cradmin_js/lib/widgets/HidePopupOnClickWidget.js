"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

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

var HidePopupOnClickWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(HidePopupOnClickWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        signalNameSpace: null
      };
    }
  }]);

  function HidePopupOnClickWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, HidePopupOnClickWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HidePopupOnClickWidget).call(this, element, widgetInstanceId));
    _this._widgetInstanceId = widgetInstanceId;
    _this._name = "django_cradmin.widgets.HidePopupOnClickWidget.".concat(widgetInstanceId);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.widgets.HidePopupOnClickWidget');

    if (_this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }

    _this._onClick = _this._onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.element.addEventListener('click', _this._onClick);

    return _this;
  }

  _createClass(HidePopupOnClickWidget, [{
    key: "destroy",
    value: function destroy() {
      this.element.removeEventListener('click', this._onClick);
    }
  }, {
    key: "_onClick",
    value: function _onClick(event) {
      event.preventDefault();
      new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".HidePopup"));
    }
  }]);

  _inherits(HidePopupOnClickWidget, _AbstractWidget);

  return HidePopupOnClickWidget;
}(_AbstractWidget2.default);

exports.default = HidePopupOnClickWidget;