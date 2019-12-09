"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _LoggerSingleton = _interopRequireDefault(require("ievv_jsbase/lib/log/LoggerSingleton"));

var _ObjectManager = _interopRequireDefault(require("ievv_jsbase/lib/utils/ObjectManager"));

var _CradminDateSelector = _interopRequireDefault(require("./CradminDateSelector"));

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

/**
 * Renders a UI for adding entries to a calendar.
 */
var CradminCalendarAdd =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminCalendarAdd, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        signalNameSpace: null,
        className: 'calendar-add',
        dateSelectorProps: {}
      };
    }
  }]);

  function CradminCalendarAdd(props) {
    var _this;

    _classCallCheck(this, CradminCalendarAdd);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminCalendarAdd).call(this, props));

    if (_this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }

    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminCalendarAdd');
    _this._fromDateSelectorProps = _ObjectManager.default.mergeAndClone(_this.props.dateSelectorProps, {
      signalNameSpace: "".concat(_this.props.signalNameSpace, ".FromDateTime")
    });
    _this._toDateSelectorProps = _ObjectManager.default.mergeAndClone(_this.props.dateSelectorProps, {
      signalNameSpace: "".concat(_this.props.signalNameSpace, ".ToDateTime")
    });
    return _this;
  }

  _createClass(CradminCalendarAdd, [{
    key: "renderDateSelectors",
    value: function renderDateSelectors() {
      return _react.default.createElement("div", null, _react.default.createElement(_CradminDateSelector.default, this._fromDateSelectorProps), "\u2014", _react.default.createElement(_CradminDateSelector.default, this._toDateSelectorProps));
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.props.className
      }, this.renderDateSelectors());
    }
  }]);

  _inherits(CradminCalendarAdd, _React$Component);

  return CradminCalendarAdd;
}(_react.default.Component);

exports.default = CradminCalendarAdd;