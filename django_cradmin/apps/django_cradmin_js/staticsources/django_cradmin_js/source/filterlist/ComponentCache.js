import AbstractListFilter from './components/filters/AbstractListFilter'
import AbstractPaginator from './components/paginators/AbstractPaginator'
import AbstractList from './components/lists/AbstractList'
import FilterListRegistrySingleton from './FilterListRegistry'

/**
 * Defines the component layout within a {@link ComponentArea}.
 */
export class ComponentLayout {
  constructor () {
    /**
     * Maps locations to arrays of components.
     *
     * The {@link AbstractLayout} component uses this
     * to determine how to render the items.
     *
     * The locations are not sorted, but the array of components
     * within each location key is sorted, and should be rendered
     * in the listed order.
     *
     * @type {Map}
     */
    this.layoutMap = new Map()
  }

  /**
   * Add a component to the layout.
   *
   * Used when parsing the `body` and `header` props
   * for {@link AbstractFilterList}.
   *
   * @param {{}} componentSpec
   */
  add (componentSpec) {
    if (!this.layoutMap.has(componentSpec.props.location)) {
      this.layoutMap.set(componentSpec.props.location, [])
    }
    this.layoutMap.get(componentSpec.props.location).push(componentSpec)
  }

  /**
   * Get the components at a given location.
   *
   * @param {string} location The location.
   * @returns {[]} Always returns a (possibly empty) array even if there are no
   *    items at the provided location.
   */
  getComponentsAtLocation (location) {
    return this.layoutMap.get(location) || []
  }
}

/**
 * Information about a component area (I.E.: header or body).
 */
export class ComponentArea {
  constructor (componentSpec) {
    /**
     * The component spec.
     *
     * You normally will not need this since {@link ComponentArea#componentClass},
     * {@link ComponentArea#props} and {@link ComponentArea#layout} should
     * provide all you need.
     *
     * @type {object}
     */
    this.componentSpec = componentSpec

    /**
     * The child component layout.
     *
     * @type {ComponentLayout}
     */
    this.layout = new ComponentLayout()
  }

  /**
   * Get the component class.
   */
  get componentClass () {
    return this.componentSpec.componentClass
  }

  /**
   * Get props for the component.
   */
  get props () {
    return Object.assign({}, this.componentSpec.props, {
      layout: this.layout
    })
  }
}

/**
 * Parser for the `body` and `header` props for {@link AbstractFilterList}.
 *
 * Validates the provided objects, looks up `component` attributes
 * and sets their actual class in a new `componentClass` attribute,
 * and much more.
 *
 * You can extend this class, and override
 * {@link AbstractFilterList#makeEmptyComponentCache} to
 * extend the possible values within the `body` and `header` props.
 *
 * You will normally only call {@link ComponentArea#setBody}
 * and {@link ComponentArea#setHeader} on an object if this
 * class. The other methods can be overridden in subclasses, but
 * should normally not be called outside the class.
 */
export default class ComponentCache {
  constructor () {
    /**
     * An instance of {@link FilterListRegistrySingleton} for convenience.
     *
     * @type {FilterListRegistrySingleton}
     */
    this.filterListRegistry = new FilterListRegistrySingleton()

    /**
     * Map from filter name to parsed filter spec.
     *
     * @type {Map}
     */
    this.filterMap = new Map()

    /**
     * The {@link ComponentArea} for the `body`.
     *
     * Is `null` until {@link ComponentCache#setBody} is called.
     *
     * @type {null|ComponentArea}
     */
    this.body = null

    /**
     * The {@link ComponentArea} for the `header`.
     *
     * Is `null` until {@link ComponentCache#setHeader} is called.
     *
     * @type {null|ComponentArea}
     */
    this.header = null

    /**
     * Internal counter of the number of layout components.
     *
     * Used by {@link ComponentCache#makeUniqueLayoutComponentKey}.
     *
     * @type {number}
     */
    this.layoutComponentCount = 0
  }

  /**
   * Clean a filter spec.
   *
   * Called by {@link ComponentCache#cleanLayoutChildComponentSpec}
   * after it has cleaned the common stuff for all layout components.
   *
   * This means that the responsibility of this method
   * is to clean attributes specific to specs for
   * {@link AbstractListFilter}.
   *
   * @param {{}} componentSpec
   */
  cleanFilterSpec (componentSpec) {
    if (!componentSpec.props.name) {
      throw new Error(
        `Filter component=${componentSpec.component} is missing required ` +
        `attribute "props.name".`)
    }
    if (this.filterMap.has(componentSpec.props.name)) {
      throw new Error(`Multiple filters with the same name: ${componentSpec.props.name}`)
    }
    this.filterMap.set(componentSpec.props.name, componentSpec)
  }

  /**
   * Clean an item spec.
   *
   * The responsibility of this method
   * is to clean attributes specific to specs for
   * {@link AbstractListItem}.
   *
   * @param {{}} componentSpec
   */
  cleanItemSpec (componentSpec) {
  }

  /**
   * Clean a list spec.
   *
   * Called by {@link ComponentCache#cleanLayoutChildComponentSpec}
   * after it has cleaned the common stuff for all layout components.
   *
   * This means that the responsibility of this method
   * is to clean attributes specific to specs for
   * {@link AbstractList}.
   *
   * @param {{}} componentSpec
   */
  cleanListSpec (componentSpec) {
    if (!componentSpec.itemSpec) {
      throw new Error(
        `Component ${componentSpec.component} is missing ` +
        `required attribute "itemSpec".`)
    }
    const itemSpec = Object.assign({}, componentSpec.itemSpec)
    this.cleanComponentSpec(itemSpec)
    this.cleanItemSpec(itemSpec)
    componentSpec.props.itemSpec = itemSpec
  }

