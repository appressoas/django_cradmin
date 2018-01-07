import React from 'react'
import PropTypes from 'prop-types'
import HttpDjangoJsonRequest from 'ievv_jsbase/lib/http/HttpDjangoJsonRequest'
import FilterListRegistrySingleton from '../../FilterListRegistry'
import {
  MULTISELECT, RENDER_AREA_ALL, RENDER_AREA_BODY, RENDER_AREA_HEADER, RENDER_LOCATION_RIGHT, RENDER_LOCATION_TOP,
  SINGLESELECT
} from '../../filterListConstants'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import LoadingIndicator from '../../../components/LoadingIndicator'


/*
<AbstractList
  headerFilterSpecs={[
    {
      component: "SearchFilter",
      props: {
        name: "search"
      }
    }
  ]}
  bodyFilterSpecs={[
    {
      component: "AmountFilter",
      props: {
        name: "max_amount",
        location: "left"
      },
      initialValue: 10
    }
  ]}
  headerSpec={
    component: "StackedLayout"
  }
  bodySpec={
    component: "ThreeColumnLayout"
  }
  itemSpec={{
    component: "MyItem",
    props: {
      myprop: 10
    }
  }}
  paginatorSpec={{
    component: "MyPaginator",
    props: {
      myLabel: "Load some more items!"
    }
  }}/>
*/


export class ChildExposedApi {
  constructor (filterListObject) {
    this.filterListObject = filterListObject
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

    this.getFiltersAtLocation = this.filterListObject.getFiltersAtLocation.bind(this.filterListObject)
    this.getAllFilters = this.filterListObject.getAllFilters.bind(this.filterListObject)
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
  }

  hasPreviousPaginationPage () {
    return this._hasPreviousPaginationPage(this.filterListObject.paginationState)
  }

  hasNextPaginationPage () {
    return this._hasNextPaginationPage(this.filterListObject.paginationState)
  }

  getPaginationPageCount () {
    return this._getPaginationPageCount(this.filterListObject.paginationState)
  }

  getTotalListItemCount () {
    return this._getTotalListItemCount(this.filterListObject.paginationState)
  }
}


