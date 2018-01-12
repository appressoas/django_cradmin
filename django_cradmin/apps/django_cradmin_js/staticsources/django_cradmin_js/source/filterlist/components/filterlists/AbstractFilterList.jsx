import React from 'react'
import PropTypes from 'prop-types'
import HttpDjangoJsonRequest from 'ievv_jsbase/lib/http/HttpDjangoJsonRequest'
import FilterListRegistrySingleton from '../../FilterListRegistry'
import { MULTISELECT, RENDER_LOCATION_CENTER, SINGLESELECT } from '../../filterListConstants'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { ComponentCache } from '../../ComponentCache'
import ChildExposedApi from './ChildExposedApi'

export default class AbstractFilterList extends React.Component {
  static get propTypes () {
    return {
      idAttribute: PropTypes.string.isRequired,
      className: PropTypes.string.isRequired,
      selectMode: PropTypes.oneOf([SINGLESELECT, MULTISELECT, null]),
      autoLoadFirstPage: PropTypes.bool.isRequired,

      getItemsApiUrl: PropTypes.string.isRequired,
      getItemsApiIdsQueryStringArgument: PropTypes.string,
      updateSingleItemSortOrderApiUrl: PropTypes.string,
      submitSelectedItemsApiUrl: PropTypes.string,

      components: PropTypes.arrayOf(PropTypes.object).isRequired

      // initiallySelectedItemIds: PropTypes.array
      // updateHttpMethod: (props, propName, componentName) => {
      //   if(!props[propName] || !/^(post|put)$/.test(props[propName])) {
      //     return new Error(
      //       `Invalid prop ${propName} supplied to ${componentName}. Must ` +
      //       `be "post" or "put".`
      //     )
      //   }
      // }
    }
  }

  static get defaultProps () {
    return {
      idAttribute: 'id',
      className: 'filterlistX',
      selectMode: null,
      autoLoadFirstPage: true,

      getItemsApiUrl: null,
      getItemsApiIdsQueryStringArgument: 'id', // TODO: Should be optional and default to null - get by ID if not provided
      updateSingleItemSortOrderApiUrl: null,
      submitSelectedItemsApiUrl: null,  // TODO: Does this make sense? What if we have multiple actions?
      header: null,
      components: [{
        component: 'ThreeColumnLayout',
        layout: [{
          component: 'BlockList',
          itemSpec: {
            component: 'IdOnlyItem'
          }
        }, {
          component: 'LoadMorePaginator'
        }]
      }]
    }
  }

  constructor (props) {
    super(props)
    this.setupBoundMethods()
    this.childExposedApi = this.makeChildExposedApi()
    this._filterApiUpdateTimeoutId = null
    this._blurTimeoutId = null
    this.filterListRegistry = new FilterListRegistrySingleton()
    this.state = this.getInitialState()
    this.filterSpecCache = new Map()
    this.cachedHeaderSpec = null
    this.cachedBodySpec = null
    this.cachedItemSpec = null
    this.cachedListSpec = null
    this.cachedPaginatorSpec = null
    this._focusChangeListeners = new Set()
    this._currentFocusChildInfo = null
  }

  /**
   * Make a {@link ChildExposedApi} object.
   *
   * See {@link ChildExposedApi} for more details.
   *
   * @returns {ChildExposedApi}
   */
  makeChildExposedApi () {
    return new ChildExposedApi(this)
  }

  componentDidMount () {
    this.refreshComponentCache(this.props.components)
    if (this.props.autoLoadFirstPage) {
      this.loadFirstPageFromApi()
    }
  }

  componentWillReceiveProps (nextProps) {
    this.refreshComponentCache(nextProps.components)
  }

  setupBoundMethods () {
    this.loadMissingSelectedItemDataFromApi = this.loadMissingSelectedItemDataFromApi.bind(this)
  }

  /**
   * Get the initial react state.
   *
   * Useful for subclasses.
   *
   * @returns {object} The initial state.
   */
  getInitialState () {
    return {
      listItemsDataArray: [],
      listItemsDataMap: new Map(),
      isLoadingNewItemsFromApi: false,
      isLoadingMoreItemsFromApi: false,
      componentCache: this.makeEmptyComponentCache(),
      paginationState: {},
      hasFocus: false,
      selectedListItemsMap: new Map(),
      loadSelectedItemsFromApiError: null,
      loadItemsFromApiError: null,
      enabledComponentGroups: new Set()
    }
  }

  setInitialFilterValuesInState (filterSpecs) {
    for (let filterSpec of filterSpecs) {
      this._setFilterValueInState(filterSpec.props.name, filterSpec.initialValue)
    }
  }

