"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractDataListWidget = _interopRequireDefault(require("./AbstractDataListWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var StaticDataListWidget =
/*#__PURE__*/
function (_AbstractDataListWidg) {
  function StaticDataListWidget() {
    _classCallCheck(this, StaticDataListWidget);

    return _possibleConstructorReturn(this, _getPrototypeOf(StaticDataListWidget).apply(this, arguments));
  }

  _createClass(StaticDataListWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      var defaultConfig = _get(_getPrototypeOf(StaticDataListWidget.prototype), "getDefaultConfig", this).call(this);

      defaultConfig.searchAttributes = ['title', 'description'];
      defaultConfig.dataList = [];
      return defaultConfig;
    }
  }, {
    key: "_isClientSideSearchMatch",
    // constructor(element, widgetInstanceId) {
    //   super(element, widgetInstanceId);
    // }
    value: function _isClientSideSearchMatch(searchString, itemData) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.config.searchAttributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var attribute = _step.value;

          if (itemData[attribute] != undefined && itemData[attribute] != null) {
            if (itemData[attribute].toLowerCase().indexOf(searchString) != -1) {
              return true;
            }
          }
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

      return false;
    }
  }, {
    key: "requestItemData",
    value: function requestItemData(key) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this.config.dataList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var itemData = _step2.value;

            if (_this._getKeyFromItemData(itemData) == key) {
              resolve(itemData);
            }
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

        reject(new Error("dataList does not contain an " + "object with ".concat(_this.config.keyAttribute, " = \"").concat(key, "\"")));
      });
    }
  }, {
    key: "requestDataList",
    value: function requestDataList(options) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var resultItemsArray = [];
        var searchString = options.searchString.toLowerCase();
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _this2.config.dataList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var itemData = _step3.value;

            if (_this2._isClientSideSearchMatch(searchString, itemData)) {
              resultItemsArray.push(itemData);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        resolve({
          count: resultItemsArray.length,
          results: resultItemsArray
        });
      });
    }
  }, {
    key: "classPath",
    get: function get() {
      return 'django_cradmin.widgets.StaticDataListWidget';
    }
  }]);

  _inherits(StaticDataListWidget, _AbstractDataListWidg);

  return StaticDataListWidget;
}(_AbstractDataListWidget.default);

exports.default = StaticDataListWidget;