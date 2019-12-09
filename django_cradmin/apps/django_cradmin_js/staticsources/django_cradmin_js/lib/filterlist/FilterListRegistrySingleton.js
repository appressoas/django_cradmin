"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The instance of the {@link FilterListRegistrySingleton}.
 */
var _instance = null;
/**
 * Registry of reusable filterlist components.
 *
 * @example <caption>Register a filter and a list item renderable</caption>
 * import FilterListRegistrySingleton from 'django_cradmin_js/lib/filterlist/FilterListRegistrySingleton'
 * import MyFilter from 'path/to/MyFilter'
 * import MyListItem from 'path/to/MyListItem'
 * const filterListRegistry = new FilterListRegistrySingleton()
 * filterListRegistry.registerFilterComponent('MyFilter', MyFilter)
 * filterListRegistry.removeItemComponent('MyListItem', MyListItem)
 */

var FilterListRegistrySingleton =
/*#__PURE__*/
function () {
  function FilterListRegistrySingleton() {
    _classCallCheck(this, FilterListRegistrySingleton);

    if (!_instance) {
      _instance = this;

      this._initialize();
    }

    return _instance;
  }

  _createClass(FilterListRegistrySingleton, [{
    key: "_initialize",
    value: function _initialize() {
      this._filterListComponentMap = new Map();
      this._listComponentMap = new Map();
      this._filterComponentMap = new Map();
      this._itemComponentMap = new Map();
      this._searchComponentMap = new Map();
      this._paginatorComponentMap = new Map();
      this._componentGroupComponentMap = new Map();
      this._layoutComponentMap = new Map();
      this._selectedItemsComponentMap = new Map();
    }
  }, {
    key: "clear",
    value: function clear() {
      this._filterListComponentMap.clear();

      this._listComponentMap.clear();

      this._filterComponentMap.clear();

      this._itemComponentMap.clear();

      this._searchComponentMap.clear();

      this._paginatorComponentMap.clear();

      this._componentGroupComponentMap.clear();

      this._layoutComponentMap.clear();

      this._selectedItemsComponentMap.clear();
    }
    /**
     * Register a filterlist component class in the registry.
     *
     * @param {string} alias The alias for the filterlist class.
     * @param {AbstractFilterList} filterListComponent The item class.
     */

  }, {
    key: "registerFilterListComponent",
    value: function registerFilterListComponent(alias, filterListComponent) {
      this._filterListComponentMap.set(alias, filterListComponent);
    }
    /**
     * Remove filterlist component class from registry.
     *
     * @param alias The alias that the filterlist component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerFilterListComponent}.
     */

  }, {
    key: "removeFilterListComponent",
    value: function removeFilterListComponent(alias) {
      this._filterListComponentMap.delete(alias);
    }
    /**
     * Get filterlist component class.
     * @param alias The alias that the filterlist component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerFilterListComponent}.
     */

  }, {
    key: "getFilterListComponent",
    value: function getFilterListComponent(alias) {
      return this._filterListComponentMap.get(alias);
    }
    /**
     * Register a list component class in the registry.
     *
     * @param {string} alias The alias for the list class.
     * @param {AbstractFilter} listComponent The item class.
     */

  }, {
    key: "registerListComponent",
    value: function registerListComponent(alias, listComponent) {
      this._listComponentMap.set(alias, listComponent);
    }
    /**
     * Remove list component class from registry.
     *
     * @param alias The alias that the list component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerListComponent}.
     */

  }, {
    key: "removeListComponent",
    value: function removeListComponent(alias) {
      this._listComponentMap.delete(alias);
    }
    /**
     * Get list component class.
     * @param alias The alias that the list component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerListComponent}.
     */

  }, {
    key: "getListComponent",
    value: function getListComponent(alias) {
      return this._listComponentMap.get(alias);
    }
    /**
     * Register a filter component class in the registry.
     *
     * @param {string} alias The alias for the filter class.
     *    Makes it possible to use a JSON serializable object
     *    to define this filter for a list.
     * @param {AbstractFilter} filterComponent The filter class.
     */

  }, {
    key: "registerFilterComponent",
    value: function registerFilterComponent(alias, filterComponent) {
      this._filterComponentMap.set(alias, filterComponent);
    }
    /**
     * Remove filter component class from registry.
     *
     * @param alias The alias that the filter class was registered with
     *      by using {@link FilterListRegistrySingleton#registerFilterComponent}.
     */

  }, {
    key: "removeFilterComponent",
    value: function removeFilterComponent(alias) {
      this._filterComponentMap.delete(alias);
    }
    /**
     * Get filter component class.
     * @param alias The alias that the filter component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerFilterComponent}.
     */

  }, {
    key: "getFilterComponent",
    value: function getFilterComponent(alias) {
      return this._filterComponentMap.get(alias);
    }
    /**
     * Register a item component class in the registry.
     *
     * @param {string} alias The alias for the item class.
     *    Makes it possible to use a JSON serializable object
     *    to define this item for a list.
     * @param {AbstractFilter} itemComponent The item class.
     */

  }, {
    key: "registerItemComponent",
    value: function registerItemComponent(alias, itemComponent) {
      this._itemComponentMap.set(alias, itemComponent);
    }
    /**
     * Remove item component class from registry.
     *
     * @param alias The alias that the item class was registered with
     *      by using {@link FilterListRegistrySingleton#registerItemComponent}.
     */

  }, {
    key: "removeItemComponent",
    value: function removeItemComponent(alias) {
      this._itemComponentMap.delete(alias);
    }
    /**
     * Get item component class.
     * @param alias The alias that the item component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerItemComponent}.
     */

  }, {
    key: "getItemComponent",
    value: function getItemComponent(alias) {
      return this._itemComponentMap.get(alias);
    }
    /**
     * Register a paginator component class in the registry.
     *
     * @param {string} alias The alias for the paginator class.
     *    Makes it possible to use a JSON serializable object
     *    to define this paginator for a list.
     * @param {AbstractPaginator} paginatorComponent The paginator class.
     */

  }, {
    key: "registerPaginatorComponent",
    value: function registerPaginatorComponent(alias, paginatorComponent) {
      this._paginatorComponentMap.set(alias, paginatorComponent);
    }
    /**
     * Remove paginator component class from registry.
     *
     * @param alias The alias that the paginator class was registered with
     *      by using {@link FilterListRegistrySingleton#registerPaginatorComponent}.
     */

  }, {
    key: "removePaginatorComponent",
    value: function removePaginatorComponent(alias) {
      this._paginatorComponentMap.delete(alias);
    }
    /**
     * Get paginator component class.
     * @param alias The alias that the paginator component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerPaginatorComponent}.
     */

  }, {
    key: "getPaginatorComponent",
    value: function getPaginatorComponent(alias) {
      return this._paginatorComponentMap.get(alias);
    }
    /**
     * Register a componentGroup component class in the registry.
     *
     * @param {string} alias The alias for the componentGroup class.
     *    Makes it possible to use a JSON serializable object
     *    to define this componentGroup for a list.
     * @param {AbstractPaginator} componentGroupComponent The componentGroup class.
     */

  }, {
    key: "registerComponentGroupComponent",
    value: function registerComponentGroupComponent(alias, componentGroupComponent) {
      this._componentGroupComponentMap.set(alias, componentGroupComponent);
    }
    /**
     * Remove componentGroup component class from registry.
     *
     * @param alias The alias that the componentGroup class was registered with
     *      by using {@link FilterListRegistrySingleton#registerComponentGroupComponent}.
     */

  }, {
    key: "removeComponentGroupComponent",
    value: function removeComponentGroupComponent(alias) {
      this._componentGroupComponentMap.delete(alias);
    }
    /**
     * Get componentGroup component class.
     * @param alias The alias that the componentGroup component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerComponentGroupComponent}.
     */

  }, {
    key: "getComponentGroupComponent",
    value: function getComponentGroupComponent(alias) {
      return this._componentGroupComponentMap.get(alias);
    }
    /**
     * Register a layout component class in the registry.
     *
     * @param {string} alias The alias for the layout class.
     *    Makes it possible to use a JSON serializable object
     *    to define this layout for a list.
     * @param {AbstractLayout} layoutComponent The layout class.
     */

  }, {
    key: "registerLayoutComponent",
    value: function registerLayoutComponent(alias, layoutComponent) {
      this._layoutComponentMap.set(alias, layoutComponent);
    }
    /**
     * Remove layout component class from registry.
     *
     * @param alias The alias that the layout class was registered with
     *      by using {@link FilterListRegistrySingleton#registerLayoutComponent}.
     */

  }, {
    key: "removeLayoutComponent",
    value: function removeLayoutComponent(alias) {
      this._layoutComponentMap.delete(alias);
    }
    /**
     * Get layout component class.
     * @param alias The alias that the layout component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerLayoutComponent}.
     */

  }, {
    key: "getLayoutComponent",
    value: function getLayoutComponent(alias) {
      return this._layoutComponentMap.get(alias);
    }
    /**
     * Register a selectedItems component class in the registry.
     *
     * @param {string} alias The alias for the selectedItems class.
     *    Makes it possible to use a JSON serializable object
     *    to define this selectedItems for a list.
     * @param {AbstractLayout} selectedItemsComponent The selectedItems class.
     */

  }, {
    key: "registerSelectedItemsComponent",
    value: function registerSelectedItemsComponent(alias, selectedItemsComponent) {
      this._selectedItemsComponentMap.set(alias, selectedItemsComponent);
    }
    /**
     * Remove selectedItems component class from registry.
     *
     * @param alias The alias that the selectedItems class was registered with
     *      by using {@link FilterListRegistrySingleton#registerSelectedItemsComponent}.
     */

  }, {
    key: "removeSelectedItemsComponent",
    value: function removeSelectedItemsComponent(alias) {
      this._selectedItemsComponentMap.delete(alias);
    }
    /**
     * Get selectedItems component class.
     * @param alias The alias that the selectedItems component class was registered with
     *      by using {@link FilterListRegistrySingleton#registerSelectedItemsComponent}.
     */

  }, {
    key: "getSelectedItemsComponent",
    value: function getSelectedItemsComponent(alias) {
      return this._selectedItemsComponentMap.get(alias);
    }
  }]);

  return FilterListRegistrySingleton;
}();

exports.default = FilterListRegistrySingleton;