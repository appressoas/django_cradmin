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

var GeoLocationFilterWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  function GeoLocationFilterWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, GeoLocationFilterWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GeoLocationFilterWidget).call(this, element, widgetInstanceId));
    _this._name = "django_cradmin.widgets.GeoLocationFilterWidget.".concat(_this.config.signalNameSpace);
    _this._onGeoLocationUpdate = _this._onGeoLocationUpdate.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(GeoLocationFilterWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        signalNameSpace: null,
        latitudeFilterKey: "latitude",
        longitudeFilterKey: "longitude"
      };
    }
  }, {
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".GeoLocationUpdate"), this._name, this._onGeoLocationUpdate);
    }
  }, {
    key: "_onGeoLocationUpdate",
    value: function _onGeoLocationUpdate(receivedSignalInfo) {
      var positionObject = receivedSignalInfo.data;
      var filtersMapPatch = new Map();
      filtersMapPatch.set(this.config.latitudeFilterKey, positionObject.coords.latitude);
      filtersMapPatch.set(this.config.longitudeFilterKey, positionObject.coords.longitude);
      new _SignalHandlerSingleton.default().send("".concat(this.config.signalNameSpace, ".PatchFilters"), filtersMapPatch);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }]);

  _inherits(GeoLocationFilterWidget, _AbstractWidget);

  return GeoLocationFilterWidget;
}(_AbstractWidget2.default);

exports.default = GeoLocationFilterWidget;