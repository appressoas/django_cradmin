"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abstractIdListItemMapStateToProps = abstractIdListItemMapStateToProps;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var reduxApiUtilities = _interopRequireWildcard(require("ievv_jsbase/lib/utils/reduxApiUtilities"));

var _CenteredLoadingIndicator = _interopRequireDefault(require("../../../../components/CenteredLoadingIndicator"));

var _BemUtilities = _interopRequireDefault(require("../../../../utilities/BemUtilities"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Generic IdListMultiselectItem. You need to subclass this when using {@link GenericIdListMultiSelectFilter} and
 * override renderContents.
 *
 * You will also need to use redux' `connect` and make a function like {@link abstractIdListItemMapStateToProps} to map
 * `idListItemMap` and `getIdListItemAction`.
 *
 * If your redux-structure is not compatible with the one build by {@link reduxApiUtilities}, or you are not using redux
 * at all, you will also need to override {@link getDerivedStateFromProps}.
 */
var AbstractGenericIdListMultiSelectItem =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AbstractGenericIdListMultiSelectItem, _React$Component);

  _createClass(AbstractGenericIdListMultiSelectItem, null, [{
    key: "propTypes",
    get: function get() {
      return {
        id: _propTypes.default.number.isRequired,
        idListItemMap: _propTypes.default.object.isRequired,
        getIdListItemAction: _propTypes.default.func.isRequired,
        bemVariants: _propTypes.default.arrayOf(_propTypes.default.string.isRequired)
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        idListItemMap: new Map(),
        selectedValues: [],
        getIdListItemAction: function getIdListItemAction() {
          console.warn('getIdListItemAction not given in props!');
          return null;
        },
        bemVariants: ['outlined']
      };
    }
  }]);

  function AbstractGenericIdListMultiSelectItem(props) {
    var _this;

    _classCallCheck(this, AbstractGenericIdListMultiSelectItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractGenericIdListMultiSelectItem).call(this, props));
    _this.state = _this.makeInitialState();

    _this.setupBoundFunctions();

    return _this;
  }
  /**
   * make and return the initial React-state. Defaults to `{hasAllReduxData: false}`
   */


  _createClass(AbstractGenericIdListMultiSelectItem, [{
    key: "makeInitialState",
    value: function makeInitialState() {
      return {
        hasAllReduxData: false
      };
    }
    /**
     * only here to be overridden. A place to setup bound functions
     */

  }, {
    key: "setupBoundFunctions",
    value: function setupBoundFunctions() {
      this.handleOnClick = this.handleOnClick.bind(this);
    }
  }, {
    key: "handleOnClick",
    value: function handleOnClick() {
      if (this.isSelected) {
        this.props.childExposedApi.deselectItems([this.props.id]);
      } else {
        this.props.childExposedApi.selectItems([this.props.id]);
      }
    }
    /**
     * Override this to use something other than `null` as a fallback if `this.props.id` is not found in
     * `this.props.idListItemMap`.
     * @return {null}
     */

  }, {
    key: "getLabel",
    value: function getLabel() {
      console.warn('getLabel: Should be overridden by subclass of AbstractIdGenericListMultiselectItem');
      return null;
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      return this.getLabel();
    }
  }, {
    key: "renderContents",
    value: function renderContents() {
      return _react.default.createElement("button", {
        className: this.elementClassName,
        onClick: this.handleOnClick
      }, _react.default.createElement("div", {
        className: 'selectable-list__icon'
      }, this.isSelected ? _react.default.createElement("i", {
        className: 'cricon cricon--check cricon--color-light'
      }) : null), _react.default.createElement("span", {
        className: 'selectable-list__itemcontent'
      }, this.renderContent()));
    }
  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      return _react.default.createElement(_CenteredLoadingIndicator.default, null);
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.hasAllReduxData) {
        return this.renderLoadingIndicator();
      }

      return this.renderContents();
    }
  }, {
    key: "idListItemNotFoundFallback",
    get: function get() {
      return null;
    }
    /**
     * Util to get idListItem.
     *
     * @return {*} lookup for `[this.props.id, 'data']` in `this.props.idListItemMap`, or
     *    `this.idListItemNotFoundFallback` if not found.
     */

  }, {
    key: "idListItem",
    get: function get() {
      return this.props.idListItemMap.getIn([this.props.id, 'data'], this.idListItemNotFoundFallback);
    }
    /**
     * Is the component selected
     *
     * @return {boolean} true if item is selected, false otherwise
     */

  }, {
    key: "isSelected",
    get: function get() {
      return this.props.childExposedApi.selectedItemIdsAsArray().includes(this.props.id);
    }
  }, {
    key: "elementVariants",
    get: function get() {
      return this.props.bemVariants;
    }
  }, {
    key: "elementClassName",
    get: function get() {
      var variants = this.elementVariants;

      if (this.isSelected) {
        variants = [].concat(_toConsumableArray(variants), ['selected']);
      }

      return _BemUtilities.default.buildBemElement('selectable-list', 'item', variants);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var nextState = null;
      var hasAllReduxData = true;

      function setValueInNextState(valueObject) {
        nextState = _objectSpread({}, nextState === null ? {} : nextState, {}, valueObject);
      }

      function ensureIdListItemInStore() {
        var idListItem = reduxApiUtilities.getObjectFromReduxMapOrNullIfLoading(nextProps.idListItemMap, nextProps.id, nextProps.getIdListItemAction, nextProps.dispatch);

        if (idListItem === null) {
          hasAllReduxData = false;
        }
      }

      ensureIdListItemInStore();

      if (hasAllReduxData !== prevState.hasAllReduxData) {
        setValueInNextState({
          hasAllReduxData: hasAllReduxData
        });
      }

      return nextState;
    }
  }]);

  return AbstractGenericIdListMultiSelectItem;
}(_react.default.Component);
/**
 * example mapStateToProps in order to use {@link AbstractGenericIdListMultiSelectItem}.
 *
 * @param state redux-state
 * @return {{getIdListItemAction: null, idListItemMap: never, idListItemId: *}}
 */


exports.default = AbstractGenericIdListMultiSelectItem;

function abstractIdListItemMapStateToProps(state) {
  return {
    idListItemMap: new Map(),
    getIdListItemAction: null
  };
}