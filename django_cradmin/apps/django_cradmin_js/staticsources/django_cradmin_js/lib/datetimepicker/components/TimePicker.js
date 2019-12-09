"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _TimeDisplay = _interopRequireDefault(require("./TimeDisplay"));

var _RangeSlider = _interopRequireDefault(require("../../components/RangeSlider"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _moment = _interopRequireDefault(require("moment"));

var _BemUtilities = _interopRequireDefault(require("../../utilities/BemUtilities"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var TimePicker =
/*#__PURE__*/
function (_React$Component) {
  function TimePicker() {
    _classCallCheck(this, TimePicker);

    return _possibleConstructorReturn(this, _getPrototypeOf(TimePicker).apply(this, arguments));
  }

  _createClass(TimePicker, [{
    key: "getMoment",
    value: function getMoment() {
      var momentObject = null;

      if (this.props.momentObject === null) {
        momentObject = this.props.initialFocusMomentObject.clone();
      } else {
        momentObject = this.props.momentObject.clone();
      }

      return momentObject;
    }
  }, {
    key: "renderTimeDisplay",
    value: function renderTimeDisplay() {
      return _react.default.createElement(_TimeDisplay.default, this.timeDisplayComponentProps);
    }
  }, {
    key: "renderTimeDisplayWrapper",
    value: function renderTimeDisplayWrapper() {
      return _react.default.createElement("p", {
        className: 'text-center',
        key: 'time-display-wrapper'
      }, this.renderTimeDisplay());
    }
  }, {
    key: "renderHourPicker",
    value: function renderHourPicker() {
      return _react.default.createElement("label", {
        className: "label",
        key: 'hour'
      }, gettext.gettext('Hours'), ":", _react.default.createElement(_RangeSlider.default, {
        value: this.getMoment().hour(),
        min: 0,
        max: 23,
        onChange: this.changeHours.bind(this)
      }));
    }
  }, {
    key: "renderMinutePicker",
    value: function renderMinutePicker() {
      return _react.default.createElement("label", {
        className: "label",
        key: 'minute'
      }, gettext.gettext('Minutes'), ":", _react.default.createElement(_RangeSlider.default, {
        value: this.getMoment().minute(),
        min: 0,
        max: 59,
        onChange: this.changeMinutes.bind(this)
      }));
    }
  }, {
    key: "renderSecondPicker",
    value: function renderSecondPicker() {
      if (!this.props.showSeconds) {
        return null;
      }

      return _react.default.createElement("label", {
        className: "label",
        key: 'second'
      }, gettext.gettext('Seconds'), ":", _react.default.createElement(_RangeSlider.default, {
        value: this.getMoment().second(),
        min: 0,
        max: 59,
        onChange: this.changeSeconds.bind(this)
      }));
    }
  }, {
    key: "renderTimePickers",
    value: function renderTimePickers() {
      return [this.renderHourPicker(), this.renderMinutePicker(), this.renderSecondPicker()];
    }
  }, {
    key: "makeShortcutButtonClassName",
    value: function makeShortcutButtonClassName() {
      var bemVariants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return _BemUtilities.default.buildBemElement('buttonbar', 'button', [bemVariants].concat(['compact']));
    }
  }, {
    key: "renderNowButtonLabel",
    value: function renderNowButtonLabel() {
      return gettext.gettext('Now');
    }
  }, {
    key: "renderNowButton",
    value: function renderNowButton() {
      return _react.default.createElement("button", {
        type: 'button',
        key: 'nowButton',
        className: this.makeShortcutButtonClassName(),
        onClick: this.onClickNowButton.bind(this)
      }, this.renderNowButtonLabel());
    }
  }, {
    key: "renderShortcutButtons",
    value: function renderShortcutButtons() {
      return [this.renderNowButton()];
    }
  }, {
    key: "renderShortcutButtonBar",
    value: function renderShortcutButtonBar() {
      return _react.default.createElement("div", {
        key: 'shortcutButtonBar',
        className: 'text-center'
      }, _react.default.createElement("div", {
        className: 'buttonbar buttonbar--inline'
      }, this.renderShortcutButtons()));
    }
  }, {
    key: "render",
    value: function render() {
      return [this.renderTimeDisplayWrapper(), this.renderTimePickers(), this.props.includeShortcuts ? this.renderShortcutButtonBar() : null];
    }
  }, {
    key: "_cleanMoment",
    value: function _cleanMoment(momentObject) {
      momentObject.millisecond(0);

      if (!this.props.showSeconds) {
        momentObject.second(0);
      }

      return momentObject;
    }
  }, {
    key: "onClickNowButton",
    value: function onClickNowButton() {
      var today = (0, _moment.default)();
      var momentObject = this.getMoment().clone();
      momentObject.hour(today.hour());
      momentObject.minute(today.minute());
      momentObject.second(today.second());
      momentObject.millisecond(0);
      this.props.onChange(this._cleanMoment(momentObject));
    }
  }, {
    key: "changeHours",
    value: function changeHours(hours) {
      var momentObject = this.getMoment().clone();
      momentObject.hours(hours);
      this.props.onChange(this._cleanMoment(momentObject));
    }
  }, {
    key: "changeMinutes",
    value: function changeMinutes(minutes) {
      var momentObject = this.getMoment().clone();
      momentObject.minutes(minutes);
      this.props.onChange(this._cleanMoment(momentObject));
    }
  }, {
    key: "changeSeconds",
    value: function changeSeconds(seconds) {
      var momentObject = this.getMoment().clone();
      momentObject.seconds(seconds);
      this.props.onChange(this._cleanMoment(momentObject));
    }
  }, {
    key: "timeDisplayComponentProps",
    get: function get() {
      return {
        momentObject: this.getMoment(),
        showSeconds: this.props.showSeconds,
        bemVariants: ['xlarge']
      };
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        momentObject: null,
        initialFocusMomentObject: (0, _moment.default)(),
        showSeconds: false,
        onChange: null,
        includeShortcuts: true
      };
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        momentObject: _propTypes.default.any,
        initialFocusMomentObject: _propTypes.default.any.isRequired,
        showSeconds: _propTypes.default.bool.isRequired,
        onChange: _propTypes.default.func.isRequired,
        includeShortcuts: _propTypes.default.bool
      };
    }
  }]);

  _inherits(TimePicker, _React$Component);

  return TimePicker;
}(_react.default.Component);

exports.default = TimePicker;