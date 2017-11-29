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
    this._filterComponentMap = new Map()
    this._itemComponentMap = new Map()
    this._searchComponentMap = new Map()
  }

  clear () {
    this._filterComponentMap.clear()
    this._itemComponentMap.clear()
    this._searchComponentMap.clear()
  }

  /**
   * Register a list component class in the registry.
   *
   * @param {string} alias The alias for the list class.
   * @param {AbstractListFilter} listComponent The item class.
   */
  registerListComponent (alias, listComponent) {
    this._itemComponentMap.set(alias, listComponent)
  }

  /**
   * Remove list component class from registry.
   *
   * @param alias The alias that the list component class was registered with
   *      by using {@link FilterListRegistrySingleton#registerListComponent}.
   */
  removeListComponent (alias) {
    this._itemComponentMap.delete(alias)
  }

  getListComponent (alias) {
    return this._itemComponentMap.get(alias)
  }

  /**
   * Register a filter component class in the registry.
   *
   * @param {string} alias The alias for the filter class.
   *    Makes it possible to use a JSON serializable object
   *    to define this filter for a list.
   * @param {AbstractListFilter} filterComponent The filter class.
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
   * @param {AbstractListFilter} itemComponent The item class.
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
}