  /**
   * Clean a paginator spec.
   *
   * Called by {@link ComponentCache#cleanLayoutChildComponentSpec}
   * after it has cleaned the common stuff for all layout components.
   *
   * This means that the responsibility of this method
   * is to clean attributes specific to specs for
   * {@link AbstractPaginator}.
   *
   * @param {{}} componentSpec
   */
  cleanPaginatorSpec (componentSpec,) {
  }

  /**
   * Get the javascript class for a `component` string.
   *
   * Looks up the component in {@link FilterListRegistrySingleton}.
   *
   * @param {string} componentString A string alias for a component class.
   * @returns {*}
   */
  getClassForComponentString (componentString) {
    let componentClass = null
    if (componentString.endsWith('Filter')) {
      componentClass = this.filterListRegistry.getFilterComponent(componentString)
    } else if (componentString.endsWith('List')) {
      componentClass = this.filterListRegistry.getListComponent(componentString)
    } else if (componentString.endsWith('Paginator')) {
      componentClass = this.filterListRegistry.getPaginatorComponent(componentString)
    } else if (componentString.endsWith('Layout')) {
      componentClass = this.filterListRegistry.getLayoutComponent(componentString)
    } else if (componentString.endsWith('Item')) {
      componentClass = this.filterListRegistry.getItemComponent(componentString)
    } else {
      throw new Error(
        `Invalid component: "${componentString}". ` +
        `Must end with "Filter", "List" or "Paginator".`)
    }
    if (!componentClass) {
      throw new Error(
        `No component class for "${componentString}" in the registry.`)
    }
    return componentClass
  }

  /**
   * Clean a component spec.
   *
   * Used by both {@link ComponentCache#cleanLayoutChildComponentSpec},
   * {@link ComponentCache#cleanItemSpec} and {@link ComponentCache#cleanAreaSpec}.
   *
   * Ensures that:
   *
   * - `componentSpec.props.componentGroup` is always set (to null if not defined).
   * - `componentSpec.componentClass`.
   *
   * @param componentSpec
   */
  cleanComponentSpec (componentSpec) {
    if (!componentSpec.props) {
      componentSpec.props = {}
    }
    if (!componentSpec.props.componentGroup) {
      componentSpec.props.componentGroup = null
    }
    if (typeof componentSpec.component === 'string') {
      componentSpec.componentClass = this.getClassForComponentString(componentSpec.component)
    } else {
      componentSpec.componentClass = componentSpec.component
    }
  }

  /**
   * Make the value for `props.uniqueComponentKey` for
   * layout components.
   *
   * @param {{}} componentSpec
   * @returns {string}
   */
  makeUniqueLayoutComponentKey (componentSpec) {
    return `layoutComponent-${this.layoutComponentCount}`
  }

  /**
   * Clean a layout child component spec (filters, lists, paginators, ...).
   *
   * @param {{}} rawComponentSpec The raw component spec.
   * @param {string} defaultLocation The default location.
   * @returns {{}} The cleaned component spec.
   */
  cleanLayoutChildComponentSpec (rawComponentSpec, defaultLocation) {
    const componentSpec = Object.assign({}, rawComponentSpec)
    this.cleanComponentSpec(componentSpec)
    if (!componentSpec.props.location) {
      componentSpec.props.location = defaultLocation
    }
    componentSpec.props.uniqueComponentKey = this.makeUniqueLayoutComponentKey(componentSpec)
    if (componentSpec.componentClass.prototype instanceof AbstractListFilter) {
      this.cleanFilterSpec(componentSpec)
    } else if (componentSpec.componentClass.prototype instanceof AbstractList) {
      this.cleanListSpec(componentSpec)
    } else if (componentSpec.componentClass.prototype instanceof AbstractPaginator) {
      this.cleanPaginatorSpec(componentSpec)
    } else {
      throw new Error(
        `Invalid component: "${componentSpec.component}". ` +
        `Must be a subclass of AbstractListFilter, AbstractList ` +
        `or AbstractPaginator.`)
    }
    return componentSpec
  }

  /**
   * Clean area component spec.
   *
   * @param componentSpec
   */
  cleanAreaSpec (componentSpec) {
    this.cleanComponentSpec(componentSpec)
    if (!componentSpec.layout) {
      throw new Error(
        `"${componentSpec.component}" is missing required ` +
        `attribute "layout".`)
    }
  }

  /**
   * Make a {@link ComponentArea}.
   *
   * @param {{}} rawAreaSpec The raw area spec.
   * @param {string} defaultLocation The default location for child components.
   * @returns {ComponentArea}
   */
  makeComponentArea (rawAreaSpec, defaultLocation) {
    const componentSpec = Object.assign({}, rawAreaSpec)
    this.cleanAreaSpec(componentSpec)
    const componentArea = new ComponentArea(componentSpec)
    for (let rawComponentSpec of componentSpec.layout) {
      componentArea.layout.add(
        this.cleanLayoutChildComponentSpec(rawComponentSpec, defaultLocation))
      this.layoutComponentCount ++
    }
    return componentArea
  }

  /**
   * Set the header {@link ComponentArea}.
   *
   * @param {{}} rawAreaSpec The raw area spec.
   * @param {string} defaultLocation The default location for child components.
   */
  setHeader (rawAreaSpec, defaultLocation) {
    this.header = this.makeComponentArea(rawAreaSpec, defaultLocation)
  }

  /**
   * Set the body {@link ComponentArea}.
   *
   * @param {{}} rawAreaSpec The raw area spec.
   * @param {string} defaultLocation The default location for child components.
   */
  setBody (rawAreaSpec, defaultLocation) {
    this.body = this.makeComponentArea(rawAreaSpec, defaultLocation)
  }
}
