"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HttpDjangoJsonRequest = _interopRequireDefault(require("ievv_jsbase/lib/http/HttpDjangoJsonRequest"));

var _typeDetect = _interopRequireDefault(require("ievv_jsbase/lib/utils/typeDetect"));

var _AbstractDataListWidget = _interopRequireDefault(require("./AbstractDataListWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ApiDataListWidget =
/*#__PURE__*/
function (_AbstractDataListWidg) {
  _createClass(ApiDataListWidget, [{
    key: "classPath",
    // getDefaultConfig() {
    //   const defaultConfig = super.getDefaultConfig();
    //   return defaultConfig;
    // }
    get: function get() {
      return 'django_cradmin.widgets.ApiDataListWidget';
    }
  }]);

  function ApiDataListWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, ApiDataListWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ApiDataListWidget).call(this, element, widgetInstanceId));

    if (!_this.config.apiUrl) {
      throw new Error('apiUrl is a required config.');
    }

    return _this;
  }

  _createClass(ApiDataListWidget, [{
    key: "requestItemData",
    value: function requestItemData(key) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var url = _this2.config.apiUrl;

        if (!_this2.config.apiUrl.endsWith('/')) {
          url = "".concat(url, "/");
        }

        url = "".concat(url).concat(key);
        var request = new _HttpDjangoJsonRequest.default(url);
        request.get().then(function (response) {
          resolve(response.bodydata);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "addFiltersToQueryString",
    value: function addFiltersToQueryString(filtersMap, queryString) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = filtersMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              filterKey = _step$value[0],
              filterValue = _step$value[1];

          var filterValueType = (0, _typeDetect.default)(filterValue);

          if (filterValueType == 'string') {
            queryString.set(filterKey, filterValue);
          } else if (filterValueType == 'number') {
            queryString.set(filterKey, filterValue.toString());
          } else if (filterValueType == 'array' || filterValueType == 'set') {
            var values = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = filterValue[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var value = _step2.value;
                values.push("".concat(value));
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

            queryString.setIterable(filterKey, values);
          } else if (filterValueType == 'boolean') {
            if (filterValue) {
              queryString.set(filterKey, 'true');
            } else {
              queryString.set(filterKey, 'false');
            }
          } else if (filterValueType == 'null' || filterValueType == 'undefined') {// Do nothing
          } else {
            throw new Error("Invalid filter value type for filterKey \"".concat(filterKey, "\". ") + "Type ".concat(filterValueType, " is not supported."));
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
    }
  }, {
    key: "requestDataList",
    value: function requestDataList(options) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var url = _this3.config.apiUrl;

        if (options.next) {
          url = _this3.state.data.next;
        } else if (options.previous) {
          url = _this3.state.data.previous;
        }

        var request = new _HttpDjangoJsonRequest.default(url);
        request.urlParser.queryString.set('search', options.searchString);

        _this3.addFiltersToQueryString(options.filtersMap, request.urlParser.queryString);

        if (_this3.logger.isDebug) {
          _this3.logger.debug('Requesting data list from API:', request.urlParser.buildUrl());
        }

        request.get().then(function (response) {
          resolve(response.bodydata);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "moveItem",
    value: function moveItem(movingItemKey, moveBeforeItemKey) {
      var _this4 = this;

      if (!this.config.moveApiUrl) {
        throw new Error('Move support requires the moveApiUrl config.');
      }

      return new Promise(function (resolve, reject) {
        var url = _this4.config.moveApiUrl;
        var request = new _HttpDjangoJsonRequest.default(url);
        var requestData = {
          moving_object_id: movingItemKey,
          move_before_object_id: moveBeforeItemKey
        };

        if (_this4.logger.isDebug) {
          _this4.logger.debug("Requesting move with a HTTP POST request to ".concat(url, " with the following request data:"), requestData);
        }

        request.post(requestData).then(function (response) {
          resolve(response.bodydata);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }]);

  _inherits(ApiDataListWidget, _AbstractDataListWidg);

  return ApiDataListWidget;
}(_AbstractDataListWidget.default);

exports.default = ApiDataListWidget;