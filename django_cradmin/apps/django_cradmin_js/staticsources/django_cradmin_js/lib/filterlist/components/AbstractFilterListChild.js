"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Base class for all child components of {@link AbstractFilterList}.
 *
 * See {@link AbstractFilterListChild.defaultProps} for documentation for
 * props and their defaults.
 */
var AbstractFilterListChild =
/*#__PURE__*/
function (_React$Component) {
  _createClass(AbstractFilterListChild, null, [{
    key: "shouldReceiveFocusEvents",

    /**
     * Does the component listen to focus changes?
     *
     * If this returns ``true``, the component will receive
     * onFocus and onBlur events.
     *
     * @param {AbstractComponentSpec} componentSpec The component spec.
     * @returns {boolean}
     */
    value: function shouldReceiveFocusEvents(componentSpec) {
      return false;
    } // /**
    //  * The focus groups this item belongs to.
    //  *
    //  * @param {AbstractComponentSpec} componentSpec The component spec.
    //  * @returns {[]} Array of focus groups.
    //  */
    // static getKeyboardNavigationGroups (componentSpec) {
    //   return []
    // }

  }, {
    key: "propTypes",
    get: function get() {
      return {
        childExposedApi: _propTypes.default.object.isRequired,
        willReceiveFocusEvents: _propTypes.default.bool.isRequired,
        willReceiveSelectionEvents: _propTypes.default.bool.isRequired,
        componentGroups: _propTypes.default.arrayOf(_propTypes.default.string),
        uniqueComponentKey: _propTypes.default.string.isRequired,
        domIdPrefix: _propTypes.default.string.isRequired,
        isMovingListItemId: _propTypes.default.any,
        allListItemMovementIsLocked: _propTypes.default.bool.isRequired,
        selectMode: _propTypes.default.string
      };
    }
    /**
     * Get default props.
     *
     * @return {Object}
     * @property {ChildExposedApi} childExposedApi Object with public methods from
     *    {@link AbstractFilterList}.
     *    _Provided automatically by the parent component_.
     * @property {string} uniqueComponentKey A unique key for this component
     *    instance.
     *    _Provided automatically by the parent component_.
     * @property {[string]|null} componentGroups The groups this component belongs to.
     *    See {@link AbstractFilterList#toggleComponentGroup}.
     *    **Can be used in spec**.
     * @property {string} domIdPrefix DOM id prefix.
     *    _Provided automatically_.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return {
        childExposedApi: null,
        componentGroups: null,
        willReceiveFocusEvents: false,
        willReceiveSelectionEvents: false,
        domIdPrefix: null,
        isMovingListItemId: null,
        allListItemMovementIsLocked: false,
        selectMode: null
      };
    }
  }]);

  function AbstractFilterListChild(props) {
    var _this;

    _classCallCheck(this, AbstractFilterListChild);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractFilterListChild).call(this, props));

    _this.setupBoundMethods();

    _this.state = {};
    return _this;
  }

  _createClass(AbstractFilterListChild, [{
    key: "makeDomId",
    value: function makeDomId() {
      var domIdSuffix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (domIdSuffix) {
        return "".concat(this.domIdPrefix, "-").concat(domIdSuffix);
      }

      return this.domIdPrefix;
    }
    /**
     * Make sure you call super.componentWillUnmount() if you override this.
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.willReceiveFocusEvents) {
        this.props.childExposedApi.unregisterFocusChangeListener(this);
      }

      if (this.props.willReceiveSelectionEvents) {
        this.props.childExposedApi.unregisterSelectionChangeListener(this);
      }
    }
    /**
     * Make sure you call super.componentWillUnmount() if you override this.
     */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.willReceiveFocusEvents) {
        this.props.childExposedApi.registerFocusChangeListener(this);
      }

      if (this.props.willReceiveSelectionEvents) {
        this.props.childExposedApi.registerSelectionChangeListener(this);
      }
    }
    /**
     * Setup bound methods.
     *
     * Binds {@link AbstractFilter#onFocus} and {@link AbstractFilter#onBlur}
     * to ``this` by default, but you can override this
     * method to bind more methods. In that case, ensure
     * you call `super.setupBoundMethods()`!
     */

  }, {
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      this.onFocus = this.onFocus.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onAnyComponentFocus = this.onAnyComponentFocus.bind(this);
      this.onAnyComponentBlur = this.onAnyComponentBlur.bind(this);
    }
    /**
     * See {@link AbstractFilterListChild#onBlur} and {@link AbstractFilterListChild#onFocus}.
     *
     * @return {{}} An object with information about this component relevant
     *    for blur/focus management.
     */

  }, {
    key: "getBlurFocusCallbackInfo",
    value: function getBlurFocusCallbackInfo() {
      return {
        uniqueComponentKey: this.props.uniqueComponentKey,
        componentGroups: this.props.componentGroups
      };
    }
    /**
     * Should be called when the component looses focus.
     *
     * By default this calls AbstractFilterList#onChildBlur with the
     * information from AbstractFilterListChild#getBlurFocusCallbackInfo.
     */

  }, {
    key: "onBlur",
    value: function onBlur() {
      this.props.childExposedApi.onChildBlur(this.getBlurFocusCallbackInfo());
    }
    /**
     * Should be called when the component gains focus.
     *
     * By default this calls AbstractFilterList#onChildFocus with the
     * information from AbstractFilterListChild#getBlurFocusCallbackInfo.
     */

  }, {
    key: "onFocus",
    value: function onFocus() {
      this.props.childExposedApi.onChildFocus(this.getBlurFocusCallbackInfo());
    }
  }, {
    key: "onAnyComponentFocus",
    value: function onAnyComponentFocus(newFocusComponentInfo, prevFocusComponentInfo, didChangeFilterListFocus) {}
  }, {
    key: "onAnyComponentBlur",
    value: function onAnyComponentBlur(blurredComponentInfo, didChangeFilterListFocus) {}
  }, {
    key: "onSelectItems",
    value: function onSelectItems(listItemIds) {}
  }, {
    key: "onDeselectItems",
    value: function onDeselectItems(listItemIds) {}
  }, {
    key: "getComponentGroupsForChildComponent",
    value: function getComponentGroupsForChildComponent(componentSpec) {
      if (this.props.componentGroups === null) {
        return componentSpec.props.componentGroups;
      }

      if (componentSpec.props.componentGroups === null) {
        return this.props.componentGroups;
      }

      return this.props.componentGroups.concat(componentSpec.props.componentGroups);
    }
    /**
     * Make props for child components that is also a subclass
     * of AbstractFilterListChild.
     *
     * @param {AbstractComponentSpec} componentSpec The spec for the child component.
     * @param {{}} extraProps Extra props. These will not override any props
     *    set by default.
     * @returns {{}} Object with child component props.
     */

  }, {
    key: "makeChildComponentProps",
    value: function makeChildComponentProps(componentSpec, extraProps) {
      return Object.assign({}, extraProps, {
        childExposedApi: this.props.childExposedApi,
        componentGroups: this.getComponentGroupsForChildComponent(componentSpec),
        selectMode: this.props.selectMode,
        isMovingListItemId: this.props.isMovingListItemId,
        allListItemMovementIsLocked: this.props.allListItemMovementIsLocked
      });
    }
  }, {
    key: "domIdPrefix",
    get: function get() {
      return this.props.domIdPrefix;
    }
  }]);

  _inherits(AbstractFilterListChild, _React$Component);

  return AbstractFilterListChild;
}(_react.default.Component);

exports.default = AbstractFilterListChild;