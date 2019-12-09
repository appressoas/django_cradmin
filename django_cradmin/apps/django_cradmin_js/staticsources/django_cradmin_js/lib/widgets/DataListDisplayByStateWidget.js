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

var DataListDisplayByStateWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(DataListDisplayByStateWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        signalNameSpace: null,
        displayStyle: 'block',
        // Valid values:
        // - 'IsInitializingDataList'
        // - 'IsNotInitializingDataList'
        // - 'UnfilteredIsEmpty'
        // - 'UnfilteredIsNotEmpty'
        // - 'FilteredIsNotEmpty'
        // - 'FilteredIsEmpty'
        // - 'HasNextPage'
        // - 'HasSearchString'
        // - 'HasFocus'
        // - 'HasNoFocus'
        // - 'HasSelectedItems'
        // - 'HasNoSelectedItems'
        showStates: [],
        hideStates: []
      };
    }
  }]);

  function DataListDisplayByStateWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, DataListDisplayByStateWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataListDisplayByStateWidget).call(this, element, widgetInstanceId));
    _this._widgetInstanceId = widgetInstanceId;
    _this._name = "django_cradmin.widgets.DataListDisplayByStateWidget.".concat(widgetInstanceId);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.widgets.DataListDisplayByStateWidget');

    if (_this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }

    _this._onDataListInitializedSignal = _this._onDataListInitializedSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onIsEmpyDataListSignal = _this._onIsEmpyDataListSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onNotEmpyDataListSignal = _this._onNotEmpyDataListSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onDataChangeSignal = _this._onDataChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onSearchValueChangeSignal = _this._onSearchValueChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusSignal = _this._onFocusSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onBlurSignal = _this._onBlurSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onLoadingStateChangeSignal = _this._onLoadingStateChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onSelectionChangeSignal = _this._onSelectionChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._watchedStates = new Set(_this.config.showStates);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _this.config.hideStates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var hideState = _step.value;

        _this._watchedStates.add(hideState);
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

    _this.stateSet = new Set();

    if (_this._watchInitializingDataList()) {
      _this.stateSet.add('IsInitializingDataList');
    }

    _this._refresh();

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(DataListDisplayByStateWidget, [{
    key: "_watchIsEmpty",
    value: function _watchIsEmpty() {
      return this._watchedStates.has('UnfilteredIsEmpty');
    }
  }, {
    key: "_watchNotEmpty",
    value: function _watchNotEmpty() {
      return this._watchedStates.has('UnfilteredIsNotEmpty');
    }
  }, {
    key: "_watchInitializingDataList",
    value: function _watchInitializingDataList() {
      return this._watchedStates.has('IsInitializingDataList') || this._watchedStates.has('IsNotInitializingDataList');
    }
  }, {
    key: "_watchResultCount",
    value: function _watchResultCount() {
      return this._watchedStates.has('FilteredIsNotEmpty') || this._watchedStates.has('FilteredIsEmpty');
    }
  }, {
    key: "_watchNextPage",
    value: function _watchNextPage() {
      return this._watchedStates.has('HasNextPage');
    }
  }, {
    key: "_watchSearchString",
    value: function _watchSearchString() {
      return this._watchedStates.has('HasSearchString');
    }
  }, {
    key: "_watchFocus",
    value: function _watchFocus() {
      return this._watchedStates.has('HasFocus') || this._watchedStates.has('HasNoFocus');
    }
  }, {
    key: "_watchLoadingStateChange",
    value: function _watchLoadingStateChange() {
      return this._watchedStates.has('IsLoading');
    }
  }, {
    key: "_watchSelectionChangeCount",
    value: function _watchSelectionChangeCount() {
      return this._watchedStates.has('HasSelectedItems') || this._watchedStates.has('HasNoSelectedItems');
    }
  }, {
    key: "_listenForDataListInitializedSignal",
    value: function _listenForDataListInitializedSignal() {
      return this._watchInitializingDataList();
    }
  }, {
    key: "_listenForIsEmpyDataListSignal",
    value: function _listenForIsEmpyDataListSignal() {
      return this._watchIsEmpty();
    }
  }, {
    key: "_listenForNotEmpyDataListSignal",
    value: function _listenForNotEmpyDataListSignal() {
      return this._watchNotEmpty();
    }
  }, {
    key: "_listenForDataChangeSignal",
    value: function _listenForDataChangeSignal() {
      return this._watchResultCount() || this._watchNextPage();
    }
  }, {
    key: "_listenForSearchValueChangeSignal",
    value: function _listenForSearchValueChangeSignal() {
      return this._watchSearchString();
    }
  }, {
    key: "_listenForFocusSignal",
    value: function _listenForFocusSignal() {
      return this._watchFocus();
    }
  }, {
    key: "_listenForBlurSignal",
    value: function _listenForBlurSignal() {
      return this._watchFocus();
    }
  }, {
    key: "_listenForLoadingStateChangeSignal",
    value: function _listenForLoadingStateChangeSignal() {
      return this._watchLoadingStateChange();
    }
  }, {
    key: "_listenForSelectionChangeSignal",
    value: function _listenForSelectionChangeSignal() {
      return this._watchSelectionChangeCount();
    }
  }, {
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      if (this._listenForDataListInitializedSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".DataListInitialized"), this._name, this._onDataListInitializedSignal);
      }

      if (this._listenForIsEmpyDataListSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".IsEmpyDataList"), this._name, this._onIsEmpyDataListSignal);
      }

      if (this._listenForNotEmpyDataListSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".NotEmpyDataList"), this._name, this._onNotEmpyDataListSignal);
      }

      if (this._listenForDataChangeSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".DataChange"), this._name, this._onDataChangeSignal);
      }

      if (this._listenForSearchValueChangeSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".SearchValueChange"), this._name, this._onSearchValueChangeSignal);
      }

      if (this._listenForFocusSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".Focus"), this._name, this._onFocusSignal);
      }

      if (this._listenForBlurSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".Blur"), this._name, this._onBlurSignal);
      }

      if (this._listenForLoadingStateChangeSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".LoadingStateChange"), this._name, this._onLoadingStateChangeSignal);
      }

      if (this._listenForSelectionChangeSignal()) {
        new _SignalHandlerSingleton.default().addReceiver("".concat(this.config.signalNameSpace, ".SelectionChange"), this._name, this._onSelectionChangeSignal);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_onDataListInitializedSignal",
    value: function _onDataListInitializedSignal(receivedSignalInfo) {
      if (this.stateSet.has('IsInitializingDataList')) {
        this.stateSet.delete('IsInitializingDataList');
        this.stateSet.add('IsNotInitializingDataList');

        this._refresh();
      }
    }
  }, {
    key: "_onIsEmpyDataListSignal",
    value: function _onIsEmpyDataListSignal(receivedSignalInfo) {
      if (!this.stateSet.has('UnfilteredIsEmpty')) {
        this.stateSet.add('UnfilteredIsEmpty');
        this.stateSet.delete('UnfilteredIsNotEmpty');

        this._refresh();
      }
    }
  }, {
    key: "_onNotEmpyDataListSignal",
    value: function _onNotEmpyDataListSignal(receivedSignalInfo) {
      if (!this.stateSet.has('UnfilteredIsNotEmpty')) {
        this.stateSet.add('UnfilteredIsNotEmpty');
        this.stateSet.delete('UnfilteredIsEmpty');

        this._refresh();
      }
    }
  }, {
    key: "_checkDataChanges",
    value: function _checkDataChanges(data) {
      var hasChanges = false;

      if (this._watchResultCount()) {
        if (data.count > 0) {
          if (!this.stateSet.has('FilteredIsNotEmpty')) {
            this.stateSet.add('FilteredIsNotEmpty');
            this.stateSet.delete('FilteredIsEmpty');
            hasChanges = true;
          }
        } else {
          if (!this.stateSet.has('FilteredIsEmpty')) {
            this.stateSet.add('FilteredIsEmpty');
            this.stateSet.delete('FilteredIsNotEmpty');
            hasChanges = true;
          }
        }
      }

      if (this._watchNextPage()) {
        if (data.next) {
          if (!this.stateSet.has('HasNextPage')) {
            this.stateSet.add('HasNextPage');
            hasChanges = true;
          }
        } else {
          if (this.stateSet.has('HasNextPage')) {
            this.stateSet.delete('HasNextPage');
            hasChanges = true;
          }
        }
      }

      return hasChanges;
    }
  }, {
    key: "_onDataChangeSignal",
    value: function _onDataChangeSignal(receivedSignalInfo) {
      var data = receivedSignalInfo.data;

      if (this._checkDataChanges(data)) {
        this._refresh();
      }
    }
  }, {
    key: "_checkSearchStringChanges",
    value: function _checkSearchStringChanges(searchString) {
      var hasChanges = false;

      if (searchString.length > 0) {
        if (!this.stateSet.has('HasSearchString')) {
          this.stateSet.add('HasSearchString');
          hasChanges = true;
        }
      } else {
        if (this.stateSet.has('HasSearchString')) {
          this.stateSet.delete('HasSearchString');
          hasChanges = true;
        }
      }

      return hasChanges;
    }
  }, {
    key: "_onSearchValueChangeSignal",
    value: function _onSearchValueChangeSignal(receivedSignalInfo) {
      var searchString = receivedSignalInfo.data;

      if (this._checkSearchStringChanges(searchString)) {
        this._refresh();
      }
    }
  }, {
    key: "_onFocusSignal",
    value: function _onFocusSignal(receivedSignalInfo) {
      if (!this.stateSet.has('HasFocus')) {
        this.stateSet.add('HasFocus');
        this.stateSet.delete('HasNoFocus');

        this._refresh();
      }
    }
  }, {
    key: "_onBlurSignal",
    value: function _onBlurSignal(receivedSignalInfo) {
      if (!this.stateSet.has('HasNoFocus')) {
        this.stateSet.add('HasNoFocus');
        this.stateSet.delete('HasFocus');

        this._refresh();
      }
    }
  }, {
    key: "_checkLoadingChanges",
    value: function _checkLoadingChanges(isLoading) {
      var hasChanges = false;

      if (isLoading) {
        if (!this.stateSet.has('IsLoading')) {
          this.stateSet.add('IsLoading');
          hasChanges = true;
        }
      } else {
        if (this.stateSet.has('IsLoading')) {
          this.stateSet.delete('IsLoading');
          hasChanges = true;
        }
      }

      return hasChanges;
    }
  }, {
    key: "_onLoadingStateChangeSignal",
    value: function _onLoadingStateChangeSignal(receivedSignalInfo) {
      var isLoading = receivedSignalInfo.data;

      if (this._checkLoadingChanges(isLoading)) {
        this._refresh();
      }
    }
  }, {
    key: "_checkSelectionChanges",
    value: function _checkSelectionChanges(selectedItemsMap) {
      var hasChanges = false;

      if (selectedItemsMap.size == 0) {
        if (!this.stateSet.has('HasNoSelectedItems')) {
          this.stateSet.add('HasNoSelectedItems');
          this.stateSet.delete('HasSelectedItems');
          hasChanges = true;
        }
      } else {
        if (!this.stateSet.has('HasSelectedItems')) {
          this.stateSet.add('HasSelectedItems');
          this.stateSet.delete('HasNoSelectedItems');
          hasChanges = true;
        }
      }

      return hasChanges;
    }
  }, {
    key: "_onSelectionChangeSignal",
    value: function _onSelectionChangeSignal(receivedSignalInfo) {
      var selectedItemsMap = receivedSignalInfo.data.selectedItemsMap;

      if (this._checkSelectionChanges(selectedItemsMap)) {
        this._refresh();
      }
    }
  }, {
    key: "_display",
    value: function _display(display) {
      if (display) {
        _DomUtilities.default.show(this.element, this.config.displayStyle);
      } else {
        _DomUtilities.default.hide(this.element);
      }
    }
  }, {
    key: "_refresh",
    value: function _refresh() {
      var display = false;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.config.showStates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var state = _step2.value;

          if (this.stateSet.has(state)) {
            display = true;
            break;
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

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.config.hideStates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _state = _step3.value;

          if (this.stateSet.has(_state)) {
            display = false;
            break;
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

      if (this.logger.isDebug) {
        this.logger.debug("State changes detected by widgetInstanceId=".concat(this._widgetInstanceId, ". New stateSet"), this.stateSet, 'Display:', display);
      }

      this._display(display);
    }
  }]);

  _inherits(DataListDisplayByStateWidget, _AbstractWidget);

  return DataListDisplayByStateWidget;
}(_AbstractWidget2.default);

exports.default = DataListDisplayByStateWidget;