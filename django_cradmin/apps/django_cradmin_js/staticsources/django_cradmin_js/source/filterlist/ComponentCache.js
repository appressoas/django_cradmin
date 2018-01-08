import AbstractListFilter from './components/filters/AbstractListFilter'
import AbstractPaginator from './components/paginators/AbstractPaginator'
import AbstractList from './components/lists/AbstractList'
import FilterListRegistrySingleton from './FilterListRegistry'

export class ComponentLayout {
  constructor () {
    this.layoutMap = new Map()
  }

  add (componentSpec) {
    if (!this.layoutMap.has(componentSpec.props.location)) {
      this.layoutMap.set(componentSpec.props.location, [])
    }
    this.layoutMap.get(componentSpec.props.location).push(componentSpec)
  }

  getComponentsAtLocation (location) {
    return this.layoutMap.get(location) || []
  }
}


export class ComponentArea {
  constructor (componentSpec) {
    this.componentSpec = componentSpec
    this.layout = new ComponentLayout()
  }

  get componentClass () {
    return this.componentSpec.componentClass
  }

  get props () {
    return Object.assign({}, this.componentSpec.props, {
      layout: this.layout
    })
  }
}


export default class ComponentCache {
  constructor () {
    this.filterListRegistry = new FilterListRegistrySingleton()
    this.filterMap = new Map()
    this.body = null
    this.header = null
    this.layoutComponentCount = 0
  }

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

  cleanItemSpec (componentSpec) {
  }

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

  cleanPaginatorSpec (componentSpec,) {
  }

  getClassForComponentString (componentSpec) {
    let componentClass = null
    if (componentSpec.component.endsWith('Filter')) {
      componentClass = this.filterListRegistry.getFilterComponent(componentSpec.component)
    } else if (componentSpec.component.endsWith('List')) {
      componentClass = this.filterListRegistry.getListComponent(componentSpec.component)
    } else if (componentSpec.component.endsWith('Paginator')) {
      componentClass = this.filterListRegistry.getPaginatorComponent(componentSpec.component)
    } else if (componentSpec.component.endsWith('Layout')) {
      componentClass = this.filterListRegistry.getLayoutComponent(componentSpec.component)
    } else if (componentSpec.component.endsWith('Item')) {
      componentClass = this.filterListRegistry.getItemComponent(componentSpec.component)
    } else {
      throw new Error(
        `Invalid component: "${componentSpec.component}". ` +
        `Must end with "Filter", "List" or "Paginator".`)
    }
    if (!componentClass) {
      throw new Error(
        `No component class for "${componentSpec.component}" in the registry.`)
    }
    return componentClass
  }

  cleanComponentSpec (componentSpec) {
    if (!componentSpec.props) {
      componentSpec.props = {}
    }
    if (!componentSpec.props.componentGroup) {
      componentSpec.props.componentGroup = null
    }
    if (typeof componentSpec.component === 'string') {
      componentSpec.componentClass = this.getClassForComponentString(componentSpec)
    } else {
      componentSpec.componentClass = componentSpec.component
    }
  }

  cleanLayoutComponentSpec (rawComponentSpec, defaultLocation) {
    const componentSpec = Object.assign({}, rawComponentSpec)
    this.cleanComponentSpec(componentSpec)
    if (!componentSpec.props.location) {
      componentSpec.props.location = defaultLocation
    }
    componentSpec.props.uniqueComponentKey = `layoutComponent-${this.layoutComponentCount}`
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

  cleanAreaSpec (componentSpec, rawComponentSpec) {
    this.cleanComponentSpec(componentSpec)
    if (!componentSpec.layout) {
      throw new Error(
        `"${rawComponentSpec.component}" is missing required ` +
        `attribute "layout".`)
    }
  }

  makeComponentArea (rawAreaSpec, defaultLocation) {
    const componentSpec = Object.assign({}, rawAreaSpec)
    this.cleanAreaSpec(componentSpec, rawAreaSpec)
    const componentArea = new ComponentArea(componentSpec)
    for (let rawComponentSpec of componentSpec.layout) {
      componentArea.layout.add(
        this.cleanLayoutComponentSpec(rawComponentSpec, defaultLocation))
      this.layoutComponentCount ++
    }
    return componentArea
  }

  setHeader (rawAreaSpec, defaultLocation) {
    this.header = this.makeComponentArea(rawAreaSpec, defaultLocation)
  }

  setBody (rawAreaSpec, defaultLocation) {
    this.body = this.makeComponentArea(rawAreaSpec, defaultLocation)
  }
}
