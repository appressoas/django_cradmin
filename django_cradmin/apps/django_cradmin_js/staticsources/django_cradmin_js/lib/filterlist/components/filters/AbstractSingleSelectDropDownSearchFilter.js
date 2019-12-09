"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _DropDownSearchFilter2 = _interopRequireDefault(require("./DropDownSearchFilter"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _AriaDescribedByTarget = _interopRequireDefault(require("../../../components/AriaDescribedByTarget"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var AbstractSingleSelectDropDownSearchFilter =
/*#__PURE__*/
function (_DropDownSearchFilter) {
  function AbstractSingleSelectDropDownSearchFilter() {
    _classCallCheck(this, AbstractSingleSelectDropDownSearchFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractSingleSelectDropDownSearchFilter).apply(this, arguments));
  }

  _createClass(AbstractSingleSelectDropDownSearchFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(AbstractSingleSelectDropDownSearchFilter.prototype), "setupBoundMethods", this).call(this);

      this.onClickSelectedItemBody = this.onClickSelectedItemBody.bind(this);
    }
  }, {
    key: "onClickClearButton",
    value: function onClickClearButton() {
      this.props.childExposedApi.deselectAllItems();

      _get(_getPrototypeOf(AbstractSingleSelectDropDownSearchFilter.prototype), "onClickClearButton", this).call(this);
    }
  }, {
    key: "onClickSelectedItemBody",
    value: function onClickSelectedItemBody() {
      this.onClickClearButton();
    }
  }, {
    key: "onSelectItems",
    value: function onSelectItems(listItemIds) {
      var _this = this;

      window.setTimeout(function () {
        if (_this._selectedItemButton) {
          _this._selectedItemButton.focus();
        }
      }, 100);
    }
  }, {
    key: "onDeselectItems",
    value: function onDeselectItems(listItemIds) {
      var _this2 = this;

      window.setTimeout(function () {
        _this2.getSearchInputRef().focus();
      }, 100);
    }
  }, {
    key: "getSelectedLabelText",
    value: function getSelectedLabelText() {
      throw new Error('getSelectedLabelText must be overridden by subclasses!');
    }
  }, {
    key: "renderSelectedLabel",
    value: function renderSelectedLabel() {
      return this.getSelectedLabelText();
    }
  }, {
    key: "renderSelectedValueExtraAriaDescribedBy",
    value: function renderSelectedValueExtraAriaDescribedBy() {
      if (this.props.selectedValueExtraAriaDescription === null) {
        return null;
      }

      return _react.default.createElement(_AriaDescribedByTarget.default, {
        domId: this.selectedValueExtraAriaDescribedByDomId,
        message: this.props.selectedValueExtraAriaDescription,
        key: 'selectedValue extra aria-describedby'
      });
    }
  }, {
    key: "renderSelectedValue",
    value: function renderSelectedValue(extraProps) {
      var _this3 = this;

      return [this.renderSelectedValueExtraAriaDescribedBy(), _react.default.createElement("button", _extends({
        className: 'searchinput__selected searchinput__selected--single',
        type: 'button',
        key: 'selected value',
        onClick: this.onClickSelectedItemBody,
        "aria-label": this.selectedValueAriaLabel,
        "aria-describedby": this.selectedValueAriaDescribedByDomIds.join(' '),
        ref: function ref(input) {
          _this3._selectedItemButton = input;
        }
      }, extraProps), _react.default.createElement("span", {
        className: 'searchinput__selected_preview'
      }, this.renderSelectedLabel()))];
    }
  }, {
    key: "renderBodyContent",
    value: function renderBodyContent() {
      var noneStyle = {
        style: {
          display: 'none'
        }
      };

      if (this.props.selectedListItemsMap.size === 0) {
        return [this.renderSearchInput()].concat(_toConsumableArray(this.renderSelectedValue(noneStyle)));
      }

      return [this.renderSearchInput(noneStyle)].concat(_toConsumableArray(this.renderSelectedValue()));
    }
  }, {
    key: "selectedValueExtraAriaDescribedByDomId",
    get: function get() {
      return this.makeDomId('selectedValueExtraAriaDescribedBy');
    }
  }, {
    key: "selectedItemKey",
    get: function get() {
      if (this.props.selectedListItemsMap.size === 0) {
        return null;
      }

      return this.props.selectedListItemsMap.keys().next().value;
    }
  }, {
    key: "selectedItemValue",
    get: function get() {
      if (this.props.selectedListItemsMap.size === 0) {
        return null;
      }

      return this.props.selectedListItemsMap.get(this.selectedItemKey);
    }
  }, {
    key: "selectedValueAriaLabel",
    get: function get() {
      return gettext.interpolate(gettext.gettext('"%(selectedValue)s" selected. Hit the enter button to change your selection.'), {
        'selectedValue': this.getSelectedLabelText()
      }, true);
    }
  }, {
    key: "selectedValueAriaDescribedByDomIds",
    get: function get() {
      var domIds = [this.labelDomId];

      if (this.props.selectedValueExtraAriaDescription !== null) {
        domIds.push(this.selectedValueExtraAriaDescribedByDomId);
      }

      return domIds;
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractSingleSelectDropDownSearchFilter), "defaultProps", this), {
        selectedValueExtraAriaDescription: null,
        willReceiveSelectionEvents: true
      });
    }
  }]);

  _inherits(AbstractSingleSelectDropDownSearchFilter, _DropDownSearchFilter);

  return AbstractSingleSelectDropDownSearchFilter;
}(_DropDownSearchFilter2.default);

exports.default = AbstractSingleSelectDropDownSearchFilter;