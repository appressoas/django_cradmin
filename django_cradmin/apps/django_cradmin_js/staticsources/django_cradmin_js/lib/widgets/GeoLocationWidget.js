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
 * Geolocation widget.
 */
var GeoLocationWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  function GeoLocationWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, GeoLocationWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeoLocationWidget).call(this, element, widgetInstanceId));
    _this.locationSuccess = _this.locationSuccess.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.locationError = _this.locationError.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    if (_this.config.signalNameSpace == null) {
      throw Error("signalNameSpace is required!");
    }

    if (navigator && navigator.geolocation) {
      _this.getLocation();
    } else {
      _this.handleBrowserWithoutGeolocationSupport();
    }

    return _this;
  }

  _createClass(GeoLocationWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        enableHighAccuracy: true,
        watchLocation: true,
        signalNameSpace: null
      };
    }
  }, {
    key: "locationSuccess",
    value: function locationSuccess(position) {
      new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".GeoLocationUpdate"), position);
    }
  }, {
    key: "locationError",
    value: function locationError(error) {
      if (error.code == 1) {
        // 1 = PERMISSION_DENIED
        new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".GeoLocationPermissionDenied"));
      } else if (error.code == 2) {
        // 2 = POSITION_UNAVAILABLE
        new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".GeoLocationUnavailable"));
      } else if (error.code == 3) {
        // 3 = TIMEOUT
        new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".GeoLocationTimeout"));
      }

      new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".GeoLocationError"), error);
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      var options = {
        enableHighAccuracy: this.config.enableHighAccuracy
      };

      if (this.config.watchLocation) {
        this.watchPositionId = navigator.geolocation.watchPosition(this.locationSuccess, this.locationError, options);
      } else {
        navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, options);
      }
    }
  }, {
    key: "handleBrowserWithoutGeolocationSupport",
    value: function handleBrowserWithoutGeolocationSupport() {
      new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".GeoLocationNotSupported"));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.watchPositionId != undefined) {
        navigator.geolocation.clearWatch(this.watchPositionId);
      }
    }
  }]);

  _inherits(GeoLocationWidget, _AbstractWidget);

  return GeoLocationWidget;
}(_AbstractWidget2.default);

exports.default = GeoLocationWidget;