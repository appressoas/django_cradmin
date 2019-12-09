"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilter2 = _interopRequireDefault(require("../filters/AbstractFilter"));

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

var _OpenModalButton = _interopRequireDefault(require("../../../components/ModalPortal/OpenModalButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var OpenModalWithFilterListContext =
/*#__PURE__*/
function (_AbstractFilter) {
  _inherits(OpenModalWithFilterListContext, _AbstractFilter);

  function OpenModalWithFilterListContext() {
    _classCallCheck(this, OpenModalWithFilterListContext);

    return _possibleConstructorReturn(this, _getPrototypeOf(OpenModalWithFilterListContext).apply(this, arguments));
  }

  _createClass(OpenModalWithFilterListContext, [{
    key: "render",
    value: function render() {
      var props = {
        htmlTag: this.props.htmlTag,
        modalContentsComponent: this.props.modalContentsComponent,
        buttonClassName: this.buttonClassName,
        buttonContents: this.props.buttonLabel,
        modalContentsComponentProps: _objectSpread({
          childExposedApi: this.props.childExposedApi
        }, this.props.modalContentsComponentProps)
      };
      return _react.default.createElement(_OpenModalButton.default, props);
    }
  }, {
    key: "buttonClassName",
    get: function get() {
      if (this.props.buttonClassName !== null) {
        return this.props.buttonClassName;
      }

      return _BemUtilities.default.addVariants('button', this.props.buttonBemVariants);
    } // Do nothing here, as this is not really a 'filter', and we do not want this to filter the httpRequest in any way.

  }], [{
    key: "filterHttpRequest",
    value: function filterHttpRequest(request) {}
  }, {
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(OpenModalWithFilterListContext), "propTypes", this), {
        buttonLabel: _propTypes.default.string.isRequired,
        htmlTag: _propTypes.default.string,
        buttonClassName: _propTypes.default.string,
        buttonBemVariants: _propTypes.default.arrayOf(_propTypes.default.string),
        modalContentsComponent: _propTypes.default.any.isRequired,
        modalContentsComponentProps: _propTypes.default.object.isRequired
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(OpenModalWithFilterListContext), "defaultProps", this), {
        htmlTag: null,
        buttonClassName: null,
        buttonBemVariants: [],
        modalContentsComponentProps: {}
      });
    }
  }]);

  return OpenModalWithFilterListContext;
}(_AbstractFilter2.default);

exports.default = OpenModalWithFilterListContext;