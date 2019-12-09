"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateOrDateTimeSelectWrapper = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

var _moment = _interopRequireDefault(require("moment"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AbstractDateOrDateTimeSelectWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(AbstractDateOrDateTimeSelectWidget, [{
    key: "getDefaultConfig",

    /**
     * @returns {Object}
     * @property datetime Something that can be passed into ``moment()`` for the initial date.
     */
    value: function getDefaultConfig() {
      return {
        locale: 'en',
        initialFocusValue: null,
        hiddenFieldId: null,
        hiddenFieldFormat: null,
        debug: true
      };
    }
  }, {
    key: "getHiddenFieldDomElement",
    value: function getHiddenFieldDomElement() {
      if (this.config.hiddenFieldId === null) {
        throw new Error("The hiddenFieldId config is required");
      }

      var domElement = document.getElementById(this.config.hiddenFieldId);

      if (domElement === null) {
        throw new Error("No DOM element with ID=".concat(this.config.hiddenFieldId, " found"));
      }

      return domElement;
    }
  }, {
    key: "getMomentObjectFromHiddenField",
    value: function getMomentObjectFromHiddenField(hiddenFieldDomElement) {
      var value = hiddenFieldDomElement.value;

      if (!value || value === '') {
        return null;
      }

      return (0, _moment.default)(value);
    }
  }, {
    key: "getInitialFocusMomentObject",
    value: function getInitialFocusMomentObject() {
      if (this.config.initialFocusValue === null) {
        return (0, _moment.default)();
      }

      return (0, _moment.default)(this.config.initialFocusValue);
    }
  }, {
    key: "renderWrapper",
    value: function renderWrapper() {
      return _react.default.createElement(DateOrDateTimeSelectWrapper, this.wrapperProps);
    }
  }, {
    key: "componentClass",
    get: function get() {
      throw new Error('componentClass getter must be implemented in subclasses');
    }
  }, {
    key: "wrapperProps",
    get: function get() {
      var hiddenFieldDomElement = this.getHiddenFieldDomElement();
      var momentObject = this.getMomentObjectFromHiddenField(hiddenFieldDomElement);
      var wrappedComponentProps = Object.assign({
        initialFocusMomentObject: this.getInitialFocusMomentObject()
      }, this.config);
      delete wrappedComponentProps.hiddenFieldId;
      delete wrappedComponentProps.hiddenFieldFormat;
      delete wrappedComponentProps.initialFocusValue;
      return {
        wrappedComponentProps: wrappedComponentProps,
        componentClass: this.componentClass,
        momentObject: momentObject,
        hiddenFieldId: this.config.hiddenFieldId,
        hiddenFieldFormat: this.config.hiddenFieldFormat,
        hiddenFieldDomElement: hiddenFieldDomElement,
        debug: this.config.debug
      };
    }
  }]);

  function AbstractDateOrDateTimeSelectWidget(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, AbstractDateOrDateTimeSelectWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractDateOrDateTimeSelectWidget).call(this, element, widgetInstanceId));

    _reactDom.default.render(_this.renderWrapper(), _this.element);

    return _this;
  }

  _createClass(AbstractDateOrDateTimeSelectWidget, [{
    key: "destroy",
    value: function destroy() {
      _reactDom.default.unmountComponentAtNode(this.element);
    }
  }]);

  _inherits(AbstractDateOrDateTimeSelectWidget, _AbstractWidget);

  return AbstractDateOrDateTimeSelectWidget;
}(_AbstractWidget2.default);

exports.default = AbstractDateOrDateTimeSelectWidget;

var DateOrDateTimeSelectWrapper =
/*#__PURE__*/
function (_React$Component) {
  _createClass(DateOrDateTimeSelectWrapper, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        hiddenFieldId: null,
        hiddenFieldFormat: null,
        hiddenFieldDomElement: null,
        componentClass: null,
        wrappedComponentProps: null,
        debug: false
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any,
        hiddenFieldId: _propTypes.default.string.isRequired,
        hiddenFieldFormat: _propTypes.default.string.isRequired,
        hiddenFieldDomElement: _propTypes.default.any.isRequired,
        componentClass: _propTypes.default.any.isRequired,
        wrappedComponentProps: _propTypes.default.object.isRequired,
        debug: _propTypes.default.bool.isRequired
      };
    }
  }]);

  function DateOrDateTimeSelectWrapper(props) {
    var _this2;

    _classCallCheck(this, DateOrDateTimeSelectWrapper);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DateOrDateTimeSelectWrapper).call(this, props));
    _this2.onChange = _this2.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    _this2.state = _this2.makeInitialState();
    return _this2;
  }

  _createClass(DateOrDateTimeSelectWrapper, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      return {
        selectedMoment: this.props.momentObject
      };
    }
  }, {
    key: "onChange",
    value: function onChange(momentObject) {
      var _this3 = this;

      this.setState({
        selectedMoment: momentObject
      }, function () {
        _this3.props.hiddenFieldDomElement.value = _this3.hiddenFieldValue;
      });
    }
  }, {
    key: "renderWrappedComponent",
    value: function renderWrappedComponent() {
      var ComponentClass = this.props.componentClass;
      return _react.default.createElement(ComponentClass, _extends({
        key: 'datetimeComponent',
        momentObject: this.state.selectedMoment,
        onChange: this.onChange
      }, this.props.wrappedComponentProps));
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderWrappedComponent();
    }
  }, {
    key: "hiddenFieldValue",
    get: function get() {
      if (this.state.selectedMoment !== null) {
        return this.state.selectedMoment.format(this.props.hiddenFieldFormat);
      }

      return '';
    }
  }]);

  _inherits(DateOrDateTimeSelectWrapper, _React$Component);

  return DateOrDateTimeSelectWrapper;
}(_react.default.Component);

exports.DateOrDateTimeSelectWrapper = DateOrDateTimeSelectWrapper;