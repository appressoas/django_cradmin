"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractSearchInputButton = _interopRequireDefault(require("./AbstractSearchInputButton"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
 * Renders a expand/collapse ``searchinput__button``.
 *
 * See {@link SearchInputExpandCollapseButton.defaultProps} for documentation for
 * props and their defaults.
 */
var SearchInputExpandCollapseButton =
/*#__PURE__*/
function (_AbstractSearchInputB) {
  function SearchInputExpandCollapseButton() {
    _classCallCheck(this, SearchInputExpandCollapseButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(SearchInputExpandCollapseButton).apply(this, arguments));
  }

  _createClass(SearchInputExpandCollapseButton, [{
    key: "iconClassName",
    get: function get() {
      if (this.props.isExpanded) {
        return 'cricon cricon--chevron-up';
      } else {
        return 'cricon cricon--chevron-down';
      }
    }
  }, {
    key: "label",
    get: function get() {
      if (this.props.isExpanded) {
        return window.gettext('Collapse');
      } else {
        return window.gettext('Expand');
      }
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(SearchInputExpandCollapseButton), "propTypes", this), {
        isExpanded: _propTypes.default.bool.isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractSearchInputButton.defaultProps}.
     *
     * @return {Object}
     * @property {bool} isExpanded Render as expanded?
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(SearchInputExpandCollapseButton), "defaultProps", this), {
        isExpanded: null,
        tabIndex: -1,
        ariaHidden: true
      });
    }
  }]);

  _inherits(SearchInputExpandCollapseButton, _AbstractSearchInputB);

  return SearchInputExpandCollapseButton;
}(_AbstractSearchInputButton.default);

exports.default = SearchInputExpandCollapseButton;