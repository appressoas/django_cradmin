import makeCustomError from "../makeCustomError";

/**
 * The instance of the {@link FilterListRegistrySingleton}.
 */
let _instance = null;


/**
 * Registry of reusable filterlist components.
 *
 * @example <caption>Register a filter and a list item renderable</caption>
 * import FilterListRegistrySingleton from 'django_cradmin_js/lib/filterlist/FilterListRegistrySingleton'
 * import MyFilter from 'path/to/MyFilter';
 * import MyListItem from 'path/to/MyListItem';
 * const filterListRegistry = new FilterListRegistrySingleton();
 * filterListRegistry.registerFilterComponent('MyFilter', MyFilter);
 * filterListRegistry.removeItemComponent('MyListItem', MyListItem);
 */
export default class FilterListRegistrySingleton {
    constructor() {
        if (!_instance) {
            _instance = this;
            this._initialize();
        }
        return _instance;
    }

    _initialize() {
        this._filterComponentMap = new Map();
        this._itemComponentMap = new Map();
    }

    clear() {
        this._filterComponentMap.clear();
        this._itemComponentMap.clear();
    }

    /**
     * Register a filter component class in the registry.
     *
     * @param {string} alias The alias for the filter class.
     *    Makes it possible to use a JSON serializable object
     *    to define this filter for a list.
     * @param {AbstractListFilter} filterComponent The filter class.
     */
    registerFilterComponent(alias, filterComponent) {
        this._filterComponentMap.set(alias, filterComponent);
    }

    /**
     * Remove filter component class from registry.
     *
     * @param alias The alias that the filter class was registered with
     *      by using {@link FilterListRegistrySingleton#registerFilterComponent}.
     */
    removeFilterComponent(alias) {
        this._filterComponentMap.delete(alias);
    }

    /**
     * Register a item component class in the registry.
     *
     * @param {string} alias The alias for the item class.
     *    Makes it possible to use a JSON serializable object
     *    to define this item for a list.
     * @param {AbstractListFilter} itemComponent The item class.
     */
    registerItemComponent(alias, itemComponent) {
        this._itemClassMap.set(alias, itemComponent);
    }

    /**
     * Remove item component class from registry.
     *
     * @param alias The alias that the item class was registered with
     *      by using {@link FilterListRegistrySingleton#registerItemComponent}.
     */
    removeItemComponent(alias) {
        this._itemComponentMap.delete(alias);
    }

    /**
     * Register a search component class in the registry.
     *
     * @param {string} alias The alias for the search class.
     *    Makes it possible to use a JSON serializable object
     *    to define this search for a list.
     * @param {AbstractListFilter} searchComponent The search class.
     */
    registerSearchComponent(alias, searchComponent) {
        this._searchClassMap.set(alias, searchComponent);
    }

    /**
     * Remove search component class from registry.
     *
     * @param alias The alias that the search class was registered with
     *      by using {@link FilterListRegistrySingleton#registerSearchComponent}.
     */
    removeSearchComponent(alias) {
        this._searchComponentMap.delete(alias);
    }
}
