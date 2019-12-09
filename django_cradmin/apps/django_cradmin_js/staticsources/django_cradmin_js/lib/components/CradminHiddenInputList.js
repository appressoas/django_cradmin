"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

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

var CradminHiddenInputList =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminHiddenInputList, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        keyAttribute: 'id',
        signalNameSpace: null,
        inputName: null,
        inputType: "hidden"
      };
    }
  }]);

  function CradminHiddenInputList(props) {
    var _this;

    _classCallCheck(this, CradminHiddenInputList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminHiddenInputList).call(this, props));
    _this._name = 'django_cradmin.components.CradminHiddenInputList';
    _this.logger = new _LoggerSingleton.default().getLogger(_this._name);

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    if (_this.props.inputName == null) {
      throw new Error('The inputName prop is required.');
    }

    _this._onSelectionChangeSignal = _this._onSelectionChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      selectedItemsMap: new Map()
    };

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminHiddenInputList, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".SelectionChange"), this._name, this._onSelectionChangeSignal);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeReceiver("".concat(this.props.signalNameSpace, ".SelectionChange"), this._name);
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
    key: "render",
    value: function render() {
      return _react.default.createElement("span", null, this.renderItems());
    }
  }, {
    key: "renderItem",
    value: function renderItem(value) {
      return _react.default.createElement("input", {
        key: value,
        value: value,
        type: this.props.inputType,
        name: this.props.inputName,
        readOnly: true
      });
    }
  }, {
    key: "renderItems",
    value: function renderItems() {
      var items = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.selectedItemsMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var value = _step.value;
          items.push(this.renderItem(value));
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
  }]);

  _inherits(CradminHiddenInputList, _React$Component);

  return CradminHiddenInputList;
}(_react.default.Component);

exports.default = CradminHiddenInputList;