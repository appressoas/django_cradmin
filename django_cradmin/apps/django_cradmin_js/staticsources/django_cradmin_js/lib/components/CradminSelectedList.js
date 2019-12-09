"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _CradminSelectedListItem = _interopRequireDefault(require("./CradminSelectedListItem"));

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

var CradminSelectedList =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminSelectedList, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        className: 'selectable-list selectable-list--inline selectable-list--nomargin',
        keyAttribute: 'id',
        signalNameSpace: null,
        uniqueId: '',
        itemComponentProps: {}
      };
    }
  }]);

  function CradminSelectedList(props) {
    var _this;

    _classCallCheck(this, CradminSelectedList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminSelectedList).call(this, props));
    _this._name = "django_cradmin.components.CradminSelectedList.".concat(_this.props.signalNameSpace, ".").concat(_this.props.uniqueId);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminSelectedList');

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    _this._onSelectionChangeSignal = _this._onSelectionChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnDeSelectableItemSignal = _this._onFocusOnDeSelectableItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnFirstSelectedItemSignal = _this._onFocusOnFirstSelectedItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnLastSelectedItemSignal = _this._onFocusOnLastSelectedItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._focusOnItemData = null;
    _this.state = {
      selectedItemsMap: new Map()
    };

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminSelectedList, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".SelectionChange"), this._name, this._onSelectionChangeSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnDeSelectableItem"), this._name, this._onFocusOnDeSelectableItemSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnFirstSelectedItem"), this._name, this._onFocusOnFirstSelectedItemSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnLastSelectedItem"), this._name, this._onFocusOnLastSelectedItemSignal);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_onSelectionChangeSignal",
    value: function _onSelectionChangeSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      this.setState({
        selectedItemsMap: receivedSignalInfo.data.selectedItemsMap
      });
    }
  }, {
    key: "_onFocusOnDeSelectableItemSignal",
    value: function _onFocusOnDeSelectableItemSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      this._focusOnItemData = receivedSignalInfo.data;
    }
  }, {
    key: "_onFocusOnFirstSelectedItemSignal",
    value: function _onFocusOnFirstSelectedItemSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      if (this.state.selectedItemsMap.size > 0) {
        var selectedItemsArray = Array.from(this.state.selectedItemsMap.values());
        this._focusOnItemData = selectedItemsArray[0];
      }
    }
  }, {
    key: "_onFocusOnLastSelectedItemSignal",
    value: function _onFocusOnLastSelectedItemSignal(receivedSignalInfo) {
      if (this.logger.isDebug) {
        this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      }

      if (this.state.selectedItemsMap.size > 0) {
        var selectedItemsArray = Array.from(this.state.selectedItemsMap.values());
        this._focusOnItemData = selectedItemsArray[selectedItemsArray.length - 1];
      }
    }
  }, {
    key: "renderItem",
    value: function renderItem(itemKey, props) {
      return _react.default.createElement(_CradminSelectedListItem.default, _extends({
        key: itemKey
      }, props));
    }
  }, {
    key: "renderItems",
    value: function renderItems() {
      var items = [];
      var itemKeys = Array.from(this.state.selectedItemsMap.keys());
      var previousItemData = null;

      for (var index = 0; index < itemKeys.length; index++) {
        var itemKey = itemKeys[index];
        var itemData = this.state.selectedItemsMap.get(itemKey);
        var nextItemData = null;
        var isLast = index == itemKeys.length - 1;

        if (!isLast) {
          nextItemData = this.state.selectedItemsMap.get(itemKeys[index + 1]);
        }

        var props = Object.assign({}, this.props.itemComponentProps, {
          data: itemData,
          itemKey: itemKey,
          signalNameSpace: this.props.signalNameSpace,
          previousItemData: previousItemData,
          nextItemData: nextItemData,
          uniqueListId: this.props.uniqueId
        });
        items.push(this.renderItem(itemKey, props));
        previousItemData = itemData;
      }

      return items;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.props.className
      }, this.renderItems());
    }
  }, {
    key: "_sendFocusOnItemSignal",
    value: function _sendFocusOnItemSignal(itemData) {
      var itemKey = itemData[this.props.keyAttribute];
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".FocusOnSelectedItem.").concat(itemKey));
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

  _inherits(CradminSelectedList, _React$Component);

  return CradminSelectedList;
}(_react.default.Component);

exports.default = CradminSelectedList;