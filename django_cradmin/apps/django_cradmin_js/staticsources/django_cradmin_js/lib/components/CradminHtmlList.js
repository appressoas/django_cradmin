"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _SignalHandlerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/SignalHandlerSingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CradminHtmlList =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminHtmlList, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      return {
        dataList: [],
        hasMorePages: false
      };
    }
  }, {
    key: "componentName",
    get: function get() {
      return 'CradminHtmlList';
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        keyAttribute: 'id',
        htmlAttribute: 'html',
        loadMoreTreshold: 3,
        className: 'blocklist',
        itemClassName: 'blocklist__item blocklist__item--movable',
        itemTagName: 'div',
        itemUrlAttribute: 'url' // Only used if itemTagName is "a"

      };
    }
  }]);

  function CradminHtmlList(props) {
    var _this;

    _classCallCheck(this, CradminHtmlList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminHtmlList).call(this, props));
    _this._name = "django_cradmin.components.".concat(_this.componentName, ".").concat(_this.props.signalNameSpace);
    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.${this.componentName}');

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    _this.signalHandler = new _SignalHandlerSingleton.default();
    _this.state = _this.makeInitialState();

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminHtmlList, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      this._onDataChangeSignal = this._onDataChangeSignal.bind(this);
      this.signalHandler.addReceiver("".concat(this.props.signalNameSpace, ".DataChange"), this._name, this._onDataChangeSignal);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.signalHandler.removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_loadMoreIfNeeded",
    value: function _loadMoreIfNeeded() {
      if (this.state.hasMorePages && this.state.dataList.length < this.props.loadMoreTreshold) {
        this.logger.debug('Automatically sending the LoadMore signal because we are below the loadMoreTreshold');
        this.signalHandler.send("".concat(this.props.signalNameSpace, ".LoadMore"));
      }
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
        hasMorePages: receivedSignalInfo.data.next != null
      });

      this._loadMoreIfNeeded();
    }
  }, {
    key: "getItemUrl",
    value: function getItemUrl(itemData) {
      return itemData[this.props.itemUrlAttribute];
    }
  }, {
    key: "renderItem",
    value: function renderItem(itemKey, itemData, itemIndex) {
      var itemProps = {
        dangerouslySetInnerHTML: {
          __html: itemData[this.props.htmlAttribute]
        },
        className: this.props.itemClassName,
        key: itemKey
      };

      if (this.props.itemTagName == 'a') {
        itemProps['href'] = this.getItemUrl(itemData);
      }

      return _react.default.createElement(this.props.itemTagName, itemProps);
    } // renderItemWrapper(itemKey, itemData, itemIndex) {
    //   return <div key={itemKey} className={this.props.itemWrapperClassName}>
    //     {this.renderItem(itemData)}
    //     {this.renderMoveBar(itemIndex, itemData)}
    //   </div>;
    // }

  }, {
    key: "renderItems",
    value: function renderItems() {
      var items = [];
      var itemIndex = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.dataList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var itemData = _step.value;
          var itemKey = itemData[this.props.keyAttribute];
          items.push(this.renderItem(itemKey, itemData, itemIndex));
          itemIndex++;
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

      return items;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.props.className
      }, this.renderItems());
    }
  }]);

  _inherits(CradminHtmlList, _React$Component);

  return CradminHtmlList;
}(_react.default.Component);

exports.default = CradminHtmlList;