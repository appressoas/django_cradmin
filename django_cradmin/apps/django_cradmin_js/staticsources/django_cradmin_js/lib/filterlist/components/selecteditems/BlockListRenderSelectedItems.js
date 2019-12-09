"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractSelectedItems = _interopRequireDefault(require("./AbstractSelectedItems"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

/**
 * Render selected items using the `blocklist` css component.
 *
 * See {@link BlockListRenderSelectedItems.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "BlockListRenderSelectedItems"
 * }
 *
 * @example <caption>Spec - custom attribute as the label</caption>
 * {
 *    "component": "BlockListRenderSelectedItems",
 *    "props": {
 *       "itemLabelAttribute": "name"
 *    }
 * }
 *
 * @example <caption>Spec - no BEM variants (render as block list)</caption>
 * {
 *    "component": "BlockListRenderSelectedItems",
 *    "props": {
 *       "bemVariants": []
 *    }
 * }
 */
var BlockListRenderSelectedItems =
/*#__PURE__*/
function (_AbstractSelectedItem) {
  function BlockListRenderSelectedItems() {
    _classCallCheck(this, BlockListRenderSelectedItems);

    return _possibleConstructorReturn(this, _getPrototypeOf(BlockListRenderSelectedItems).apply(this, arguments));
  }

  _createClass(BlockListRenderSelectedItems, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(BlockListRenderSelectedItems.prototype), "setupBoundMethods", this).call(this);

      this.onClick = this.onClick.bind(this);
    }
  }, {
    key: "onClick",
    value: function onClick(listItemId) {
      this.props.childExposedApi.deselectItem(listItemId);
    }
  }, {
    key: "getSelectedItemTitle",
    value: function getSelectedItemTitle(listItemData) {
      return listItemData[this.props.itemTitleAttribute];
    }
  }, {
    key: "getSelectedItemDescription",
    value: function getSelectedItemDescription(listItemData) {
      if (this.props.itemDescriptionAttribute === '') {
        return null;
      }

      return listItemData[this.props.itemDescriptionAttribute];
    }
  }, {
    key: "renderSelectedItemTitle",
    value: function renderSelectedItemTitle(listItemData) {
      return this.getSelectedItemTitle(listItemData);
    }
  }, {
    key: "renderSelectedItemDescription",
    value: function renderSelectedItemDescription(listItemData) {
      var description = this.getSelectedItemDescription(listItemData);

      if (description !== null) {
        return _react.default.createElement("p", {
          className: 'help-text'
        }, description);
      }

      return null;
    }
  }, {
    key: "renderSelectedItemTitleDescription",
    value: function renderSelectedItemTitleDescription(listItemId, listItemData) {
      if (listItemData === null) {
        return null;
      }

      return _react.default.createElement("div", {
        className: 'blocklist__action-content',
        key: "".concat(listItemId, " action-content title-description")
      }, this.renderSelectedItemTitle(listItemData), this.renderSelectedItemDescription(listItemData));
    }
  }, {
    key: "renderSelectedItemIcon",
    value: function renderSelectedItemIcon(listItemId, listItemData) {
      return _react.default.createElement("i", {
        className: this.selectedItemIconClassName
      });
    }
  }, {
    key: "renderSelectedItemIconBlock",
    value: function renderSelectedItemIconBlock(listItemId, listItemData) {
      return _react.default.createElement("div", {
        className: this.selectedItemIconBlockClassName
      }, this.renderSelectedItemIcon(listItemId, listItemData));
    }
  }, {
    key: "renderSelectedItemContent",
    value: function renderSelectedItemContent(listItemId, listItemData) {
      var _this = this;

      return [_react.default.createElement("div", {
        className: "blocklist__action-sidebar",
        onClick: function onClick() {
          _this.onClick(listItemId);
        },
        key: "".concat(listItemId, " action-sidebar-delete")
      }, _react.default.createElement("button", {
        className: "blocklist__action-button",
        "aria-label": "Delete",
        type: "button"
      }, _react.default.createElement("span", {
        className: "cricon cricon--trash",
        "aria-hidden": "true"
      }))), this.renderSelectedItemTitleDescription(listItemId, listItemData)];
    }
  }, {
    key: "renderSelectedItem",
    value: function renderSelectedItem(listItemId, listItemData) {
      return _react.default.createElement("div", {
        tabIndex: 0,
        key: listItemId,
        className: "".concat(this.selectedItemClassName, " blocklist__item--with-action-sidebar"),
        role: "button",
        onFocus: this.onFocus,
        onBlur: this.onBlur
      }, this.renderSelectedItemContent(listItemId, listItemData));
    }
  }, {
    key: "renderSelectedItems",
    value: function renderSelectedItems() {
      var renderedHiddenFields = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.selectedListItemsMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              listItemId = _step$value[0],
              listItemData = _step$value[1];

          renderedHiddenFields.push(this.renderSelectedItem(listItemId, listItemData));
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

      return renderedHiddenFields;
    }
  }, {
    key: "renderLabel",
    value: function renderLabel() {
      return this.props.label;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.selectedListItemsMap.size === 0) {
        return null;
      }

      return _react.default.createElement("div", {
        className: this.wrapperClassName
      }, this.renderLabel(), _react.default.createElement("div", {
        className: this.className
      }, this.renderSelectedItems()));
    }
  }, {
    key: "wrapperClassName",
    get: function get() {
      return 'paragraph';
    }
  }, {
    key: "bemBlock",
    get: function get() {
      return 'blocklist';
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.bemBlock, this.props.bemVariants);
    }
  }, {
    key: "selectedItemClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.bemBlock, 'item');
    }
  }, {
    key: "selectedItemContentClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.bemBlock, 'itemtitle');
    }
  }, {
    key: "selectedItemIconBlockClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.bemBlock, 'icon');
    }
  }, {
    key: "selectedItemIconClassName",
    get: function get() {
      return 'cricon cricon--close cricon--color-light';
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign({}, {
        label: _propTypes.default.string,
        itemTitleAttribute: _propTypes.default.string.isRequired,
        itemDescriptionAttribute: _propTypes.default.string,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractSelectedItems.defaultProps}.
     *
     * @return {Object}
     * @property {string} itemLabelAttribute The list item data attribute
     *    to use as the label of selected items.
     *    This is required, and defaults to `title`.
     *    **Can be used in spec**.
     * @property {[string]} bemVariants BEM variants for the selectable-list.
     *    **Can be used in spec**.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(BlockListRenderSelectedItems), "defaultProps", this), {
        label: window.gettext('Selected items:'),
        itemTitleAttribute: 'title',
        itemDescriptionAttribute: '',
        bemVariants: ['tight']
      });
    }
  }]);

  _inherits(BlockListRenderSelectedItems, _AbstractSelectedItem);

  return BlockListRenderSelectedItems;
}(_AbstractSelectedItems.default);

exports.default = BlockListRenderSelectedItems;