  /**
   * Make an empty component cache.
   *
   * @returns {ComponentCache} An object of {@link ComponentCache} or a subclass.
   */
  makeEmptyComponentCache () {
    return new ComponentCache()
  }

  /**
   * Make a {@link ComponentCache} object.
   *
   * @param rawComponentSpecs
   * @returns {ComponentCache}
   */
  buildComponentCache (rawComponentSpecs) {
    const componentCache = this.makeEmptyComponentCache()
    componentCache.addRawLayoutComponentSpecs(rawComponentSpecs)
    return componentCache
  }

  refreshComponentCache (rawComponentSpecs) {
    const componentCache = this.buildComponentCache(rawComponentSpecs)
    this.setInitialFilterValuesInState(componentCache.filterMap.values())
    this.setState({
      componentCache: componentCache
    })
  }

  //
  //
  // Component groups
  //
  //

  /**
   * Disable a component group.
   *
   * See {@link AbstractFilterList#toggleComponentGroup} for more info
   * about component groups.
   *
   * @param {string} group The group to disable.
   */
  disableComponentGroup (group) {
    this.setState((prevState) => {
      const enabledComponentGroups = new Set(prevState.enabledComponentGroups)
      enabledComponentGroups.delete(group)
      return {
        enabledComponentGroups: enabledComponentGroups
      }
    })
  }

  /**
   * Enable a component group.
   *
   * See {@link AbstractFilterList#toggleComponentGroup} for more info
   * about component groups.
   *
   * @param {string} group The group to enable.
   */
  enableComponentGroup (group) {
    this.setState((prevState) => {
      const enabledComponentGroups = new Set(prevState.enabledComponentGroups)
      enabledComponentGroups.add(group)
      return {
        enabledComponentGroups: enabledComponentGroups
      }
    })
  }

  /**
   * Is a component group enabled?
   *
   * See {@link AbstractFilterList#toggleComponentGroup} for more info
   * about component groups.
   *
   * @param {string|null} group The group to check. If this is null, we always return `true`.
   * @return {bool} Is the component group enabled?
   */
  componentGroupIsEnabled (group) {
    if (group === null) {
      return true
    }
    return this.state.enabledComponentGroups.has(group)
  }

  /**
   * Is all the provided component groups enabled?
   *
   * @param {[string]|null} groups
   * @return {bool} Is all the component groups enabled?
   */
  componentGroupsIsEnabled (groups) {
    if (groups === null) {
      return true
    }
    for (let group of groups) {
      if (!this.componentGroupIsEnabled(group)) {
        return false
      }
    }
    return true
  }

  /**
   * Toggle a component group between disabled/enabled.
   *
   * A component group is just a string that any component
   * in `body` or `header` can set via their `componentGroup`
   * prop. You can then use this method, {@link AbstractFilterList#enableComponentGroup}
   * or {@link AbstractFilterList#disableComponentGroup} to enable/disable
   * rendering of a whole group of components. This is perfect
   * for things like dropdowns, toggle advanced filters, etc.
   *
   * We provide the {@link COMPONENT_GROUP_EXPANDABLE} and
   * {@link COMPONENT_GROUP_ADVANCED} constants, and you
   * should use these (or their values in case of purely configuring
   * through JSON input) unless you have needs not covered by them.
   *
   * @param {string} group The group to enable/disable.
   */
  toggleComponentGroup (group) {
    if (this.componentGroupIsEnabled(group)) {
      this.disableComponentGroup(group)
    } else {
      this.enableComponentGroup(group)
    }
  }

  //
  //
  // Focus/blur
  //
  //

  _stopBlurTimer () {
    if (this._blurTimeoutId) {
      window.clearTimeout(this._blurTimeoutId)
    }
  }

  onBlurTimerTimeout (childInfo) {
    const didChangeFilterListFocus = this.state.hasFocus !== false
    this.setState({
      hasFocus: false
    })
    this.callAllFocusChangeListeners('onAnyComponentBlur',
      childInfo, didChangeFilterListFocus)
    this._currentFocusChildInfo = null
  }

  get blurTimerTimeout () {
    return 200
  }

  _startBlurTimer (childInfo) {
    this._blurTimeoutId = window.setTimeout(() => {
      this.onBlurTimerTimeout(childInfo)
    }, this.blurTimerTimeout)
  }

  onChildBlur (childInfo) {
    this.callAllFocusChangeListeners('onAnyComponentBlur',
      childInfo, false)
    this._startBlurTimer(childInfo)
  }

