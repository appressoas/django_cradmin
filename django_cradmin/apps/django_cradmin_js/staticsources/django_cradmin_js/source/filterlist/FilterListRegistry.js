/**
 * The instance of the {@link FilterListRegistrySingleton}.
 */
let _instance = null


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
export default class FilterListRegistrySingleton {
  constructor () {
    if (!_instance) {
      _instance = this
      this._initialize()
    }
    return _instance
  }

  _initialize () {
    this._filterListComponentMap = new Map()
    this._listComponentMap = new Map()
    this._filterComponentMap = new Map()
    this._itemComponentMap = new Map()
    this._searchComponentMap = new Map()
    this._paginatorComponentMap = new Map()
    this._layoutComponentMap = new Map()
  }

  clear () {
    this._filterListComponentMap.clear()
    this._listComponentMap.clear()
    this._filterComponentMap.clear()
    this._itemComponentMap.clear()
    this._searchComponentMap.clear()
    this._paginatorComponentMap.clear()
    this._layoutComponentMap.clear()
  }

  /**
   * Register a filterlist component class in the registry.
   *
   * @param {string} alias The alias for the filterlist class.
   * @param {AbstractFilterList} filterListComponent The item class.
   */
  registerFilterListComponent (alias, filterListComponent) {
    this._filterListComponentMap.set(alias, filterListComponent)
  }

  /**
   * Remove filterlist component class from registry.
   *
   * @param alias The alias that the filterlist component class was registered with
   *      by using {@link FilterListRegistrySingleton#registerFilterListComponent}.
   */
  removeFilterListComponent (alias) {
    this._filterListComponentMap.delete(alias)
  }

  getFilterListComponent (alias) {
    return this._filterListComponentMap.get(alias)
  }

  /**
   * Register a list component class in the registry.
   *
   * @param {string} alias The alias for the list class.
   * @param {AbstractFilter} listComponent The item class.
   */
  registerListComponent (alias, listComponent) {
    this._listComponentMap.set(alias, listComponent)
  }

  /**
   * Remove list component class from registry.
   *
   * @param alias The alias that the list component class was registered with
   *      by using {@link FilterListRegistrySingleton#registerListComponent}.
   */
  removeListComponent (alias) {
    this._listComponentMap.delete(alias)
  }

  getListComponent (alias) {
    return this._listComponentMap.get(alias)
  }

  /**
   * Register a filter component class in the registry.
   *
   * @param {string} alias The alias for the filter class.
   *    Makes it possible to use a JSON serializable object
   *    to define this filter for a list.
   * @param {AbstractFilter} filterComponent The filter class.
   */
  registerFilterComponent (alias, filterComponent) {
    this._filterComponentMap.set(alias, filterComponent)
  }

  /**
   * Remove filter component class from registry.
   *
   * @param alias The alias that the filter class was registered with
   *      by using {@link FilterListRegistrySingleton#registerFilterComponent}.
   */
  removeFilterComponent (alias) {
    this._filterComponentMap.delete(alias)
  }

  getFilterComponent (alias) {
    return this._filterComponentMap.get(alias)
  }

  /**
   * Register a item component class in the registry.
   *
   * @param {string} alias The alias for the item class.
   *    Makes it possible to use a JSON serializable object
   *    to define this item for a list.
   * @param {AbstractFilter} itemComponent The item class.
   */
  registerItemComponent (alias, itemComponent) {
    this._itemComponentMap.set(alias, itemComponent)
  }

  /**
   * Remove item component class from registry.
   *
   * @param alias The alias that the item class was registered with
   *      by using {@link FilterListRegistrySingleton#registerItemComponent}.
   */
  removeItemComponent (alias) {
    this._itemComponentMap.delete(alias)
  }

  getItemComponent (alias) {
    return this._itemComponentMap.get(alias)
  }

  /**
   * Register a paginator component class in the registry.
   *
   * @param {string} alias The alias for the paginator class.
   *    Makes it possible to use a JSON serializable object
   *    to define this paginator for a list.
   * @param {AbstractPaginator} paginatorComponent The paginator class.
   */
  registerPaginatorComponent (alias, paginatorComponent) {
    this._paginatorComponentMap.set(alias, paginatorComponent)
  }

  /**
   * Remove paginator component class from registry.
   *
   * @param alias The alias that the paginator class was registered with
   *      by using {@link FilterListRegistrySingleton#registerPaginatorComponent}.
   */
  removePaginatorComponent (alias) {
    this._paginatorComponentMap.delete(alias)
  }

  getPaginatorComponent (alias) {
    return this._paginatorComponentMap.get(alias)
  }

  /**
   * Register a layout component class in the registry.
   *
   * @param {string} alias The alias for the layout class.
   *    Makes it possible to use a JSON serializable object
   *    to define this layout for a list.
   * @param {AbstractLayout} layoutComponent The layout class.
   */
  registerLayoutComponent (alias, layoutComponent) {
    this._layoutComponentMap.set(alias, layoutComponent)
  }

  /**
   * Remove layout component class from registry.
   *
   * @param alias The alias that the layout class was registered with
   *      by using {@link FilterListRegistrySingleton#registerLayoutComponent}.
   */
  removeLayoutComponent (alias) {
    this._layoutComponentMap.delete(alias)
  }

  getLayoutComponent (alias) {
    return this._layoutComponentMap.get(alias)
  }
}
