"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _CradminMoveButton = _interopRequireDefault(require("./CradminMoveButton"));

var _CradminHtmlList2 = _interopRequireDefault(require("./CradminHtmlList"));

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

var CradminHtmlListWithMovableItems =
/*#__PURE__*/
function (_CradminHtmlList) {
  function CradminHtmlListWithMovableItems() {
    _classCallCheck(this, CradminHtmlListWithMovableItems);

    return _possibleConstructorReturn(this, _getPrototypeOf(CradminHtmlListWithMovableItems).apply(this, arguments));
  }

  _createClass(CradminHtmlListWithMovableItems, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      var initialState = _get(_getPrototypeOf(CradminHtmlListWithMovableItems.prototype), "makeInitialState", this).call(this);

      initialState = Object.assign({}, initialState, {
        isMovingItemKey: null,
        isCallingMoveApi: false,
        hasSearchValue: false,
        dataListIsLoading: false
      });
      return initialState;
    }
  }, {
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      _get(_getPrototypeOf(CradminHtmlListWithMovableItems.prototype), "initializeSignalHandlers", this).call(this);

      this._onMoveItemUpSignal = this._onMoveItemUpSignal.bind(this);
      this._onMoveItemDownSignal = this._onMoveItemDownSignal.bind(this);
      this._onMoveItemCompleteSignal = this._onMoveItemCompleteSignal.bind(this);
      this._onSearchValueChangeEmptySignal = this._onSearchValueChangeEmptySignal.bind(this);
      this._onSearchValueChangeNotEmptySignal = this._onSearchValueChangeNotEmptySignal.bind(this);
      this._onLoadingStateChangeSignal = this._onLoadingStateChangeSignal.bind(this);
      this.signalHandler.addReceiver("".concat(this.props.signalNameSpace, ".SortableHtmlList.MoveItemUp"), this._name, this._onMoveItemUpSignal);
      this.signalHandler.addReceiver("".concat(this.props.signalNameSpace, ".SortableHtmlList.MoveItemDown"), this._name, this._onMoveItemDownSignal);
      this.signalHandler.addReceiver("".concat(this.props.signalNameSpace, ".MoveItemComplete"), this._name, this._onMoveItemCompleteSignal);
      this.signalHandler.addReceiver("".concat(this.props.signalNameSpace, ".SearchValueChangeEmpty"), this._name, this._onSearchValueChangeEmptySignal);
      this.signalHandler.addReceiver("".concat(this.props.signalNameSpace, ".SearchValueChangeNotEmpty"), this._name, this._onSearchValueChangeNotEmptySignal);
      this.signalHandler.addReceiver("".concat(this.props.signalNameSpace, ".LoadingStateChange"), this._name, this._onLoadingStateChangeSignal);
    }
  }, {
    key: "_onSearchValueChangeEmptySignal",
    value: function _onSearchValueChangeEmptySignal(receivedSignalInfo) {
      this.setState({
        hasSearchValue: false
      });
    }
  }, {
    key: "_onSearchValueChangeNotEmptySignal",
    value: function _onSearchValueChangeNotEmptySignal(receivedSignalInfo) {
      this.setState({
        hasSearchValue: true
      });
    }
  }, {
    key: "_onLoadingStateChangeSignal",
    value: function _onLoadingStateChangeSignal(receivedSignalInfo) {
      var isLoading = receivedSignalInfo.data;
      this.setState({
        dataListIsLoading: isLoading
      });
    } // _getDataListDebugArray() {
    //   let debugArray = [];
    //   for(let itemData of this.state.dataList) {
    //     // debugArray.push(`  - ${itemData[this.props.keyAttribute]}`);
    //     debugArray.push(itemData[this.props.keyAttribute])
    //   }
    //   // return '\n' + debugArray.join('\n');
    //   return debugArray.join(', ')
    // }

  }, {
    key: "_cancelMoveTimer",
    value: function _cancelMoveTimer() {
      if (this._blurTimeoutId != undefined) {
        window.clearTimeout(this._blurTimeoutId);
      }
    }
  }, {
    key: "_startMoveTimer",
    value: function _startMoveTimer(callback) {
      this._blurTimeoutId = window.setTimeout(callback, this.props.moveApiCallDelayMilliseconds);
    }
  }, {
    key: "_sendMoveSignal",
    value: function _sendMoveSignal(moveBeforeItemKey) {
      this.setState({
        isCallingMoveApi: true
      });
      this.signalHandler.send("".concat(this.props.signalNameSpace, ".MoveItem"), {
        movingItemKey: this.state.isMovingItemKey,
        moveBeforeItemKey: moveBeforeItemKey
      });
    }
  }, {
    key: "_sendMoveStartedSignal",
    value: function _sendMoveStartedSignal() {
      this.signalHandler.send("".concat(this.props.signalNameSpace, ".MoveItemStarted"));
    }
  }, {
    key: "_moveItem",
    value: function _moveItem(from_index, to_index) {
      var _this = this;

      if (to_index < 0) {
        throw new Error('Can not move a result item to an index smaller than 0');
      } else if (to_index > this.state.dataList.length) {
        throw new Error('Can not move a result item to an index that is larger ' + 'than the result array size.');
      }

      var itemData = this.state.dataList[from_index];
      var itemKey = itemData[this.props.keyAttribute];

      if (this.state.isMovingItemKey != null && this.state.isMovingItemKey != itemKey) {
        throw new Error("Can not move item with key=".concat(itemKey, ". We are already in the ") + "process of moving the item with key=".concat(this.state.isMovingItemKey, "."));
      }

      if (this.state.isMovingItemKey == null) {
        this._sendMoveStartedSignal();
      }

      this._cancelMoveTimer();

      var moveLast = to_index == this.state.dataList.length - 1;
      var moveBeforeItemKey = null;
      this.state.dataList.splice(from_index, 1);

      if (moveLast) {
        this.state.dataList.push(itemData);
      } else {
        this.state.dataList.splice(to_index, 0, itemData);
        moveBeforeItemKey = this.state.dataList[to_index + 1][this.props.keyAttribute];
      }

      this.state.isMovingItemKey = itemData[this.props.keyAttribute];
      this.forceUpdate();

      this._startMoveTimer(function () {
        _this._sendMoveSignal(moveBeforeItemKey);
      });
    }
  }, {
    key: "_onMoveItemUpSignal",
    value: function _onMoveItemUpSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());

      this._moveItem(receivedSignalInfo.data.itemIndex, receivedSignalInfo.data.itemIndex - 1);
    }
  }, {
    key: "_onMoveItemDownSignal",
    value: function _onMoveItemDownSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());

      this._moveItem(receivedSignalInfo.data.itemIndex, receivedSignalInfo.data.itemIndex + 1);
    }
  }, {
    key: "_onMoveItemCompleteSignal",
    value: function _onMoveItemCompleteSignal(receivedSignalInfo) {
      this.logger.debug('Received:', receivedSignalInfo.toString());
      this.setState({
        isCallingMoveApi: false,
        isMovingItemKey: null
      });
    }
  }, {
    key: "canMoveItem",
    value: function canMoveItem(itemData) {
      return !this.state.isCallingMoveApi && !this.state.dataListIsLoading && !this.state.hasSearchValue && (this.state.isMovingItemKey == null || this.state.isMovingItemKey == itemData[this.props.keyAttribute]);
    }
  }, {
    key: "renderMoveUpButton",
    value: function renderMoveUpButton(itemIndex, itemData) {
      if (itemIndex > 0 && this.canMoveItem(itemData)) {
        return _react.default.createElement(_CradminMoveButton.default, {
          className: this.props.moveUpButtonClassName,
          signalNameSpace: this.props.signalNameSpace,
          itemIndex: itemIndex,
          moveDirection: "Up",
          iconClassName: this.props.moveUpButtonIconClassName
        });
      }

      return '';
    }
  }, {
    key: "renderMoveDownButton",
    value: function renderMoveDownButton(itemIndex, itemData) {
      if (itemIndex < this.state.dataList.length - 1 && this.canMoveItem(itemData)) {
        return _react.default.createElement(_CradminMoveButton.default, {
          className: this.props.moveDownButtonClassName,
          signalNameSpace: this.props.signalNameSpace,
          itemIndex: itemIndex,
          moveDirection: "Down",
          iconClassName: this.props.moveDownButtonIconClassName
        });
      }

      return '';
    }
  }, {
    key: "makeMoveBarClassName",
    value: function makeMoveBarClassName(itemIndex) {
      if (itemIndex == 0) {
        return this.props.itemMoveBarClassNameFirst;
      } else if (itemIndex == this.state.dataList.length - 1) {
        return this.props.itemMoveBarClassNameLast;
      } else {
        return this.props.itemMoveBarClassName;
      }
    }
  }, {
    key: "renderMoveBar",
    value: function renderMoveBar(itemIndex, itemData) {
      return _react.default.createElement("div", {
        className: this.makeMoveBarClassName(itemIndex)
      }, this.renderMoveUpButton(itemIndex, itemData), this.renderMoveDownButton(itemIndex, itemData));
    }
  }, {
    key: "renderItemWrapper",
    value: function renderItemWrapper(itemKey, itemData, itemIndex, renderedItem) {
      return _react.default.createElement("div", {
        key: itemKey,
        className: this.props.itemWrapperClassName
      }, renderedItem, this.renderMoveBar(itemIndex, itemData));
    }
  }, {
    key: "renderItem",
    value: function renderItem(itemKey, itemData, itemIndex) {
      var renderedItem = _get(_getPrototypeOf(CradminHtmlListWithMovableItems.prototype), "renderItem", this).call(this, itemKey, itemData, itemIndex);

      return this.renderItemWrapper(itemKey, itemData, itemIndex, renderedItem);
    }
  }, {
    key: "componentName",
    get: function get() {
      return 'CradminHtmlListWithMovableItems';
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      var defaultProps = _get(_getPrototypeOf(CradminHtmlListWithMovableItems), "defaultProps", this);

      defaultProps = Object.assign({}, defaultProps, {
        moveApiCallDelayMilliseconds: 2000,
        itemWrapperClassName: 'blocklist__movable-item-wrapper',
        itemMoveBarClassName: 'blocklist__movesidebar',
        itemMoveBarClassNameFirst: 'blocklist__movesidebar blocklist__movesidebar--only-down',
        itemMoveBarClassNameLast: 'blocklist__movesidebar blocklist__movesidebar--only-up',
        moveUpButtonClassName: 'blocklist__movebutton',
        moveUpButtonIconClassName: 'cricon cricon--chevron-up cricon--color-light',
        moveDownButtonClassName: 'blocklist__movebutton',
        moveDownButtonIconClassName: 'cricon cricon--chevron-down cricon--color-light'
      });
      return defaultProps;
    }
  }]);

  _inherits(CradminHtmlListWithMovableItems, _CradminHtmlList);

  return CradminHtmlListWithMovableItems;
}(_CradminHtmlList2.default);

exports.default = CradminHtmlListWithMovableItems;