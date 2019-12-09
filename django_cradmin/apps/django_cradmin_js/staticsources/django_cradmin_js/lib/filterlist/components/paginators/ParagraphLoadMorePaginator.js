"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _LoadMorePaginator2 = _interopRequireDefault(require("./LoadMorePaginator"));

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
 * Just like {@link LoadMorePaginator}, except that the button is
 * wrapped with a paragraph.
 *
 * See {@link ParagraphLoadMorePaginator.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "ParagraphLoadMorePaginator"
 * }
 *
 * @example <caption>Spec - advanced</caption>
 * {
 *    "component": "ParagraphLoadMorePaginator",
 *    "props": {
 *       "paragraphClassName": "paragraph paragraph--tight",
 *       "label": "Load some more items!",
 *       "bemBlock": "custombutton",
 *       "bemVariants": ["large", "dark"],
 *       "location": "left"
 *    }
 * }
 */
var ParagraphLoadMorePaginator =
/*#__PURE__*/
function (_LoadMorePaginator) {
  function ParagraphLoadMorePaginator() {
    _classCallCheck(this, ParagraphLoadMorePaginator);

    return _possibleConstructorReturn(this, _getPrototypeOf(ParagraphLoadMorePaginator).apply(this, arguments));
  }

  _createClass(ParagraphLoadMorePaginator, [{
    key: "renderLoadMoreButton",
    value: function renderLoadMoreButton() {
      return _react.default.createElement("p", {
        className: this.props.paragraphClassName
      }, _get(_getPrototypeOf(ParagraphLoadMorePaginator.prototype), "renderLoadMoreButton", this).call(this));
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(ParagraphLoadMorePaginator), "propTypes", this), {
        paragraphClassName: _propTypes.default.string
      });
    }
    /**
     * Get default props. Extends the default props
     * from {@link LoadMorePaginator.defaultProps}.
     *
     * @return {Object}
     * @property {string} paragraphClassName The css class for the paragraph.
     *    Defaults to `null`.
     *    **Can be used in spec**.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign({}, _get(_getPrototypeOf(ParagraphLoadMorePaginator), "defaultProps", this), {
        paragraphClassName: null
      });
    }
  }]);

  _inherits(ParagraphLoadMorePaginator, _LoadMorePaginator);

  return ParagraphLoadMorePaginator;
}(_LoadMorePaginator2.default);

exports.default = ParagraphLoadMorePaginator;