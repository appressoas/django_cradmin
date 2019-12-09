"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractPaginator2 = _interopRequireDefault(require("./AbstractPaginator"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

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

/**
 * Load more paginator.
 *
 * See {@link LoadMorePaginator.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "LoadMorePaginator"
 * }
 *
 * @example <caption>Spec - advanced</caption>
 * {
 *    "component": "LoadMorePaginator",
 *    "props": {
 *       "label": "Load some more items!",
 *       "bemBlock": "custombutton",
 *       "bemVariants": ["large", "dark"],
 *       "location": "left"
 *    }
 * }
 */
var LoadMorePaginator =
/*#__PURE__*/
function (_AbstractPaginator) {
  function LoadMorePaginator() {
    _classCallCheck(this, LoadMorePaginator);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoadMorePaginator).apply(this, arguments));
  }

  _createClass(LoadMorePaginator, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(LoadMorePaginator.prototype), "setupBoundMethods", this).call(this);

      this.onClick = this.onClick.bind(this);
    }
  }, {
    key: "onClick",
    value: function onClick(e) {
      e.preventDefault();
      this.props.childExposedApi.loadMoreItemsFromApi();
    }
  }, {
    key: "renderLoadMoreButton",
    value: function renderLoadMoreButton() {
      return _react.default.createElement("button", {
        type: 'button',
        className: this.className,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onClick: this.onClick
      }, this.props.label);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.childExposedApi.hasNextPaginationPage()) {
        return this.renderLoadMoreButton();
      }

      return null;
    }
  }, {
    key: "className",
    get: function get() {
      return _BemUtilities.default.addVariants(this.props.bemBlock, this.props.bemVariants);
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(LoadMorePaginator), "propTypes", this), {
        bemBlock: _propTypes.default.string.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
        label: _propTypes.default.string.isRequired
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link AbstractPaginator.defaultProps}.
     *
     * @return {Object}
     * @property {string} bemBlock The BEM block for the button.
     *    This is required, and defaults to `'button'`.
     *    **Can be used in spec**.
     * @property {[string]} bemVariants The BEM variants for the button as an array of strings.
     *    Defaults to empty array.
     *    **Can be used in spec**.
     * @property {string} label The label of the button.
     *    This is required, and defaults to `'Load more'` (marked for translation).
     *    **Can be used in spec**.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(LoadMorePaginator), "defaultProps", this), {
        bemBlock: 'button',
        bemVariants: [],
        label: window.gettext('Load more')
      });
    }
  }]);

  _inherits(LoadMorePaginator, _AbstractPaginator);

  return LoadMorePaginator;
}(_AbstractPaginator2.default);

exports.default = LoadMorePaginator;