"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Html5FromToDateSelectors = _interopRequireDefault(require("../../../html5datetimepicker/Html5FromToDateSelectors"));

var _AbstractFilter2 = _interopRequireDefault(require("./AbstractFilter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Html5FromToDateFilter filter that does something.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "Html5FromToDateFilter",
 *    "props": {
 *      "name": "<some name here>",
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "Html5FromToDateFilter",
 *    "initialValue": "2018-12-24,2019-04-29",
 *    "props": {
 *      "name": "christmas_range",
 *      "label": "Christmas ends on",
 *      "expandedLabel": "Christmas lasts ...",
 *      "fromDateExpandedLabel": "From",
 *      "toDateExpandedLabel": "To",
 *      "expandToggleLabel": "Show range",
 *      "isExpandedInitially": true,
 *      "displayExpandToggle": true,
 *    }
 * }
 */
var Html5FromToDateFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  _createClass(Html5FromToDateFilter, null, [{
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(Html5FromToDateFilter), "propTypes", this), {
        value: _propTypes.default.string.isRequired,
        dateSelectorProps: _propTypes.default.shape({
          label: _propTypes.default.string.isRequired,
          expandedLabel: _propTypes.default.string,
          commonDateOptions: _propTypes.default.shape({}).isRequired,
          isExpandedInitially: _propTypes.default.bool.isRequired,
          toDateExpandedLabel: _propTypes.default.string,
          fromDateExpandedLabel: _propTypes.default.string,
          expandToggleLabel: _propTypes.default.string,
          displayExpandToggle: _propTypes.default.bool
        })
      });
    }
  }]);

  function Html5FromToDateFilter(props) {
    var _this;

    _classCallCheck(this, Html5FromToDateFilter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Html5FromToDateFilter).call(this, props));
    _this.handleChangeTimeout = null;
    return _this;
  }

  _createClass(Html5FromToDateFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(Html5FromToDateFilter.prototype), "setupBoundMethods", this).call(this);

      this.handleDateChange = this.handleDateChange.bind(this);
    }
  }, {
    key: "_clearTimeout",
    value: function _clearTimeout() {
      if (this.handleChangeTimeout === null) {
        return;
      }

      window.clearTimeout(this.handleChangeTimeout);
    }
  }, {
    key: "handleDateChange",
    value: function handleDateChange(fromDate, toDate) {
      var _this2 = this;

      var skipTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this._clearTimeout();

      var filterValue = "".concat(fromDate || '', ",").concat(toDate || '');

      if (skipTimeout) {
        this.setFilterValue(filterValue);
      } else {
        this.handleChangeTimeout = window.setTimeout(function () {
          _this2.setFilterValue(filterValue);
        }, 1000);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var config = _objectSpread({}, this.props.dateSelectorProps, {
        fromDateValue: this.fromDate,
        toDateValue: this.toDate,
        onChange: this.handleDateChange
      });

      return _react.default.createElement(_Html5FromToDateSelectors.default, config);
    }
  }, {
    key: "datesAsList",
    get: function get() {
      if (!this.props.value) {
        return ['', ''];
      }

      var split = this.props.value.split(',', 2);

      if (split.length === 0) {
        return ['', ''];
      }

      if (split.length === 1) {
        return [split[0], split[0]];
      }

      if (split.length > 2) {
        return ['', ''];
      }

      return split;
    }
  }, {
    key: "fromDate",
    get: function get() {
      return this.datesAsList[0];
    }
  }, {
    key: "toDate",
    get: function get() {
      return this.datesAsList[1];
    }
  }]);

  _inherits(Html5FromToDateFilter, _AbstractFilter);

  return Html5FromToDateFilter;
}(_AbstractFilter2.default);

exports.default = Html5FromToDateFilter;