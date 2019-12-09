"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _DropDownSearchFilter2 = _interopRequireDefault(require("./DropDownSearchFilter"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _AriaDescribedByTarget = _interopRequireDefault(require("../../../components/AriaDescribedByTarget"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var AbstractMultiSelectDropDownSearchFilter =
/*#__PURE__*/
function (_DropDownSearchFilter) {
  _inherits(AbstractMultiSelectDropDownSearchFilter, _DropDownSearchFilter);

  function AbstractMultiSelectDropDownSearchFilter() {
    _classCallCheck(this, AbstractMultiSelectDropDownSearchFilter);

    return _possibleConstructorReturn(this, _getPrototypeOf(AbstractMultiSelectDropDownSearchFilter).apply(this, arguments));
  }

  _createClass(AbstractMultiSelectDropDownSearchFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(AbstractMultiSelectDropDownSearchFilter.prototype), "setupBoundMethods", this).call(this);

      this.onClickDeselectItem = this.onClickDeselectItem.bind(this);
    }
  }, {
    key: "onClickClearButton",
    value: function onClickClearButton() {
      this.props.childExposedApi.deselectAllItems();

      _get(_getPrototypeOf(AbstractMultiSelectDropDownSearchFilter.prototype), "onClickClearButton", this).call(this);
    }
  }, {
    key: "onClickDeselectItem",
    value: function onClickDeselectItem(selectedItemId, selectedItemData) {
      var _this = this;

      this.props.childExposedApi.deselectItem(selectedItemId);
      window.setTimeout(function () {
        _this.getSearchInputRef().focus();
      }, 100);
    }
  }, {
    key: "onSelectItems",
    value: function onSelectItems(listItemIds) {
      var _this2 = this;

      window.setTimeout(function () {
        _this2.getSearchInputRef().focus();
      }, 100);
    }
  }, {
    key: "onDeselectItems",
    value: function onDeselectItems(listItemIds) {
      var _this3 = this;

      window.setTimeout(function () {
        _this3.getSearchInputRef().focus();
      }, 100);
    }
  }, {
    key: "getSelectedLabelText",
    value: function getSelectedLabelText(selectedItemId, selectedItemData) {
      throw new Error('getSelectedLabelText must be overridden by subclasses!');
    }
  }, {
    key: "renderSelectedLabel",
    value: function renderSelectedLabel(selectedItemId, selectedItemData) {
      return this.getSelectedLabelText(selectedItemId, selectedItemData);
    }
  }, {
    key: "getSelectedValueExtraAriaDescribedByDomId",
    value: function getSelectedValueExtraAriaDescribedByDomId(selectedItemId, selectedItemData) {
      return this.makeDomId('selectedValueExtraAriaDescribedBy');
    }
  }, {
    key: "getSelectedValueAriaLabel",
    value: function getSelectedValueAriaLabel(selectedItemId, selectedItemData) {
      return gettext.interpolate(gettext.gettext('"%(selectedValue)s" selected. Click the button to remove it from your selection.'), {
        'selectedValue': this.getSelectedLabelText(selectedItemId, selectedItemData)
      }, true);
    }
  }, {
    key: "renderSelectedValueExtraAriaDescribedBy",
    value: function renderSelectedValueExtraAriaDescribedBy(domId, selectedItemId, selectedItemData) {
      if (this.props.selectedValueExtraAriaDescription === null) {
        return null;
      }

      return _react.default.createElement(_AriaDescribedByTarget.default, {
        domId: domId,
        message: this.props.selectedValueExtraAriaDescription,
        key: 'selectedValue extra aria-describedby'
      });
    }
  }, {
    key: "getSelectedValueAriaDescribedByDomIds",
    value: function getSelectedValueAriaDescribedByDomIds(extraDomId) {
      var domIds = [this.labelDomId];

      if (this.props.selectedValueExtraAriaDescription !== null) {
        domIds.push(extraDomId);
      }

      return domIds;
    }
  }, {
    key: "renderSelectedItem",
    value: function renderSelectedItem(selectedItemId, selectedItemData) {
      var _this4 = this;

      var extraAriaDescribedByDomId = this.getSelectedValueExtraAriaDescribedByDomId(selectedItemId, selectedItemData);
      return [this.renderSelectedValueExtraAriaDescribedBy(extraAriaDescribedByDomId, selectedItemId, selectedItemData), _react.default.createElement("span", {
        className: 'searchinput__selected',
        key: "selected value ".concat(selectedItemId)
      }, _react.default.createElement("span", {
        className: 'searchinput__selected_preview searchinput__selected_preview--with-deselect',
        style: this.selectedItemPreviewStyle,
        title: this.getSelectedLabelText(selectedItemId, selectedItemData)
      }, this.renderSelectedLabel(selectedItemId, selectedItemData)), _react.default.createElement("button", {
        className: 'searchinput__deselect',
        type: 'button',
        onClick: function onClick() {
          _this4.onClickDeselectItem(selectedItemId, selectedItemData);
        },
        "aria-label": this.getSelectedValueAriaLabel(selectedItemId, selectedItemData),
        "aria-describedby": this.getSelectedValueAriaDescribedByDomIds(extraAriaDescribedByDomId).join(' ')
      }, _react.default.createElement("span", {
        className: "searchinput__deselect_icon cricon cricon--close cricon--color-light"
      })))];
    }
  }, {
    key: "renderSelectedItems",
    value: function renderSelectedItems() {
      var renderedItems = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.selectedListItemsMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              selectedItemId = _step$value[0],
              selectedItemData = _step$value[1];

          renderedItems.push(this.renderSelectedItem(selectedItemId, selectedItemData));
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

      return renderedItems;
    }
  }, {
    key: "renderBodyContent",
    value: function renderBodyContent() {
      return [].concat(_toConsumableArray(this.renderSelectedItems()), [this.renderSearchInput()]);
    }
  }, {
    key: "selectedItemPreviewStyle",
    get: function get() {
      return {
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      };
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(AbstractMultiSelectDropDownSearchFilter), "defaultProps", this), {
        selectedValueExtraAriaDescription: null,
        willReceiveSelectionEvents: true
      });
    }
  }]);

  return AbstractMultiSelectDropDownSearchFilter;
}(_DropDownSearchFilter2.default);

exports.default = AbstractMultiSelectDropDownSearchFilter;