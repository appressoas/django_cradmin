import FilterListRegistry from './FilterListRegistry'
import List from './components/lists/List'
import IdOnlyListItem from './components/items/IdOnlyListItem'
import CheckboxBooleanFilter from './components/filters/CheckboxBooleanFilter'

export function setupDefaultListRegistryListComponents(registry) {
  registry.registerListComponent('List', List)
}

export function setupDefaultListRegistryFilterComponents(registry) {
  registry.registerFilterComponent('CheckboxBoolean', CheckboxBooleanFilter)
}

export function setupDefaultListRegistryItemComponents(registry) {
  registry.registerItemComponent('IdOnly', IdOnlyListItem)
}

export default function setupDefaultListRegistry() {
  const registry = new FilterListRegistry()
  setupDefaultListRegistryListComponents(registry)
  setupDefaultListRegistryFilterComponents(registry)
  setupDefaultListRegistryItemComponents(registry)
}