  onChildFocus (childInfo) {
    this._stopBlurTimer()
    const didChangeFilterListFocus = this.state.hasFocus !== true
    this.setState({
      hasFocus: true
    })
    const prevChildInfo = this._currentFocusChildInfo
    this.callAllFocusChangeListeners(
      'onAnyComponentFocus', childInfo, prevChildInfo, didChangeFilterListFocus)
    this._currentFocusChildInfo = childInfo
  }

  registerFocusChangeListener (componentObject) {
    this._focusChangeListeners.add(componentObject)
  }

  unregisterFocusChangeListener (componentObject) {
    this._focusChangeListeners.delete(componentObject)
  }

  callAllFocusChangeListeners (methodName, ...args) {
    for (let componentObject of this._focusChangeListeners) {
      componentObject[methodName](...args)
    }
  }

  //
  //
  // Single and multiselect
  //
  //

  /**
   * Is `props.selectMode === 'single'`?
   *
   * WARNING: The default value for `props.selectMode` is `null`,
   * which means that this method returns `false` by default.
   * This means that you normally want to use {@link AbstractFilterList#isMultiSelectMode}
   * instead of this method unless you work with 3 states of selectMode
   * (no select (null), singleselect and multiselect)
   *
   * @returns {boolean}
   */
  isSingleSelectMode () {
    return this.props.selectMode === SINGLESELECT
  }

  /**
   * Is `props.selectMode === 'multi'`?
   *
   * @returns {boolean}
   */
  isMultiSelectMode () {
    return this.props.selectMode === MULTISELECT
  }

  /**
   * Is the provided `listItemId` selected?
   *
   * @param listItemId The ID of a list item.
   * @returns {boolean}
   */
  itemIsSelected (listItemId) {
    return this.state.selectedListItemsMap.has(listItemId)
  }

  /**
   * Select an item.
   *
   * @param listItemId The ID of a list item.
   */
  selectItem (listItemId) {
    this.selectItems([listItemId])
  }

  /**
   * Select multiple items.
   *
   * @param {[]} listItemIds Array of list item IDs. The array can not have more
   *    than 1 item unless {@link AbstractFilterList#isMultiSelectMode} is `true`.
   */
  selectItems (listItemIds) {
    if (listItemIds.length > 1 && !this.isMultiSelectMode()) {
      throw new Error('Can not select multiple items unless selectMode is "multi".')
    }
    if (!this.isMultiSelectMode()) {
      this.deselectAllItems()
    }
    this.setState((prevState, props) => {
      const selectedListItemsMap = prevState.selectedListItemsMap
      for (let listItemId of listItemIds) {
        let listItemData = null
        if (prevState.listItemsDataMap.has(listItemId)) {
          listItemData = prevState.listItemsDataMap.get(listItemId)
        }
        selectedListItemsMap.set(listItemId, listItemData)
      }
      return {
        selectedListItemsMap: selectedListItemsMap
      }
    }, this.loadMissingSelectedItemDataFromApi)
  }

  /**
   * Deselect an item.
   *
   * @param listItemId The ID of a list item.
   */
  deselectItem (listItemId) {
    this.deselectItems([listItemId])
  }

  /**
   * Deselect multiple items.
   *
   * @param {[]} listItemIds Array of list item IDs.
   */
  deselectItems (listItemIds) {
    this.setState((prevState, props) => {
      const selectedListItemsMap = prevState.selectedListItemsMap
      for (let listItemId of listItemIds) {
        selectedListItemsMap.delete(listItemId)
      }
      return {
        selectedListItemsMap: selectedListItemsMap
      }
    })
  }

  /**
   * Deselect all selected items.
   */
  deselectAllItems () {
    this.setState({
      selectedListItemsMap: new Map()
    })
  }

  getSelectedItemIdsWithMissingItemData () {
    const selectedItemIdsWithMissingItemData = []
    for (let [listItemId, listItemData] of this.state.selectedListItemsMap) {
      if (listItemData === null) {
        selectedItemIdsWithMissingItemData.push(listItemId)
      }
    }
    return selectedItemIdsWithMissingItemData
  }

  filterLoadSelectedItemDataFromApiRequest (httpRequest, listItemIds) {
    httpRequest.urlParser.queryString.setIterable(
      this.props.getItemsApiIdsQueryStringArgument,
      listItemIds)
  }

