"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ThreeColumnLayout2 = _interopRequireDefault(require("./ThreeColumnLayout"));

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

var ThreeColumnDropDownLayout =
/*#__PURE__*/
function (_ThreeColumnLayout) {
  function ThreeColumnDropDownLayout() {
    _classCallCheck(this, ThreeColumnDropDownLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThreeColumnDropDownLayout).apply(this, arguments));
  }

  _createClass(ThreeColumnDropDownLayout, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.dropdownBemBlock
      }, _react.default.createElement("div", {
        className: this.dropdownContentClassName
      }, _get(_getPrototypeOf(ThreeColumnDropDownLayout.prototype), "render", this).call(this)));
    }
  }, {
    key: "dropdownBemBlock",
    get: function get() {
      return 'dropdown';
    }
  }, {
    key: "dropdownContentBemElement",
    get: function get() {
      return "".concat(this.dropdownBemBlock, "__content");
    }
  }, {
    key: "dropdownContentClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.dropdownContentBemElement, this.props.dropdownContentBemVariants);
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(ThreeColumnDropDownLayout), "propTypes", this), {
        dropdownContentBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(ThreeColumnDropDownLayout), "defaultProps", this), {
        dropdownContentBemVariants: ['spaced']
      });
    }
  }]);

  _inherits(ThreeColumnDropDownLayout, _ThreeColumnLayout);

  return ThreeColumnDropDownLayout;
}(_ThreeColumnLayout2.default);

exports.default = ThreeColumnDropDownLayout;