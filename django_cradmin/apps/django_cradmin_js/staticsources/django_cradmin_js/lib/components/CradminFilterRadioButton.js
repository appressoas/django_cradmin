"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _typeDetect = _interopRequireDefault(require("ievv_jsbase/lib/utils/typeDetect"));

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

var CradminFilterRadioButton =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminFilterRadioButton, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        wrapperClassName: "",
        labelClassName: "radio radio--block",
        indicatorClassName: "radio__control-indicator",
        inputName: null,
        initialValue: null,
        optionsList: []
      };
    }
  }]);

  function CradminFilterRadioButton(props) {
    var _this;

    _classCallCheck(this, CradminFilterRadioButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminFilterRadioButton).call(this, props));

    _this._validateProps();

    _this.logger = new _LoggerSingleton.default().getLogger('django_cradmin.components.CradminFilterRadioButton');
    _this._name = "django_cradmin.components.CradminFilterRadioButton.".concat(_this.props.signalNameSpace);
    _this.originalValues = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _this.props.optionsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var option = _step.value;
        _this.originalValues["".concat(option.value)] = option.value;
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

    _this._onDataListInitializedSignal = _this._onDataListInitializedSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onChange = _this._onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFiltersChangeSignal = _this._onFiltersChangeSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocus = _this._onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onBlur = _this._onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      selectedValue: _this.getInitialValue()
    };

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminFilterRadioButton, [{
    key: "_validateProps",
    value: function _validateProps() {
      if ((0, _typeDetect.default)(this.props.optionsList) != "array" || this.props.optionsList.length == 0) {
        throw Error("this.props.optionsObject must be a list containing at least one {value: \"value\", label: \"label\"} object");
      }

      if ((0, _typeDetect.default)(this.props.inputName) != "string" || this.props.inputName == '') {
        throw Error("props.optionsList.inputName must be a valid string");
      }

      if (this.props.signalNameSpace == null) {
        throw new Error('The signalNameSpace prop is required.');
      }

      if (this.props.filterKey == null) {
        throw new Error('The filterKey prop is required.');
      }
    }
  }, {
    key: "getInitialValue",
    value: function getInitialValue() {
      if (this.props.initialValue != null) {
        return this.props.initialValue;
      }

      return this.props.optionsList[0].value;
    }
  }, {
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".DataListInitialized"), this._name, this._onDataListInitializedSignal);
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FiltersChange"), this._name, this._onFiltersChangeSignal);
    }
  }, {
    key: "_getNewValueFromFiltersMap",
    value: function _getNewValueFromFiltersMap(filtersMap) {
      var newValue = filtersMap.get(this.props.filterKey);

      if (newValue == undefined) {
        newValue = this.getInitialValue();
      }

      return newValue;
    }
  }, {
    key: "_setValueFromFiltersMap",
    value: function _setValueFromFiltersMap(filtersMap) {
      var newValue = this._getNewValueFromFiltersMap(filtersMap);

      this.setState({
        selectedValue: newValue
      });
    }
  }, {
    key: "_onDataListInitializedSignal",
    value: function _onDataListInitializedSignal(receivedSignalInfo) {
      var state = receivedSignalInfo.data;

      this._setValueFromFiltersMap(state.filtersMap);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "_sendChangeSignal",
    value: function _sendChangeSignal() {
      var filtersMapPatch = new Map();
      filtersMapPatch.set(this.props.filterKey, this.changeToValue);
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".PatchFilters"), filtersMapPatch);
    }
  }, {
    key: "_onChange",
    value: function _onChange(event) {
      event.preventDefault();
      this.changeToValue = this.originalValues[event.target.value];

      this._sendChangeSignal();
    }
  }, {
    key: "_onFocus",
    value: function _onFocus(event) {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Focus"));
    }
  }, {
    key: "_onBlur",
    value: function _onBlur(event) {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Blur"));
    }
  }, {
    key: "_onFiltersChangeSignal",
    value: function _onFiltersChangeSignal(receivedSignalInfo) {
      this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
      var filtersMap = receivedSignalInfo.data;

      this._setValueFromFiltersMap(filtersMap);
    }
  }, {
    key: "getRenderOptionIndicator",
    value: function getRenderOptionIndicator() {
      if (this.props.indicatorClassName == null || this.props.indicatorClassName == "") {
        return "";
      }

      return _react.default.createElement("span", {
        className: this.props.indicatorClassName
      });
    }
  }, {
    key: "getRenderOptions",
    value: function getRenderOptions() {
      var renderedOptions = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.props.optionsList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var option = _step2.value;

          var renderedOption = _react.default.createElement("label", {
            key: option.value,
            className: this.props.labelClassName
          }, _react.default.createElement("input", {
            type: "radio",
            name: this.props.inputName,
            value: option.value,
            onChange: this._onChange,
            checked: this.state.selectedValue == option.value,
            onFocus: this._onFocus,
            onBlur: this._onBlur
          }), this.getRenderOptionIndicator(), option.label);

          renderedOptions.push(renderedOption);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return renderedOptions;
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.props.wrapperClassName
      }, this.getRenderOptions());
    }
  }]);

  _inherits(CradminFilterRadioButton, _React$Component);

  return CradminFilterRadioButton;
}(_react.default.Component);

exports.default = CradminFilterRadioButton;