export default class AbstractFilterList extends React.Component {
  static get propTypes () {
    return {
      idAttribute: PropTypes.string.isRequired,
      className: PropTypes.string.isRequired,
      selectMode: PropTypes.oneOf([SINGLESELECT, MULTISELECT, null]),

      getItemsApiUrl: PropTypes.string.isRequired,
      getItemsApiIdsQueryStringArgument: PropTypes.string,
      updateSingleItemSortOrderApiUrl: PropTypes.string,
      submitSelectedItemsApiUrl: PropTypes.string,

      headerFilterSpecs: PropTypes.array,
      bodyFilterSpecs: PropTypes.array,
      headerSpec: PropTypes.object.isRequired,
      bodySpec: PropTypes.object.isRequired,
      itemSpec: PropTypes.object.isRequired,
      listSpec: PropTypes.object.isRequired,
      paginatorSpec: PropTypes.object,

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

      getItemsApiUrl: null,
      getItemsApiIdsQueryStringArgument: 'id', // TODO: Should be optional and default to null - get by ID if not provided
      updateSingleItemSortOrderApiUrl: null,
      submitSelectedItemsApiUrl: null,  // TODO: Does this make sense? What if we have multiple actions?
      // updateHttpMethod: 'post'

      headerFilterSpecs: [],
      bodyFilterSpecs: [],

      // initiallySelectedItemIds: [],
      headerSpec: {
        'component': 'ThreeColumnLayout'
      },
      bodySpec: {
        'component': 'ThreeColumnLayout'
      },
      itemSpec: {
        'component': 'IdOnly'
      },
      paginatorSpec: {
        'component': 'LoadMore'
      }
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

    this.refreshHeaderSpec(this.props.headerSpec)
    this.refreshBodySpec(this.props.bodySpec)
    this.refreshItemSpec(this.props.itemSpec)
    this.refreshListSpec(this.props.listSpec)
    this.refreshPaginatorSpec(this.props.paginatorSpec)
  }

  makeChildExposedApi () {
    return new ChildExposedApi(this)
  }

  componentDidMount () {
    this.refreshFiltersCache(this.props.headerFilterSpecs, this.props.bodyFilterSpecs)
  }

  componentWillReceiveProps (nextProps) {
    this.refreshHeaderSpec(nextProps.headerSpec)
    this.refreshBodySpec(nextProps.bodySpec)
    this.refreshItemSpec(nextProps.itemSpec)
    this.refreshListSpec(nextProps.listSpec)
    this.refreshPaginatorSpec(nextProps.paginatorSpec)
    this.refreshFiltersCache(nextProps.headerFilterSpecs, nextProps.bodyFilterSpecs)
  }

  setupBoundMethods () {
    this.setFilterValue = this.setFilterValue.bind(this)
    this.getFilterValue = this.getFilterValue.bind(this)
    this.loadMoreItemsFromApi = this.loadMoreItemsFromApi.bind(this)
    this.loadNextPageFromApi = this.loadNextPageFromApi.bind(this)
    this.loadPreviousPageFromApi = this.loadPreviousPageFromApi.bind(this)
    this.loadSpecificPageFromApi = this.loadSpecificPageFromApi.bind(this)
    this.onChildBlur = this.onChildBlur.bind(this)
    this.onChildFocus = this.onChildFocus.bind(this)
    this.loadMissingSelectedItemDataFromApi = this.loadMissingSelectedItemDataFromApi.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.selectItems = this.selectItems.bind(this)
    this.deselectItem = this.deselectItem.bind(this)
    this.deselectItems = this.deselectItems.bind(this)
    this.deselectAllItems = this.deselectAllItems.bind(this)
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
      paginationState: {},
      hasFocus: false,
      selectedListItemsMap: new Map(),
      loadSelectedItemsFromApiError: null,
      loadItemsFromApiError: null
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

  onBlurTimerTimeout () {
    this.setState({
      hasFocus: false
    })
  }

  get blurTimerTimeout () {
    return 200
  }

  _startBlurTimer () {
    this._blurTimeoutId = window.setTimeout(() => {
      this.onBlurTimerTimeout()
    }, this.blurTimerTimeout)
  }

  onChildBlur (childInfo) {
    this._startBlurTimer()
  }

  onChildFocus (childInfo) {
    this._stopBlurTimer()
    this.setState({
      hasFocus: true
    })
  }

  //
  //
  // Single and multiselect
  //
  //

  isSingleSelectMode () {
    return this.props.selectMode === SINGLESELECT
  }

  isMultiSelectMode () {
    return this.props.selectMode === MULTISELECT
  }

  itemIsSelected (listItemId) {
    return this.state.selectedListItemsMap.has(listItemId)
  }

  selectItem (listItemId) {
    this.selectItems([listItemId])
  }

  selectItems (listItemIds) {
    if (listItemIds.length > 1 && this.isSingleSelectMode()) {
      throw new Error('Can not select multiple items in single select mode')
    }
    if (this.isSingleSelectMode()) {
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

  deselectItem (listItemId) {
    this.deselectItems([listItemId])
  }

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
        this.getSelectedItemIdsWithMissingItemData(),
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
              selectedListItemsMap: selectedListItemsMap,
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
  // Header / body specs
  //
  //

  makeLayoutSpec (rawLayoutSpec, propName, methodName) {
    let cachedLayoutSpec = null
    if (rawLayoutSpec) {
      cachedLayoutSpec = Object.assign({}, rawLayoutSpec)
      if (cachedLayoutSpec.component) {
        if (typeof cachedLayoutSpec.component === 'string') {
          cachedLayoutSpec.componentClass = this.filterListRegistry.getLayoutComponent(cachedLayoutSpec.component)
          if (!cachedLayoutSpec.componentClass) {
            throw new Error(
              `Could not find a filterlist layout component class registered for ` +
              `alias "${cachedLayoutSpec.component}"`)
          }
        } else {
          cachedLayoutSpec.componentClass = cachedLayoutSpec.component
        }
      } else {
        throw new Error(
          `You must specify the "props.${propName}", or override ` +
          `the ${methodName}() method.`)
      }
      if (!cachedLayoutSpec.props) {
        cachedLayoutSpec.props = {}
      }
    }
    return cachedLayoutSpec
  }

  refreshHeaderSpec (rawHeaderSpec) {
    this.cachedHeaderSpec = this.makeLayoutSpec('headerSpec', 'refreshHeaderSpec')
  }

  refreshBodySpec (rawBodySpec) {
    this.cachedBodySpec = this.makeLayoutSpec('bodySpec', 'refreshBodySpec')
  }

  //
  //
  // Filters
  //
  //

  /**
   * Make a filterSpec from a rawFilterSpec.
   *
   * Validates the provided filterSpec, and ensures that
   * the returned filterSpec has a javascript class
   * in the componentClass property. This means that if
   * rawFilterSpec.component is a string, we will lookup
   * the class using {@link FilterListRegistrySingleton#getFilterComponent}.
   *
   * @param rawFilterSpec {{}} The raw filterSpec.
   * @param defaultLocation {string} The fallback value for the location if
   *    is not specified in rawFilterSpec.
   * @returns {{}} That is guaranteed to have the following attributes: componentClass,
   *    location, name.
   */
  makeFilterSpec (rawFilterSpec, defaultLocation) {
    const filterSpec = Object.assign({}, rawFilterSpec)
    if (typeof rawFilterSpec.component === 'string') {
      filterSpec.componentClass = this.filterListRegistry.getFilterComponent(rawFilterSpec.component)
    } else {
      filterSpec.componentClass = rawFilterSpec.component
    }
    if (!rawFilterSpec.props) {
      throw new Error(
        `Filter component=${rawFilterSpec.component} is missing required ` +
        `attribute "props".`)
    }
    if (!rawFilterSpec.props.location) {
      filterSpec.props.location = defaultLocation
    }
    if (!rawFilterSpec.props.name) {
      throw new Error(
        `Filter component=${rawFilterSpec.component} is missing required ` +
        `attribute "props.name".`)
    }
    return filterSpec
  }

  get filterApiUpdateDelayMilliseconds () {
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
    }, this.filterApiUpdateDelayMilliseconds)
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

  getFilterValue (filterName) {
    return this.state[this._getStateVariableNameForFilter(filterName)]
  }

  _refreshSingleAreaFilterSpecs(allFilters, filterSpecCache, defaultLocation, area, rawFilterSpecs) {
    const areaFilterMap = new Map()
    for (let rawFilterSpec of rawFilterSpecs) {
      const filterSpec = this.makeFilterSpec(rawFilterSpec, defaultLocation)
      allFilters.push(filterSpec)
      if (this.state[this._getStateVariableNameForFilter(filterSpec.props.name)] !== undefined) {
        throw new Error(
          `Multiple filters with the same name: ${filterSpec.props.name}`)
      }
      this._setFilterValueInState(filterSpec.props.name, filterSpec.initialValue)

      if (!areaFilterMap.has(filterSpec.props.location)) {
        areaFilterMap.set(filterSpec.props.location, [])
      }
      areaFilterMap.get(filterSpec.props.location).push(filterSpec)
    }
    filterSpecCache.set(area, areaFilterMap)
  }

  refreshFiltersCache (rawHeaderFilterSpecs, rawBodyFilterSpecs) {
    const allFilters = []
    const filterSpecCache = new Map()
    this._refreshSingleAreaFilterSpecs(
      allFilters, filterSpecCache, this.getDefaultHeaderFilterLocation(),
      RENDER_AREA_HEADER, rawHeaderFilterSpecs)
    this._refreshSingleAreaFilterSpecs(
      allFilters, filterSpecCache, this.getDefaultBodyFilterLocation(),
      RENDER_AREA_BODY, rawBodyFilterSpecs)
    filterSpecCache.set('all', allFilters)
    this.filterSpecCache = filterSpecCache
  }

  /**
   * Get the default render location for filters
   * that does not specify a location.
   */
  getDefaultHeaderFilterLocation () {
    return RENDER_LOCATION_TOP
  }

  /**
   * Get the default render location for filters
   * that does not specify a location.
   */
  getDefaultBodyFilterLocation () {
    return RENDER_LOCATION_RIGHT
  }

  /**
   * Can be overridden if you need to ignore props.headerFilterSpecs and
   * props.bodyFilterSpecs, and customize filters in a subclass.
   */
  getFiltersAtLocation (renderArea, location) {
    if (!this.filterSpecCache.has(renderArea)) {
      throw new Error(`Invalid renderArea: "${renderArea}".`)
    }
    return this.filterSpecCache.get(renderArea).get(location) || []
  }

  /**
   * Can be overridden if you need to ignore props.headerFilterSpecs and
   * props.bodyFilterSpecs, and customize filters in a subclass.
   *
   * @return An array of filter specs parsed by {@link AbstractFilterList#makeFilterSpec}
   */
  getAllFilters () {
    return this.filterSpecCache.get(RENDER_AREA_ALL)
  }

  /**
   * Refresh this.cachedListSpec.
   */
  refreshListSpec (rawListSpec) {
    const cachedListSpec = Object.assign({}, rawListSpec)
    if (cachedListSpec.component) {
      if (typeof cachedListSpec.component === 'string') {
        cachedListSpec.componentClass = this.filterListRegistry.getListComponent(cachedListSpec.component)
        if (!cachedListSpec.componentClass) {
          throw new Error(
            `Could not find a filterlist list component class registered for ` +
            `alias "${cachedListSpec.component}"`)
        }
      } else {
        cachedListSpec.componentClass = cachedListSpec.component
      }
    } else {
      throw new Error(
        'You must specify the "props.list", or override ' +
        'the refreshListSpec() method.')
    }
    if (!cachedListSpec.props) {
      cachedListSpec.props = {}
    }
    this.cachedListSpec = cachedListSpec
  }

  //
  //
  // List items
  //
  //

  /**
   * Refresh this.cachedItemSpec.
   */
  refreshItemSpec (rawItemSpec) {
    const cachedItemSpec = Object.assign({}, rawItemSpec)
    if (cachedItemSpec.component) {
      if (typeof cachedItemSpec.component === 'string') {
        cachedItemSpec.componentClass = this.filterListRegistry.getItemComponent(cachedItemSpec.component)
        if (!cachedItemSpec.componentClass) {
          throw new Error(
            `Could not find a filterlist item component class registered for ` +
            `alias "${cachedItemSpec.component}"`)
        }
      } else {
        cachedItemSpec.componentClass = cachedItemSpec.component
      }
    } else {
      throw new Error(
        'You must specify the "props.itemSpec", or override ' +
        'the refreshItemSpec() method.')
    }
    if (!cachedItemSpec.props) {
      cachedItemSpec.props = {}
    }
    this.cachedItemSpec = cachedItemSpec
  }

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
  // Paginator
  //
  //

  refreshPaginatorSpec (rawPaginatorSpec) {
    let cachedPaginatorSpec = null
    if (rawPaginatorSpec) {
      cachedPaginatorSpec = Object.assign({}, rawPaginatorSpec)
      if (cachedPaginatorSpec.component) {
        if (typeof cachedPaginatorSpec.component === 'string') {
          cachedPaginatorSpec.componentClass = this.filterListRegistry.getPaginatorComponent(cachedPaginatorSpec.component)
          if (!cachedPaginatorSpec.componentClass) {
            throw new Error(
              `Could not find a filterlist paginator component class registered for ` +
              `alias "${cachedPaginatorSpec.component}"`)
          }
        } else {
          cachedPaginatorSpec.componentClass = cachedPaginatorSpec.component
        }
      } else {
        throw new Error(
          'You must specify the "props.paginatorSpec", or override ' +
          'the refreshPaginatorSpec() method.')
      }
      if (!cachedPaginatorSpec.props) {
        cachedPaginatorSpec.props = {}
      }
    }
    this.cachedPaginatorSpec = cachedPaginatorSpec
  }

  //
  //
  // HTTP requests
  //
  //

  filterListItemsHttpRequest (httpRequest) {
    for (let filterSpec of this.getAllFilters()) {
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
   * @param paginationOptions
   */
  paginateListItemsHttpRequest (httpRequest, paginationOptions) {
    if (paginationOptions) {
      httpRequest.urlParser.queryString.setValuesFromObject(paginationOptions)
    }
  }

  makeListItemsHttpRequest (paginationOptions, filter=true) {
    const HttpRequestClass = this.getHttpRequestClass()
    const httpRequest = new HttpRequestClass(this.props.getItemsApiUrl)
    if (filter) {
      this.filterListItemsHttpRequest(httpRequest)
    }
    this.paginateListItemsHttpRequest(httpRequest, paginationOptions)
    return httpRequest
  }

  setLoadItemsFromApiErrorMessage (errorObject) {
    this.setState({
      loadItemsFromApiError: window.gettext('Failed to load list items from the server.')
    })
  }

  clearLoadItemsFromApiErrorMessage () {
    if (this.state.loadItemsFromApiError !== null) {
      this.setState({
        loadItemsFromApiError: null
      })
    }
  }

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
   * The default implementation assumes that a page number is available
   * in ``httpRequest.bodydata.page``.
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
   * @returns {object|null} Pagination options.
   */
  getFirstPagePaginationOptions (paginationState) {
    return null
  }

  getCurrentPaginationPage (paginationState) {
    return 1
  }

  /**
   * Get pagination options for the next page relative to the
   * currently active page.
   *
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
   * @returns {object|null} Pagination options. If this returns
   *    null, it means that there are no "previous" page.
   */
  getPreviousPagePaginationOptions (paginationState) {
    return null
  }

  /**
   * Get pagination options for a specific page number.
   *
   * @param {int} pageNumber The page number
   *
   * @returns {object} Pagination options
   */
  getSpecificPagePaginationOptions (pageNumber, paginationState) {
    throw new Error ('getSpecificPagePaginationOptions() is not implemented')
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
   * @param httpResponse The HTTP response. Will always be a
   *    subclass of HttpResponse from the ievv_jsbase library.
   * @param clearOldItems If this is ``true``, we replace the
   *    items displayed in the list with the items from the response.
   *    If it is ``false``, we append the new items to the items
   *    displayed in the list.
   * @returns {[]} An array containing raw data for list items.
   */
  makeNewItemsStateFromApiResponse (prevState, props, httpResponse, clearOldItems) {
    const newItemsArray = this.getItemsArrayFromHttpResponse(httpResponse)
    let listItemsDataArray;
    let listItemsDataMap;
    if (clearOldItems) {
      listItemsDataMap = new Map()
      listItemsDataArray = newItemsArray
    } else {
      prevState.listItemsDataArray.push(...newItemsArray)
      listItemsDataArray = prevState.listItemsDataArray
      listItemsDataMap = prevState.listItemsDataMap
    }
    for(let listItemData of newItemsArray) {
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
   * @param paginationOptions
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

  getLayoutComponentProps (extraProps={}) {
    return Object.assign({
      childExposedApi: this.childExposedApi,
      cachedPaginatorSpec: this.cachedPaginatorSpec,
      cachedListSpec: this.cachedListSpec,
      listItemsDataArray: this.state.listItemsDataArray,
      listItemsDataMap: this.state.listItemsDataMap,
      selectedListItemsMap: this.state.selectedListItemsMap,
      isLoadingNewItemsFromApi: this.state.isLoadingNewItemsFromApi,
      isLoadingMoreItemsFromApi: this.state.isLoadingMoreItemsFromApi
    }, extraProps)
  }

  getHeaderComponentClass () {
    return this.cachedHeaderSpec.componentClass
  }

  getHeaderComponentProps () {
    return this.getLayoutComponentProps({
      renderArea: RENDER_AREA_HEADER
    })
  }

  renderHeader () {
    if (!this.cachedHeaderSpec) {
      return null
    }
    return React.createElement(
      this.getHeaderComponentClass(),
      this.getHeaderComponentProps())
  }

  getBodyComponentClass () {
    return this.cachedBodySpec.componentClass
  }

  getBodyComponentProps () {
    return this.getLayoutComponentProps({
      renderArea: RENDER_AREA_BODY
    })
  }

  renderBody () {
    if (!this.cachedBodySpec) {
      return null
    }
    return React.createElement(
      this.getBodyComponentClass(),
      this.getBodyComponentProps())
  }

  render () {
    if (this.state.isLoadingSelectedItemDataFromApi) {
      return <LoadingIndicator/>
    } else {
      return <div className={this.props.className}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    }
  }
}
