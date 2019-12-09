"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Widget used by uicontainer.Form for disabling "Enter" key to prevent form being submitted when
 * editing e.g a input-field.
 *
 * This widget exists mostly to prevent form submitting because we have
 * a lot of views combining jsbase-widgets and django-forms resulting in editing a input-field in a widget with the same
 * name as a django-form input-field resulted in the data being posted and django-form input-field value being
 * overwritten in the data from the jsbase-widget.
 *
 * This widget will prevent registering "Enter"-keypress on all input and non-input fields unless it's:
 *  - of type 'textarea'
 *  - html-element is a button (for accessibility)
 */
var DisableFormSubmitOnEnter =
/*#__PURE__*/
function (_AbstractWidget) {
  function DisableFormSubmitOnEnter(element, widgetInstanceId) {
    var _this;

    _classCallCheck(this, DisableFormSubmitOnEnter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DisableFormSubmitOnEnter).call(this, element, widgetInstanceId));

    var suppressEnter = function suppressEnter(event) {
      var target = null;

      if (event.target) {
        target = event.target;
      } else if (event.srcElement) {
        target = event.srcElement;
      }

      if (target && event.keyCode === 13 && target.nodeName === 'BUTTON') {
        return true;
      } else if (target && event.keyCode === 13 && target.type !== 'textarea') {
        return false;
      }
    };

    element.onkeypress = suppressEnter;
    return _this;
  }

  _inherits(DisableFormSubmitOnEnter, _AbstractWidget);

  return DisableFormSubmitOnEnter;
}(_AbstractWidget2.default);

exports.default = DisableFormSubmitOnEnter;