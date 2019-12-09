"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Html5DateInputWrapper = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

var _Html5DateInput = _interopRequireDefault(require("../Html5DateInput"));

var _moment = _interopRequireDefault(require("moment/moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Add the widget to a Django template
 *
 * @example
 * <input type="hidden" id="id_test100">
 * <div data-ievv-jsbase-widget="cradmin-html5-datepicker"
 *      data-ievv-jsbase-widget-config='{"hiddenFieldId": "id_test100", "ariaLabel": "Select a date"}'>
 * </div>
 */
var Html5DateInputWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(Html5DateInputWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        hiddenFieldId: null
      };
    }
  }, {
    key: "getHiddenFieldInitialValue",
    value: function getHiddenFieldInitialValue(hiddenFieldDomElement) {
      var value = hiddenFieldDomElement.value;

      if (!value || value === '') {
        return '';
      }

      return (0, _moment.default)(value).format('YYYY-MM-DD');
    }
  }, {
    key: "renderWrapper",
    value: function renderWrapper() {
      return _react.default.createElement(Html5DateInputWrapper, this.wrapperProps);
    }
  }, {
    key: "wrapperProps",
    get: function get() {
      var hiddenFieldDomElement = document.getElementById(this.config.hiddenFieldId);
      var hiddenFieldValue = this.getHiddenFieldInitialValue(hiddenFieldDomElement);
      var wrappedComponentProps = Object.assign(_objectSpread({
        value: hiddenFieldValue
      }, this.config));
      delete wrappedComponentProps.hiddenFieldId;
      return {
        componentClass: _Html5DateInput.default,
        wrappedComponentProps: wrappedComponentProps,
        hiddenFieldId: this.config.hiddenFieldId,
        hiddenFieldDomElement: hiddenFieldDomElement
      };
    }
  }]);

  function Html5DateInputWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, Html5DateInputWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Html5DateInputWidget).call(this, element, widgetInstanceId));

    _reactDom.default.render(_this.renderWrapper(), _this.element);

    return _this;
  }

  _createClass(Html5DateInputWidget, [{
    key: "destroy",
    value: function destroy() {
      _reactDom.default.unmountComponentAtNode(this.element);
    }
  }]);

  _inherits(Html5DateInputWidget, _AbstractWidget);

  return Html5DateInputWidget;
}(_AbstractWidget2.default);

exports.default = Html5DateInputWidget;

var Html5DateInputWrapper =
/*#__PURE__*/
function (_React$Component) {
  _createClass(Html5DateInputWrapper, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        hiddenFieldId: null,
        hiddenFieldDomElement: null,
        wrappedComponentProps: null,
        componentClass: null
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        hiddenFieldId: _propTypes.default.string.isRequired,
        hiddenFieldDomElement: _propTypes.default.any.isRequired,
        wrappedComponentProps: _propTypes.default.object.isRequired,
        componentClass: _propTypes.default.any.isRequired
      };
    }
  }]);

  function Html5DateInputWrapper(props) {
    var _this2;

    _classCallCheck(this, Html5DateInputWrapper);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Html5DateInputWrapper).call(this, props));
    _this2.onChange = _this2.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(Html5DateInputWrapper, [{
    key: "onChange",
    value: function onChange(isoStringValue) {
      console.log(isoStringValue);
      this.props.hiddenFieldDomElement.value = isoStringValue;
    }
  }, {
    key: "renderWrappedComponent",
    value: function renderWrappedComponent() {
      var ComponentClass = this.props.componentClass;
      return _react.default.createElement(ComponentClass, _extends({
        key: 'html5dateComponent',
        onChange: this.onChange
      }, this.props.wrappedComponentProps));
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderWrappedComponent();
    }
  }]);

  _inherits(Html5DateInputWrapper, _React$Component);

  return Html5DateInputWrapper;
}(_react.default.Component);

exports.Html5DateInputWrapper = Html5DateInputWrapper;