"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

var _makeCustomError = _interopRequireDefault(require("ievv_jsbase/lib/makeCustomError"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

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

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var CancelledDataRequest = (0, _makeCustomError.default)('CancelledDataRequest');

var AbstractDataListWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(AbstractDataListWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        signalNameSpace: null,
        keyAttribute: 'id',
        multiselect: false,
        selectedKeys: [],
        minimumSearchStringLength: 0,
        initialSearchString: '',
        filters: {}
      };
    }
  }]);

  function AbstractDataListWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, AbstractDataListWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractDataListWidget).call(this, element, widgetInstanceId));
    _this._name = "".concat(_this.classPath, ".").concat(widgetInstanceId);
    _this.logger = new _LoggerSingleton.default().getLogger(_this._name);
    _this.signalHandler = new _SignalHandlerSingleton.default();
    _this._onSearchValueChangeSignal = _this._onSearchValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onSetFiltersSignal = _this._onSetFiltersSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onPatchFiltersSignal = _this._onPatchFiltersSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onSelectItemSignal = _this._onSelectItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onDeSelectItemSignal = _this._onDeSelectItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onMoveItemSignal = _this._onMoveItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusSignal = _this._onFocusSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onBlurSignal = _this._onBlurSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onLoadMoreSignal = _this._onLoadMoreSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onLoadNextPageSignal = _this._onLoadNextPageSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onLoadPreviousPageSignal = _this._onLoadPreviousPageSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._dataRequestId = 0;
    _this._isLoadingDataList = false;

    if (_this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }

    _this.state = null;
    _this.signalHandlersInitialized = false;
    return _this;
  }

  _createClass(AbstractDataListWidget, [{
    key: "_objectToMap",
    value: function _objectToMap(object) {
      var map = new Map();

      var _arr = Object.keys(object);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];
        map.set(key, object[key]);
      }

      return map;
    }
  }, {
    key: "_initialize",
    value: function _initialize(state) {
      this._initializeSignalHandlers();

      this.signalHandlersInitialized = true;
      this.state = Object.assign({}, {
        data: {
          count: 0,
          next: null,
          previous: null,
          results: []
        },
        selectedItemsMap: new Map(),
        searchString: '',
        filtersMap: this._objectToMap(this.config.filters),
        focus: false,
        loading: false
      }, state);

      this._sendDataListInitializedSignal();

      this.setState(state, true);
    }
  }, {
    key: "_makeItemMapFromArray",
    value: function _makeItemMapFromArray(itemDataArray) {
      var itemMap = new Map();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = itemDataArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var itemData = _step.value;
          itemMap.set(this._getKeyFromItemData(itemData), itemData);
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

      return itemMap;
    }
  }, {
    key: "_requestItemDataForKeys",
    value: function _requestItemDataForKeys(keys) {
      var promises = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          promises.push(this.requestItemData(key));
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

      return Promise.all(promises);
    }
  }, {
    key: "_loadInitialState",
    value: function _loadInitialState() {
      var _this2 = this;

      var state = {
        searchString: this.config.initialSearchString
      };

      this._requestItemDataForKeys(this.config.selectedKeys).then(function (selectedItemsArray) {
        state.setSelectedItems = selectedItemsArray;

        _this2._initialize(state);
      }).catch(function (error) {
        _this2.logger.error('Failed to load config.selectedKeys:', _this2.config.selectedKeys, '. Error:', error.toString());

        _this2._initialize(state);
      });
    }
  }, {
    key: "useAfterInitializeAllWidgets",
    value: function useAfterInitializeAllWidgets() {
      return true;
    }
  }, {
    key: "afterInitializeAllWidgets",
    value: function afterInitializeAllWidgets() {
      this._loadInitialState();
    }
  }, {
    key: "_initializeSignalHandlers",
    value: function _initializeSignalHandlers() {
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".SearchValueChange"), this._name, this._onSearchValueChangeSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".SetFilters"), this._name, this._onSetFiltersSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".PatchFilters"), this._name, this._onPatchFiltersSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".SelectItem"), this._name, this._onSelectItemSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".DeSelectItem"), this._name, this._onDeSelectItemSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".MoveItem"), this._name, this._onMoveItemSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".Focus"), this._name, this._onFocusSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".Blur"), this._name, this._onBlurSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".LoadMore"), this._name, this._onLoadMoreSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".LoadNextPage"), this._name, this._onLoadNextPageSignal);
      this.signalHandler.addReceiver("".concat(this.config.signalNameSpace, ".LoadPreviousPage"), this._name, this._onLoadPreviousPageSignal);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.signalHandlersInitialized) {
        this.signalHandler.removeAllSignalsFromReceiver(this._name);
      }
    }
  }, {
    key: "_updateSearchStringStateChange",
    value: function _updateSearchStringStateChange(stateChange, stateChangesSet) {
      if (stateChange.searchString != undefined) {
        this.state.searchString = stateChange.searchString;

        if (stateChange.searchString.length >= this.config.minimumSearchStringLength) {
          stateChangesSet.add('searchString');
        } else {
          stateChange.data = {
            count: 0,
            next: null,
            previous: null,
            results: []
          };
        }
      }
    }
  }, {
    key: "_updateFiltersStateChange",
    value: function _updateFiltersStateChange(stateChange, stateChangesSet) {
      if (stateChange.filtersMap != undefined) {
        this.state.filtersMap = stateChange.filtersMap;
        stateChangesSet.add('filters');
      }

      if (stateChange.filtersMapPatch != undefined) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = stateChange.filtersMapPatch[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                filterKey = _step3$value[0],
                filterValue = _step3$value[1];

            this.state.filtersMap.set(filterKey, filterValue);
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

        stateChangesSet.add('filters');
      }
    }
  }, {
    key: "_updateDataStateChange",
    value: function _updateDataStateChange(stateChange, stateChangesSet) {
      if (stateChange.data != undefined) {
        this.state.data = stateChange.data;
        stateChangesSet.add('data');
      } else if (stateChange.appendData != undefined) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = stateChange.appendData.results[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var itemData = _step4.value;
            this.state.data.results.push(itemData);
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

        this.state.data.count = stateChange.appendData.count;
        this.state.data.next = stateChange.appendData.next;
        this.state.data.previous = stateChange.appendData.previous;
        stateChangesSet.add('data');
      }
    }
  }, {
    key: "_updateSelectionStateChange",
    value: function _updateSelectionStateChange(stateChange, stateChangesSet) {
      if (stateChange.addSelectedItem != undefined) {
        if (!this.config.multiselect) {
          this.state.selectedItemsMap.clear();
        }

        this.state.selectedItemsMap.set(this._getKeyFromItemData(stateChange.addSelectedItem), stateChange.addSelectedItem);
        stateChangesSet.add('selection');
      }

      if (stateChange.removeSelectedItem != undefined) {
        if (this.config.multiselect) {
          this.state.selectedItemsMap.delete(this._getKeyFromItemData(stateChange.removeSelectedItem));
        } else {
          this.state.selectedItemsMap.clear();
        }

        stateChangesSet.add('selection');
      }

      if (stateChange.clearSelectedKeys != undefined) {
        this.state.selectedItemsMap.clear();
        stateChangesSet.add('selection');
      }

      if (stateChange.setSelectedItems != undefined) {
        this.state.selectedItemsMap = this._makeItemMapFromArray(stateChange.setSelectedItems);
        stateChangesSet.add('selection');
      }
    }
  }, {
    key: "_updateFocusStateChange",
    value: function _updateFocusStateChange(stateChange, stateChangesSet) {
      if (stateChange.focus != undefined && this.state.focus != stateChange.focus) {
        this.state.focus = stateChange.focus;
        stateChangesSet.add('focus');
      }
    }
  }, {
    key: "_updateLoadingStateChange",
    value: function _updateLoadingStateChange(stateChange, stateChangesSet) {
      if (stateChange.loading != undefined && this.state.loading != stateChange.loading) {
        this.state.loading = stateChange.loading;
        stateChangesSet.add('loading');
      }
    }
  }, {
    key: "_hasAnyFiltersOrSearchString",
    value: function _hasAnyFiltersOrSearchString() {
      return this.state.searchString != '' || this.state.filtersMap.size > 0;
    }
  }, {
    key: "setState",
    value: function setState(stateChange) {
      var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var stateChangesSet = new Set();

      this._updateSearchStringStateChange(stateChange, stateChangesSet);

      this._updateFiltersStateChange(stateChange, stateChangesSet);

      this._updateDataStateChange(stateChange, stateChangesSet);

      this._updateSelectionStateChange(stateChange, stateChangesSet);

      this._updateFocusStateChange(stateChange, stateChangesSet);

      this._updateLoadingStateChange(stateChange, stateChangesSet);

      if (stateChangesSet.has('data')) {
        if (!this._hasAnyFiltersOrSearchString()) {
          if (this.state.data.count == 0) {
            this.state.isEmpty = true;

            this._sendIsEmpyDataListSignal();
          } else if (this.state.isEmpty || this.state.isEmpty == undefined) {
            this.state.isEmpty = false;

            this._sendNotEmpyDataListSignal();
          }
        }

        this._sendDataChangeSignal();
      }

      if (stateChangesSet.has('selection')) {
        this._sendSelectionChangeSignal();
      }

      if (stateChangesSet.has('searchString') || stateChangesSet.has('filters')) {
        this._requestDataListAndRefresh(this.makeRequestDataListOptions());
      }

      if (stateChangesSet.has('loading')) {
        this._sendLoadingStateChangeSignal();
      }

      if (stateChangesSet.has('filters')) {
        this._sendFiltersChangeSignal();
      }

      this._sendStateChangeSignal(stateChangesSet);
    }
  }, {
    key: "_sendIsEmpyDataListSignal",
    value: function _sendIsEmpyDataListSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".IsEmpyDataList"));
    }
  }, {
    key: "_sendNotEmpyDataListSignal",
    value: function _sendNotEmpyDataListSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".NotEmpyDataList"));
    }
  }, {
    key: "_sendDataChangeSignal",
    value: function _sendDataChangeSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".DataChange"), this.state.data);
    }
  }, {
    key: "_sendFiltersChangeSignal",
    value: function _sendFiltersChangeSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".FiltersChange"), this.state.filtersMap);
    }
  }, {
    key: "_sendSelectionChangeSignal",
    value: function _sendSelectionChangeSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".SelectionChange"), {
        selectedItemsMap: this.state.selectedItemsMap
      });
    }
  }, {
    key: "_sendLoadingStateChangeSignal",
    value: function _sendLoadingStateChangeSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".LoadingStateChange"), this.state.loading);
    }
  }, {
    key: "_sendLostFocusSignal",
    value: function _sendLostFocusSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".LostFocus"), this.state.loading);
    }
  }, {
    key: "_sendStateChangeSignal",
    value: function _sendStateChangeSignal(stateChanges) {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".StateChange"), {
        state: this.state,
        stateChanges: stateChanges
      });
    }
  }, {
    key: "_sendDataListInitializedSignal",
    value: function _sendDataListInitializedSignal() {
      this.signalHandler.send("".concat(this.config.signalNameSpace, ".DataListInitialized"), this.state);
    }
  }, {
    key: "_onSearchValueChangeSignal",
    value: function _onSearchValueChangeSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());
      this.setState({
        searchString: receivedSignalInfo.data
      });
    }
  }, {
    key: "_onSetFiltersSignal",
    value: function _onSetFiltersSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());
      this.setState({
        filtersMap: receivedSignalInfo.data
      });
    }
  }, {
    key: "_onPatchFiltersSignal",
    value: function _onPatchFiltersSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());
      this.setState({
        filtersMapPatch: receivedSignalInfo.data
      });
    }
  }, {
    key: "_getKeyFromItemData",
    value: function _getKeyFromItemData(itemData) {
      return itemData[this.config.keyAttribute];
    }
  }, {
    key: "_onSelectItemSignal",
    value: function _onSelectItemSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());
      var itemData = receivedSignalInfo.data;
      this.setState({
        addSelectedItem: itemData
      });
    }
  }, {
    key: "_onDeSelectItemSignal",
    value: function _onDeSelectItemSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());
      var itemData = receivedSignalInfo.data;
      this.setState({
        removeSelectedItem: itemData
      });
    }
    /**
     * Called to perform the actual API call that updates the move.
     * For client side move, this may or may not make sense to handle.
     *
     * Calls the moveItem() method to perform the actual move.
     */

  }, {
    key: "_onMoveItemSignal",
    value: function _onMoveItemSignal(receivedSignalInfo) {
      var _this3 = this;

      this.logger.debug('Received:', receivedSignalInfo.toString(), receivedSignalInfo.data);
      this.moveItem(receivedSignalInfo.data.movingItemKey, receivedSignalInfo.data.moveBeforeItemKey).then(function (result) {
        _this3.setState({
          moveItemInProgress: false
        });

        _this3.signalHandler.send("".concat(_this3.config.signalNameSpace, ".MoveItemComplete"), receivedSignalInfo.data);
      }).catch(function (error) {
        throw error;
      });
    }
  }, {
    key: "moveItem",
    value: function moveItem(movingItemKey, moveBeforeItemKey) {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }
  }, {
    key: "_cancelBlurTimer",
    value: function _cancelBlurTimer() {
      if (this._blurTimeoutId != undefined) {
        window.clearTimeout(this._blurTimeoutId);
      }
    }
  }, {
    key: "_startBlurTimer",
    value: function _startBlurTimer(callback) {
      this._blurTimeoutId = window.setTimeout(callback, 200);
    }
  }, {
    key: "_onFocusSignal",
    value: function _onFocusSignal(receivedSignalInfo) {
      this._cancelBlurTimer();

      this.setState({
        focus: true
      });
    }
  }, {
    key: "_onBlurSignal",
    value: function _onBlurSignal(receivedSignalInfo) {
      var _this4 = this;

      this._startBlurTimer(function () {
        _this4.setState({
          focus: false
        });

        _this4._sendLostFocusSignal();
      });
    }
  }, {
    key: "_onLoadMoreSignal",
    value: function _onLoadMoreSignal(receivedSignalInfo) {
      if (this._isLoadingDataList) {
        this.logger.warning('Requested LoadMore while loading data.');
        return;
      }

      if (!this.state.data.next) {
        this.logger.warning('Requested LoadMore with no next page.');
        return;
      }

      this._requestDataListAndRefresh(this.makeRequestDataListOptions({
        next: true
      }), 'appendData');
    }
  }, {
    key: "_onLoadNextPageSignal",
    value: function _onLoadNextPageSignal(receivedSignalInfo) {
      if (!this.state.data.next) {
        this.logger.warning('Requested LoadNextPage with no next page.');
        return;
      }

      this._requestDataListAndRefresh(this.makeRequestDataListOptions({
        next: true
      }), 'data');
    }
  }, {
    key: "_onLoadPreviousPageSignal",
    value: function _onLoadPreviousPageSignal(receivedSignalInfo) {
      if (!this.state.data.previous) {
        this.logger.warning('Requested LoadPreviousPage with no previous page.');
        return;
      }

      this._requestDataListAndRefresh(this.makeRequestDataListOptions({
        previous: true
      }), 'data');
    }
  }, {
    key: "requestItemData",
    value: function requestItemData(key) {
      throw new Error('requestItemData must be implemented in subclasses of AbstractDataListWidget.');
    }
  }, {
    key: "requestDataList",
    value: function requestDataList() {
      throw new Error('requestDataList must be implemented in subclasses of AbstractDataListWidget.');
    }
  }, {
    key: "_cancelLoadingStateTimer",
    value: function _cancelLoadingStateTimer() {
      if (this._loadingStateTimeoutId != undefined) {
        window.clearTimeout(this._loadingStateTimeoutId);
      }
    }
  }, {
    key: "_startLoadingStateTimer",
    value: function _startLoadingStateTimer() {
      var _this5 = this;

      this._loadingStateTimeoutId = window.setTimeout(function () {
        _this5.setState({
          loading: true
        });
      }, 200);
    }
  }, {
    key: "_setLoadingState",
    value: function _setLoadingState() {
      this._startLoadingStateTimer();
    }
  }, {
    key: "_unsetLoadingState",
    value: function _unsetLoadingState() {
      this._cancelLoadingStateTimer();

      this.setState({
        loading: false
      });
    }
  }, {
    key: "_requestDataList",
    value: function _requestDataList(options) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var dataRequestId = ++_this6._dataRequestId; // this.logger.debug(`Requesting data ${dataRequestId}`, options);

        _this6._isLoadingDataList = true;

        _this6._setLoadingState();

        _this6.requestDataList(options).then(function (data) {
          _this6._isLoadingDataList = false;

          _this6._unsetLoadingState();

          if (_this6._dataRequestId == dataRequestId) {
            resolve(data);
          } else {
            reject(new CancelledDataRequest("Data list request ".concat(dataRequestId, " was cancelled."), {
              options: options
            }));
          }
        }).catch(function (error) {
          _this6._isLoadingDataList = false;

          _this6._unsetLoadingState();

          reject(error);
        });
      });
    }
  }, {
    key: "makeRequestDataListOptions",
    value: function makeRequestDataListOptions() {
      var overrideOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Object.assign({}, {
        filtersMap: this.state.filtersMap,
        searchString: this.state.searchString
      }, overrideOptions);
    }
  }, {
    key: "_requestDataListAndRefresh",
    value: function _requestDataListAndRefresh(options) {
      var _this7 = this;

      var stateChangeAttribute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';

      this._requestDataList(options).then(function (data) {
        var stateChange = {};
        stateChange[stateChangeAttribute] = data;

        _this7.setState(stateChange);
      }).catch(function (error) {
        if (error instanceof CancelledDataRequest) {
          _this7.logger.warning(error.toString(), error.options);
        } else {
          throw error;
        }
      });
    }
  }]);

  _inherits(AbstractDataListWidget, _AbstractWidget);

  return AbstractDataListWidget;
}(_AbstractWidget2.default);

exports.default = AbstractDataListWidget;