"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _AbstractHtml5DatetimeInput = _interopRequireDefault(require("./AbstractHtml5DatetimeInput"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Html5TimeInput =
/*#__PURE__*/
function (_AbstractHtml5Datetim) {
  _inherits(Html5TimeInput, _AbstractHtml5Datetim);

  function Html5TimeInput() {
    _classCallCheck(this, Html5TimeInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(Html5TimeInput).apply(this, arguments));
  }

  _createClass(Html5TimeInput, [{
    key: "getInputType",
    value: function getInputType() {
      return 'time';
    }
  }, {
    key: "makeValidInputFieldValue",
    value: function makeValidInputFieldValue(stringValue) {
      return stringValue;
    }
  }, {
    key: "parseInputValue",
    value: function parseInputValue(stringValue) {
      var isValid = Html5TimeInput.isValidTime(stringValue);

      if (!isValid) {
        stringValue = '';
      }

      return {
        isValid: isValid,
        timeStringValue: stringValue
      };
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      var stringValue = e.target.value || '';
      var parseResult = this.parseInputValue(stringValue);
      this.setState({
        isBlurred: true,
        value: parseResult.timeStringValue
      });
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

        _this.props.onChange(parseResult.timeStringValue);
      });
    }
  }, {
    key: "renderInvalidInputText",
    value: function renderInvalidInputText() {
      var prefix = '';

      if (this.state.isBlurred) {
        prefix = "".concat(gettext.gettext('Invalid time format'), ". ");
      }

      var commonText = gettext.interpolate(gettext.gettext('Please type a time using this format: %(format)s'), {
        format: this.humanReadableInputFormat
      }, true);
      return "".concat(prefix).concat(commonText);
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      return _react.default.createElement("input", _extends({}, this.inputProps, {
        key: 'time input'
      }));
    }
  }, {
    key: "inputFormat",
    get: function get() {
      return 'HH:MM';
    }
  }, {
    key: "humanReadableInputFormat",
    get: function get() {
      return gettext.pgettext('time format', this.inputFormat);
    }
  }], [{
    key: "isValidTime",
    value: function isValidTime(value) {
      return /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(value);
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(Html5TimeInput), "defaultProps", this), {
        clearButtonTitle: gettext.pgettext('cradmin html5 date', 'Clear time')
      });
    }
  }]);

  return Html5TimeInput;
}(_AbstractHtml5DatetimeInput.default);

exports.default = Html5TimeInput;