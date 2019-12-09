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

var SignalRouterWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(SignalRouterWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        signalNameSpace: null,
        signalMap: {// - SearchDownKey
          // - FocusBeforeFirstSelectableItem
          // - FocusAfterLastSelectableItem
        }
      };
    }
  }]);

  function SignalRouterWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, SignalRouterWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SignalRouterWidget).call(this, element, widgetInstanceId));
    _this._widgetInstanceId = widgetInstanceId;
    _this._name = "django_cradmin.widgets.SignalRouterWidget.".concat(widgetInstanceId);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.widgets.SignalRouterWidget');

    if (_this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }

    _this.signalMap = new Map();

    var _arr = Object.keys(_this.config.signalMap);

    for (var _i = 0; _i < _arr.length; _i++) {
      var key = _arr[_i];

      _this.signalMap.set("".concat(_this.config.signalNameSpace, ".").concat(key), _this.config.signalMap[key]);
    }

    _this._onRouteSignal = _this._onRouteSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._signalHandler = new _SignalHandlerSingleton.default();

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(SignalRouterWidget, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.signalMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var signalName = _step.value;

          this._signalHandler.addReceiver(signalName, this._name, this._onRouteSignal);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._signalHandler.removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_onRouteSignal",
    value: function _onRouteSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data, 'Sending:', this.signalMap.get(receivedSignalInfo.signalName));
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.signalMap.get(receivedSignalInfo.signalName)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var signalName = _step2.value;

          this._signalHandler.send("".concat(this.config.signalNameSpace, ".").concat(signalName));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  _inherits(SignalRouterWidget, _AbstractWidget);

  return SignalRouterWidget;
}(_AbstractWidget2.default);

exports.default = SignalRouterWidget;