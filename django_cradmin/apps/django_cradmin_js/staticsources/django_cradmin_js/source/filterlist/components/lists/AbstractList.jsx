import React from 'react'
import PropTypes from 'prop-types'
import HttpDjangoJsonRequest from 'ievv_jsbase/lib/http/HttpDjangoJsonRequest'
import FilterListRegistrySingleton from '../../FilterListRegistry'
import {
  RENDER_LOCATION_BOTTOM, RENDER_LOCATION_LEFT, RENDER_LOCATION_RIGHT,
  RENDER_LOCATION_TOP
} from '../../filterListConstants'

/*
<AbstractList
  filterSpecs={[
    {
      component: "AmountFilter",
      props: {
        "name: "max_amount",
        location: "left"
      },
      initialValue: 10
    }
  ]}
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

export default class AbstractList extends React.Component {
  static get propTypes () {
    return {
      idAttribute: PropTypes.string.isRequired,
      filterSpecs: PropTypes.array,
      itemSpec: PropTypes.object.isRequired,
      paginatorSpec: PropTypes.object.isRequired,
      getItemsApiUrl: PropTypes.string.isRequired,
      updateSingleItemSortOrderApiUrl: PropTypes.string,
      submitSelectedItemsApiUrl: PropTypes.string,
      bemBlock: PropTypes.string.isRequired
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
      bemBlock: 'filterlist',
      filterSpecs: [],
      idAttribute: 'id',
      itemSpec: {
        'component': 'IdOnly'
      },
      paginatorSpec: {
        'component': 'LoadMore'
      }
      // updateHttpMethod: 'post'
    }
  }

  constructor (props) {
    super(props)
    this.setupBoundMethods()
    this._filterApiUpdateTimeoutId = null
    this.filterListRegistry = new FilterListRegistrySingleton()
    this.state = this.getInitialState()
    this.filterSpecCache = new Map()
    this.cachedItemSpec = null
    this.cachedPaginatorSpec = null
    this.refreshItemSpec(this.props.itemSpec)
    this.refreshPaginatorSpec(this.props.paginatorSpec)
  }

  componentDidMount () {
    this.refreshFiltersCache(this.props.filterSpecs)
  }

  componentWillReceiveProps (nextProps) {
    this.refreshItemSpec(nextProps.itemSpec)
    this.refreshPaginatorSpec(nextProps.paginatorSpec)
    this.refreshFiltersCache(nextProps.filterSpecs)
  }

  setupBoundMethods () {
    this.setFilterValue = this.setFilterValue.bind(this)
    this.loadMoreItemsFromApi = this.loadMoreItemsFromApi.bind(this)
    this.loadNextPageFromApi = this.loadNextPageFromApi.bind(this)
    this.loadPreviousPageFromApi = this.loadPreviousPageFromApi.bind(this)
    this.loadSpecificPageFromApi = this.loadSpecificPageFromApi.bind(this)
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
      isLoadingItemsFromApi: false,
      paginationState: {}
    }
  }

  /**
   * Get the default render location for filters
   * that does not specify a location.
   */
  getDefaultFilterLocation () {
    return RENDER_LOCATION_RIGHT
  }

  isLoading () {
    // TODO: Include state variables for update too
    return this.state.isLoadingItemsFromApi
  }

  //
  //
  // Filters
  //
  //

  makeFilterSpec (rawFilterSpec) {
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
      filterSpec.props.location = this.getDefaultFilterLocation()
    }
    if (!rawFilterSpec.props.name) {
      throw new Error(
        `Filter component=${rawFilterSpec.component} is missing required ` +
        `attribute "props.name".`)
    }
    return filterSpec
  }

  get filterApiUpdateDelayMilliseconds () {
    return 200
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

  refreshFiltersCache (rawFilterSpecs) {
    const filterSpecCache = new Map()
    const allFilters = []
    for (let rawFilterSpec of rawFilterSpecs) {
      const filterSpec = this.makeFilterSpec(rawFilterSpec)
      allFilters.push(filterSpec)
      if (this.state[this._getStateVariableNameForFilter(filterSpec.props.name)] !== undefined) {
        throw new Error(
          `Multiple filters with the same name: ${filterSpec.props.name}`)
      }
      this._setFilterValueInState(filterSpec.props.name, filterSpec.initialValue)

      if (!filterSpecCache.has(filterSpec.props.location)) {
        filterSpecCache.set(filterSpec.props.location, [])
      }
      filterSpecCache.get(filterSpec.props.location).push(filterSpec)
    }
    filterSpecCache.set('all', allFilters)
    this.filterSpecCache = filterSpecCache
  }

  /**
   * Can be overridden if you need to ignore props.filterSpecs, and customize
   * filters in a subclass.
   */
  getFiltersAtLocation (location) {
    return this.filterSpecCache.get(location) || []
  }

  /**
   * Can be overridden if you need to ignore props.filterSpecs, and customize
   * filters in a subclass.
   */
  getAllFilters () {
    return this.getFiltersAtLocation('all')
  }

  /**
   * Determine if a filter should be rendered.
   *
   * Perfect place to hook in things like "show advanced" filters etc.
   * in subclasses.
   *
   * @param filterSpec The filter we want to determine if should be rendered.
   * @returns {boolean} `true` to render the filter, and `false` to not render
   *    the filter. Defaults to `true` if not overridden.
   */
  shouldRenderFilter (filterSpec) {
    return true
  }

  getFilterComponentClass (filterSpec) {
    return filterSpec.componentClass
  }

  getFilterComponentProps (filterSpec) {
    return Object.assign({}, filterSpec.props, {
      setFilterValueCallback: this.setFilterValue,
      value: this.getFilterValue(filterSpec.props.name),
      key: filterSpec.props.name
    })
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

  itemIsSelected (listItemData) {
    return false
  }

  getIdFromListItemData (listItemData) {
    if (this.props.idAttribute) {
      return listItemData[this.props.idAttribute]
    }
    throw new Error(
      'You have to specify the "idAttribute" prop, ' +
      'or override the getIdFromListItemData() method.')
  }

  shouldRenderListItem (listItemData) {
    return true
  }

  getItemComponentClass (listItemData) {
    return this.cachedItemSpec.componentClass
  }

  getItemComponentProps (listItemData) {
    const listItemId = this.getIdFromListItemData(listItemData)
    return Object.assign({}, listItemData, this.cachedItemSpec.props, {
      key: listItemId,
      isSelected: this.itemIsSelected(listItemData),
      listItemId: listItemId
    })
  }

  //
  //
  // Paginator
  //
  //

  refreshPaginatorSpec (rawPaginatorSpec) {
    let cachedPaginatorSpec = Object.assign({}, rawPaginatorSpec)
    if (cachedPaginatorSpec) {
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
    } else {
      cachedPaginatorSpec = null
    }
    this.cachedPaginatorSpec = cachedPaginatorSpec
  }

  getPaginatorComponentClass () {
    return this.cachedPaginatorSpec.componentClass
  }

  getPaginatorComponentProps () {
    return Object.assign({}, {
      key: 'paginator',
      paginationState: this.state.paginationState,
      loadMoreItemsFromApi: this.loadMoreItemsFromApi,
      loadNextPageFromApi: this.loadNextPageFromApi,
      loadPreviousPageFromApi: this.loadPreviousPageFromApi,
      loadSpecificPageFromApi: this.loadSpecificPageFromApi,
      hasNextPage: this.hasNextPaginationPage(),
      hasPreviousPage: this.hasPreviousPaginationPage()
    }, this.cachedPaginatorSpec.props)
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

  makeListItemsHttpRequest (paginationOptions) {
    const HttpRequestClass = this.getHttpRequestClass()
    const httpRequest = new HttpRequestClass(this.props.getItemsApiUrl)
    this.filterListItemsHttpRequest(httpRequest)
    this.paginateListItemsHttpRequest(httpRequest, paginationOptions)
    return httpRequest.get()
  }

  setLoadItemsFromApiErrorMessage (errorObject) {
    this.setState({
      loadItemsFromApiError: window.gettext('Failed to load list items from the server.')
    })
  }

  handleGetListItemsFromApiRequestError (errorObjet) {
    console.error('Error:', errorObjet.toString())
    this.setLoadItemsFromApiErrorMessage(errorObjet)
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
    let page = 1
    if (paginationOptions && paginationOptions.page) {
      page = paginationOptions.page
    }
    return {
      page: page,
      next: httpResponse.bodydata.next,
      previous: httpResponse.bodydata.previous,
      count: httpResponse.bodydata.count
    }
  }

  /**
   * Get pagination options for the first paginated page.
   *
   * @returns {object|null} Pagination options.
   */
  getFirstPagePaginationOptions () {
    return null
  }

  getCurrentPaginationPage () {
    if (this.state.paginationState && this.state.paginationState.page) {
      return this.state.paginationState.page
    }
    return 1
  }

  /**
   * Get pagination options for the next page relative to the
   * currently active page.
   *
   * @returns {object|null} Pagination options. If this returns
   *    null, it means that there are no "next" page.
   */
  getNextPagePaginationOptions () {
    if (this.state.paginationState) {
      if (this.state.paginationState.next === null) {
        return null
      }
      return {
        page: this.getCurrentPaginationPage() + 1
      }
    }
    return null
  }

  /**
   * Get pagination options for the previous page relative to the
   * currently active page.
   *
   * @returns {object|null} Pagination options. If this returns
   *    null, it means that there are no "previous" page.
   */
  getPreviousPagePaginationOptions () {
    if (this.state.paginationState) {
      if (this.state.paginationState.previous === null) {
        return null
      }
      return {
        page: this.getCurrentPaginationPage() - 1
      }
    }
    return null
  }

  /**
   * Get pagination options for a specific page number.
   *
   * @param {int} pageNumber The page number
   *
   * @returns {object} Pagination options
   */
  getSpecificPagePaginationOptions (pageNumber) {
    return {
      page: pageNumber
    }
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
  getPaginationPageCount () {
    return this.state.paginationState.count
  }

  /**
   * Do we have a previous paginatable page?
   *
   * @returns {boolean}
   */
  hasPreviousPaginationPage () {
    return this.getPreviousPagePaginationOptions() !== null
  }

  /**
   * Do we have a next paginatable page?
   *
   * @returns {boolean}
   */
  hasNextPaginationPage () {
    return this.getNextPagePaginationOptions() !== null
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
  makeNewItemsDataArrayFromApiResponse (httpResponse, clearOldItems) {
    const newItemsArray = this.getItemsArrayFromHttpResponse(httpResponse)
    if (clearOldItems) {
      return newItemsArray
    } else {
      return this.state.listItemsDataArray.concat(newItemsArray)
    }
  }

  /**
   * Make react state variables from a successful load items from API HTTP response.
   *
   * You should normally not need to override this method.
   * It should normally be enough to override
   * {@link makeNewItemsDataArrayFromApiResponse}
   * and {@link makePaginationStateFromHttpResponse}
   *
   * @param httpResponse The HTTP response. Will always be a
   *    subclass of HttpResponse from the ievv_jsbase library.
   * @param paginationOptions Pagination options normally created
   *    with {@link getNextPagePaginationOptions},
   *    {@link getNextPagePaginationOptions}, {@link getPreviousPagePaginationOptions}
   *    or {@link getSpecificPagePaginationOptions}.
   * @param clearOldItems See {@link makeNewItemsDataArrayFromApiResponse}.
   * @returns {object}
   */
  makeStateFromLoadItemsApiSuccessResponse (httpResponse, paginationOptions, clearOldItems) {
    return {
      isLoadingItemsFromApi: false,
      listItemsDataArray: this.makeNewItemsDataArrayFromApiResponse(
        httpResponse, clearOldItems),
      paginationState: this.makePaginationStateFromHttpResponse(httpResponse, paginationOptions)
    }
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
   * @param clearOldItems
   * @returns {Promise}
   */
  loadItemsFromApi (paginationOptions, clearOldItems) {
    return new Promise((resolve, reject) => {
      this.setState({
        isLoadingItemsFromApi: true
      }, () => {
        this.makeListItemsHttpRequest(paginationOptions)
          .then((httpResponse) => {
            resolve({
              httpResponse: httpResponse,
              newState: this.makeStateFromLoadItemsApiSuccessResponse(
                httpResponse, paginationOptions, clearOldItems)
            })
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
    this.loadItemsFromApi(this.getFirstPagePaginationOptions(), true)
      .then((result) => {
        this.setState(result.newState)
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
    this.loadItemsFromApi(this.getNextPagePaginationOptions(), false)
      .then((result) => {
        this.setState(result.newState)
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
    this.loadItemsFromApi(this.getNextPagePaginationOptions(), true)
      .then((result) => {
        this.setState(result.newState)
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
    this.loadItemsFromApi(this.getPreviousPagePaginationOptions(), true)
      .then((result) => {
        this.setState(result.newState)
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
    this.loadItemsFromApi(this.getSpecificPagePaginationOptions(pageNumber), true)
      .then((result) => {
        this.setState(result.newState)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  //
  //
  // Css classes
  //
  //

  get leftColumnClassName () {
    return `${this.props.bemBlock}__leftcolumn`
  }

  get centerColumnClassName () {
    return `${this.props.bemBlock}__centercolumn`
  }

  get rightColumnClassName () {
    return `${this.props.bemBlock}__rightcolumn`
  }

  get topBarClassName () {
    return `${this.props.bemBlock}__topbar`
  }

  get listClassName () {
    return `${this.props.bemBlock}__list`
  }

  get bottomBarClassName () {
    return `${this.props.bemBlock}__bottombar`
  }

  //
  //
  // Rendering
  //
  //

  renderLoadingIndicator () {
    return <span className='loading-indicator' key={'loadingIndicator'}>
      <span className='loading-indicator__indicator' />
      <span className='loading-indicator__indicator' />
      <span className='loading-indicator__indicator' />
      <span className='loading-indicator__text'>
        {window.gettext('Loading ...')}
      </span>
    </span>
  }

  renderPaginator () {
    if (!this.cachedPaginatorSpec) {
      return null
    }
    return React.createElement(
      this.getPaginatorComponentClass(),
      this.getPaginatorComponentProps())
  }

  renderListItem (listItemData) {
    return React.createElement(
      this.getItemComponentClass(listItemData),
      this.getItemComponentProps(listItemData))
  }

  renderListItems () {
    const renderedListItems = []
    for (let listItemData of this.state.listItemsDataArray) {
      if (this.shouldRenderListItem(listItemData)) {
        renderedListItems.push(this.renderListItem(listItemData))
      }
    }
    return renderedListItems
  }

  renderList () {
    return <div className={this.listClassName} key={'itemList'}>
      {this.renderListItems()}
    </div>
  }

  renderFilter (filterSpec) {
    return React.createElement(
      this.getFilterComponentClass(filterSpec),
      this.getFilterComponentProps(filterSpec))
  }

  renderFiltersAtLocation (location) {
    const renderedFilters = []
    for (let filterSpec of this.getFiltersAtLocation(location)) {
      if (this.shouldRenderFilter(filterSpec)) {
        renderedFilters.push(this.renderFilter(filterSpec))
      }
    }
    return renderedFilters
  }

  renderLeftColumnContent () {
    return this.renderFiltersAtLocation(RENDER_LOCATION_LEFT)
  }

  renderLeftColumn () {
    const content = this.renderLeftColumnContent()
    if (content) {
      return <div className={this.leftColumnClassName} key={'leftColumn'}>
        {content}
      </div>
    }
    return null
  }

  renderTopBarContent () {
    return this.renderFiltersAtLocation(RENDER_LOCATION_TOP)
  }

  renderTopBar () {
    const content = this.renderTopBarContent()
    if (content) {
      return <div className={this.topBarClassName} key={'topBar'}>
        {content}
      </div>
    }
    return null
  }

  renderBottomBarContent () {
    return [
      ...this.renderFiltersAtLocation(RENDER_LOCATION_BOTTOM),
      this.renderPaginator()
    ]
  }

  renderBottomBar () {
    const content = this.renderBottomBarContent()
    if (content) {
      return <div className={this.bottomBarClassName} key={'bottomBar'}>
        {content}
      </div>
    }
    return null
  }

  renderRightColumnContent () {
    return this.renderFiltersAtLocation(RENDER_LOCATION_RIGHT)
  }

  renderRightColumn () {
    const content = this.renderRightColumnContent()
    if (content) {
      return <div className={this.rightColumnClassName} key={'rightColumn'}>
        {content}
      </div>
    }
    return null
  }

  renderCenterColumnContent () {
    const centerColumnContent = [
      this.renderTopBar()
    ]
    if (this.isLoading()) {
      centerColumnContent.push(this.renderLoadingIndicator())
    } else {
      centerColumnContent.push(this.renderList())
    }
    centerColumnContent.push(this.renderBottomBar())
    return centerColumnContent
  }

  renderCenterColumn () {
    return <div className={this.centerColumnClassName} key={'centerColumn'}>
      {this.renderCenterColumnContent()}
    </div>
  }

  renderContent () {
    return [
      this.renderLeftColumn(),
      this.renderCenterColumn(),
      this.renderRightColumn()
    ]
  }

  render () {
    return <div className={this.props.bemBlock}>
      {this.renderContent()}
    </div>
  }
}
