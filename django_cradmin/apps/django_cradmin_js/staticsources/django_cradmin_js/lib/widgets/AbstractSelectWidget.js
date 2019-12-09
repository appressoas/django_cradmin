"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

var _HttpDjangoJsonRequest = _interopRequireDefault(require("ievv_jsbase/lib/http/HttpDjangoJsonRequest"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

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

var AbstractSelectWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  function AbstractSelectWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, AbstractSelectWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractSelectWidget).call(this, element, widgetInstanceId));
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.widgets.AbstractSelectWidget');
    _this.onSelectResultSignal = _this.onSelectResultSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onSearchRequestedSignal = _this.onSearchRequestedSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._uniquePrefix = "django_cradmin.Select.".concat(_this.widgetInstanceId);
    _this._searchRequestedSignalName = "".concat(_this._uniquePrefix, ".SearchRequested");
    _this._searchCompletedSignalName = "".concat(_this._uniquePrefix, ".SearchCompleted");
    _this._selectResultSignalName = "".concat(_this._uniquePrefix, ".SelectResult");
    _this.initialValue = _this._getInitialValue();
    _this.selectedValue = _this.initialValue;

    _this.logger.debug("initialValue: \"".concat(_this.initialValue, "\""));

    _this._initializeSignalHandlers();

    if (_this.initialValue != null) {
      _this._loadPreviewForInitialValue();
    } else {
      _this._updateUiForEmptyValue();
    }

    return _this;
  }

  _createClass(AbstractSelectWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        valueAttribute: 'id',
        fetchEmptySearchOnLoad: false,
        toggleElementsOnValueChange: {
          loading: [],
          hasValue: [],
          noValue: []
        },
        updateInnerHtmlWithResult: {},
        clientsideSearch: {},
        searchApi: {
          url: null,
          staticData: {}
        },
        componentProps: {
          search: {},
          resultList: {},
          result: {}
        }
      };
    }
  }, {
    key: "_getInitialValue",
    value: function _getInitialValue() {
      var initialValue = null;

      if (this.config.valueTargetInputId) {
        initialValue = document.getElementById(this.config.valueTargetInputId).value;
      } else if (this.config.initialValue) {
        initialValue = this.config.initialValue;
      }

      if (initialValue == undefined || initialValue == '') {
        initialValue = null;
      }

      return initialValue;
    }
  }, {
    key: "_initializeSignalHandlers",
    value: function _initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver(this._searchRequestedSignalName, 'django_cradmin.widgets.AbstractSelectWidget', this.onSearchRequestedSignal);
      new _SignalHandlerSingleton.default().addReceiver(this._selectResultSignalName, 'django_cradmin.widgets.AbstractSelectWidget', this.onSelectResultSignal);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.element.removeEventListener('click', this._onClick);
      new _SignalHandlerSingleton.default().removeReceiver(this._searchRequestedSignalName, 'django_cradmin.widgets.AbstractSelectWidget');
      new _SignalHandlerSingleton.default().removeReceiver(this._selectResultSignalName, 'django_cradmin.widgets.AbstractSelectWidget');

      if (this._reactWrapperElement) {
        _reactDom.default.unmountComponentAtNode(this._reactWrapperElement);

        this._reactWrapperElement.remove();
      }
    }
  }, {
    key: "_setValueTargetValue",
    value: function _setValueTargetValue(value) {
      if (this.config.valueTargetInputId) {
        document.getElementById(this.config.valueTargetInputId).value = value;
      }
    }
  }, {
    key: "_hideElementById",
    value: function _hideElementById(domId) {
      var element = document.getElementById(domId);

      if (element) {
        element.setAttribute('style', 'display: none');
      }
    }
  }, {
    key: "_showElementById",
    value: function _showElementById(domId) {
      var element = document.getElementById(domId);

      if (element) {
        element.setAttribute('style', 'display: block');
      }
    }
  }, {
    key: "_hideElementsById",
    value: function _hideElementsById(domIdArray) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = domIdArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var domId = _step.value;

          this._hideElementById(domId);
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
    key: "_showElementsById",
    value: function _showElementsById(domIdArray) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = domIdArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var domId = _step2.value;

          this._showElementById(domId);
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
  }, {
    key: "_updatePreviews",
    value: function _updatePreviews(resultObject) {
      var _arr = Object.keys(this.config.updateInnerHtmlWithResult);

      for (var _i = 0; _i < _arr.length; _i++) {
        var attribute = _arr[_i];
        var domIds = this.config.updateInnerHtmlWithResult[attribute];
        var value = resultObject[attribute];

        if (value != undefined && value != null) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = domIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var domId = _step3.value;
              var element = document.getElementById(domId);

              if (element) {
                element.innerHTML = value;
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
        }
      }
    }
  }, {
    key: "_getValueFromResultObject",
    value: function _getValueFromResultObject(resultObject) {
      return resultObject[this.config.valueAttribute];
    }
  }, {
    key: "_setLoading",
    value: function _setLoading() {
      this._hideElementsById(this.config.toggleElementsOnValueChange.hasValue);

      this._hideElementsById(this.config.toggleElementsOnValueChange.noValue);

      this._showElementsById(this.config.toggleElementsOnValueChange.loading);
    }
  }, {
    key: "_updateUiForEmptyValue",
    value: function _updateUiForEmptyValue() {
      this.selectedValue = null;

      this._hideElementsById(this.config.toggleElementsOnValueChange.hasValue);

      this._hideElementsById(this.config.toggleElementsOnValueChange.loading);

      this._showElementsById(this.config.toggleElementsOnValueChange.noValue);

      this._setValueTargetValue('');
    }
  }, {
    key: "_updateUiFromResultObject",
    value: function _updateUiFromResultObject(resultObject) {
      var value = this._getValueFromResultObject(resultObject);

      this.selectedValue = value;

      this._hideElementsById(this.config.toggleElementsOnValueChange.noValue);

      this._hideElementsById(this.config.toggleElementsOnValueChange.loading);

      this._showElementsById(this.config.toggleElementsOnValueChange.hasValue);

      this._setValueTargetValue(value);

      this._updatePreviews(resultObject);
    }
  }, {
    key: "onSelectResultSignal",
    value: function onSelectResultSignal(receivedSignalInfo) {
      this.logger.debug(receivedSignalInfo.toString());
      var resultObject = receivedSignalInfo.data;

      if (resultObject == null) {
        this._updateUiForEmptyValue();
      } else {
        this._updateUiFromResultObject(resultObject);
      }
    }
  }, {
    key: "_useServerSideSearch",
    value: function _useServerSideSearch() {
      return this.config.searchApi.url != undefined && this.config.searchApi.url != null;
    }
  }, {
    key: "onSearchRequestedSignal",
    value: function onSearchRequestedSignal(receivedSignalInfo) {
      var _this2 = this;

      this.logger.debug(receivedSignalInfo.toString());
      var searchString = receivedSignalInfo.data;
      this.requestSearchResults(searchString).then(function (results) {
        _this2.sendSearchCompletedSignal(results);
      }).catch(function (error) {
        throw error;
      });
    }
  }, {
    key: "sendSearchCompletedSignal",
    value: function sendSearchCompletedSignal(results) {
      this.logger.debug('Search complete. Result:', results);
      new _SignalHandlerSingleton.default().send(this._searchCompletedSignalName, results);
    }
  }, {
    key: "_isClientSideSearchMatch",
    value: function _isClientSideSearchMatch(searchString, resultObject) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.config.clientsideSearch.searchAttributes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var attribute = _step4.value;

          if (resultObject[attribute] != undefined && resultObject[attribute] != null) {
            if (resultObject[attribute].toLowerCase().indexOf(searchString) != -1) {
              return true;
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: "_requestClientSideSearchResults",
    value: function _requestClientSideSearchResults(searchString) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var resultObjectArray = [];
        searchString = searchString.toLowerCase();
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = _this3.config.clientsideSearch.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var resultObject = _step5.value;

            if (_this3._isClientSideSearchMatch(searchString, resultObject)) {
              resultObjectArray.push(resultObject);
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        resolve({
          count: resultObjectArray.size,
          results: resultObjectArray
        });
      });
    }
  }, {
    key: "_requestServerSideSearchResults",
    value: function _requestServerSideSearchResults(searchString) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var request = new _HttpDjangoJsonRequest.default(_this4.config.searchApi.url);

        var _arr2 = Object.keys(_this4.config.searchApi.staticData);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var attribute = _arr2[_i2];
          request.urlParser.queryString.set(attribute, _this4.config.searchApi.staticData[attribute]);
        }

        request.urlParser.queryString.set('search', searchString);
        request.get().then(function (response) {
          resolve(response.bodydata);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "requestSearchResults",
    value: function requestSearchResults() {
      var searchString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (this._useServerSideSearch()) {
        return this._requestServerSideSearchResults(searchString);
      } else {
        return this._requestClientSideSearchResults(searchString);
      }
    }
  }, {
    key: "_requestSingleResultServerSide",
    value: function _requestSingleResultServerSide(value) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var url = _this5.config.searchApi.url;

        if (!_this5.config.searchApi.url.endsWith('/')) {
          url = "".concat(url, "/");
        }

        url = "".concat(url).concat(value);
        var request = new _HttpDjangoJsonRequest.default(url);
        request.get().then(function (response) {
          resolve(response.bodydata);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "_requestSingleResultClientSide",
    value: function _requestSingleResultClientSide(value) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = _this6.config.clientsideSearch.data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var resultObject = _step6.value;

            if (_this6._getValueFromResultObject(resultObject) == value) {
              resolve(resultObject);
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        reject(new Error("config.clientsideSearch.data does not contain an " + "object with ".concat(_this6.config.valueAttribute, " = \"").concat(value, "\"")));
      });
    }
  }, {
    key: "_requestSingleResult",
    value: function _requestSingleResult(value) {
      if (this._useServerSideSearch()) {
        return this._requestSingleResultServerSide(value);
      } else {
        return this._requestSingleResultClientSide(value);
      }
    }
  }, {
    key: "_loadPreviewForInitialValue",
    value: function _loadPreviewForInitialValue() {
      var _this7 = this;

      this._setLoading();

      this._requestSingleResult(this.initialValue).then(function (resultObject) {
        _this7.logger.debug("Loaded data for initialValue (\"".concat(_this7.initialValue, "\"):"), resultObject);

        _this7._updateUiFromResultObject(resultObject);
      }).catch(function (error) {
        _this7.logger.error("Failed to load data for initialValue: \"".concat(_this7.initialValue, "\". ") + "Error details: ".concat(error.toString()));
      });
    }
  }, {
    key: "addReactWrapperElementToDocument",
    value: function addReactWrapperElementToDocument(reactWrapperElement) {
      this.element.parentNode.insertBefore(reactWrapperElement, this.element.nextSibling);
    }
  }, {
    key: "initializeReactComponent",
    value: function initializeReactComponent() {
      var _this8 = this;

      this._reactWrapperElement = document.createElement('div');
      this.addReactWrapperElementToDocument(this._reactWrapperElement);
      var reactElement = this.makeReactElement();

      _reactDom.default.render(reactElement, this._reactWrapperElement);

      if (this.config.fetchEmptySearchOnLoad) {
        this.requestSearchResults().then(function (results) {
          _this8.sendSearchCompletedSignal(results);
        }).catch(function (error) {
          throw error;
        });
      }
    }
  }, {
    key: "makeReactComponentProps",
    value: function makeReactComponentProps() {
      return {
        closeCallback: this._onClose,
        selectResultSignalName: this._selectResultSignalName,
        searchCompletedSignalName: this._searchCompletedSignalName,
        searchRequestedSignalName: this._searchRequestedSignalName,
        valueAttribute: this.config.valueAttribute,
        searchComponentProps: this.config.componentProps.search,
        resultListComponentProps: this.config.componentProps.resultList,
        resultComponentProps: this.config.componentProps.result,
        selectedValue: this.selectedValue
      };
    }
  }, {
    key: "makeReactElement",
    value: function makeReactElement() {
      throw new Error('You must override makeReactElement()');
    }
  }]);

  _inherits(AbstractSelectWidget, _AbstractWidget);

  return AbstractSelectWidget;
}(_AbstractWidget2.default);

exports.default = AbstractSelectWidget;