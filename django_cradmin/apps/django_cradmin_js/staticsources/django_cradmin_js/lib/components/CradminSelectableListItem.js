"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHotkeys = require("react-hotkeys");

var _DomUtilities = _interopRequireDefault(require("../utilities/DomUtilities"));

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

var CradminSelectableListItem =
/*#__PURE__*/
function (_React$Component) {
  _createClass(CradminSelectableListItem, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        className: 'selectable-list__item',
        selectedClassName: 'selectable-list__item--selected',
        contentClassName: 'selectable-list__itemcontent',
        renderIcon: false,
        iconWrapperClassName: 'selectable-list__icon',
        selectedIconClassName: 'cricon cricon--check cricon--color-light',
        titleTagName: 'strong',
        titleClassName: 'selectable-list__itemtitle',
        descriptionClassName: '',
        isSelected: false,
        selectCallback: null,
        setDataListFocus: true,
        renderMode: 'TitleAndDescription',
        focusClosestSiblingOnSelect: true,
        previousItemData: null,
        nextItemData: null,
        disableTabNavigation: false,
        useHotKeys: false
      };
    }
  }]);

  function CradminSelectableListItem(props) {
    var _this;

    _classCallCheck(this, CradminSelectableListItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CradminSelectableListItem).call(this, props));
    _this._name = "django_cradmin.components.CradminSelectableListItem.".concat(_this.props.signalNameSpace, ".").concat(_this.props.itemKey);
    _this.handleSelect = _this.handleSelect.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._onFocusOnSelectableItemSignal = _this._onFocusOnSelectableItemSignal.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.initializeSignalHandlers();

    return _this;
  }

  _createClass(CradminSelectableListItem, [{
    key: "initializeSignalHandlers",
    value: function initializeSignalHandlers() {
      new _SignalHandlerSingleton.default().addReceiver("".concat(this.props.signalNameSpace, ".FocusOnSelectableItem.").concat(this.props.itemKey), this._name, this._onFocusOnSelectableItemSignal);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      new _SignalHandlerSingleton.default().removeAllSignalsFromReceiver(this._name);
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(event) {
      event.preventDefault();

      if (this.props.isSelected) {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".DeSelectItem"), this.props.data);
      } else {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SelectItem"), this.props.data);

        if (this.props.focusClosestSiblingOnSelect) {
          var closestSiblingData = this.props.nextItemData;

          if (closestSiblingData == null) {
            closestSiblingData = this.props.previousItemData;
          }

          if (closestSiblingData == null) {
            new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".CouldNotFocusOnClosestSelectableItem"));
          } else {
            new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".FocusOnSelectableItem"), closestSiblingData);
          }
        }
      }
    }
  }, {
    key: "_onFocusOnSelectableItemSignal",
    value: function _onFocusOnSelectableItemSignal() {
      _DomUtilities.default.forceFocus(this._domElement);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus() {
      if (this.props.setDataListFocus) {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Focus"));
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      if (this.props.setDataListFocus) {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".Blur"));
      }
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return _react.default.createElement(this.props.titleTagName, {
        className: this.props.titleClassName
      }, this.props.data.title);
    }
  }, {
    key: "renderDescription",
    value: function renderDescription() {
      if (this.props.data.description && this.props.data.description != '') {
        return _react.default.createElement("p", {
          className: this.props.descriptionClassName
        }, this.props.data.description);
      } else {
        return '';
      }
    }
  }, {
    key: "renderIcon",
    value: function renderIcon() {
      if (this.props.isSelected) {
        return _react.default.createElement("i", {
          className: this.props.selectedIconClassName
        });
      } else {
        return '';
      }
    }
  }, {
    key: "renderIconWrapper",
    value: function renderIconWrapper() {
      if (this.props.renderIcon) {
        return _react.default.createElement("div", {
          className: this.props.iconWrapperClassName
        }, this.renderIcon());
      } else {
        return '';
      }
    }
  }, {
    key: "renderContentModeTitleAndDescription",
    value: function renderContentModeTitleAndDescription() {
      return _react.default.createElement("div", {
        className: this.props.contentClassName
      }, this.renderTitle(), this.renderDescription());
    }
  }, {
    key: "renderContentModeTitleOnly",
    value: function renderContentModeTitleOnly() {
      return _react.default.createElement("div", {
        className: this.props.contentClassName
      }, this.props.data.title);
    }
  }, {
    key: "renderContentModeHtml",
    value: function renderContentModeHtml() {
      return _react.default.createElement("div", {
        className: this.props.contentClassName,
        dangerouslySetInnerHTML: {
          __html: this.props.data.html
        }
      });
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      if (this.props.renderMode == 'TitleAndDescription') {
        return this.renderContentModeTitleAndDescription();
      } else if (this.props.renderMode == 'TitleOnly') {
        return this.renderContentModeTitleOnly();
      } else if (this.props.renderMode == 'html') {
        return this.renderContentModeHtml();
      } else {
        throw new Error("Invalid renderMode: ".concat(this.props.renderMode));
      }
    }
  }, {
    key: "getTabIndex",
    value: function getTabIndex() {
      if (this.props.disableTabNavigation) {
        return "-1";
      } else {
        return "0";
      }
    }
  }, {
    key: "_focusPreviousItem",
    value: function _focusPreviousItem() {
      if (this.props.previousItemData == null) {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".FocusBeforeFirstSelectableItem"));
      } else {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".FocusOnSelectableItem"), this.props.previousItemData);
      }
    }
  }, {
    key: "_focusNextItem",
    value: function _focusNextItem() {
      if (this.props.nextItemData == null) {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".FocusAfterLastSelectableItem"));
      } else {
        new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".FocusOnSelectableItem"), this.props.nextItemData);
      }
    }
  }, {
    key: "_onEscapeKey",
    value: function _onEscapeKey() {
      new _SignalHandlerSingleton.default().send("".concat(this.props.signalNameSpace, ".SelectableItemEscapeKey"));
    }
  }, {
    key: "renderWrapper",
    value: function renderWrapper() {
      var _this2 = this;

      return _react.default.createElement("a", {
        href: "#",
        className: this.fullClassName,
        ref: function ref(domElement) {
          _this2._domElement = domElement;
        },
        tabIndex: this.getTabIndex(),
        onClick: this.handleSelect,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        "aria-label": this.ariaTitle,
        role: "button"
      }, this.renderIconWrapper(), this.renderContent());
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.useHotKeys) {
        return _react.default.createElement(_reactHotkeys.HotKeys, {
          keyMap: this.hotKeysMap,
          handlers: this.hotKeysHandlers
        }, this.renderWrapper());
      } else {
        return this.renderWrapper();
      }
    }
  }, {
    key: "ariaTitle",
    get: function get() {
      if (this.props.data.ariaTitle) {
        return this.props.data.ariaTitle;
      } else {
        return this.props.data.title;
      }
    }
  }, {
    key: "fullClassName",
    get: function get() {
      var className = this.props.className;

      if (this.props.isSelected) {
        className = "".concat(className, " ").concat(this.props.selectedClassName);
      }

      return className;
    }
  }, {
    key: "hotKeysMap",
    get: function get() {
      return {
        'focusPreviousItem': ['up'],
        'focusNextItem': ['down'],
        'escapeKey': ['escape']
      };
    }
  }, {
    key: "hotKeysHandlers",
    get: function get() {
      var _this3 = this;

      return {
        'focusPreviousItem': function focusPreviousItem(event) {
          event.preventDefault();

          _this3._focusPreviousItem();
        },
        'focusNextItem': function focusNextItem(event) {
          event.preventDefault();

          _this3._focusNextItem();
        },
        'escapeKey': function escapeKey(event) {
          event.preventDefault();

          _this3._onEscapeKey();
        }
      };
    }
  }]);

  _inherits(CradminSelectableListItem, _React$Component);

  return CradminSelectableListItem;
}(_react.default.Component);

exports.default = CradminSelectableListItem;