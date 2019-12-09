"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

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

var PopUpWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(PopUpWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        signalNameSpace: null
      };
    }
  }]);

  function PopUpWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, PopUpWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PopUpWidget).call(this, element, widgetInstanceId));
    _this._widgetInstanceId = widgetInstanceId;
    _this._name = "django_cradmin.widgets.PopUpWidget.".concat(widgetInstanceId);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.widgets.PopUpWidget');

    if (_this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }

    _this._onShowPopupSignal = _this._onShowPopupSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onHidePopupSignal = _this._onHidePopupSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._signalHandler = new _SignalHandlerSingleton.default();

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(PopUpWidget, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      this._signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".ShowPopup"), this._name, this._onShowPopupSignal);

      this._signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".HidePopup"), this._name, this._onHidePopupSignal);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._signalHandler.removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_onShowPopupSignal",
    value: function _onShowPopupSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      _DomUtilities.default.show(this.element);

      document.body.classList.add('fill-view-height');
    }
  }, {
    key: "_onHidePopupSignal",
    value: function _onHidePopupSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      _DomUtilities.default.hide(this.element);

      document.body.classList.remove('fill-view-height');
    }
  }]);

  _inherits(PopUpWidget, _AbstractWidget);

  return PopUpWidget;
}(_AbstractWidget2.default);

exports.default = PopUpWidget;