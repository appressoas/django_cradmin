"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractWidget2 = _interopRequireDefault(require("ievv_jsbase/lib/widget/AbstractWidget"));

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

var TabPanelWidget =
/*#__PURE__*/
function (_AbstractWidget) {
  _createClass(TabPanelWidget, [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        id: 'defaultTab',
        activeClass: "tabs__panel--active"
      };
    }
  }]);

  function TabPanelWidget(element) {
    var _this;

    _classCallCheck(this, TabPanelWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TabPanelWidget).call(this, element));

    if (!_this._domId) {
      throw new Error('A TabPanelWidget element must have an id attribute.');
    }

    _this._onActivateTabSignal = _this._onActivateTabSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this._initializeSignalHandlers();

    return _this;
  }

  _createClass(TabPanelWidget, [{
    key: "_initializeSignalHandlers",
    value: function _initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("cradmin.ActivateTab.".concat(this.config.id), "cradmin.TabPanelWidget.".concat(this.config.id, ".").concat(this._domId), this._onActivateTabSignal);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      new _SignalHandlerSingleton.default().removeReceiver("cradmin.ActivateTab.".concat(this.config.id), "cradmin.TabPanel.".concat(this.config.id, ".").concat(this._domId));
    }
  }, {
    key: "_hasActiveClass",
    value: function _hasActiveClass() {
      return this.element.classList.contains(this.config.activeClass);
    }
  }, {
    key: "_isAriaHidden",
    value: function _isAriaHidden() {
      return this.element.getAttribute('aria-hidden') == 'true';
    }
  }, {
    key: "_activate",
    value: function _activate() {
      if (!this._hasActiveClass()) {
        this.element.classList.add(this.config.activeClass);
      }

      if (this._isAriaHidden()) {
        this.element.setAttribute('aria-hidden', 'false');
      }
    }
  }, {
    key: "_deactivate",
    value: function _deactivate() {
      if (this._hasActiveClass()) {
        this.element.classList.remove(this.config.activeClass);
      }

      if (!this._isAriaHidden()) {
        this.element.setAttribute('aria-hidden', 'true');
      }
    }
  }, {
    key: "_onActivateTabSignal",
    value: function _onActivateTabSignal(receivedSignalInfo) {
      var tabPanelDomId = receivedSignalInfo.data.tabPanelDomId;

      if (this._domId == tabPanelDomId) {
        this._activate();
      } else {
        this._deactivate();
      }
    }
  }, {
    key: "initializeFromTabButton",
    value: function initializeFromTabButton(isActive, tabButtonDomId) {
      this.element.setAttribute('aria-labelledby', tabButtonDomId);

      if (isActive) {
        this._activate();
      } else {
        this._deactivate();
      }
    }
  }, {
    key: "_domId",
    get: function get() {
      return this.element.getAttribute('id');
    }
  }]);

  _inherits(TabPanelWidget, _AbstractWidget);

  return TabPanelWidget;
}(_AbstractWidget2.default);

exports.default = TabPanelWidget;