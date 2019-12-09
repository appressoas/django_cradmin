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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Autosubmit form after a timeout widget.
 *
 * @example
 * <form action="/test" method="post">
 *     <p>
 *        Will autosubmit in
 *        <span data-ievv-jsbase-widget="cradmin-auto-submit-form-after-countdown"
 *              data-ievv-jsbase-widget-config='{
 *                "timeoutSeconds": 5
 *              }'>
 *            5
 *        </span>
 *        seconds!
 *     </p>
 * </form>
 */
var AutoSubmitFormAfterCountdownWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(AutoSubmitFormAfterCountdownWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        timeoutSeconds: 5
      };
    }
  }]);

  function AutoSubmitFormAfterCountdownWidget(element) {
    var _this;

    _classCallCheck(this, AutoSubmitFormAfterCountdownWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AutoSubmitFormAfterCountdownWidget).call(this, element));
    _this._timeoutId = null;
    _this._secondsRemaining = _this.config.timeoutSeconds;
    _this._form = _this._findForm();

    _this._onTick();

    return _this;
  }

  _createClass(AutoSubmitFormAfterCountdownWidget, [{
    key: "_findForm",
    value: function _findForm() {
      var element = this.element;

      while (element != null) {
        if (element.nodeName.toLowerCase() == 'form') {
          return element;
        }

        element = element.parentElement;
      }

      throw new Error('Could not find a FORM element within the parent hierarchy of this element.');
    }
  }, {
    key: "_onTick",
    value: function _onTick() {
      var _this2 = this;

      this._secondsRemaining--;

      this._updateCounter();

      if (this._secondsRemaining < 1) {
        this._form.submit();
      } else {
        this._timeoutId = window.setTimeout(function () {
          _this2._onTick();
        }, 1000);
      }
    }
  }, {
    key: "_updateCounter",
    value: function _updateCounter() {
      this.element.innerHTML = "".concat(this._secondsRemaining);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this._timeoutId != null) {
        window.clearTimeout(this._timeoutId);
      }
    }
  }]);

  _inherits(AutoSubmitFormAfterCountdownWidget, _AbstractWidget);

  return AutoSubmitFormAfterCountdownWidget;
}(_AbstractWidget2.default);

exports.default = AutoSubmitFormAfterCountdownWidget;