  _loadSelectedItemDataFromApi (listItemIds, paginationOptions, selectedItemDataArray) {
    return new Promise((resolve, reject) => {
      const httpRequest = this.makeListItemsHttpRequest(paginationOptions, false)
      this.filterLoadSelectedItemDataFromApiRequest(httpRequest, listItemIds)
      httpRequest.get()
        .then((httpResponse) => {
          const itemDataArray = this.getItemsArrayFromHttpResponse(httpResponse)
          selectedItemDataArray.push(...itemDataArray)

          // Load more paginated pages if needed
          const paginationState = this.makePaginationStateFromHttpResponse(
            httpResponse, paginationOptions)
          const nextPaginationOptions = this.getNextPagePaginationOptions(
            paginationState)
          if (this.hasNextPaginationPage(paginationState)) {
            this._loadSelectedItemDataFromApi(listItemIds, nextPaginationOptions, selectedItemDataArray)
              .then(() => {
                resolve()
              })
              .catch((error) => {
                reject(error)
              })
          } else {
            resolve()
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  setLoadMissingSelectedItemDataFromApiErrorMessage (errorObject) {
    this.setState({
      loadSelectedItemsFromApiError: window.gettext('Failed to load selected list items from the server.')
    })
  }

  clearLoadMissingSelectedItemDataFromApiErrorMessage () {
    if (this.state.loadSelectedItemsFromApiError !== null) {
      this.setState({
        loadSelectedItemsFromApiError: null
      })
    }
  }

  handleLoadMissingSelectedItemDataFromApiError (errorObject) {
    console.error('Error:', errorObject.toString())
    this.setLoadMissingSelectedItemDataFromApiErrorMessage(errorObject)
  }

  loadMissingSelectedItemDataFromApi () {
    const itemIdsWithMissingData = this.getSelectedItemIdsWithMissingItemData()
    if (itemIdsWithMissingData.length === 0) {
      return
    }
    if (this.state.isLoadingSelectedItemDataFromApi) {
      // Do not allow this to run in parallel
      setTimeout(this.loadMissingSelectedItemDataFromApi, 20)
      return
    }
    this.clearLoadMissingSelectedItemDataFromApiErrorMessage()
    this.setState({
      isLoadingSelectedItemDataFromApi: true
    }, () => {
      const selectedItemDataArray = []
      this._loadSelectedItemDataFromApi(
        itemIdsWithMissingData,
        this.getFirstPagePaginationOptions(this.state.paginationState),
        selectedItemDataArray)
        .then(() => {
          this.setState((prevState, props) => {
            const selectedListItemsMap = prevState.selectedListItemsMap
            for (let listItemData of selectedItemDataArray) {
              const listItemId = this.getIdFromListItemData(listItemData)
              selectedListItemsMap.set(listItemId, listItemData)
            }
            return {
              // selectedListItemsMap: selectedListItemsMap,
              isLoadingSelectedItemDataFromApi: false
            }
          })
        })
        .catch((error) => {
          this.handleLoadMissingSelectedItemDataFromApiError(error)
        })
    })
  }

  //
  //
  // Filters
  //
  //

  /**
   * Get the delay after changing a filter value until
   * we make the API request. This avoids extra API requests
   * when users change many filter values fast (I.E.: search, or
   * clicking many checkboxes fast).
   *
   * If a new filter value is set before this delay is
   * exceeded, the delay is reset and a new delay is started.
   *
   * @returns {number} Number of milliseconds to wait before
   *    making the API request on filter value change.
   *    Defaults to `300`.
   */
  get filterApiDelayMilliseconds () {
    return 300
  }

  _stopFilterApiUpdateTimer () {
    if (this._filterApiUpdateTimeoutId) {
      window.clearTimeout(this._filterApiUpdateTimeoutId)
    }
  }

  _startFilterApiUpdateTimer () {
    this._filterApiUpdateTimeoutId = window.setTimeout(() => {
      this.loadFromApiOnFilterChange()
    }, this.filterApiDelayMilliseconds)
  }

  _getStateVariableNameForFilter (filterName) {
    return `filterstate_${filterName}`
  }

  _setFilterValueInState (filterName, value, onComplete = () => {}) {
    if (value === undefined) {
      value = null
    }
    this.setState({
      [this._getStateVariableNameForFilter(filterName)]: value
    }, onComplete)
  }

  /**
   * Set the value of a filter.
   * @param filterName The name of the filter.
   * @param value The new filter value.
   * @param {bool} noDelay Perform the API request immediately if
   *    this is `true` (see {@link AbstractFilterList#filterApiDelayMilliseconds}).
   *    Defaults to `false`.
   */
  setFilterValue (filterName, value, noDelay = false) {
    this._stopFilterApiUpdateTimer()
    this._setFilterValueInState(filterName, value, () => {
      if (noDelay) {
        this.loadFromApiOnFilterChange()
      } else {
        this._startFilterApiUpdateTimer()
      }
    })
  }

  /**
   * Get the current value of a filter.
   *
   * @param filterName The name of the filter.
   * @returns Value of the filter.
   */
  getFilterValue (filterName) {
    return this.state[this._getStateVariableNameForFilter(filterName)]
  }

  /**
   * Get the default render location for filters
   * that does not specify a location.
   */
  getDefaultHeaderComponentLocation () {
    return RENDER_LOCATION_CENTER
  }

  /**
   * Get the default render location for filters
   * that does not specify a location.
   */
  getDefaultBodyComponentLocation () {
    return RENDER_LOCATION_CENTER
  }

  //
  //
  // List items
  //
  //

  /**
   * Get the ID of a list item from the item data.
   *
   * @param {{}} listItemData The list item data.
   * @returns {*} The ID of the list item.
   */
  getIdFromListItemData (listItemData) {
    if (this.props.idAttribute) {
      return listItemData[this.props.idAttribute]
    }
    throw new Error(
      'You have to specify the "idAttribute" prop, ' +
      'or override the getIdFromListItemData() method.')
  }

  //
  //
  // HTTP requests
  //
  //

  /**
   * Filter a list items HTTP request.
   *
   * Calls {@link AbstractListFilter#filterHttpRequest}
   * on all filters.
   *
   * @param httpRequest The HTTP request.
   *    An object of the class returned by {@link AbstractListFilter#getHttpRequestClass}
   */
  filterListItemsHttpRequest (httpRequest) {
    for (let filterSpec of this.state.componentCache.filterMap.values()) {
      const value = this.getFilterValue(filterSpec.props.name)
      filterSpec.componentClass.filterHttpRequest(
        httpRequest, filterSpec.props.name, value)
    }
  }

  /**
   * Get the HttpRequest class to use for the HTTP requests.
   *
   * Must return a subclass of HttpRequest from the ievv_jsbase library.
   *
   * Defaults to HttpDjangoJsonRequest.
   */
  getHttpRequestClass () {
    return HttpDjangoJsonRequest
  }

  /**
   * Add pagination options to a HTTP request.
   *
   * @param httpRequest A HTTP request object. Will always be an
   *    object of the class returned by {@link getHttpRequestClass}
   * @param {{}} paginationOptions The default implementation sets
   *    the provided options as querystring arguments.
   */
  paginateListItemsHttpRequest (httpRequest, paginationOptions) {
    if (paginationOptions) {
      httpRequest.urlParser.queryString.setValuesFromObject(paginationOptions)
    }
  }

  /**
   * Make list items HTTP request.
   *
   * @param {{}} paginationOptions Paginator options.
   * @param {bool} filter Should we filter the HTTP request using
   *    {@link AbstractListFilter#filterListItemsHttpRequest}?
   *    Defaults to `true`.
   * @returns {*} HTTP request object. An instance of the
   *    class returned by {@link AbstractListFilter#getHttpRequestClass}.
   */
  makeListItemsHttpRequest (paginationOptions, filter = true) {
    const HttpRequestClass = this.getHttpRequestClass()
    const httpRequest = new HttpRequestClass(this.props.getItemsApiUrl)
    if (filter) {
      this.filterListItemsHttpRequest(httpRequest)
    }
    this.paginateListItemsHttpRequest(httpRequest, paginationOptions)
    return httpRequest
  }

  /**
   * Get a human readable and user friendly load
   * items from API request error message.
   *
   * @param {Error} errorObject
   */
  getLoadItemsFromApiErrorMessage (errorObject) {
    return window.gettext('Failed to load list items from the server.')
  }

  /**
   * Update state with data about an error from a
   * load items from API http request.
   *
   * You normally want to override
   * {@link AbstractListFilter#getLoadItemsFromApiErrorMessage}
   * instead of this method unless you are changing the error handling
   * completely.
   *
   * If you override this, you will need to also
   * override {@link AbstractListFilter#clearLoadItemsFromApiErrorMessage}.
   *
   * @param {Error} errorObject
   */
  setLoadItemsFromApiErrorMessage (errorObject) {
    this.setState({
      loadItemsFromApiError: this.getLoadItemsFromApiErrorMessage(errorObject)
    })
  }

  /**
   * Clear the error messages set by
   * {@link AbstractListFilter#setLoadItemsFromApiErrorMessage}.
   */
  clearLoadItemsFromApiErrorMessage () {
    if (this.state.loadItemsFromApiError !== null) {
      this.setState({
        loadItemsFromApiError: null
      })
    }
  }

  /**
   * Handle a failed load items from API http request.
   *
   * You normally want to override
   * {@link AbstractListFilter#getLoadItemsFromApiErrorMessage}
   * instead of this method unless you are changing the error handling
   * completely.
   *
   * @param {Error} errorObject
   */
  handleGetListItemsFromApiRequestError (errorObject) {
    console.error('Error:', errorObject.toString())
    this.setLoadItemsFromApiErrorMessage(errorObject)
  }

  /**
   * Make pagination state from a HTTP response.
   *
   * The return value from this is stored in ``state.paginationState``,
   * and it is typically used in many of the methods for getting
   * pagination options ({@link getNextPagePaginationOptions},
   * {@link getPreviousPagePaginationOptions}, ...).
   *
   * @param httpResponse The HTTP response. Will always be a
   *    subclass of HttpResponse from the ievv_jsbase library.
   * @param paginationOptions The pagination options that was sent to
   *    the HTTP request.
   * @returns {object} Pagination state object defining the current pagination
   *    state.
   */
  makePaginationStateFromHttpResponse (httpResponse, paginationOptions) {
    return {}
  }

  /**
   * Get pagination options for the first paginated page.
   *
   * The returned options are used with
   * {@link AbstractFilterList#paginateListItemsHttpRequest}
   * when requesting the first page from the API.
   *
   * @param {int} paginationState The current pagination state.
   *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
   * @returns {object|null} Pagination options. If this returns `null`,
   *     it means that no pagination options are needed to fetch the
   *     first page.
   */
  getFirstPagePaginationOptions (paginationState) {
    return null
  }

  /**
   * Get the current pagination page number.
   *
   * @param {int} paginationState The current pagination state.
   *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
   * @returns {number}
   */
  getCurrentPaginationPage (paginationState) {
    return 1
  }

  /**
   * Get pagination options for the next page relative to the
   * currently active page.
   *
   * @param {int} paginationState The current pagination state.
   *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
   * @returns {object|null} Pagination options. If this returns
   *    null, it means that there are no "next" page.
   */
  getNextPagePaginationOptions (paginationState) {
    return null
  }

  /**
   * Get pagination options for the previous page relative to the
   * currently active page.
   *
   * @param {int} paginationState The current pagination state.
   *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
   * @returns {object|null} Pagination options. If this returns
   *    null, it means that there are no "previous" page.
   */
  getPreviousPagePaginationOptions (paginationState) {
    return null
  }

  /**
   * Get pagination options for a specific page number.
   *
   * @param {int} pageNumber The page number.
   * @param {int} paginationState The current pagination state.
   *    See {@link AbstractFilterList#makePaginationStateFromHttpResponse}
   *
   * @returns {object} Pagination options
   */
  getSpecificPagePaginationOptions (pageNumber, paginationState) {
    throw new Error('getSpecificPagePaginationOptions() is not implemented')
  }

  /**
   * Get the total number of available paginatable pages.
   *
   * If this returns ``null``, it means that the information
   * is not available, and paginators depending on this information
   * can not be used.
   *
   * @returns {int|null}
   */
  getPaginationPageCount (paginationState) {
    return null
  }

  /**
   * Get the total number of available list items with the current filters
   * activated.
   *
   * If this returns ``null``, it means that the information
   * is not available, and paginators depending on this information
   * can not be used.
   *
   * @returns {int|null}
   */
  getTotalListItemCount (paginationState) {
    return null
  }

  /**
   * Do we have a previous paginatable page?
   *
   * @returns {boolean}
   */
  hasPreviousPaginationPage (paginationState) {
    return this.getPreviousPagePaginationOptions(paginationState) !== null
  }

  /**
   * Do we have a next paginatable page?
   *
   * @returns {boolean}
   */
  hasNextPaginationPage (paginationState) {
    return this.getNextPagePaginationOptions(paginationState) !== null
  }

  /**
   * Get an array of list items raw data objects from an API response.
   *
   * @param httpResponse The HTTP response. Will always be a
   *    subclass of HttpResponse from the ievv_jsbase library.
   */
  getItemsArrayFromHttpResponse (httpResponse) {
    return httpResponse.bodydata.results
  }

  /**
   * Make new items state from API response.
   *
   * Parses the HTTP response, and returns an object
   * with new state variables for the list items.
   *
   * @param {{}} prevState The current state.
   * @param {{}} props The current props.
   * @param httpResponse The HTTP response. Will always be a
   *    subclass of HttpResponse from the ievv_jsbase library.
   * @param clearOldItems If this is ``true``, we replace the
   *    items displayed in the list with the items from the response.
   *    If it is ``false``, we append the new items to the items
   *    displayed in the list.
   * @returns {{}} New state variables for the list items.
   */
  makeNewItemsStateFromApiResponse (prevState, props, httpResponse, clearOldItems) {
    const newItemsArray = this.getItemsArrayFromHttpResponse(httpResponse)
    let listItemsDataArray
    let listItemsDataMap
    if (clearOldItems) {
      listItemsDataMap = new Map()
      listItemsDataArray = newItemsArray
    } else {
      prevState.listItemsDataArray.push(...newItemsArray)
      listItemsDataArray = prevState.listItemsDataArray
      listItemsDataMap = prevState.listItemsDataMap
    }
    for (let listItemData of newItemsArray) {
      const listItemId = this.getIdFromListItemData(listItemData)
      listItemsDataMap.set(listItemId, listItemData)
    }
    return {
      listItemsDataArray: listItemsDataArray,
      listItemsDataMap: listItemsDataMap
    }
  }

  /**
   * Make react state variables from a successful load items from API HTTP response.
   *
   * You should normally not need to override this method.
   * It should normally be enough to override
   * {@link makeNewItemsStateFromApiResponse}
   * and {@link makePaginationStateFromHttpResponse}
   *
   * @param {{}} prevState The current state.
   * @param {{}} props The current props.
   * @param httpResponse The HTTP response. Will always be a
   *    subclass of HttpResponse from the ievv_jsbase library.
   * @param paginationOptions Pagination options normally created
   *    with {@link getNextPagePaginationOptions},
   *    {@link getNextPagePaginationOptions}, {@link getPreviousPagePaginationOptions}
   *    or {@link getSpecificPagePaginationOptions}.
   * @param clearOldItems See {@link makeNewItemsStateFromApiResponse}.
   * @returns {object}
   */
  makeStateFromLoadItemsApiSuccessResponse (prevState, props, httpResponse, paginationOptions, clearOldItems) {
    const newItemsState = this.makeNewItemsStateFromApiResponse(
        prevState, props, httpResponse, clearOldItems)
    return {
      isLoadingNewItemsFromApi: false,
      isLoadingMoreItemsFromApi: false,
      listItemsDataArray: newItemsState.listItemsDataArray,
      listItemsDataMap: newItemsState.listItemsDataMap,
      paginationState: this.makePaginationStateFromHttpResponse(httpResponse, paginationOptions)
    }
  }

  /**
   * Update state from load items API success response.
   *
   * Called by all the `load*FromApi` methods.
   *
   * @param httpResponse The HTTP response object.
   * @param {{}} paginationOptions The pagination options used by the HTTP request.
   * @param {bool} clearOldItems Should we clear old list items and replace
   *    them with the items in the response. If this is `false`, we should
   *    append the new items.
   */
  updateStateFromLoadItemsApiSuccessResponse (httpResponse, paginationOptions, clearOldItems) {
    this.setState((prevState, props) => {
      return this.makeStateFromLoadItemsApiSuccessResponse(
        prevState, props, httpResponse, paginationOptions, clearOldItems)
    })
  }

  /**
   * Load items from API.
   *
   * Low level method. You normally call one of
   *
   * - {@link loadMoreItemsFromApi}
   * - {@link loadNextPageFromApi}
   * - {@link loadPreviousPageFromApi}
   * - {@link loadSpecificPageFromApi}
   *
   * instead of calling this method directly.
   *
   * @param {{}} paginationOptions Paginator options.
   * @param {bool} clearOldItems
   * @returns {Promise}
   */
  loadItemsFromApi (paginationOptions, clearOldItems) {
    return new Promise((resolve, reject) => {
      this.clearLoadItemsFromApiErrorMessage()
      const newState = {}
      if (clearOldItems) {
        newState.isLoadingNewItemsFromApi = true
      } else {
        newState.isLoadingMoreItemsFromApi = true
      }
      this.setState(newState, () => {
        this.makeListItemsHttpRequest(paginationOptions).get()
          .then((httpResponse) => {
            resolve(httpResponse)
          })
          .catch((error) => {
            reject(error)
          })
      })
    })
  }

  /**
   * Load first page from the API.
   *
   * Loaded items replace the current items in the list.
   */
  loadFirstPageFromApi () {
    const paginationOptions = this.getFirstPagePaginationOptions()
    this.loadItemsFromApi(paginationOptions, true)
      .then((httpResponse) => {
        this.updateStateFromLoadItemsApiSuccessResponse(
          httpResponse, paginationOptions, true)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  /**
   * Called when filter values changes to load new items from the API.
   *
   * By default, this is just an alias for
   * {@link AbstractFilterList#loadFirstPageFromApi}.
   */
  loadFromApiOnFilterChange () {
    this.loadFirstPageFromApi()
  }

  /**
   * Load more items from the API.
   *
   * Intended for _Load more_ buttons, and infinite scroll
   * implementations.
   *
   * Loaded items are appended at the end of the list.
   */
  loadMoreItemsFromApi () {
    const paginationOptions = this.getNextPagePaginationOptions(this.state.paginationState)
    this.loadItemsFromApi(paginationOptions, false)
      .then((httpResponse) => {
        this.updateStateFromLoadItemsApiSuccessResponse(
          httpResponse, paginationOptions, false)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  /**
   * Load the next paginated "page" of items from the API.
   *
   * Intended to be used along with {@link loadPreviousPageFromApi} by
   * paginators with _Next_ and _Previous_ page buttons.
   *
   * Loaded items replace the current items in the list.
   */
  loadNextPageFromApi () {
    const paginationOptions = this.getNextPagePaginationOptions(this.state.paginationState)
    this.loadItemsFromApi(paginationOptions, true)
      .then((httpResponse) => {
        this.updateStateFromLoadItemsApiSuccessResponse(
          httpResponse, paginationOptions, true)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  /**
   * Load the previous paginated "page" of items from the API.
   *
   * Intended to be used along with {@link loadNextPageFromApi} by
   * paginators with _Next_ and _Previous_ page buttons.
   *
   * Loaded items replace the current items in the list.
   */
  loadPreviousPageFromApi () {
    const paginationOptions = this.getPreviousPagePaginationOptions(this.state.paginationState)
    this.loadItemsFromApi(paginationOptions, true)
      .then((httpResponse) => {
        this.updateStateFromLoadItemsApiSuccessResponse(
          httpResponse, paginationOptions, true)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  /**
   * Load a specific paginated "page" of items from the API.
   *
   * Intended to be used by paginators that use {@link getPaginationPageCount}
   * to render links to specific paginated pages.
   *
   * Loaded items replace the current items in the list.
   */
  loadSpecificPageFromApi (pageNumber) {
    const paginationOptions = this.getSpecificPagePaginationOptions(
      pageNumber, this.state.paginationState)
    this.loadItemsFromApi(paginationOptions, true)
      .then((httpResponse) => {
        this.updateStateFromLoadItemsApiSuccessResponse(
          httpResponse, paginationOptions, true)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  //
  //
  // Rendering
  //
  //

  /**
   * Get props for a layout component.
   *
   * Used by {@link AbstractFilterList#renderLayoutComponent}.
   *
   * @param {LayoutComponentSpec} layoutComponentSpec The layout component spec
   * @returns {{}} Props for the layout component.
   */
  getLayoutComponentProps (layoutComponentSpec) {
    return Object.assign({}, layoutComponentSpec.props, {
      key: layoutComponentSpec.props.uniqueComponentKey,
      childExposedApi: this.childExposedApi,
      listItemsDataArray: this.state.listItemsDataArray,
      listItemsDataMap: this.state.listItemsDataMap,
      selectedListItemsMap: this.state.selectedListItemsMap,
      enabledComponentGroups: this.state.enabledComponentGroups,
      isLoadingNewItemsFromApi: this.state.isLoadingNewItemsFromApi,
      isLoadingMoreItemsFromApi: this.state.isLoadingMoreItemsFromApi
    })
  }

  /**
   * Should we render the provided layout component?
   *
   * Uses {@link AbstractFilterList#componentGroupsIsEnabled} to determine
   * if the component should be rendered.
   *
   * @param {LayoutComponentSpec} layoutComponentSpec A layout component spec.
   * @returns {bool}
   */
  shouldRenderLayoutComponentSpec (layoutComponentSpec) {
    return this.componentGroupsIsEnabled(layoutComponentSpec.props.componentGroups)
  }

  /**
   * Render a layout component.
   *
   * @param {LayoutComponentSpec} layoutComponentSpec A layout component spec.
   * @returns {null|React.Element}
   */
  renderLayoutComponent (layoutComponentSpec) {
    if (!this.shouldRenderLayoutComponentSpec(layoutComponentSpec)) {
      return null
    }
    return React.createElement(
      layoutComponentSpec.componentClass,
      this.getLayoutComponentProps(layoutComponentSpec))
  }

  renderComponents () {
    const renderedComponents = []
    for (let layoutComponentSpec of this.state.componentCache.layoutComponentSpecs) {
      renderedComponents.push(this.renderLayoutComponent(layoutComponentSpec))
    }
    return renderedComponents
  }

  render () {
    if (this.state.isLoadingSelectedItemDataFromApi) {
      return <LoadingIndicator />
    } else {
      return <div className={this.props.className}>
        {this.renderComponents()}
      </div>
    }
  }
}
