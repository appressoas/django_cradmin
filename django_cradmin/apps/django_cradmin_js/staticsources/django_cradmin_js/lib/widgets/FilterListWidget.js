"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

var _FilterListRegistrySingleton = _interopRequireDefault(require("../filterlist/FilterListRegistrySingleton"));

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

var FilterListWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(FilterListWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        component: 'PageNumberPaginationFilterList'
      };
    }
  }]);

  function FilterListWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, FilterListWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterListWidget).call(this, element, widgetInstanceId));
    var registry = new _FilterListRegistrySingleton.default();

    if (!_this.config.component) {
      throw new Error('The "component" config is required');
    }

    var filterListComponentClass = registry.getFilterListComponent(_this.config.component);

    if (!filterListComponentClass) {
      throw new Error("No filterlist component registered for " + "the \"".concat(_this.config.component, "\" alias."));
    }

    delete _this.config.component;

    var reactElement = _react.default.createElement(filterListComponentClass, _this.config);

    _reactDom.default.render(reactElement, _this.element);

    return _this;
  }

  _createClass(FilterListWidget, [{
    key: "destroy",
    value: function destroy() {
      _reactDom.default.unmountComponentAtNode(this.element);
    }
  }]);

  _inherits(FilterListWidget, _AbstractWidget);

  return FilterListWidget;
}(_AbstractWidget2.default);

exports.default = FilterListWidget;