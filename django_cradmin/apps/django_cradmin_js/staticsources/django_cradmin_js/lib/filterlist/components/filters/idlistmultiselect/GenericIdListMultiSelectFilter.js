"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AbstractFilter2 = _interopRequireDefault(require("../AbstractFilter"));

var _AbstractGenericIdListMultiSelectItem = _interopRequireDefault(require("./AbstractGenericIdListMultiSelectItem"));

var _PageNumberPaginationFilterList = _interopRequireDefault(require("../../filterlists/PageNumberPaginationFilterList"));

var _ThreeColumnLayout = _interopRequireDefault(require("../../layout/ThreeColumnLayout"));

var _LoadMorePaginator = _interopRequireDefault(require("../../paginators/LoadMorePaginator"));

var _DropDownSearchFilter = _interopRequireDefault(require("../DropDownSearchFilter"));

var gettext = _interopRequireWildcard(require("ievv_jsbase/lib/gettext"));

var _SelectableList = _interopRequireDefault(require("../../lists/SelectableList"));

var _GenericFilterListItemWrapper = _interopRequireDefault(require("./GenericFilterListItemWrapper"));

var _GenericSearchFilterWrapper = _interopRequireDefault(require("./GenericSearchFilterWrapper"));

var _filterListConstants = require("../../../filterListConstants");

var _typeDetect = _interopRequireDefault(require("ievv_jsbase/lib/utils/typeDetect"));

var _ThreeColumnDropDownLayout = _interopRequireDefault(require("../../layout/ThreeColumnDropDownLayout"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var GenericIdListMultiSelectFilter =
/*#__PURE__*/
function (_AbstractFilter) {
  _createClass(GenericIdListMultiSelectFilter, [{
    key: "filterListSearchFieldConfig",
    get: function get() {
      return {
        component: _GenericSearchFilterWrapper.default,
        props: _objectSpread({
          name: 'search',
          componentType: this.props.searchFilterComponentType,
          label: this.props.searchFilterLabel,
          labelIsScreenreaderOnly: true,
          placeholder: this.props.searchFilterPlaceholders
        }, this.props.SearchFilterComponentPropOverrides)
      };
    }
  }, {
    key: "filterListStaticFilters",
    get: function get() {
      return [];
    }
  }, {
    key: "filterListExtraFilters",
    get: function get() {
      return [];
    }
  }, {
    key: "filterListFilterConfig",
    get: function get() {
      return _toConsumableArray(this.filterListStaticFilters).concat(_toConsumableArray(this.filterListExtraFilters), [this.filterListSearchFieldConfig]);
    }
  }, {
    key: "itemComponentType",
    get: function get() {
      if (!this.props.itemComponentType) {
        console.error('No itemComponentType given in props. ' + 'Falling back to AbstractGenericIdListMultiSelectItem. ' + 'You should make a subclass of that component and pass it as "itemComponentType" in props!');
        return _AbstractGenericIdListMultiSelectItem.default;
      }

      return this.props.itemComponentType;
    }
  }, {
    key: "filterListItemListConfig",
    get: function get() {
      return {
        component: _SelectableList.default,
        itemSpec: {
          component: _GenericFilterListItemWrapper.default,
          props: {
            listItemIdName: this.props.listItemIdName,
            componentType: this.itemComponentType,
            componentProps: this.props.itemComponentProps
          }
        }
      };
    }
  }], [{
    key: "propTypes",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(GenericIdListMultiSelectFilter), "propTypes", this), {
        idListApiUrl: _propTypes.default.string.isRequired,
        listItemIdName: _propTypes.default.string.isRequired,
        itemComponentType: _propTypes.default.any.isRequired,
        itemComponentPropOverrides: _propTypes.default.object,
        searchFilterComponentType: _propTypes.default.any,
        SearchFilterComponentPropOverrides: _propTypes.default.object,
        searchFilterLabel: _propTypes.default.string.isRequired,
        searchFilterName: _propTypes.default.string.isRequired,
        searchFilterPlaceholders: _propTypes.default.arrayOf(_propTypes.default.string.isRequired),
        dropDownBemVariants: _propTypes.default.arrayOf(_propTypes.default.string)
      });
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(GenericIdListMultiSelectFilter), "defaultProps", this), {
        idListApiUrl: null,
        listItemIdName: 'id',
        itemComponentType: null,
        itemComponentPropOverrides: {},
        searchFilterLabel: gettext.pgettext('cradmin GenericIdListMultiSelect searchFilterLabel', 'Search'),
        searchFilterName: 'search',
        searchFilterPlaceholders: [gettext.gettext('Search ...')],
        searchFilterComponentType: _DropDownSearchFilter.default,
        dropDownBemVariants: ['spaced-sm']
      });
    }
  }]);

  function GenericIdListMultiSelectFilter(props) {
    var _this;

    _classCallCheck(this, GenericIdListMultiSelectFilter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GenericIdListMultiSelectFilter).call(this, props));
    _this.filterListRef = _react.default.createRef();
    return _this;
  }

  _createClass(GenericIdListMultiSelectFilter, [{
    key: "setupBoundMethods",
    value: function setupBoundMethods() {
      _get(_getPrototypeOf(GenericIdListMultiSelectFilter.prototype), "setupBoundMethods", this).call(this);

      this.handleSelectItems = this.handleSelectItems.bind(this);
      this.handleDeselectItems = this.handleDeselectItems.bind(this);
    }
  }, {
    key: "handleSelectItems",
    value: function handleSelectItems(data) {
      this.setFilterValue(this.filterListRef.selectedItemIdsAsArray());
      this.filterListRef.setFilterValue('search', '');
    }
  }, {
    key: "handleDeselectItems",
    value: function handleDeselectItems(data) {
      this.setFilterValue(this.filterListRef.selectedItemIdsAsArray());
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement(_PageNumberPaginationFilterList.default, _extends({}, this.filterListConfig, {
        ref: function ref(_ref) {
          _this2.filterListRef = _ref;
        }
      }));
    }
  }, {
    key: "initiallySelectedItemIds",
    get: function get() {
      if (!this.props.value) {
        return [];
      }

      if ((0, _typeDetect.default)(this.props.value) === 'array') {
        return this.props.value;
      }

      var value = parseInt(this.props.value, 10);

      if (isNaN(value)) {
        return [];
      }

      return [value];
    }
  }, {
    key: "filterListConfig",
    get: function get() {
      return {
        getItemsApiUrl: this.props.idListApiUrl,
        onSelectItems: this.handleSelectItems,
        onDeselectItems: this.handleDeselectItems,
        selectMode: _filterListConstants.MULTISELECT,
        initiallySelectedItemIds: this.initiallySelectedItemIds,
        components: [{
          component: _ThreeColumnLayout.default,
          layout: this.filterListFilterConfig
        }, {
          component: _ThreeColumnDropDownLayout.default,
          props: {
            componentGroups: ['expandable'],
            dropdownContentBemVariants: this.props.dropDownBemVariants
          },
          layout: [this.filterListItemListConfig, {
            component: _LoadMorePaginator.default,
            props: {
              location: 'bottom'
            }
          }]
        }]
      };
    }
  }]);

  _inherits(GenericIdListMultiSelectFilter, _AbstractFilter);

  return GenericIdListMultiSelectFilter;
}(_AbstractFilter2.default);

exports.default = GenericIdListMultiSelectFilter;