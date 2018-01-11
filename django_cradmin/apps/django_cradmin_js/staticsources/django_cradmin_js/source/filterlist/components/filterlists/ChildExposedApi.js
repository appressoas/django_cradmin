/**
 * Object that exposes a safe set of methods from
 * {@link AbstractFilterList} to child components.
 *
 * You can extend this class, and override {@link AbstractFilterList#makeChildExposedApi}
 * to expand the API available to all components within your filterlist.
 *
 * Exposes the following methods:
 *
 * API:
 * - {@link AbstractFilterList#loadMoreItemsFromApi}
 * - {@link AbstractFilterList#loadNextPageFromApi}
 * - {@link AbstractFilterList#loadPreviousPageFromApi}
 * - {@link AbstractFilterList#loadSpecificPageFromApi}
 *
 * Select items:
 * - {@link AbstractFilterList#selectItem}
 * - {@link AbstractFilterList#selectItems}
 * - {@link AbstractFilterList#deselectItem}
 * - {@link AbstractFilterList#deselectItems}
 * - {@link AbstractFilterList#deselectAllItems}
 * - {@link AbstractFilterList#itemIsSelected}
 * - {@link AbstractFilterList#isSingleSelectMode}
 * - {@link AbstractFilterList#isMultiSelectMode}
 *
 * Item details:
 * - {@link AbstractFilterList#getIdFromListItemData}
 *
 * Filtering:
 * - {@link AbstractFilterList#setFilterValue}
 * - {@link AbstractFilterList#getFilterValue}
 *
 * Pagination
 * - {@link AbstractFilterList#hasPreviousPaginationPage} (without the paginationState argument)
 * - {@link AbstractFilterList#hasNextPaginationPage} (without the paginationState argument)
 * - {@link AbstractFilterList#getPaginationPageCount} (without the paginationState argument)
 * - {@link AbstractFilterList#getTotalListItemCount} (without the paginationState argument)
 *
 * Focus
 * - {@link AbstractFilterList#onChildFocus}
 * - {@link AbstractFilterList#onChildBlur}
 *
 * Component groups:
 * - {@link AbstractFilterList#disableComponentGroup}
 * - {@link AbstractFilterList#enableComponentGroup}
 * - {@link AbstractFilterList#toggleComponentGroup}
 * - {@link AbstractFilterList#componentGroupIsEnabled}
 */
export default class ChildExposedApi {
  constructor (filterListObject) {
    this.filterListObject = filterListObject
    this.setupBoundMethods()
  }

  setupBoundMethods () {
    this.loadMoreItemsFromApi = this.filterListObject.loadMoreItemsFromApi.bind(this.filterListObject)
    this.loadNextPageFromApi = this.filterListObject.loadNextPageFromApi.bind(this.filterListObject)
    this.loadPreviousPageFromApi = this.filterListObject.loadPreviousPageFromApi.bind(this.filterListObject)
    this.loadSpecificPageFromApi = this.filterListObject.loadSpecificPageFromApi.bind(this.filterListObject)

    this.selectItem = this.filterListObject.selectItem.bind(this.filterListObject)
    this.selectItems = this.filterListObject.selectItems.bind(this.filterListObject)
    this.deselectItem = this.filterListObject.deselectItem.bind(this.filterListObject)
    this.deselectItems = this.filterListObject.deselectItems.bind(this.filterListObject)
    this.deselectAllItems = this.filterListObject.deselectAllItems.bind(this.filterListObject)
    this.itemIsSelected = this.filterListObject.itemIsSelected.bind(this.filterListObject)
    this.getIdFromListItemData = this.filterListObject.getIdFromListItemData.bind(this.filterListObject)

    this.setFilterValue = this.filterListObject.setFilterValue.bind(this.filterListObject)
    this.getFilterValue = this.filterListObject.getFilterValue.bind(this.filterListObject)

    this.isSingleSelectMode = this.filterListObject.isSingleSelectMode.bind(this.filterListObject)
    this.isMultiSelectMode = this.filterListObject.isMultiSelectMode.bind(this.filterListObject)

    this._hasPreviousPaginationPage = this.filterListObject.hasPreviousPaginationPage.bind(this.filterListObject)
    this._hasNextPaginationPage = this.filterListObject.hasNextPaginationPage.bind(this.filterListObject)
    this._getPaginationPageCount = this.filterListObject.getPaginationPageCount.bind(this.filterListObject)
    this._getTotalListItemCount = this.filterListObject.getTotalListItemCount.bind(this.filterListObject)

    this.onChildFocus = this.filterListObject.onChildFocus.bind(this.filterListObject)
    this.onChildBlur = this.filterListObject.onChildBlur.bind(this.filterListObject)

    this.disableComponentGroup = this.filterListObject.disableComponentGroup.bind(this.filterListObject)
    this.enableComponentGroup = this.filterListObject.enableComponentGroup.bind(this.filterListObject)
    this.toggleComponentGroup = this.filterListObject.toggleComponentGroup.bind(this.filterListObject)
    this.componentGroupIsEnabled = this.filterListObject.componentGroupIsEnabled.bind(this.filterListObject)
    this.componentGroupsIsEnabled = this.filterListObject.componentGroupsIsEnabled.bind(this.filterListObject)
  }

  hasPreviousPaginationPage () {
    return this._hasPreviousPaginationPage(this.filterListObject.state.paginationState)
  }

  hasNextPaginationPage () {
    return this._hasNextPaginationPage(this.filterListObject.state.paginationState)
  }

  getPaginationPageCount () {
    return this._getPaginationPageCount(this.filterListObject.state.paginationState)
  }

  getTotalListItemCount () {
    return this._getTotalListItemCount(this.filterListObject.state.paginationState)
  }
}
