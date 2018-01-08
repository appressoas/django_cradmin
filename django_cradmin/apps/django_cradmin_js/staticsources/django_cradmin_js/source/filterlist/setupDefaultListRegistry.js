import FilterListRegistry from './FilterListRegistry'
import BlockList from './components/lists/BlockList'
import IdOnlyListItem from './components/items/IdOnlyListItem'
import CheckboxBooleanFilter from './components/filters/CheckboxBooleanFilter'
import TitleDescriptionListItem from './components/items/TitleDescriptionListItem'
import LoadMorePaginator from './components/paginators/LoadMorePaginator'
import SearchFilter from './components/filters/SearchFilter'
import DropDownList from './components/lists/DropDownList'
import DropDownSearchFilter from './components/filters/DropDownSearchFilter'
import SelectableTitleDescriptionListItem from './components/items/SelectableTitleDescriptionListItem'
import SelectableList from './components/lists/SelectableList'
import ThreeColumnLayout from './components/layout/ThreeColumnLayout'
import { PageNumberPaginationFilterList } from './components/filterlists/PageNumberPaginationFilterList'

export function setupDefaultListRegistryFilterListComponents (registry) {
  registry.registerFilterListComponent('PageNumberPaginationFilterList', PageNumberPaginationFilterList)
}

export function setupDefaultListRegistryLayoutComponents (registry) {
  registry.registerLayoutComponent('ThreeColumnLayout', ThreeColumnLayout)
}

export function setupDefaultListRegistryListComponents (registry) {
  registry.registerListComponent('BlockList', BlockList)
  registry.registerListComponent('DropDownList', DropDownList)
  registry.registerListComponent('SelectableList', SelectableList)
}

export function setupDefaultListRegistryFilterComponents (registry) {
  registry.registerFilterComponent('CheckboxBooleanFilter', CheckboxBooleanFilter)
  registry.registerFilterComponent('SearchFilter', SearchFilter)
  registry.registerFilterComponent('DropDownSearchFilter', DropDownSearchFilter)
}

export function setupDefaultListRegistryItemComponents (registry) {
  registry.registerItemComponent('IdOnlyItem', IdOnlyListItem)
  registry.registerItemComponent('TitleDescriptionItem', TitleDescriptionListItem)
  registry.registerItemComponent('SelectableTitleDescriptionItem', SelectableTitleDescriptionListItem)
}

export function setupDefaultListRegistryPaginatorComponents (registry) {
  registry.registerPaginatorComponent('LoadMorePaginator', LoadMorePaginator)
}

export default function setupDefaultListRegistry () {
  const registry = new FilterListRegistry()
  setupDefaultListRegistryFilterListComponents(registry)
  setupDefaultListRegistryLayoutComponents(registry)
  setupDefaultListRegistryListComponents(registry)
  setupDefaultListRegistryFilterComponents(registry)
  setupDefaultListRegistryItemComponents(registry)
  setupDefaultListRegistryPaginatorComponents(registry)
}
