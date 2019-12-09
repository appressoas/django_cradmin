"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _filterListConstants = require("../../../filterListConstants");

var _AbstractGenericIdListSearchInputMultiSelect = _interopRequireDefault(require("./AbstractGenericIdListSearchInputMultiSelect"));

var _SearchInputExpandCollapseButton = _interopRequireDefault(require("../components/SearchInputExpandCollapseButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var AbstractGenericIdListDropDownSearchInputMultiSelect =
/*#__PURE__*/
function (_AbstractGenericIdLis) {
  function AbstractGenericIdListDropDownSearchInputMultiSelect() {
    _classCallCheck(this, AbstractGenericIdListDropDownSearchInputMultiSelect);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractGenericIdListDropDownSearchInputMultiSelect).apply(this, arguments));
  }

  _createClass(AbstractGenericIdListDropDownSearchInputMultiSelect, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(AbstractGenericIdListDropDownSearchInputMultiSelect.prototype), "setupBoundMethods", this).call(this);

      this.onClickExpandCollapseButton = this.onClickExpandCollapseButton.bind(this);
      this.onExpandandCollapseButtonFocus = this.onExpandandCollapseButtonFocus.bind(this);
    }
  }, {
    key: "onAnyComponentFocus",
    value: function onAnyComponentFocus(newFocusComponentInfo, prevFocusComponentInfo, didChangeFilterListFocus) {
      if (newFocusComponentInfo.uniqueComponentKey === this.props.uniqueComponentKey) {
        return;
      }

      if (newFocusComponentInfo.componentGroups === null) {
        this.disableExpandableComponentGroup();
      } else if (newFocusComponentInfo.componentGroups.indexOf(this.expandableComponentGroup) === -1) {
        this.disableExpandableComponentGroup();
      }
    }
  }, {
    key: "onAnyComponentBlur",
    value: function onAnyComponentBlur(blurredComponentInfo, didChangeFilterListFocus) {
      if (didChangeFilterListFocus) {
        this.disableExpandableComponentGroup();
      }
    }
  }, {
    key: "isExpanded",
    value: function isExpanded() {
      return this.props.childExposedApi.componentGroupIsEnabled(this.expandableComponentGroup);
    }
  }, {
    key: "toggleExpandableComponentGroup",
    value: function toggleExpandableComponentGroup() {
      this.props.childExposedApi.toggleComponentGroup(this.expandableComponentGroup);
    }
  }, {
    key: "enableExpandableComponentGroup",
    value: function enableExpandableComponentGroup() {
      this.props.childExposedApi.enableComponentGroup(this.expandableComponentGroup);
    }
  }, {
    key: "disableExpandableComponentGroup",
    value: function disableExpandableComponentGroup() {
      this.props.childExposedApi.disableComponentGroup(this.expandableComponentGroup);
    }
  }, {
    key: "onClickExpandCollapseButton",
    value: function onClickExpandCollapseButton() {
      this.toggleExpandableComponentGroup();
    }
  }, {
    key: "onFocus",
    value: function onFocus() {
      this.enableExpandableComponentGroup();

      _get(_getPrototypeOf(AbstractGenericIdListDropDownSearchInputMultiSelect.prototype), "onFocus", this).call(this);
    }
  }, {
    key: "onClickClearButton",
    value: function onClickClearButton() {
      this.props.childExposedApi.deselectAllItems();
    }
  }, {
    key: "onExpandandCollapseButtonFocus",
    value: function onExpandandCollapseButtonFocus() {
      // NOTE: We do not use this.onFocus() since that toggles the
      // collapsible component group. This leads to a race-condition
      // when just clicking on the expand button since it will first get focus,
      // which will expand the component group on, then be clicked, which will
      // toggle the group off.
      _get(_getPrototypeOf(AbstractGenericIdListDropDownSearchInputMultiSelect.prototype), "onFocus", this).call(this);
    }
  }, {
    key: "renderExpandCollapseButton",
    value: function renderExpandCollapseButton() {
      return _react.default.createElement(_SearchInputExpandCollapseButton.default, {
        key: 'expand-collapse-button',
        onClick: this.onClickExpandCollapseButton,
        onFocus: this.onExpandandCollapseButtonFocus,
        onBlur: this.onBlur,
        isExpanded: this.isExpanded()
      });
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      return [this.renderClearButton(), this.renderExpandCollapseButton()];
    }
  }, {
    key: "expandableComponentGroup",
    get: function get() {
      return _filterListConstants.COMPONENT_GROUP_EXPANDABLE;
    }
  }], [{
    key: "shouldReceiveFocusEvents",
    value: function shouldReceiveFocusEvents(componentSpec) {
      return true;
    }
  }]);

  _inherits(AbstractGenericIdListDropDownSearchInputMultiSelect, _AbstractGenericIdLis);

  return AbstractGenericIdListDropDownSearchInputMultiSelect;
}(_AbstractGenericIdListSearchInputMultiSelect.default);

exports.default = AbstractGenericIdListDropDownSearchInputMultiSelect;