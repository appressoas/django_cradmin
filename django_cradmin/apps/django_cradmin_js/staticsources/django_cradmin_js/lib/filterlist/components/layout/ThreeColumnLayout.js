"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _filterListConstants = require("../../filterListConstants");

var _AbstractLayout2 = _interopRequireDefault(require("./AbstractLayout"));

var _BemUtilities = _interopRequireDefault(require("../../../utilities/BemUtilities"));

var _propTypes = _interopRequireDefault(require("prop-types"));

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

var ThreeColumnLayout =
/*#__PURE__*/
function (_AbstractLayout) {
  function ThreeColumnLayout() {
    _classCallCheck(this, ThreeColumnLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThreeColumnLayout).apply(this, arguments));
  }

  _createClass(ThreeColumnLayout, [{
    key: "renderLeftColumnContent",
    //
    //
    // Rendering
    //
    //
    value: function renderLeftColumnContent() {
      return this.renderComponentsAtLocation(_filterListConstants.RENDER_LOCATION_LEFT);
    }
  }, {
    key: "renderLeftColumn",
    value: function renderLeftColumn() {
      var content = this.renderLeftColumnContent();

      if (content) {
        return _react.default.createElement("div", {
          className: this.leftColumnClassName,
          key: 'leftColumn'
        }, content);
      }

      return null;
    }
  }, {
    key: "renderTopBarContent",
    value: function renderTopBarContent() {
      return this.renderComponentsAtLocation(_filterListConstants.RENDER_LOCATION_TOP);
    }
  }, {
    key: "renderTopBar",
    value: function renderTopBar() {
      var content = this.renderTopBarContent();

      if (content && content.length > 0) {
        return _react.default.createElement("div", {
          className: this.topBarClassName,
          key: 'topBar'
        }, content);
      }

      return null;
    }
  }, {
    key: "renderBottomBarContent",
    value: function renderBottomBarContent() {
      return this.renderComponentsAtLocation(_filterListConstants.RENDER_LOCATION_BOTTOM) || [];
    }
  }, {
    key: "renderBottomBar",
    value: function renderBottomBar() {
      var content = this.renderBottomBarContent();

      if (content && content.length > 0) {
        return _react.default.createElement("div", {
          className: this.bottomBarClassName,
          key: 'bottomBar'
        }, content);
      }

      return null;
    }
  }, {
    key: "renderRightColumnContent",
    value: function renderRightColumnContent() {
      return this.renderComponentsAtLocation(_filterListConstants.RENDER_LOCATION_RIGHT);
    }
  }, {
    key: "renderRightColumn",
    value: function renderRightColumn() {
      var content = this.renderRightColumnContent();

      if (content && content.length > 0) {
        return _react.default.createElement("div", {
          className: this.rightColumnClassName,
          key: 'rightColumn'
        }, content);
      }

      return null;
    }
  }, {
    key: "renderCenterColumnContent",
    value: function renderCenterColumnContent() {
      var centerColumnContent = [this.renderTopBar()];
      centerColumnContent.push.apply(centerColumnContent, _toConsumableArray(this.renderComponentsAtLocation(_filterListConstants.RENDER_LOCATION_CENTER, [])));
      centerColumnContent.push.apply(centerColumnContent, _toConsumableArray(this.renderComponentsAtLocation(_filterListConstants.RENDER_LOCATION_DEFAULT, [])));

      if (this.props.isLoadingNewItemsFromApi || this.props.isLoadingMoreItemsFromApi) {
        centerColumnContent.push(this.renderLoadingIndicator());
      }

      centerColumnContent.push(this.renderBottomBar());
      return centerColumnContent;
    }
  }, {
    key: "renderCenterColumn",
    value: function renderCenterColumn() {
      var content = this.renderCenterColumnContent();

      if (content && content.length > 0) {
        return _react.default.createElement("div", {
          className: this.centerColumnClassName,
          key: 'centerColumn'
        }, content);
      }

      return null;
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      return [this.renderLeftColumn(), this.renderCenterColumn(), this.renderRightColumn()];
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: this.className,
        id: this.makeDomId(),
        "aria-live": 'polite',
        "aria-atomic": 'true'
      }, this.renderContent());
    }
  }, {
    key: "bemBlock",
    //
    //
    // Css classes
    //
    //
    get: function get() {
      return 'columnlayout';
    }
  }, {
    key: "className",
    get: function get() {
      return this.bemBlock;
    }
  }, {
    key: "leftColumnClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.bemBlock, 'column', this.props.leftColumnBemVariants);
    }
  }, {
    key: "centerColumnClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.bemBlock, 'column', this.props.centerColumnBemVariants);
    }
  }, {
    key: "rightColumnClassName",
    get: function get() {
      return _BemUtilities.default.buildBemElement(this.bemBlock, 'column', this.props.rightColumnBemVariants);
    }
  }, {
    key: "barBemBlock",
    get: function get() {
      return 'box';
    }
  }, {
    key: "topBarClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.barBemBlock, this.props.topBarBemVariants);
    }
  }, {
    key: "bottomBarClassName",
    get: function get() {
      return _BemUtilities.default.addVariants(this.barBemBlock, this.props.bottomBarBemVariants);
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(ThreeColumnLayout), "propTypes", this), {
        leftColumnBemVariants: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return Object.assign(_get(_getPrototypeOf(ThreeColumnLayout), "defaultProps", this), {
        leftColumnBemVariants: ['large'],
        centerColumnBemVariants: [],
        rightColumnBemVariants: ['small'],
        topBarBemVariants: [],
        bottomBarBemVariants: []
      });
    }
  }]);

  _inherits(ThreeColumnLayout, _AbstractLayout);

  return ThreeColumnLayout;
}(_AbstractLayout2.default);

exports.default = ThreeColumnLayout;