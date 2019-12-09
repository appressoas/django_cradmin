"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractListItem2 = _interopRequireDefault(require("./AbstractListItem"));

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var SelectableTitleDescriptionListItem =
/*#__PURE__*/
function (_AbstractListItem) {
  function SelectableTitleDescriptionListItem() {
    _classCallCheck(this, SelectableTitleDescriptionListItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(SelectableTitleDescriptionListItem).apply(this, arguments));
  }

  _createClass(SelectableTitleDescriptionListItem, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(SelectableTitleDescriptionListItem.prototype), "setupBoundMethods", this).call(this);

      this.onClick = this.onClick.bind(this);
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.isSelected) {
        this.props.childExposedApi.deselectItem(this.props.listItemId);
      } else {
        this.props.childExposedApi.selectItem(this.props.listItemId);
      }
    }
  }, {
    key: "renderIcon",
    value: function renderIcon() {
      if (this.props.isSelected) {
        return _react.default.createElement("i", {
          className: this.iconClassName
        });
      }

      return null;
    }
  }, {
    key: "renderIconWrapper",
    value: function renderIconWrapper() {
      return _react.default.createElement("div", {
        className: this.iconWrapperClassName
      }, this.renderIcon());
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      return _react.default.createElement("div", {
        className: this.contentClassName
      }, _react.default.createElement("h2", {
        className: this.titleClassName
      }, this.props.title), _react.default.createElement("p", {
        className: this.descriptionClassName
      }, this.props.description));
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.className,
        tabIndex: 0,
        "aria-selected": this.props.isSelected,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onClick: this.onClick
      }, this.renderIconWrapper(), this.renderContent());
    }
  }, {
    key: "className",
    get: function get() {
      var bemVariants = _toConsumableArray(this.props.bemVariants);

      if (this.props.isSelected) {
        bemVariants.push('selected');
      }

      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'item', bemVariants);
    }
  }, {
    key: "iconWrapperClassName",
    get: function get() {
      return 'selectable-list__icon';
    }
  }, {
    key: "iconClassName",
    get: function get() {
      return 'cricon cricon--check cricon--color-light';
    }
  }, {
    key: "contentClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'itemcontent', this.props.contentBemVariants);
    }
  }, {
    key: "titleClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.props.bemBlock, 'itemtitle', this.props.titleBemVariants);
    }
  }, {
    key: "descriptionClassName",
    get: function get() {
      return '';
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(SelectableTitleDescriptionListItem), "propTypes", this), {
        title: _propTypes.default.string.isRequired,
        description: _propTypes.default.string.isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        titleBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        contentBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(SelectableTitleDescriptionListItem), "defaultProps", this), {
        bemBlock: 'selectable-list',
        bemVariants: [],
        titleBemVariants: [],
        contentBemVariants: []
      });
    }
  }]);

  _inherits(SelectableTitleDescriptionListItem, _AbstractListItem);

  return SelectableTitleDescriptionListItem;
}(_AbstractListItem2.default);

exports.default = SelectableTitleDescriptionListItem;