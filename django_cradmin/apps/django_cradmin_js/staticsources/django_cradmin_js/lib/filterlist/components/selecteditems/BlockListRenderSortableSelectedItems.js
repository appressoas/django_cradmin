"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _BlockListRenderSelectedItems = _interopRequireDefault(require("./BlockListRenderSelectedItems"));

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

var BlockListRenderSortableSelectedItems =
/*#__PURE__*/
function (_BlockListRenderSelec) {
  function BlockListRenderSortableSelectedItems() {
    _classCallCheck(this, BlockListRenderSortableSelectedItems);

    return _possibleConstructorReturn(this, _getPrototypeOf(BlockListRenderSortableSelectedItems).apply(this, arguments));
  }

  _createClass(BlockListRenderSortableSelectedItems, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(BlockListRenderSortableSelectedItems.prototype), "setupBoundMethods", this).call(this);

      this.onClickMoveUp = this.onClickMoveUp.bind(this);
      this.onClickMoveDown = this.onClickMoveDown.bind(this);
    }
  }, {
    key: "onClickMoveUp",
    value: function onClickMoveUp(listItemId) {
      this.props.childExposedApi.selectedItemMoveUp(listItemId);
    }
  }, {
    key: "onClickMoveDown",
    value: function onClickMoveDown(listItemId) {
      this.props.childExposedApi.selectedItemMoveDown(listItemId);
    }
  }, {
    key: "renderSelectedItemMoveUp",
    value: function renderSelectedItemMoveUp(listItemId) {
      var _this = this;

      var withActionSidebar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this.props.childExposedApi.selectedItemIsFirst(listItemId)) {
        return null;
      }

      var button = _react.default.createElement("button", {
        type: "button",
        className: "blocklist__action-button",
        "aria-label": "Move up",
        onClick: function onClick() {
          _this.onClickMoveUp(listItemId);
        }
      }, _react.default.createElement("span", {
        className: "cricon cricon--chevron-up",
        "aria-hidden": "true"
      }));

      if (withActionSidebar) {
        return _react.default.createElement("div", {
          className: "blocklist__action-sidebar",
          key: "".concat(listItemId, " sortable-item-move-up")
        }, button);
      }

      return button;
    }
  }, {
    key: "renderSelectedItemMoveDown",
    value: function renderSelectedItemMoveDown(listItemId) {
      var _this2 = this;

      var withActionSidebar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this.props.childExposedApi.selectedItemIsLast(listItemId)) {
        return null;
      }

      var button = _react.default.createElement("button", {
        type: "button",
        className: "blocklist__action-button",
        "aria-label": "Move down",
        onClick: function onClick() {
          _this2.onClickMoveDown(listItemId);
        }
      }, _react.default.createElement("span", {
        className: "cricon cricon--chevron-down",
        "aria-hidden": "true"
      }));

      if (withActionSidebar) {
        return _react.default.createElement("div", {
          className: "blocklist__action-sidebar",
          key: "".concat(listItemId, " sortable-item")
        }, button);
      }

      return button;
    }
  }, {
    key: "renderSortableItems",
    value: function renderSortableItems(listItemId) {
      if (this.props.inlineMoveIcons) {
        return [this.renderSelectedItemMoveUp(listItemId), this.renderSelectedItemMoveDown(listItemId)];
      }

      return _react.default.createElement("div", {
        className: "blocklist__action-sidebar",
        key: "".concat(listItemId, " sortable-item")
      }, this.renderSelectedItemMoveUp(listItemId, false), this.renderSelectedItemMoveDown(listItemId, false));
    }
  }, {
    key: "renderSelectedItemContent",
    value: function renderSelectedItemContent(listItemId, listItemData) {
      var selectedItemContentList = _get(_getPrototypeOf(BlockListRenderSortableSelectedItems.prototype), "renderSelectedItemContent", this).call(this, listItemId, listItemData);

      selectedItemContentList.push(this.renderSortableItems(listItemId));
      return selectedItemContentList;
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(BlockListRenderSortableSelectedItems), "propTypes", this), {
        inlineMoveIcons: _propTypes.default.bool
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(BlockListRenderSortableSelectedItems), "defaultProps", this), {
        inlineMoveIcons: false
      });
    }
  }]);

  _inherits(BlockListRenderSortableSelectedItems, _BlockListRenderSelec);

  return BlockListRenderSortableSelectedItems;
}(_BlockListRenderSelectedItems.default);

exports.default = BlockListRenderSortableSelectedItems;