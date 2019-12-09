"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _CradminSelectableListItem = _interopRequireDefault(require("./CradminSelectableListItem"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var CradminSelectableList =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminSelectableList, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        className: 'selectable-list',
        keyAttribute: 'id',
        renderSelected: true,
        signalNameSpace: null,
        itemComponentProps: {},
        loadMoreTreshold: 3
      };
    }
  }]);

  function CradminSelectableList(props) {
    var _this;

    _classCallCheck(this, CradminSelectableList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminSelectableList).call(this, props));
    _this._name = "django_cradmin.components.CradminSelectableList.".concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminSelectableList');

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    _this._onDataChangeSignal = _this._onDataChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onSelectionChangeSignal = _this._onSelectionChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnSelectableItemSignal = _this._onFocusOnSelectableItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnFirstSelectableItemSignal = _this._onFocusOnFirstSelectableItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnLastSelectableItemSignal = _this._onFocusOnLastSelectableItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._focusOnItemData = null;
    _this.state = {
      dataList: [],
      renderableDataList: [],
      hasMorePages: false,
      selectedItemsMap: new Map()
    };

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminSelectableList, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".DataChange"), this._name, this._onDataChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".SelectionChange"), this._name, this._onSelectionChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnSelectableItem"), this._name, this._onFocusOnSelectableItemSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnFirstSelectableItem"), this._name, this._onFocusOnFirstSelectableItemSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnLastSelectableItem"), this._name, this._onFocusOnLastSelectableItemSignal);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.props.className
      }, this.renderItems());
    }
  }, {
    key: "_loadMoreIfNeeded",
    value: function _loadMoreIfNeeded() {
      if (this.state.hasMorePages && this.state.renderableDataList.length < this.props.loadMoreTreshold) {
        this.logger.debug('Automatically sending the LoadMore signal because we are below the loadMoreTreshold');
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".LoadMore"));
      }
    }
  }, {
    key: "_makeRenderableDataList",
    value: function _makeRenderableDataList(dataList) {
      var renderableDataList = dataList;

      if (!this.props.renderSelected) {
        renderableDataList = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dataList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var itemData = _step.value;
            var itemKey = itemData[this.props.keyAttribute];
            var isSelected = this.state.selectedItemsMap.has(itemKey);

            if (!isSelected) {
              renderableDataList.push(itemData);
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

      return renderableDataList;
    }
  }, {
    key: "_onDataChangeSignal",
    value: function _onDataChangeSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      var dataList = receivedSignalInfo.data.results;
      this.setState({
        dataList: dataList,
        renderableDataList: this._makeRenderableDataList(dataList),
        hasMorePages: receivedSignalInfo.data.next != null
      });

      this._loadMoreIfNeeded();
    }
  }, {
    key: "_onSelectionChangeSignal",
    value: function _onSelectionChangeSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      this.setState({
        selectedItemsMap: receivedSignalInfo.data.selectedItemsMap,
        renderableDataList: this._makeRenderableDataList(this.state.dataList)
      });

      this._loadMoreIfNeeded();
    }
  }, {
    key: "_onFocusOnSelectableItemSignal",
    value: function _onFocusOnSelectableItemSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      this._focusOnItemData = receivedSignalInfo.data;
      this.forceUpdate();
    }
  }, {
    key: "_onFocusOnFirstSelectableItemSignal",
    value: function _onFocusOnFirstSelectableItemSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      if (this.state.renderableDataList.length > 0) {
        this._focusOnItemData = this.state.renderableDataList[0];
        this.forceUpdate();
      }
    }
  }, {
    key: "_onFocusOnLastSelectableItemSignal",
    value: function _onFocusOnLastSelectableItemSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      if (this.state.renderableDataList.length > 0) {
        this._focusOnItemData = this.state.renderableDataList[this.state.renderableDataList.length - 1];
        this.forceUpdate();
      }
    }
  }, {
    key: "renderItem",
    value: function renderItem(itemKey, props) {
      return _react.default.createElement(_CradminSelectableListItem.default, _extends({
        key: itemKey
      }, props));
    }
  }, {
    key: "renderItems",
    value: function renderItems() {
      var items = [];
      var previousItemData = null;

      for (var index = 0; index < this.state.renderableDataList.length; index++) {
        var itemData = this.state.renderableDataList[index];
        var itemKey = itemData[this.props.keyAttribute];
        var isSelected = this.state.selectedItemsMap.has(itemKey);
        var nextItemData = null;
        var isLast = index == this.state.renderableDataList.length - 1;

        if (!isLast) {
          nextItemData = this.state.renderableDataList[index + 1];
        }

        var props = Object.assign({
          focusClosestSiblingOnSelect: !this.props.renderSelected
        }, this.props.itemComponentProps, {
          data: itemData,
          itemKey: itemKey,
          isSelected: isSelected,
          signalNameSpace: this.props.signalNameSpace,
          previousItemData: previousItemData,
          nextItemData: nextItemData
        });
        items.push(this.renderItem(itemKey, props));
        previousItemData = itemData;
      }

      return items;
    }
  }, {
    key: "_sendFocusOnItemSignal",
    value: function _sendFocusOnItemSignal(itemData) {
      var itemKey = itemData[this.props.keyAttribute];
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".FocusOnSelectableItem.").concat(itemKey));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this._focusOnItemData != null) {
        this._sendFocusOnItemSignal(this._focusOnItemData);

        this._focusOnItemData = null;
      }
    }
  }]);

  _inherits(CradminSelectableList, _React$Component);

  return CradminSelectableList;
}(_react.default.Component);

exports.default = CradminSelectableList;