"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _moment = _interopRequireDefault(require("moment"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _AbstractHtml5DatetimeInput = _interopRequireDefault(require("./AbstractHtml5DatetimeInput"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var Html5DateInput =
/*#__PURE__*/
function (_AbstractHtml5Datetim) {
  function Html5DateInput() {
    _classCallCheck(this, Html5DateInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(Html5DateInput).apply(this, arguments));
  }

  _createClass(Html5DateInput, [{
    key: "valueStringToMoment",
    value: function valueStringToMoment(stringValue) {
      if (stringValue) {
        var momentValue = (0, _moment.default)(stringValue);

        if (momentValue.isValid()) {
          return momentValue;
        }
      }

      return null;
    }
  }, {
    key: "makeValidInputFieldValue",
    value: function makeValidInputFieldValue(valueString) {
      if (this.browserFullySupportsDateInput() || !valueString) {
        return valueString;
      }

      var momentValue = (0, _moment.default)(valueString);

      if (!momentValue.isValid()) {
        return valueString;
      }

      return momentValue.format(this.inputFormat);
    }
  }, {
    key: "parseInputValue",
    value: function parseInputValue(stringValue) {
      var momentValue = null;
      var isValid = true;
      var isoStringValue = '';

      if (stringValue) {
        momentValue = (0, _moment.default)(stringValue, this.inputFormat);

        if (momentValue.isValid()) {
          isoStringValue = momentValue.format('YYYY-MM-DD');
        } else {
          momentValue = null;
          isValid = false;
        }
      }

      return {
        isValid: isValid,
        momentValue: momentValue,
        isoStringValue: isoStringValue
      };
    }
  }, {
    key: "handleChange",
    value: function handleChange(stringValue) {
      var _this = this;

      stringValue = stringValue || '';
      this.setState({
        value: stringValue
      }, function () {
        var parseResult = _this.parseInputValue(stringValue);

        _this.props.onChange(parseResult.isoStringValue, parseResult.momentValue);
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      var stringValue = e.target.value || '';
      var parseResult = this.parseInputValue(stringValue);

      if (parseResult.isoStringValue !== '') {
        stringValue = parseResult.momentValue.format(this.inputFormat);
      }

      this.setState({
        isBlurred: true,
        value: stringValue
      });
      this.props.onBlur(e);
    }
  }, {
    key: "getInputType",
    value: function getInputType() {
      return 'date';
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      return _react.default.createElement("input", _extends({}, this.inputProps, {
        key: 'date input'
      }));
    }
  }, {
    key: "renderInvalidInputText",
    value: function renderInvalidInputText() {
      var prefix = '';

      if (this.state.isBlurred) {
        prefix = "".concat(gettext.gettext('Invalid date format'), ". ");
      }

      var commonText = gettext.interpolate(gettext.gettext('Please type a date using this format: %(format)s'), {
        format: this.humanReadableInputFormat
      }, true);
      return "".concat(prefix).concat(commonText);
    }
  }, {
    key: "momentValue",
    get: function get() {
      return this.valueStringToMoment(this.props.value);
    }
  }, {
    key: "inputFormat",
    get: function get() {
      if (this.browserFullySupportsDateInput()) {
        return 'YYYY-MM-DD';
      }

      return _moment.default.localeData().longDateFormat('L');
    }
  }, {
    key: "humanReadableInputFormat",
    get: function get() {
      return gettext.pgettext('date format', this.inputFormat);
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(Html5DateInput), "defaultProps", this), {
        clearButtonTitle: gettext.pgettext('cradmin html5 date', 'Clear date'),
        onBlur: function onBlur() {}
      });
    }
  }, {
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(Html5DateInput), "propTypes", this), {
        onBlur: _propTypes.default.func
      });
    }
  }]);

  _inherits(Html5DateInput, _AbstractHtml5Datetim);

  return Html5DateInput;
}(_AbstractHtml5DatetimeInput.default);

exports.default = Html5DateInput;