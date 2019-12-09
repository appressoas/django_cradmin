"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _BemUtilities = _interopRequireDefault(require("../utilities/BemUtilities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Renders a loading indicator.
 *
 * Uses the `loading-indicator` bem block from the cradmin styles by default.
 *
 * @example
 * <LoadingIndicator/>
 *
 * @example <caption>With message - screenreader only</caption>
 * <LoadingIndicator message="Loading the awesome ..."/>
 *
 * @example <caption>With message - visible to anyone</caption>
 * <LoadingIndicator message="Loading the awesome ..." visibleMessage={true} />
 *
 * @example <caption>Light variant</caption>
 * <LoadingIndicator message="Loading the awesome ..." bemVariants={["light"]} />
 */
var LoadingIndicator =
/*#__PURE__*/
function (_React$Component) {
  function LoadingIndicator() {
    _classCallCheck(this, LoadingIndicator);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoadingIndicator).apply(this, arguments));
  }

  _createClass(LoadingIndicator, [{
    key: "renderScreenReaderOnlyMessage",
    value: function renderScreenReaderOnlyMessage() {
      return _react.default.createElement("span", {
        className: this.messageScreenReaderOnlyClassName
      }, this.props.message);
    }
  }, {
    key: "renderVisibleMessage",
    value: function renderVisibleMessage() {
      return _react.default.createElement("span", {
        className: this.messageVisibleClassName
      }, this.props.message);
    }
  }, {
    key: "renderMessage",
    value: function renderMessage() {
      if (this.props.visibleMessage) {
        return this.renderVisibleMessage();
      }

      return this.renderScreenReaderOnlyMessage();
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("span", {
        className: this.props.bemBlock
      }, _react.default.createElement("span", {
        className: this.indicatorClassName
      }), _react.default.createElement("span", {
        className: this.indicatorClassName
      }), _react.default.createElement("span", {
        className: this.indicatorClassName
      }), this.renderMessage());
    }
  }, {
    key: "indicatorClassName",
    get: function get() {
      return _BemUtilities.default.addVariants("".concat(this.props.bemBlock, "__indicator"), this.props.bemVariants);
    }
  }, {
    key: "messageScreenReaderOnlyClassName",
    get: function get() {
      return "".concat(this.props.bemBlock, "__text");
    }
  }, {
    key: "messageVisibleClassName",
    get: function get() {
      return _BemUtilities.default.addVariants("".concat(this.props.bemBlock, "__label"), this.props.bemVariants);
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return {
        message: _propTypes.default.string.isRequired,
        bemBlock: _propTypes.default.string.isRequired,
        visibleMessage: _propTypes.default.bool.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string)
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        message: window.gettext('Loading ...'),
        bemBlock: 'loading-indicator',
        visibleMessage: false,
        bemVariants: []
      };
    }
  }]);

  _inherits(LoadingIndicator, _React$Component);

  return LoadingIndicator;
}(_react.default.Component);

exports.default = LoadingIndicator;