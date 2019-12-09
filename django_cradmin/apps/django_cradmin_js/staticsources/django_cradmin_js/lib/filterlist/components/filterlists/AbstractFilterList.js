"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _HttpDjangoJsonRequest = _interopRequireDefault(require("ievv_jsbase/lib/http/HttpDjangoJsonRequest"));

var _FilterListRegistrySingleton = _interopRequireDefault(require("../../FilterListRegistrySingleton"));

var _filterListConstants = require("../../filterListConstants");

require("ievv_jsbase/lib/utils/i18nFallbacks");

var _LoadingIndicator = _interopRequireDefault(require("../../../components/LoadingIndicator"));

var _ComponentCache = require("../../ComponentCache");

var _ChildExposedApi = _interopRequireDefault(require("./ChildExposedApi"));

var _UrlParser = require("ievv_jsbase/lib/http/UrlParser");

var _QueryString = _interopRequireDefault(require("ievv_jsbase/lib/http/QueryString"));

var _UniqueDomIdSingleton = _interopRequireDefault(require("ievv_jsbase/lib/dom/UniqueDomIdSingleton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AbstractFilterList =
/*#__PURE__*/
function (_React$Component) {
  _createClass(AbstractFilterList, null, [{
    key: "propTypes",
    get: function get() {
      return {
        idAttribute: _propTypes.default.string.isRequired,
        className: _propTypes.default.string,
        selectMode: _propTypes.default.oneOf([_filterListConstants.SINGLESELECT, _filterListConstants.MULTISELECT, null]),
        autoLoadFirstPage: _propTypes.default.bool.isRequired,
        skipLoadingMissingSelectedItemDataFromApi: _propTypes.default.bool.isRequired,
        domIdPrefix: _propTypes.default.string,
        onFocus: _propTypes.default.func,
        onBlur: _propTypes.default.func,
        onSelectItem: _propTypes.default.func,
        onSelectItems: _propTypes.default.func,
        onDeselectItem: _propTypes.default.func,
        onDeselectItems: _propTypes.default.func,
        onSelectedItemsMoved: _propTypes.default.func,
        onDeselectAllItems: _propTypes.default.func,
        getItemsApiUrl: _propTypes.default.string.isRequired,
        updateSingleItemSortOrderApiUrl: _propTypes.default.string,
        components: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
        initiallySelectedItemIds: _propTypes.default.array.isRequired // updateHttpMethod: (props, propName, componentName) => {
        //   if(!props[propName] || !/^(post|put)$/.test(props[propName])) {
        //     return new Error(
        //       `Invalid prop ${propName} supplied to ${componentName}. Must ` +
        //       `be "post" or "put".`
        //     )
        //   }
        // }

      };
    }
    /**
     * Get default props.
     *
     * TODO: Document all the props.
     *
     * @return {Object}
     * @property {string} idAttribute The ID attribute in the getItemsApiUrl API. Defaults to `id`.
     * @property {string} getItemsApiUrl The API to get the items from (with a GET request). Required.
     * @property {string} domIdPrefix The DOM id prefix that we use when we need to set IDs on DOM elements
     *    within the list. This is optional, but highly recommended to set. If this is not set,
     *    we generate a prefix from the `getItemsApiUrl` and a random integer.
     * @property {function} onGetListItemsFromApiRequestBegin
     *    Called each time we initialize an API request to get items. Called with
     *    three arguments: (<this - the filterlist object>, paginationOptions, clearOldItems).
     *    See {@link AbstractFilterList#loadItemsFromApi} for documentation of ``paginationOptions``
     *    and ``clearOldItems``.
     * @property {function} onGetListItemsFromApiRequestSuccess
     *    Called each time we successfully complete an API request to get items. Called with
     *    three arguments: (<this - the filterlist object>, paginationOptions, clearOldItems).
     *    See {@link AbstractFilterList#loadItemsFromApi} for documentation of ``paginationOptions``
     *    and ``clearOldItems``.
     * @property {function} onGetListItemsFromApiRequestError
     *    Called each time we successfully complete an API request to get items. Called with
     *    three arguments: (<this - the filterlist object>, error, paginationOptions, clearOldItems).
     *    See {@link AbstractFilterList#loadItemsFromApi} for documentation of ``paginationOptions``
     *    and ``clearOldItems``. ``error`` is the exception object.
     * @property {number} filterApiDelayMilliseconds Number of milliseconds we wait from the last filter change until
     *    we perform an API request. Defaults to ``500``.
     * @property {string} selectMode One of {@link SINGLESELECT}, {@link MULTISELECT} or null. Always set this
     *    to something other than null when using a configuration that enables selecting items.
     * @property {function} onSelectItems Callback function called each time a user adds to the selected items
     *    when `selectMode` is {@link MULTISELECT}. Called with two arguments `(addedSelectedListItemIds, filterList)`
     *    where `addedSelectedListItemIds` is the items that was just added to the selection, and
     *    `filterList` is a reference to this filterlist object.
     * @property {function} onDeselectItems Callback function called each time a user removes from the selected items
     *    when `selectMode` is {@link MULTISELECT}. Called with two arguments `(removedSelectedListItemIds, filterList)`
     *    where `removedSelectedListItemIds` is the items that was just removed from the selection, and
     *    `filterList` is a reference to this filterlist object.
     * @property {function} onSelectedItemsMoved Callback function called each time a user moves a selected item
     *    when `selectMode` is {@link MULTISELECT}. Called with one argument `(filterList)` where `filterList` is a
     *    reference to this filterlist object.
     * @property {function} onSelectItem Callback function called each time a user adds to the selected items
     *    when `selectMode` is {@link SINGLESELECT}. Called with two arguments `(selectedItemId, filterList)`
     *    where `selectedItemId` is the ID of the selected item, and `filterList` is a reference to this
     *    filterlist object.
     * @property {function} onDeselectItem Callback function called each time a user removes from the selected items
     *    when `selectMode` is {@link SINGLESELECT}. Called with two arguments `(deselectedItemId, filterList)`
     *    where `deselectedItemId` is the ID of the deselected item, and `filterList` is a reference to this
     *    filterlist object.
     */

  }, {
    key: "defaultProps",
    get: function get() {
      return {
        idAttribute: 'id',
        className: null,
        selectMode: null,
        autoLoadFirstPage: true,
        skipLoadingMissingSelectedItemDataFromApi: false,
        onFocus: null,
        onBlur: null,
        onSelectItem: null,
        onSelectItems: null,
        onDeselectItem: null,
        onDeselectItems: null,
        onSelectedItemsMoved: null,
        onDeselectAllItems: null,
        onGetListItemsFromApiRequestBegin: null,
        onGetListItemsFromApiRequestError: null,
        onGetListItemsFromApiRequestSuccess: null,
        filterApiDelayMilliseconds: 500,
        bindFiltersToQuerystring: false,
        getItemsApiUrl: null,
        updateSingleItemSortOrderApiUrl: null,
        initiallySelectedItemIds: [],
        domIdPrefix: null,
        components: [{
          component: 'ThreeColumnLayout',
          layout: [{
            component: 'BlockList',
            itemSpec: {
              component: 'IdOnlyItem'
            }
          }, {
            component: 'LoadMorePaginator'
          }]
        }]
      };
    }
  }]);

  function AbstractFilterList(props) {
    var _this;

    _classCallCheck(this, AbstractFilterList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractFilterList).call(this, props));

    _this.setupBoundMethods();

    _this._apiRequestNumber = 0;
    _this.childExposedApi = _this.makeChildExposedApi();
    _this._filterApiUpdateTimeoutId = null;
    _this._saveMovingItemTimeout = null;
    _this._blurTimeoutId = null;
    _this.filterListRegistry = new _FilterListRegistrySingleton.default();
    _this.state = _this.getInitialState();
    _this.filterSpecCache = new Map();
    _this.cachedHeaderSpec = null;
    _this.cachedBodySpec = null;
    _this.cachedItemSpec = null;
    _this.cachedListSpec = null;
    _this.cachedPaginatorSpec = null;
    _this._focusChangeListeners = new Set();
    _this._selectionChangeListeners = new Set();
    _this._currentFocusChildInfo = null;
    return _this;
  }
  /**
   * Make a {@link ChildExposedApi} object.
   *
   * See {@link ChildExposedApi} for more details.
   *
   * @returns {ChildExposedApi}
   */


  _createClass(AbstractFilterList, [{
    key: "makeChildExposedApi",
    value: function makeChildExposedApi() {
      return new _ChildExposedApi.default(this);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.setState(_objectSpread({}, AbstractFilterList.refreshComponentCache(this.props, this.state), {
        isMounted: true
      }), function () {
        _this2.loadMissingSelectedItemDataFromApi();

        _this2.loadInitialFilterValues();

        if (_this2.props.autoLoadFirstPage) {
          _this2.loadFirstPageFromApi();
        }
      });
    }
  }, {
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      this.loadMissingSelectedItemDataFromApi = this.loadMissingSelectedItemDataFromApi.bind(this);
    }
  }, {
    key: "_makeInitiallySelectedListItemsMap",
    value: function _makeInitiallySelectedListItemsMap() {
      var selectedListItemsMap = new Map();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.initiallySelectedItemIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var itemId = _step.value;
          selectedListItemsMap.set(itemId, null);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return selectedListItemsMap;
    }
    /**
     * Get the initial react state.
     *
     * Useful for subclasses.
     *
     * @returns {object} The initial state.
     */

  }, {
    key: "getInitialState",
    value: function getInitialState() {
      return {
        listItemsDataArray: [],
        listItemsDataMap: new Map(),
        isLoadingNewItemsFromApi: false,
        isLoadingMoreItemsFromApi: false,
        componentCache: AbstractFilterList.makeEmptyComponentCache(),
        paginationState: {},
        hasFocus: false,
        selectedListItemsMap: this._makeInitiallySelectedListItemsMap(),
        loadSelectedItemsFromApiError: null,
        loadItemsFromApiError: null,
        enabledComponentGroups: new Set(),
        selectMode: this.props.selectMode,
        isMounted: false,
        isMovingListItemId: null,
        allListItemMovementIsLocked: false
      };
    }
    /**
     * Make an empty component cache.
     *
     * @returns {ComponentCache} An object of {@link ComponentCache} or a subclass.
     */

  }, {
    key: "disableComponentGroup",
    //
    //
    // Component groups
    //
    //

    /**
     * Disable a component group.
     *
     * See {@link AbstractFilterList#toggleComponentGroup} for more info
     * about component groups.
     *
     * @param {string} group The group to disable.
     */
    value: function disableComponentGroup(group) {
      this.setState(function (prevState) {
        var enabledComponentGroups = new Set(prevState.enabledComponentGroups);
        enabledComponentGroups.delete(group);
        return {
          enabledComponentGroups: enabledComponentGroups
        };
      });
    }
    /**
     * Enable a component group.
     *
     * See {@link AbstractFilterList#toggleComponentGroup} for more info
     * about component groups.
     *
     * @param {string} group The group to enable.
     */

  }, {
    key: "enableComponentGroup",
    value: function enableComponentGroup(group) {
      this.setState(function (prevState) {
        var enabledComponentGroups = new Set(prevState.enabledComponentGroups);
        enabledComponentGroups.add(group);
        return {
          enabledComponentGroups: enabledComponentGroups
        };
      });
    }
    /**
     * Is a component group enabled?
     *
     * See {@link AbstractFilterList#toggleComponentGroup} for more info
     * about component groups.
     *
     * @param {string|null} group The group to check. If this is null, we always return `true`.
     * @return {bool} Is the component group enabled?
     */

  }, {
    key: "componentGroupIsEnabled",
    value: function componentGroupIsEnabled(group) {
      if (group === null) {
        return true;
      }

      return this.state.enabledComponentGroups.has(group);
    }
    /**
     * Is all the provided component groups enabled?
     *
     * @param {[string]|null} groups
     * @return {bool} Is all the component groups enabled?
     */

  }, {
    key: "componentGroupsIsEnabled",
    value: function componentGroupsIsEnabled(groups) {
      if (groups === null) {
        return true;
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var group = _step2.value;

          if (!this.componentGroupIsEnabled(group)) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return true;
    }
    /**
     * Toggle a component group between disabled/enabled.
     *
     * A component group is just a string that any component
     * in `body` or `header` can set via their `componentGroup`
     * prop. You can then use this method, {@link AbstractFilterList#enableComponentGroup}
     * or {@link AbstractFilterList#disableComponentGroup} to enable/disable
     * rendering of a whole group of components. This is perfect
     * for things like dropdowns, toggle advanced filters, etc.
     *
     * We provide the {@link COMPONENT_GROUP_EXPANDABLE} and
     * {@link COMPONENT_GROUP_ADVANCED} constants, and you
     * should use these (or their values in case of purely configuring
     * through JSON input) unless you have needs not covered by them.
     *
     * @param {string} group The group to enable/disable.
     */

  }, {
    key: "toggleComponentGroup",
    value: function toggleComponentGroup(group) {
      if (this.componentGroupIsEnabled(group)) {
        this.disableComponentGroup(group);
      } else {
        this.enableComponentGroup(group);
      }
    } //
    //
    // Focus/blur
    //
    //

  }, {
    key: "_stopBlurTimer",
    value: function _stopBlurTimer() {
      if (this._blurTimeoutId) {
        window.clearTimeout(this._blurTimeoutId);
      }
    }
  }, {
    key: "onBlurTimerTimeout",
    value: function onBlurTimerTimeout(childInfo) {
      var _this3 = this;

      var didChangeFilterListFocus = this.state.hasFocus !== false;
      this.setState({
        hasFocus: false
      }, function () {
        _this3.callAllFocusChangeListeners('onAnyComponentBlur', childInfo, didChangeFilterListFocus);

        _this3._currentFocusChildInfo = null;

        if (_this3.props.onBlur) {
          _this3.props.onBlur(_this3);
        }
      });
    }
  }, {
    key: "_startBlurTimer",
    value: function _startBlurTimer(childInfo) {
      var _this4 = this;

      this._blurTimeoutId = window.setTimeout(function () {
        _this4.onBlurTimerTimeout(childInfo);
      }, this.blurTimerTimeout);
    }
  }, {
    key: "onChildBlur",
    value: function onChildBlur(childInfo) {
      this.callAllFocusChangeListeners('onAnyComponentBlur', childInfo, false);

      this._startBlurTimer(childInfo);
    }
  }, {
    key: "onChildFocus",
    value: function onChildFocus(childInfo) {
      var _this5 = this;

      this._stopBlurTimer();

      var didChangeFilterListFocus = this.state.hasFocus !== true;
      this.setState({
        hasFocus: true
      }, function () {
        var prevChildInfo = _this5._currentFocusChildInfo;

        _this5.callAllFocusChangeListeners('onAnyComponentFocus', childInfo, prevChildInfo, didChangeFilterListFocus);

        _this5._currentFocusChildInfo = childInfo;

        if (_this5.props.onFocus) {
          _this5.props.onFocus(_this5);
        }
      });
    }
  }, {
    key: "registerFocusChangeListener",
    value: function registerFocusChangeListener(componentObject) {
      this._focusChangeListeners.add(componentObject);
    }
  }, {
    key: "unregisterFocusChangeListener",
    value: function unregisterFocusChangeListener(componentObject) {
      this._focusChangeListeners.delete(componentObject);
    }
  }, {
    key: "callAllFocusChangeListeners",
    value: function callAllFocusChangeListeners(methodName) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this._focusChangeListeners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var componentObject = _step3.value;
          componentObject[methodName].apply(componentObject, args);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    } //
    //
    // Selected items list mutation
    //
    //

    /**
     * Get the index of the selectedListItemId in the selectedItemsArray.
     * @param selectedListItemId
     * @param selectedItemsArray
     * @returns {number} the index of the selected item in the array.
     */

  }, {
    key: "getIndexOfItem",
    value: function getIndexOfItem(selectedListItemId, selectedItemsArray) {
      return selectedItemsArray.findIndex(function (itemId) {
        return itemId === selectedListItemId;
      });
    }
    /**
     * Returns true if the selectedListeItemId is the first element in selectedListItemsMap.
     *
     * @param selectedListItemId
     * @returns {boolean}
     */

  }, {
    key: "selectedItemIsFirst",
    value: function selectedItemIsFirst(selectedListItemId) {
      var item = Array.from(this.state.selectedListItemsMap.values())[0];

      if (item === null) {
        return false;
      }

      return item.id === selectedListItemId;
    }
    /**
     * Returns true if the selectedListeItemId is the last element in selectedListItemsMap.
     *
     * @param selectedListItemId
     * @returns {boolean}
     */

  }, {
    key: "selectedItemIsLast",
    value: function selectedItemIsLast(selectedListItemId) {
      var item = Array.from(this.state.selectedListItemsMap.values()).slice(-1)[0];

      if (item === null) {
        return false;
      }

      return item.id === selectedListItemId;
    }
    /**
     * Get an array of the selected item ids from selectedListItemsMap.
     * @returns {Array}
     */

  }, {
    key: "selectedItemIdsAsArray",
    value: function selectedItemIdsAsArray() {
      return Array.from(this.state.selectedListItemsMap.keys());
    }
    /**
     * Build a new map from a reordered array of selected item ids to replace current
     * selectedListItemsMap
     * @param reorderedArray
     * @returns {Map<Number, Object>}
     */

  }, {
    key: "getItemsMapFromReorderedArray",
    value: function getItemsMapFromReorderedArray(reorderedArray) {
      var selectedItemsMap = new Map();
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = reorderedArray[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var itemId = _step4.value;
          selectedItemsMap.set(itemId, this.state.selectedListItemsMap.get(itemId));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return selectedItemsMap;
    }
    /**
     * Moves an element with selectedItemId one step up in the selectedListItemsMap.
     * @param selectedItemId the selected item id to move up.
     */

  }, {
    key: "selectedItemMoveUp",
    value: function selectedItemMoveUp(selectedItemId) {
      var _this6 = this;

      if (this.selectedItemIsFirst(selectedItemId)) {
        return;
      }

      var selectedItemsArray = this.selectedItemIdsAsArray();

      if (selectedItemsArray[0] === selectedItemId) {
        return;
      }

      var index = this.getIndexOfItem(selectedItemId, selectedItemsArray);

      var newArray = _toConsumableArray(selectedItemsArray.slice(0, index - 1)).concat([selectedItemsArray[index], selectedItemsArray[index - 1]], _toConsumableArray(selectedItemsArray.slice(index + 1)));

      this.setState({
        selectedListItemsMap: this.getItemsMapFromReorderedArray(newArray)
      }, function () {
        if (_this6.props.onSelectedItemsMoved) {
          _this6.props.onSelectedItemsMoved(_this6);
        }
      });
    }
    /**
     * Moves an element with selectedItemId one step down in the selectedListItemsMap.
     * @param selectedItemId the selected item id to move down.
     */

  }, {
    key: "selectedItemMoveDown",
    value: function selectedItemMoveDown(selectedItemId) {
      var _this7 = this;

      if (this.selectedItemIsLast(selectedItemId)) {
        return;
      }

      var selectedItemsArray = this.selectedItemIdsAsArray();
      var index = this.getIndexOfItem(selectedItemId, selectedItemsArray);

      var newArray = _toConsumableArray(selectedItemsArray.slice(0, index)).concat([selectedItemsArray[index + 1], selectedItemsArray[index]], _toConsumableArray(selectedItemsArray.slice(index + 2)));

      this.setState({
        selectedListItemsMap: this.getItemsMapFromReorderedArray(newArray)
      }, function () {
        if (_this7.props.onSelectedItemsMoved) {
          _this7.props.onSelectedItemsMoved(_this7);
        }
      });
    } //
    //
    // List mutations
    //
    //

    /**
     * Get the index of listItemId in the listItemsDataArray
     * @param listItemId The list item id
     * @returns {number} the index of item in list
     */

  }, {
    key: "getIndexOfId",
    value: function getIndexOfId(listItemId) {
      return this.state.listItemsDataArray.findIndex(function (item) {
        return item.listItemId === listItemId;
      });
    }
    /**
     * Returns true if the listItemId is the first element in listItemsDataArray
     * @param listItemId the list item id
     * @returns {boolean}
     */

  }, {
    key: "isFirst",
    value: function isFirst(listItemId) {
      return this.getIndexOfId(listItemId) === 0;
    }
    /**
     * Returns true if the listItemId is the last element in listItemsDataArray
     * @param listItemId the list item id
     * @returns {boolean}
     */

  }, {
    key: "isLast",
    value: function isLast(listItemId) {
      return this.getIndexOfId(listItemId) === this.state.listItemsDataArray.length - 1;
    }
    /**
     * Get the element before the listItemId element
     * @param listItemId the list item id
     * @returns {null|number} returns null if list item id is the first element, otherwise the object before.
     */

  }, {
    key: "getBefore",
    value: function getBefore(listItemId) {
      if (this.isFirst(listItemId)) {
        return null;
      }

      return this.state.listItemsDataArray[this.getIndexOfId(listItemId) - 1];
    }
    /**
     * Get the element after the listItemId element
     * @param listItemId the list item id
     * @returns {null|number} returns null if the list item id is the last element, otherwise the object after.
     */

  }, {
    key: "getAfter",
    value: function getAfter(listItemId) {
      if (this.isLast(listItemId)) {
        return null;
      }

      return this.state.listItemsDataArray[this.getIndexOfId(listItemId) + 1];
    }
    /**
     * Moves an element with listItemId one step up in the listItemsDataArray
     * @param listItemId the list item id to move
     */

  }, {
    key: "moveUp",
    value: function moveUp(listItemId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var index = this.getIndexOfId(listItemId);

      if (index === 0) {
        return;
      }

      this.setState({
        listItemsDataArray: _toConsumableArray(this.state.listItemsDataArray.slice(0, index - 1)).concat([this.state.listItemsDataArray[index], this.state.listItemsDataArray[index - 1]], _toConsumableArray(this.state.listItemsDataArray.slice(index + 1)))
      }, function () {
        if (callback !== null) {
          callback(listItemId);
        }
      });
    }
    /**
     * Moves an element with listItemId one step down in the listItemsDataArray
     * @param listItemId the list item id to move
     */

  }, {
    key: "moveDown",
    value: function moveDown(listItemId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var index = this.getIndexOfId(listItemId);

      if (index === this.state.listItemsDataArray.lastIndex - 1) {
        return;
      }

      this.setState({
        listItemsDataArray: _toConsumableArray(this.state.listItemsDataArray.slice(0, index)).concat([this.state.listItemsDataArray[index + 1], this.state.listItemsDataArray[index]], _toConsumableArray(this.state.listItemsDataArray.slice(index + 2)))
      }, function () {
        if (callback !== null) {
          callback(listItemId);
        }
      });
    }
    /**
     *
     * @example <caption>Typical example within some child component of the filterlist</caption>
     *
     * handleMoveUp () {
     *   // this.props.listItemId would work for list item renderables, but you may get it from somewhere else
     *   this.childExposedApi.setIsMovingListItemId(this.props.listItemId, (listItemId) => {
     *     this.childExposedApi.moveUp(listItemId, () => {
     *       this.childExposedApi.setSaveMovingItemTimeout((listItemId) => {
     *         this.saveMovedItem(listItemId)
     *       })
     *     })
     *   })
     * }
     *
     * saveMovedItem (listItemId) {
     *   this.childExposedApi.lockAllListItemMovement(() => {
     *     new HttpRequest()
     *        .post(...)
     *        .then(() => {
     *           this.childExposedApi.clearIsMovingListItemId()
     *        })
     *        .catch(() => {
     *           // Show some error, and perhaps call clearisMovingListItemId()
     *        })
     *   })
     * }
     *
     * @param listItemId
     * @param callback
     */

  }, {
    key: "setIsMovingListItemId",
    value: function setIsMovingListItemId(listItemId) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState({
        isMovingListItemId: listItemId
      }, function () {
        if (callback !== null) {
          callback(listItemId);
        }
      });
    }
    /**
     * Get the ID of the list-item currently being moved.
     *
     * @returns {*}
     */

  }, {
    key: "lockAllListItemMovement",

    /**
     * Sets the `allListItemMovementIsLocked` in state, and the
     * callback should handle the POST-request to an API.
     *
     * For example usage, see the example for `setIsMovingListItemId`.
     *
     * @param callback
     */
    value: function lockAllListItemMovement() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.setState({
        allListItemMovementIsLocked: true
      }, function () {
        if (callback !== null) {
          callback();
        }
      });
    }
    /**
     * Sets `isMovingListItemId` to ``null`` and `allListItemMovementIsLocked` to
     * ``false`` in state.
     *
     * @see setIsMovingListItemId
     */

  }, {
    key: "clearIsMovingListItemId",
    value: function clearIsMovingListItemId() {
      this.setState({
        isMovingListItemId: null,
        allListItemMovementIsLocked: false
      });
    }
    /**
     * A timeout applied everytime an item is moved, that resets when moving an item
     * before the previous timeout.
     *
     * For example usage, see the example for `setIsMovingListItemId`.
     *
     * @param callback
     * @param timeoutMilliseconds
     */

  }, {
    key: "setSaveMovingItemTimeout",
    value: function setSaveMovingItemTimeout(callback) {
      var timeoutMilliseconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

      if (this._saveMovingItemTimeout) {
        window.clearTimeout(this._saveMovingItemTimeout);
      }

      this._saveMovingItemTimeout = window.setTimeout(callback, timeoutMilliseconds);
    } //
    //
    // Single and multiselect
    //
    //

    /**
     * Change selectMode to given selectMode
     *
     * NOTE: this is not error-handled, so users should take care to only use selectModes that make sense for the
     * current use-case.
     *
     * @param selectMode the selectMode to change to.
     */

  }, {
    key: "setSelectMode",
    value: function setSelectMode(selectMode) {
      this.setState({
        selectMode: selectMode
      });
    }
    /**
     * Is `props.selectMode === 'single'`?
     *
     * WARNING: The default value for `props.selectMode` is `null`,
     * which means that this method returns `false` by default.
     * This means that you normally want to use {@link AbstractFilterList#isMultiSelectMode}
     * instead of this method unless you work with 3 states of selectMode
     * (no select (null), singleselect and multiselect)
     *
     * @returns {boolean}
     */

  }, {
    key: "isSingleSelectMode",
    value: function isSingleSelectMode() {
      return this.state.selectMode === _filterListConstants.SINGLESELECT;
    }
    /**
     * Is `props.selectMode === 'multi'`?
     *
     * @returns {boolean}
     */

  }, {
    key: "isMultiSelectMode",
    value: function isMultiSelectMode() {
      return this.state.selectMode === _filterListConstants.MULTISELECT;
    }
    /**
     * Is the provided `listItemId` selected?
     *
     * @param listItemId The ID of a list item.
     * @returns {boolean}
     */

  }, {
    key: "itemIsSelected",
    value: function itemIsSelected(listItemId) {
      return this.state.selectedListItemsMap.has(listItemId);
    }
    /**
     * Get an array with the IDs of the selected items.
     *
     * You will typically use this in combination with
     * the `onSelectItems`, `onDeselectItems` and `onSelectedItemsMoved` to store the
     * selected items in some parent component. Both `onSelectItems`
     * and `onDeselectItems` gets a reference to this filterlist class
     * as their second argument. `onSelectedItemsMoved` gets a reference to this filterlist as
     * its only argument.
     *
     * @example <caption>A typical callback function for the onSelectItems / onDeselectItems props</caption>
     * onSelectItemsHandler (addedSelectedListItemIds, filterList) {
     *   const allSelectedItemIds = filterList.getSelectedListItemIds()
     * }
     *
     * @example <caption>A typical callback function for the onSelectedItemsMoved prop</caption>
     * onSelectedItemsMovedHandler (filterList) {
     *   const allSelectedItemIds = filterList.getSelectedListItemIds()
     * }
     */

  }, {
    key: "getSelectedListItemIds",
    value: function getSelectedListItemIds() {
      return Array.from(this.state.selectedListItemsMap.keys());
    }
    /**
     * Select an item.
     *
     * @param listItemId The ID of a list item.
     */

  }, {
    key: "selectItem",
    value: function selectItem(listItemId) {
      this.selectItems([listItemId]);
    }
  }, {
    key: "registerSelectionChangeListener",
    value: function registerSelectionChangeListener(componentObject) {
      this._selectionChangeListeners.add(componentObject);
    }
  }, {
    key: "unregisterSelectionChangeListener",
    value: function unregisterSelectionChangeListener(componentObject) {
      this._selectionChangeListeners.delete(componentObject);
    }
  }, {
    key: "callAllSelectionChangeListeners",
    value: function callAllSelectionChangeListeners(methodName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this._selectionChangeListeners[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var componentObject = _step5.value;
          componentObject[methodName].apply(componentObject, args);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "onSelectedItems",
    value: function onSelectedItems(listItemIds) {
      this.callAllSelectionChangeListeners('onSelectItems', listItemIds);
    }
  }, {
    key: "onDeselectItems",
    value: function onDeselectItems(listItemIds) {
      this.callAllSelectionChangeListeners('onDeselectItems', listItemIds);
    }
    /**
     * Select multiple items.
     *
     * @param {[]} listItemIds Array of list item IDs. The array can not have more
     *    than 1 item unless {@link AbstractFilterList#isMultiSelectMode} is `true`.
     */

  }, {
    key: "selectItems",
    value: function selectItems(listItemIds) {
      var _this8 = this;

      if (listItemIds.length > 1 && !this.isMultiSelectMode()) {
        throw new Error('Can not select multiple items unless selectMode is "multi".');
      }

      if (!this.isMultiSelectMode()) {
        this.deselectAllItems();
      }

      this.setState(function (prevState, props) {
        var selectedListItemsMap = prevState.selectedListItemsMap;
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = listItemIds[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var listItemId = _step6.value;
            var listItemData = null;

            if (prevState.listItemsDataMap.has(listItemId)) {
              listItemData = prevState.listItemsDataMap.get(listItemId);
            }

            selectedListItemsMap.set(listItemId, listItemData);
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        return {
          selectedListItemsMap: selectedListItemsMap
        };
      }, function () {
        _this8.loadMissingSelectedItemDataFromApi();

        _this8.onSelectedItems(listItemIds);

        if (_this8.props.onSelectItems) {
          _this8.props.onSelectItems(listItemIds, _this8);
        }

        if (!_this8.isMultiSelectMode()) {
          if (_this8.props.onSelectItem && listItemIds.length > 0) {
            _this8.props.onSelectItem(listItemIds[0], _this8);
          }
        }
      });
    }
    /**
     * Deselect an item.
     *
     * @param listItemId The ID of a list item.
     */

  }, {
    key: "deselectItem",
    value: function deselectItem(listItemId) {
      this.deselectItems([listItemId]);
    }
    /**
     * Deselect multiple items.
     *
     * @param {[]} listItemIds Array of list item IDs.
     */

  }, {
    key: "deselectItems",
    value: function deselectItems(listItemIds) {
      var _this9 = this;

      this.setState(function (prevState) {
        var selectedListItemsMap = prevState.selectedListItemsMap;
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = listItemIds[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var listItemId = _step7.value;
            selectedListItemsMap.delete(listItemId);
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        return {
          selectedListItemsMap: selectedListItemsMap
        };
      }, function () {
        _this9.onDeselectItems();

        if (_this9.props.onDeselectItems) {
          _this9.props.onDeselectItems(listItemIds, _this9);
        }

        if (!_this9.isMultiSelectMode()) {
          if (_this9.props.onDeselectItem && listItemIds.length > 0) {
            _this9.props.onDeselectItem(listItemIds[0], _this9);
          }
        }

        if (_this9.props.onDeselectAllItems && _this9.state.selectedListItemsMap.size === 0) {
          _this9.props.onDeselectAllItems(_this9);
        }
      });
    }
    /**
     * Deselect all selected items.
     */

  }, {
    key: "deselectAllItems",
    value: function deselectAllItems() {
      var listItemIds = Array.from(this.state.selectedListItemsMap.keys());
      this.deselectItems(listItemIds);
    }
  }, {
    key: "getSelectedItemIdsWithMissingItemData",
    value: function getSelectedItemIdsWithMissingItemData() {
      var selectedItemIdsWithMissingItemData = [];
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.state.selectedListItemsMap[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _step8$value = _slicedToArray(_step8.value, 2),
              listItemId = _step8$value[0],
              listItemData = _step8$value[1];

          if (listItemData === null) {
            selectedItemIdsWithMissingItemData.push(listItemId);
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      return selectedItemIdsWithMissingItemData;
    } // filterLoadSelectedItemDataFromApiRequest (httpRequest, listItemIds) {
    //   httpRequest.urlParser.queryString.setIterable(
    //     this.props.getItemsApiIdsQueryStringArgument,
    //     listItemIds)
    // }

  }, {
    key: "setLoadMissingSelectedItemDataFromApiErrorMessage",
    value: function setLoadMissingSelectedItemDataFromApiErrorMessage(errorObject) {
      this.setState({
        loadSelectedItemsFromApiError: window.gettext('Failed to load selected list items from the server.')
      });
    }
  }, {
    key: "clearLoadMissingSelectedItemDataFromApiErrorMessage",
    value: function clearLoadMissingSelectedItemDataFromApiErrorMessage() {
      if (this.state.loadSelectedItemsFromApiError !== null) {
        this.setState({
          loadSelectedItemsFromApiError: null
        });
      }
    }
  }, {
    key: "handleLoadMissingSelectedItemDataFromApiError",
    value: function handleLoadMissingSelectedItemDataFromApiError(errorObject) {
      console.error('Error:', errorObject.toString());
      this.setLoadMissingSelectedItemDataFromApiErrorMessage(errorObject);
    }
  }, {
    key: "handleRetrieveListItemDataError",
    value: function handleRetrieveListItemDataError(listItemResponse) {
      console.warn('Failed to retrieve list item data:', listItemResponse);
    }
  }, {
    key: "loadMissingSelectedItemDataFromApi",
    value: function loadMissingSelectedItemDataFromApi() {
      var _this10 = this;

      if (this.props.skipLoadingMissingSelectedItemDataFromApi) {
        return;
      }

      var itemIdsWithMissingData = this.getSelectedItemIdsWithMissingItemData();

      if (itemIdsWithMissingData.length === 0) {
        return;
      }

      if (this.state.isLoadingSelectedItemDataFromApi) {
        // Do not allow this to run in parallel
        setTimeout(this.loadMissingSelectedItemDataFromApi, 20);
        return;
      }

      this.clearLoadMissingSelectedItemDataFromApiErrorMessage();
      this.setState({
        isLoadingSelectedItemDataFromApi: true
      }, function () {
        _this10.loadMultipleItemDataFromApi(itemIdsWithMissingData).then(function (selectedItemDataArray) {
          _this10.setState(function (prevState) {
            var selectedListItemsMap = prevState.selectedListItemsMap;
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
              for (var _iterator9 = selectedItemDataArray[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var listItemResponse = _step9.value;
                var listItemId = listItemResponse.listItemId;

                if (listItemResponse.status === 200) {
                  selectedListItemsMap.set(listItemId, listItemResponse.data);
                } else {
                  selectedListItemsMap.delete(listItemId);

                  _this10.handleRetrieveListItemDataError(listItemResponse);
                }
              }
            } catch (err) {
              _didIteratorError9 = true;
              _iteratorError9 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
                  _iterator9.return();
                }
              } finally {
                if (_didIteratorError9) {
                  throw _iteratorError9;
                }
              }
            }

            return {
              selectedListItemsMap: selectedListItemsMap,
              isLoadingSelectedItemDataFromApi: false
            };
          });
        }).catch(function (error) {
          _this10.handleLoadMissingSelectedItemDataFromApiError(error);
        });
      });
    }
  }, {
    key: "_stopFilterApiUpdateTimer",
    value: function _stopFilterApiUpdateTimer() {
      if (this._filterApiUpdateTimeoutId) {
        window.clearTimeout(this._filterApiUpdateTimeoutId);
      }
    }
  }, {
    key: "_startFilterApiUpdateTimer",
    value: function _startFilterApiUpdateTimer() {
      var _this11 = this;

      this._filterApiUpdateTimeoutId = window.setTimeout(function () {
        _this11.loadFromApiOnFilterChange();
      }, this.filterApiDelayMilliseconds);
    }
  }, {
    key: "_setFilterValueInState",
    value: function _setFilterValueInState(filterName, value) {
      var _this12 = this;

      var onComplete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
      this.setState(AbstractFilterList._makeFilterValue(filterName, value), function () {
        if (_this12.props.bindFiltersToQuerystring) {
          _this12.syncFilterValuesToQueryString(filterName, value);
        }

        _this12.onFilterValueSetInState(filterName, value);

        onComplete();
      });
    }
  }, {
    key: "onFilterValueSetInState",
    value: function onFilterValueSetInState(filterName, value) {}
  }, {
    key: "loadFilterValuesFromQueryString",
    value: function loadFilterValuesFromQueryString() {
      var queryString = new _QueryString.default(window.location.search);
      var newState = {};
      var stateUpdateNeeded = false;
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = queryString.keys()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var filterName = _step10.value;
          var filterSpec = this.state.componentCache.filterMap.get(filterName);

          if (filterSpec) {
            var value = filterSpec.componentClass.getValueFromQueryString(queryString, filterName);
            newState[AbstractFilterList._getStateVariableNameForFilter(filterName)] = value;
            stateUpdateNeeded = true;
          }
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }

      if (stateUpdateNeeded) {
        this.setState(newState);
      }
    }
  }, {
    key: "loadInitialFilterValues",
    value: function loadInitialFilterValues() {
      if (this.props.bindFiltersToQuerystring) {
        this.loadFilterValuesFromQueryString();
      }
    }
  }, {
    key: "setFilterValueInQueryString",
    value: function setFilterValueInQueryString(queryString, filterName) {
      var filterSpec = this.state.componentCache.filterMap.get(filterName);
      var value = this.getFilterValue(filterName);

      if (value === null || value === undefined || value === '') {
        queryString.remove(filterName);
      } else {
        filterSpec.componentClass.setInQueryString(queryString, filterName, value);
      }
    }
  }, {
    key: "syncFilterValuesToQueryString",
    value: function syncFilterValuesToQueryString() {
      var changedFilterName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var changedFilterValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var urlParser = new _UrlParser.UrlParser(window.location.href);

      if (changedFilterName !== null) {
        this.setFilterValueInQueryString(urlParser.queryString, changedFilterName);
      } else {
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = this.state.componentCache.filterMap.keys()[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var filterName = _step11.value;
            this.setFilterValueInQueryString(urlParser.queryString, filterName);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }
      }

      var newUrl = urlParser.buildUrl();
      window.history.replaceState({
        path: newUrl
      }, '', newUrl);
    }
    /**
     * Set the value of a filter.
     * @param filterName The name of the filter.
     * @param value The new filter value.
     * @param {bool} noDelay Perform the API request immediately if
     *    this is `true` (see {@link AbstractFilterList#filterApiDelayMilliseconds}).
     *    Defaults to `false`.
     */

  }, {
    key: "setFilterValue",
    value: function setFilterValue(filterName, value) {
      var _this13 = this;

      var noDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this._stopFilterApiUpdateTimer();

      this._setFilterValueInState(filterName, value, function () {
        if (noDelay) {
          _this13.loadFromApiOnFilterChange();
        } else {
          _this13._startFilterApiUpdateTimer();
        }
      });
    }
  }, {
    key: "getFilterValue",

    /**
     * Get the current value of a filter.
     *
     * @param filterName The name of the filter.
     * @returns Value of the filter.
     */
    value: function getFilterValue(filterName) {
      return this.state[AbstractFilterList._getStateVariableNameForFilter(filterName)];
    } //
    //
    // List items
    //
    //

    /**
     * Get the ID of a list item from the item data.
     *
     * @param {{}} listItemData The list item data.
     * @returns {*} The ID of the list item.
     */

  }, {
    key: "getIdFromListItemData",
    value: function getIdFromListItemData(listItemData) {
      if (this.props.idAttribute) {
        return listItemData[this.props.idAttribute];
      }

      throw new Error('You have to specify the "idAttribute" prop, ' + 'or override the getIdFromListItemData() method.');
    } //
    //
    // HTTP requests
    //
    //

    /**
     * Filter a list items HTTP request.
     *
     * Calls {@link AbstractFilter#filterHttpRequest}
     * on all filters.
     *
     * @param httpRequest The HTTP request.
     *    An object of the class returned by {@link AbstractFilter#getHttpRequestClass}
     */

  }, {
    key: "filterListItemsHttpRequest",
    value: function filterListItemsHttpRequest(httpRequest) {
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = this.state.componentCache.filterMap.values()[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var filterSpec = _step12.value;
          var value = this.getFilterValue(filterSpec.props.name);
          filterSpec.componentClass.filterHttpRequest(httpRequest, filterSpec.props.name, value);
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }
    }
    /**
     * Get the HttpRequest class to use for the HTTP requests.
     *
     * Must return a subclass of HttpRequest from the ievv_jsbase library.
     *
     * Defaults to HttpDjangoJsonRequest.
     */

  }, {
    key: "getHttpRequestClass",
    value: function getHttpRequestClass() {
      return _HttpDjangoJsonRequest.default;
    }
    /**
     * Add pagination options to a HTTP request.
     *
     * @param httpRequest A HTTP request object. Will always be an
     *    object of the class returned by {@link getHttpRequestClass}
     * @param {{}} paginationOptions The default implementation sets
     *    the provided options as querystring arguments.
     */

  }, {
    key: "paginateListItemsHttpRequest",
    value: function paginateListItemsHttpRequest(httpRequest, paginationOptions) {
      if (paginationOptions) {
        httpRequest.urlParser.queryString.setValuesFromObject(paginationOptions);
      }
    }
    /**
     * Make list items HTTP request.
     *
     * @param {{}} paginationOptions Paginator options.
     * @param {bool} filter Should we filter the HTTP request using
     *    {@link AbstractFilter#filterListItemsHttpRequest}?
     *    Defaults to `true`.
     * @param {bool} paginate should we add paginationOptions using
     *    {@link AbstractFilterList#paginateListItemsHttpRequest}? Default: true
     * @returns {*} HTTP request object. An instance of the
     *    class returned by {@link AbstractFilter#getHttpRequestClass}.
     */

  }, {
    key: "makeListItemsHttpRequest",
    value: function makeListItemsHttpRequest(paginationOptions) {
      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var paginate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var HttpRequestClass = this.getHttpRequestClass();
      var httpRequest = new HttpRequestClass(this.props.getItemsApiUrl);

      if (filter) {
        this.filterListItemsHttpRequest(httpRequest);
      }

      if (!paginate) {
        return httpRequest;
      }

      this.paginateListItemsHttpRequest(httpRequest, paginationOptions);
      return httpRequest;
    }
  }, {
    key: "getSingleItemApiUrl",
    value: function getSingleItemApiUrl(listItemId) {
      return _UrlParser.UrlParser.pathJoin(this.props.getItemsApiUrl, "".concat(listItemId));
    }
  }, {
    key: "makeGetSingleItemHttpRequest",
    value: function makeGetSingleItemHttpRequest(listItemId) {
      var HttpRequestClass = this.getHttpRequestClass();
      return new HttpRequestClass(this.getSingleItemApiUrl(listItemId));
    }
    /**
     * Get a human readable and user friendly load
     * items from API request error message.
     *
     * @param {Error} errorObject
     */

  }, {
    key: "getLoadItemsFromApiErrorMessage",
    value: function getLoadItemsFromApiErrorMessage(errorObject) {
      return window.gettext('Failed to load list items from the server.');
    }
    /**
     * Update state with data about an error from a
     * load items from API http request.
     *
     * You normally want to override
     * {@link AbstractFilter#getLoadItemsFromApiErrorMessage}
     * instead of this method unless you are changing the error handling
     * completely.
     *
     * If you override this, you will need to also
     * override {@link AbstractFilter#clearLoadItemsFromApiErrorMessage}.
     *
     * @param {Error} errorObject
     */

  }, {
    key: "setLoadItemsFromApiErrorMessage",
    value: function setLoadItemsFromApiErrorMessage(errorObject) {
      this.setState({
        loadItemsFromApiError: this.getLoadItemsFromApiErrorMessage(errorObject)
      });
    }
    /**
     * Clear the error messages set by
     * {@link AbstractFilter#setLoadItemsFromApiErrorMessage}.
     */

  }, {
    key: "clearLoadItemsFromApiErrorMessage",
    value: function clearLoadItemsFromApiErrorMessage() {
      if (this.state.loadItemsFromApiError !== null) {
        this.setState({
          loadItemsFromApiError: null
        });
      }
    }
    /**
     * Handle a failed load items from API http request.
     *
     * You normally want to override
     * {@link AbstractFilter#getLoadItemsFromApiErrorMessage}
     * instead of this method unless you are changing the error handling
     * completely.
     *
     * @param {Error} errorObject
     */

  }, {
    key: "handleGetListItemsFromApiRequestError",
    value: function handleGetListItemsFromApiRequestError(errorObject) {
      console.error('Error:', errorObject.toString());
      this.setLoadItemsFromApiErrorMessage(errorObject);
    }
    /**
     * Make pagination state from a HTTP response.
     *
     * The return value from this is stored in ``state.paginationState``,
     * and it is typically used in many of the methods for getting
     * pagination options ({@link getNextPagePaginationOptions},
     * {@link getPreviousPagePaginationOptions}, ...).
     *
     * @param httpResponse The HTTP response. Will always be a
     *    subclass of HttpResponse from the ievv_jsbase library.
     * @param paginationOptions The pagination options that was sent to
     *    the HTTP request.
     * @returns {object} Pagination state object defining the current pagination
     *    state.
     */

  }, {
    key: "makePaginationStateFromHttpResponse",
    value: function makePaginationStateFromHttpResponse(httpResponse, paginationOptions) {
      return {};
    }
    /**
     * Get pagination options for the first paginated page.
     *
     * The returned options are used with
     * {@link AbstractFilterList#paginateListItemsHttpRequest}
     * when requesting the first page from the API.
     *
     * @param {int} paginationState The current pagination state.
     *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
     * @returns {object|null} Pagination options. If this returns `null`,
     *     it means that no pagination options are needed to fetch the
     *     first page.
     */

  }, {
    key: "getFirstPagePaginationOptions",
    value: function getFirstPagePaginationOptions(paginationState) {
      return null;
    }
    /**
     * Get the current pagination page number.
     *
     * @param {int} paginationState The current pagination state.
     *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
     * @returns {number}
     */

  }, {
    key: "getCurrentPaginationPage",
    value: function getCurrentPaginationPage(paginationState) {
      return 1;
    }
    /**
     * Get pagination options for the next page relative to the
     * currently active page.
     *
     * @param {int} paginationState The current pagination state.
     *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
     * @returns {object|null} Pagination options. If this returns
     *    null, it means that there are no "next" page.
     */

  }, {
    key: "getNextPagePaginationOptions",
    value: function getNextPagePaginationOptions(paginationState) {
      return null;
    }
    /**
     * Get pagination options for the previous page relative to the
     * currently active page.
     *
     * @param {int} paginationState The current pagination state.
     *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
     * @returns {object|null} Pagination options. If this returns
     *    null, it means that there are no "previous" page.
     */

  }, {
    key: "getPreviousPagePaginationOptions",
    value: function getPreviousPagePaginationOptions(paginationState) {
      return null;
    }
    /**
     * Get pagination options for a specific page number.
     *
     * @param {int} pageNumber The page number.
     * @param {int} paginationState The current pagination state.
     *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
     *
     * @returns {object} Pagination options
     */

  }, {
    key: "getSpecificPagePaginationOptions",
    value: function getSpecificPagePaginationOptions(pageNumber, paginationState) {
      throw new Error('getSpecificPagePaginationOptions() is not implemented');
    }
    /**
     * Get the total number of available paginatable pages.
     *
     * If this returns ``null``, it means that the information
     * is not available, and paginators depending on this information
     * can not be used.
     *
     * @returns {int|null}
     */

  }, {
    key: "getPaginationPageCount",
    value: function getPaginationPageCount(paginationState) {
      return null;
    }
    /**
     * Get the total number of available list items with the current filters
     * activated.
     *
     * If this returns ``null``, it means that the information
     * is not available, and paginators depending on this information
     * can not be used.
     *
     * @returns {int|null}
     */

  }, {
    key: "getTotalListItemCount",
    value: function getTotalListItemCount(paginationState) {
      return null;
    }
    /**
     * Do we have a previous paginatable page?
     *
     * @returns {boolean}
     */

  }, {
    key: "hasPreviousPaginationPage",
    value: function hasPreviousPaginationPage(paginationState) {
      return this.getPreviousPagePaginationOptions(paginationState) !== null;
    }
    /**
     * Do we have a next paginatable page?
     *
     * @returns {boolean}
     */

  }, {
    key: "hasNextPaginationPage",
    value: function hasNextPaginationPage(paginationState) {
      return this.getNextPagePaginationOptions(paginationState) !== null;
    }
    /**
     * Get an array of list items raw data objects from an API response.
     *
     * @param httpResponse The HTTP response. Will always be a
     *    subclass of HttpResponse from the ievv_jsbase library.
     */

  }, {
    key: "getItemsArrayFromHttpResponse",
    value: function getItemsArrayFromHttpResponse(httpResponse) {
      return httpResponse.bodydata.results;
    }
    /**
     * Make new items state from API response.
     *
     * Parses the HTTP response, and returns an object
     * with new state variables for the list items.
     *
     * @param {{}} prevState The current state.
     * @param {{}} props The current props.
     * @param httpResponse The HTTP response. Will always be a
     *    subclass of HttpResponse from the ievv_jsbase library.
     * @param clearOldItems If this is ``true``, we replace the
     *    items displayed in the list with the items from the response.
     *    If it is ``false``, we append the new items to the items
     *    displayed in the list.
     * @returns {{}} New state variables for the list items.
     */

  }, {
    key: "makeNewItemsStateFromApiResponse",
    value: function makeNewItemsStateFromApiResponse(prevState, props, httpResponse, clearOldItems) {
      var newItemsArray = this.getItemsArrayFromHttpResponse(httpResponse);
      var listItemsDataArray;
      var listItemsDataMap;

      if (clearOldItems) {
        listItemsDataMap = new Map();
        listItemsDataArray = newItemsArray;
      } else {
        var _prevState$listItemsD;

        (_prevState$listItemsD = prevState.listItemsDataArray).push.apply(_prevState$listItemsD, _toConsumableArray(newItemsArray));

        listItemsDataArray = prevState.listItemsDataArray;
        listItemsDataMap = prevState.listItemsDataMap;
      }

      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = newItemsArray[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var listItemData = _step13.value;
          var listItemId = this.getIdFromListItemData(listItemData);
          listItemsDataMap.set(listItemId, listItemData);
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
            _iterator13.return();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }

      return {
        listItemsDataArray: listItemsDataArray,
        listItemsDataMap: listItemsDataMap
      };
    }
    /**
     * Make react state variables from a successful load items from API HTTP response.
     *
     * You should normally not need to override this method.
     * It should normally be enough to override
     * {@link makeNewItemsStateFromApiResponse}
     * and {@link makePaginationStateFromHttpResponse}
     *
     * @param {{}} prevState The current state.
     * @param {{}} props The current props.
     * @param httpResponse The HTTP response. Will always be a
     *    subclass of HttpResponse from the ievv_jsbase library.
     * @param paginationOptions Pagination options normally created
     *    with {@link getNextPagePaginationOptions},
     *    {@link getNextPagePaginationOptions}, {@link getPreviousPagePaginationOptions}
     *    or {@link getSpecificPagePaginationOptions}.
     * @param clearOldItems See {@link makeNewItemsStateFromApiResponse}.
     * @returns {object}
     */

  }, {
    key: "makeStateFromLoadItemsApiSuccessResponse",
    value: function makeStateFromLoadItemsApiSuccessResponse(prevState, props, httpResponse, paginationOptions, clearOldItems) {
      var newItemsState = this.makeNewItemsStateFromApiResponse(prevState, props, httpResponse, clearOldItems);
      return {
        isLoadingNewItemsFromApi: false,
        isLoadingMoreItemsFromApi: false,
        listItemsDataArray: newItemsState.listItemsDataArray,
        listItemsDataMap: newItemsState.listItemsDataMap,
        paginationState: this.makePaginationStateFromHttpResponse(httpResponse, paginationOptions)
      };
    }
    /**
     * Update state from load items API success response.
     *
     * Called by all the `load*FromApi` methods.
     *
     * @param httpResponse The HTTP response object.
     * @param {{}} paginationOptions The pagination options used by the HTTP request.
     * @param {bool} clearOldItems Should we clear old list items and replace
     *    them with the items in the response. If this is `false`, we should
     *    append the new items.
     */

  }, {
    key: "updateStateFromLoadItemsApiSuccessResponse",
    value: function updateStateFromLoadItemsApiSuccessResponse(httpResponse, paginationOptions, clearOldItems) {
      var _this14 = this;

      this.setState(function (prevState, props) {
        return _this14.makeStateFromLoadItemsApiSuccessResponse(prevState, props, httpResponse, paginationOptions, clearOldItems);
      });
    }
  }, {
    key: "_makeApiRequestNumber",
    value: function _makeApiRequestNumber() {
      this._apiRequestNumber++;
      return this._apiRequestNumber;
    }
    /**
     * Load items from API.
     *
     * Low level method. You normally call one of
     *
     * - {@link loadMoreItemsFromApi}
     * - {@link loadNextPageFromApi}
     * - {@link loadPreviousPageFromApi}
     * - {@link loadSpecificPageFromApi}
     *
     * instead of calling this method directly.
     *
     * @param {{}} paginationOptions Paginator options.
     * @param {bool} clearOldItems
     * @returns {Promise}
     */

  }, {
    key: "loadItemsFromApi",
    value: function loadItemsFromApi(paginationOptions, clearOldItems) {
      var _this15 = this;

      var apiRequestNumber = this._makeApiRequestNumber();

      this._isLoadingItemsFromApiRequestNumber = apiRequestNumber;

      if (this.props.onGetListItemsFromApiRequestBegin) {
        this.props.onGetListItemsFromApiRequestBegin(this, paginationOptions, clearOldItems);
      }

      return new Promise(function (resolve, reject) {
        _this15.clearLoadItemsFromApiErrorMessage();

        var newState = {};

        if (clearOldItems) {
          newState.isLoadingNewItemsFromApi = true;
        } else {
          newState.isLoadingMoreItemsFromApi = true;
        }

        _this15.setState(newState, function () {
          _this15.makeListItemsHttpRequest(paginationOptions).get().then(function (httpResponse) {
            if (apiRequestNumber === _this15._isLoadingItemsFromApiRequestNumber) {
              _this15._isLoadingItemsFromApiRequestNumber = null;
              resolve(httpResponse);

              if (_this15.props.onGetListItemsFromApiRequestSuccess) {
                _this15.props.onGetListItemsFromApiRequestSuccess(_this15, httpResponse, paginationOptions, clearOldItems);
              }
            } else {
              reject({
                isCancelled: true
              });

              if (_this15.props.onGetListItemsFromApiRequestError) {
                _this15.props.onGetListItemsFromApiRequestError(_this15, {
                  isCancelled: true
                }, paginationOptions, clearOldItems);
              }
            }
          }).catch(function (error) {
            _this15._isLoadingItemsFromApiRequestNumber = null;
            reject(error);

            if (_this15.props.onGetListItemsFromApiRequestError) {
              _this15.props.onGetListItemsFromApiRequestError(_this15, error, paginationOptions, clearOldItems);
            }
          });
        });
      });
    }
    /**
     * Load first page from the API.
     *
     * Loaded items replaces all items currently in the list.
     */

  }, {
    key: "loadFirstPageFromApi",
    value: function loadFirstPageFromApi() {
      var _this16 = this;

      var paginationOptions = this.getFirstPagePaginationOptions();
      this.loadItemsFromApi(paginationOptions, true).then(function (httpResponse) {
        _this16.updateStateFromLoadItemsApiSuccessResponse(httpResponse, paginationOptions, true);
      }).catch(function (error) {
        if (!error.isCancelled) {
          _this16.handleGetListItemsFromApiRequestError(error);
        }
      });
    }
    /**
     * Called when filter values changes to load new items from the API.
     *
     * By default, this is just an alias for
     * {@link AbstractFilterList#loadFirstPageFromApi}.
     */

  }, {
    key: "loadFromApiOnFilterChange",
    value: function loadFromApiOnFilterChange() {
      this.loadFirstPageFromApi();
    }
    /**
     * Load more items from the API.
     *
     * Intended for _Load more_ buttons, and infinite scroll
     * implementations.
     *
     * Loaded items are appended at the end of the list.
     */

  }, {
    key: "loadMoreItemsFromApi",
    value: function loadMoreItemsFromApi() {
      var _this17 = this;

      var paginationOptions = this.getNextPagePaginationOptions(this.state.paginationState);
      this.loadItemsFromApi(paginationOptions, false).then(function (httpResponse) {
        _this17.updateStateFromLoadItemsApiSuccessResponse(httpResponse, paginationOptions, false);
      }).catch(function (error) {
        if (!error.isCancelled) {
          _this17.handleGetListItemsFromApiRequestError(error);
        }
      });
    }
    /**
     * Load the next paginated "page" of items from the API.
     *
     * Intended to be used along with {@link loadPreviousPageFromApi} by
     * paginators with _Next_ and _Previous_ page buttons.
     *
     * Loaded items replace the current items in the list.
     */

  }, {
    key: "loadNextPageFromApi",
    value: function loadNextPageFromApi() {
      var _this18 = this;

      var paginationOptions = this.getNextPagePaginationOptions(this.state.paginationState);
      this.loadItemsFromApi(paginationOptions, true).then(function (httpResponse) {
        _this18.updateStateFromLoadItemsApiSuccessResponse(httpResponse, paginationOptions, true);
      }).catch(function (error) {
        if (!error.isCancelled) {
          _this18.handleGetListItemsFromApiRequestError(error);
        }
      });
    }
    /**
     * Load the previous paginated "page" of items from the API.
     *
     * Intended to be used along with {@link loadNextPageFromApi} by
     * paginators with _Next_ and _Previous_ page buttons.
     *
     * Loaded items replace the current items in the list.
     */

  }, {
    key: "loadPreviousPageFromApi",
    value: function loadPreviousPageFromApi() {
      var _this19 = this;

      var paginationOptions = this.getPreviousPagePaginationOptions(this.state.paginationState);
      this.loadItemsFromApi(paginationOptions, true).then(function (httpResponse) {
        _this19.updateStateFromLoadItemsApiSuccessResponse(httpResponse, paginationOptions, true);
      }).catch(function (error) {
        if (!error.isCancelled) {
          _this19.handleGetListItemsFromApiRequestError(error);
        }
      });
    }
    /**
     * Load a specific paginated "page" of items from the API.
     *
     * Intended to be used by paginators that use {@link getPaginationPageCount}
     * to render links to specific paginated pages.
     *
     * Loaded items replace the current items in the list.
     */

  }, {
    key: "loadSpecificPageFromApi",
    value: function loadSpecificPageFromApi(pageNumber) {
      var _this20 = this;

      var paginationOptions = this.getSpecificPagePaginationOptions(pageNumber, this.state.paginationState);
      this.loadItemsFromApi(paginationOptions, true).then(function (httpResponse) {
        _this20.updateStateFromLoadItemsApiSuccessResponse(httpResponse, paginationOptions, true);
      }).catch(function (error) {
        if (!error.isCancelled) {
          _this20.handleGetListItemsFromApiRequestError(error);
        }
      });
    } //
    //
    // Rendering
    //
    //

    /**
     * Get props for a layout component.
     *
     * Used by {@link AbstractFilterList#renderLayoutComponent}.
     *
     * @param {LayoutComponentSpec} layoutComponentSpec The layout component spec
     * @returns {{}} Props for the layout component.
     */

  }, {
    key: "getLayoutComponentProps",
    value: function getLayoutComponentProps(layoutComponentSpec) {
      return Object.assign({}, layoutComponentSpec.props, {
        key: layoutComponentSpec.props.uniqueComponentKey,
        childExposedApi: this.childExposedApi,
        listItemsDataArray: this.state.listItemsDataArray,
        listItemsDataMap: this.state.listItemsDataMap,
        selectedListItemsMap: this.state.selectedListItemsMap,
        enabledComponentGroups: this.state.enabledComponentGroups,
        isLoadingNewItemsFromApi: this.state.isLoadingNewItemsFromApi,
        isLoadingMoreItemsFromApi: this.state.isLoadingMoreItemsFromApi,
        selectMode: this.state.selectMode,
        movingListItem: this.state.movingListItem,
        allListItemMovementIsLocked: this.state.allListItemMovementIsLocked
      });
    }
    /**
     * Should we render the provided layout component?
     *
     * Uses {@link AbstractFilterList#componentGroupsIsEnabled} to determine
     * if the component should be rendered.
     *
     * @param {LayoutComponentSpec} layoutComponentSpec A layout component spec.
     * @returns {bool}
     */

  }, {
    key: "shouldRenderLayoutComponentSpec",
    value: function shouldRenderLayoutComponentSpec(layoutComponentSpec) {
      return this.componentGroupsIsEnabled(layoutComponentSpec.props.componentGroups);
    }
    /**
     * Render a layout component.
     *
     * @param {LayoutComponentSpec} layoutComponentSpec A layout component spec.
     * @returns {null|React.Element}
     */

  }, {
    key: "renderLayoutComponent",
    value: function renderLayoutComponent(layoutComponentSpec) {
      if (!this.shouldRenderLayoutComponentSpec(layoutComponentSpec)) {
        return null;
      }

      return _react.default.createElement(layoutComponentSpec.componentClass, this.getLayoutComponentProps(layoutComponentSpec));
    }
  }, {
    key: "renderComponents",
    value: function renderComponents() {
      var renderedComponents = [];
      var _iteratorNormalCompletion14 = true;
      var _didIteratorError14 = false;
      var _iteratorError14 = undefined;

      try {
        for (var _iterator14 = this.state.componentCache.layoutComponentSpecs[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
          var layoutComponentSpec = _step14.value;
          renderedComponents.push(this.renderLayoutComponent(layoutComponentSpec));
        }
      } catch (err) {
        _didIteratorError14 = true;
        _iteratorError14 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
            _iterator14.return();
          }
        } finally {
          if (_didIteratorError14) {
            throw _iteratorError14;
          }
        }
      }

      return renderedComponents;
    }
  }, {
    key: "loadSingleItemDataFromApi",
    value: function loadSingleItemDataFromApi(listItemId) {
      var _this21 = this;

      return new Promise(function (resolve, reject) {
        _this21.makeGetSingleItemHttpRequest(listItemId).get().then(function (httpResponse) {
          resolve({
            status: httpResponse.status,
            data: httpResponse.bodydata,
            listItemId: listItemId
          });
        }).catch(function (error) {
          if (error.response.isClientError()) {
            resolve({
              status: error.response.status,
              error: error,
              listItemId: listItemId
            });
          } else {
            reject(error);
          }
        });
      });
    }
  }, {
    key: "loadMultipleItemDataFromApi",
    value: function loadMultipleItemDataFromApi(listItemIds) {
      var _this22 = this;

      return new Promise(function (resolve, reject) {
        var allPromises = [];
        var _iteratorNormalCompletion15 = true;
        var _didIteratorError15 = false;
        var _iteratorError15 = undefined;

        try {
          for (var _iterator15 = listItemIds[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
            var listItemId = _step15.value;
            allPromises.push(_this22.loadSingleItemDataFromApi(listItemId));
          }
        } catch (err) {
          _didIteratorError15 = true;
          _iteratorError15 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
              _iterator15.return();
            }
          } finally {
            if (_didIteratorError15) {
              throw _iteratorError15;
            }
          }
        }

        Promise.all(allPromises).then(function (listItemDataArray) {
          resolve(listItemDataArray);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.isLoadingSelectedItemDataFromApi) {
        return _react.default.createElement(_LoadingIndicator.default, null);
      } else {
        return _react.default.createElement("div", {
          className: this.props.className
        }, this.renderComponents());
      }
    }
  }, {
    key: "blurTimerTimeout",
    get: function get() {
      return 200;
    }
  }, {
    key: "isMovingListItemId",
    get: function get() {
      return this.state.isMovingListItemId;
    }
    /**
     * Should item-movement be completely disabled?
     *
     * @returns {bool}
     */

  }, {
    key: "allListItemMovementIsLocked",
    get: function get() {
      return this.state.allListItemMovementIsLocked;
    }
  }, {
    key: "selectedItemIds",
    get: function get() {
      return Array.from(this.state.selectedListItemsMap.keys());
    } //
    //
    // Filters
    //
    //

    /**
     * Get the delay after changing a filter value until
     * we make the API request. This avoids extra API requests
     * when users change many filter values fast (I.E.: search, or
     * clicking many checkboxes fast).
     *
     * If a new filter value is set before this delay is
     * exceeded, the delay is reset and a new delay is started.
     *
     * @returns {number} Number of milliseconds to wait before
     *    making the API request on filter value change.
     *    Defaults to `this.props.filterApiDelayMilliseconds`.
     */

  }, {
    key: "filterApiDelayMilliseconds",
    get: function get() {
      return this.props.filterApiDelayMilliseconds;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.isMounted) {
        var nextState = AbstractFilterList.refreshComponentCache(nextProps, prevState);
        nextState = _objectSpread({}, nextState, {
          isMounted: true
        });

        if ('selectMode' in nextProps) {
          nextState = _objectSpread({}, nextState, {
            selectMode: nextProps.selectMode
          });
        }

        return nextState;
      }

      return null;
    }
  }, {
    key: "makeEmptyComponentCache",
    value: function makeEmptyComponentCache() {
      var domIdPrefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!domIdPrefix) {
        domIdPrefix = "".concat(new _UniqueDomIdSingleton.default().generate(), "-");
      }

      return new _ComponentCache.ComponentCache([], domIdPrefix);
    }
    /**
     * Make a {@link ComponentCache} object.
     *
     * @param rawComponentSpecs
     * @param domIdPrefix
     * @returns {ComponentCache}
     */

  }, {
    key: "buildComponentCache",
    value: function buildComponentCache(rawComponentSpecs, domIdPrefix) {
      var componentCache = AbstractFilterList.makeEmptyComponentCache(domIdPrefix);
      componentCache.addRawLayoutComponentSpecs(rawComponentSpecs);
      return componentCache;
    }
  }, {
    key: "refreshComponentCache",
    value: function refreshComponentCache(props, state) {
      var componentCache = AbstractFilterList.buildComponentCache(props.components, props.domIdPrefix);
      return Object.assign(AbstractFilterList.makeInitialFilterValues(componentCache.filterMap.values(), state), {
        componentCache: componentCache
      });
    }
  }, {
    key: "_getStateVariableNameForFilter",
    value: function _getStateVariableNameForFilter(filterName) {
      return "filterstate_".concat(filterName);
    }
  }, {
    key: "_makeFilterValue",
    value: function _makeFilterValue(filterName, value) {
      if (value === undefined) {
        value = null;
      }

      return _defineProperty({}, AbstractFilterList._getStateVariableNameForFilter(filterName), value);
    }
  }, {
    key: "makeInitialFilterValues",
    value: function makeInitialFilterValues(filterSpecs, state) {
      var filter = {};
      var _iteratorNormalCompletion16 = true;
      var _didIteratorError16 = false;
      var _iteratorError16 = undefined;

      try {
        for (var _iterator16 = filterSpecs[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
          var filterSpec = _step16.value;

          var filterKey = AbstractFilterList._getStateVariableNameForFilter(filterSpec.props.name);

          if (state[filterKey] === undefined) {
            filter = _objectSpread({}, filter, AbstractFilterList._makeFilterValue(filterSpec.props.name, filterSpec.initialValue));
          }
        }
      } catch (err) {
        _didIteratorError16 = true;
        _iteratorError16 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
            _iterator16.return();
          }
        } finally {
          if (_didIteratorError16) {
            throw _iteratorError16;
          }
        }
      }

      return filter;
    }
  }]);

  _inherits(AbstractFilterList, _React$Component);

  return AbstractFilterList;
}(_react.default.Component);

exports.default = AbstractFilterList;