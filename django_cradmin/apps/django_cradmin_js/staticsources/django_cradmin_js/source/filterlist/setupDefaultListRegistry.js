import FilterListRegistry from './FilterListRegistry'
import List from './components/lists/List'
import BaseListItem from './components/items/BaseListItem'

export function setupDefaultListRegistryListComponents(registry) {
  registry.registerListComponent('list', List)
}

export function setupDefaultListRegistryFilterComponents(registry) {
}

export function setupDefaultListRegistryItemComponents(registry) {
  registry.registerItemComponent('base', BaseListItem)
}

export default function setupDefaultListRegistry() {
  const registry = new FilterListRegistry()
  setupDefaultListRegistryListComponents(registry)
  setupDefaultListRegistryFilterComponents(registry)
  setupDefaultListRegistryItemComponents(registry)
}
