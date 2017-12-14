import FilterListRegistry from './FilterListRegistry'
import List from './components/lists/List'
import IdOnlyListItem from './components/items/IdOnlyListItem'
import CheckboxBooleanFilter from './components/filters/CheckboxBooleanFilter'
import TitleDescriptionListItem from './components/items/TitleDescriptionListItem'
import LoadMorePaginator from './components/paginators/LoadMorePaginator'
import SearchFilter from './components/filters/SearchFilter'
import DropDownList from './components/lists/DropDownList'
import DropDownSearchFilter from './components/filters/DropDownSearchFilter'

export function setupDefaultListRegistryListComponents (registry) {
  registry.registerListComponent('List', List)
  registry.registerListComponent('DropDownList', DropDownList)
}

export function setupDefaultListRegistryFilterComponents (registry) {
  registry.registerFilterComponent('CheckboxBoolean', CheckboxBooleanFilter)
  registry.registerFilterComponent('Search', SearchFilter)
  registry.registerFilterComponent('DropDownSearch', DropDownSearchFilter)
}

export function setupDefaultListRegistryItemComponents (registry) {
  registry.registerItemComponent('IdOnly', IdOnlyListItem)
  registry.registerItemComponent('TitleDescription', TitleDescriptionListItem)
}

export function setupDefaultListRegistryPaginatorComponents (registry) {
  registry.registerPaginatorComponent('LoadMore', LoadMorePaginator)
}

export default function setupDefaultListRegistry () {
  const registry = new FilterListRegistry()
  setupDefaultListRegistryListComponents(registry)
  setupDefaultListRegistryFilterComponents(registry)
  setupDefaultListRegistryItemComponents(registry)
  setupDefaultListRegistryPaginatorComponents(registry)
}
