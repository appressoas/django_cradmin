"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/**
 * Geolocation debug widget.
 *
 * For debugging {@link GeoLocationWidget}.
 */
var GeoLocationDebugWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  function GeoLocationDebugWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, GeoLocationDebugWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeoLocationDebugWidget).call(this, element, widgetInstanceId));

    if (_this.config.signalNameSpace == null) {
      throw Error("signalNameSpace is required!");
    }

    _this._name = "django_cradmin.widgets.GeoLocationDebugWidget.".concat(_this.config.signalNameSpace);
    _this._onGeoLocationUpdate = _this._onGeoLocationUpdate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onGeoLocationPermissionDenied = _this._onGeoLocationPermissionDenied.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onGeoLocationUnavailable = _this._onGeoLocationUnavailable.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onGeoLocationTimeout = _this._onGeoLocationTimeout.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(GeoLocationDebugWidget, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".GeoLocationUpdate"), this._name, this._onGeoLocationUpdate);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".GeoLocationPermissionDenied"), this._name, this._onGeoLocationPermissionDenied);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".GeoLocationUnavailable"), this._name, this._onGeoLocationUnavailable);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".GeoLocationTimeout"), this._name, this._onGeoLocationTimeout);
    }
  }, {
    key: "_onGeoLocationUpdate",
    value: function _onGeoLocationUpdate(receivedSignalInfo) {
      var positionObject = receivedSignalInfo.data;
      this.element.innerHTML = "GeoLocation: ".concat(positionObject.coords.latitude, ", ").concat(positionObject.coords.longitude);
    }
  }, {
    key: "_onGeoLocationPermissionDenied",
    value: function _onGeoLocationPermissionDenied(receivedSignalInfo) {
      this.element.innerHTML = "GeoLocation error: permission denied";
    }
  }, {
    key: "_onGeoLocationUnavailable",
    value: function _onGeoLocationUnavailable(receivedSignalInfo) {
      this.element.innerHTML = "GeoLocation error: unavailable";
    }
  }, {
    key: "_onGeoLocationTimeout",
    value: function _onGeoLocationTimeout(receivedSignalInfo) {
      this.element.innerHTML = "GeoLocation error: timeout";
    }
  }, {
    key: "destroy",
    value: function destroy() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }]);

  _inherits(GeoLocationDebugWidget, _AbstractWidget);

  return GeoLocationDebugWidget;
}(_AbstractWidget2.default);

exports.default = GeoLocationDebugWidget;