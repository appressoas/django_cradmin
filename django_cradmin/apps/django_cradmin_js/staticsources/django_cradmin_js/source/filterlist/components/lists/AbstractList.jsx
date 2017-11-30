import React from 'react'
import PropTypes from 'prop-types'
import HttpDjangoJsonRequest from 'ievv_jsbase/lib/http/HttpDjangoJsonRequest'
import FilterListRegistrySingleton from '../../FilterListRegistry'
import {
  RENDER_LOCATION_BOTTOM, RENDER_LOCATION_LEFT, RENDER_LOCATION_RIGHT,
  RENDER_LOCATION_TOP
} from '../../filterListConstants'
import AbstractListItem from '../items/AbstractListItem'

/*
<AbstractList
  filters={[
    {
      "component": "AmountFilter",
      "props": {
        "name": "max_amount",
        "location": "left"
      },
      "initialValue": 10
    }
  ]}
  itemComponent={'MyItem'}
/>
*/

export default class AbstractList extends React.Component {
  static get propTypes() {
    return {
      bemBlock: PropTypes.string,
      getItemsApiUrl: PropTypes.string.isRequired,
      updateSingleItemSortOrderApiUrl: PropTypes.string,
      submitSelectedItemsApiUrl: PropTypes.string,
      filters: PropTypes.array,
      itemComponent: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(AbstractListItem)
      ]),
      idAttribute: PropTypes.string
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
      filters: [],
      idAttribute: 'id',
      itemComponent: 'IdOnly'
      // updateHttpMethod: 'post'
    }
  }

  constructor(props) {
    super(props)
    this.setupBoundMethods()
    this._filterApiUpdateTimeoutId = null
    this.filterListRegistry = new FilterListRegistrySingleton()
    this.state = this.getInitialState()
    this._filterSpecCache = new Map();
  }

  componentDidMount () {
    this._initializeFilters()
  }

  setupBoundMethods () {
    this.setFilterValue = this.setFilterValue.bind(this)
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
      currentPaginationOptions: null
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

  parseFilterSpec (filterSpec) {
    if(typeof filterSpec.component === 'string') {
      filterSpec.componentClass = this.filterListRegistry.getFilterComponent(filterSpec.component)
    } else {
      filterSpec.componentClass = filterSpec.component
    }
    if(!filterSpec.props) {
      throw new Error(
        `Filter component=${filterSpec.component} is missing required ` +
        `attribute "props".`)
    }
    if(!filterSpec.props.location) {
      filterSpec.props.location = this.getDefaultFilterLocation()
    }
    if(!filterSpec.props.name) {
      throw new Error(
        `Filter component=${filterSpec.component} is missing required ` +
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

  _setFilterValueInState (filterName, value, onComplete=() => {}) {
    if (value === undefined) {
      value = null
    }
    this.setState({
      [this._getStateVariableNameForFilter(filterName)]: value
    }, onComplete)
  }

  setFilterValue (filterName, value, noDelay=false) {
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

  _initializeFilters () {
    const filterSpecCache = new Map()
    const allFilters = []
    for(let filterSpec of this.props.filters) {
      filterSpec = this.parseFilterSpec(filterSpec)
      allFilters.push(filterSpec)
      if(this.state[this._getStateVariableNameForFilter(filterSpec.props.name)] !== undefined) {
        throw new Error(
          `Multiple filters with the same name: ${filterSpec.props.name}`)
      }
      this._setFilterValueInState(filterSpec.props.name, filterSpec.initialValue)

      if(!filterSpecCache.has(filterSpec.props.location)) {
        filterSpecCache.set(filterSpec.props.location, [])
      }
      filterSpecCache.get(filterSpec.props.location).push(filterSpec)
    }
    filterSpecCache.set('all', allFilters)
    this._filterSpecCache = filterSpecCache
  }

  /**
   * Can be overriden if you need to ignore props.filters, and customize
   * filters in a subclass.
   */
  getFiltersAtLocation (location) {
    return this._filterSpecCache.get(location) || []
  }

  /**
   * Can be overriden if you need to ignore props.filters, and customize
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
   * @param filter The filter we want to determine if should be rendered.
   * @returns {boolean} `true` to render the filter, and `false` to not render
   *    the filter. Defaults to `true` if not overridden.
   */
  shouldRenderFilter (filterSpec) {
    return true
  }

  getFilterComponentClass (filterSpec) {
    return filterSpec.componentClass
  }

  getFilterComponentProps(filterSpec) {
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

  getItemComponentClass (listItemData) {
    if (this.props.itemComponent) {
      if (typeof this.props.itemComponent === 'string') {
        const itemComponentClass = this.filterListRegistry.getItemComponent(this.props.itemComponent)
        if (itemComponentClass) {
          return itemComponentClass
        }
        throw new Error(
          `Could not find a filterlist item component class registered for ` +
          `alias "${this.props.itemComponent}"`)
      } else {
        return this.props.itemComponent
      }
    }
    throw new Error(
      'You must specify the "itemComponent" prop, or override ' +
      'the getItemComponentClass() method.')
  }

  getItemComponentProps (listItemData) {
    const listItemId = this.getIdFromListItemData(listItemData)
    return Object.assign({}, listItemData, {
      key: listItemId,
      isSelected: this.itemIsSelected(listItemData),
      listItemId: listItemId
    })
  }

  //
  //
  // HTTP requests
  //
  //

  filterListItemsHttpRequest (httpRequest) {
    for(let filterSpec of this.getAllFilters()) {
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
    httpRequest.urlParser.queryString.setValuesFromObject(paginationOptions)
  }

  makeListItemsHttpRequest(paginationOptions) {
    const httpRequestClass = this.getHttpRequestClass()
    const httpRequest = new httpRequestClass(this.props.getItemsApiUrl)
    this.filterListItemsHttpRequest(httpRequest)
    this.paginateListItemsHttpRequest(httpRequest, paginationOptions)
    return httpRequest.get()
  }

  setLoadItemsFromApiErrorMessage (error) {
    this.setState({
      loadItemsFromApiError: window.gettext('Failed to load list items from the server.')
    })
  }

  handleGetListItemsFromApiRequestError (error) {
    console.error('Error:', error.toString())
    this.setLoadItemsFromApiErrorMessage(error)
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
   * @returns {object} Pagination state object defining the current pagination
   *    state.
   */
  makePaginationStateFromHttpResponse (httpResponse) {
    return {
      page: httpResponse.bodydata.page
    }
  }

  /**
   * Get pagination options for the first paginated page.
   *
   * @returns {object|null} Pagination options.
   */
  getFirstPagePaginationOptions () {
    return {}
  }

  /**
   * Get pagination options for the next page relative to the
   * currently active page.
   *
   * @returns {object|null} Pagination options. If this returns
   *    null, it means that there are no "next" page.
   */
  getNextPagePaginationOptions () {
    if (this.state.currentPaginationOptions) {
      if(this.this.state.currentPaginationOptions.next === null) {
        return null
      }
      return {
        page: this.state.currentPaginationOptions.page + 1
      }
    }
    return {}
  }

  /**
   * Get pagination options for the previous page relative to the
   * currently active page.
   *
   * @returns {object|null} Pagination options. If this returns
   *    null, it means that there are no "previous" page.
   */
  getPreviousPagePaginationOptions() {
    if (this.state.currentPaginationOptions) {
      if(this.this.state.currentPaginationOptions.previous === null) {
        return null
      }
      return {
        page: this.state.currentPaginationOptions.page - 1
      }
    }
    return {}
  }

  /**
   * Get pagination options for a specific page number.
   *
   * @param {int} pageNumber The page number
   *
   * @returns {object} Pagination options
   */
  getSpecificPagePaginationOptions(pageNumber) {
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
  getPaginationPageCount() {
    return null
  }

  /**
   * Do we have a previous paginatable page?
   *
   * @returns {boolean}
   */
  hasPreviousPage() {
    return this.getPreviousPagePaginationOptions() !== null
  }

  /**
   * Do we have a next paginatable page?
   *
   * @returns {boolean}
   */
  hasNextPage() {
    return this.getNextPagePaginationOptions() !== null
  }

  /**
   * Get an array of list items raw data objects from an API response.
   *
   * @param httpResponse The HTTP response. Will always be a
   *    subclass of HttpResponse from the ievv_jsbase library.
   */
  getItemsArrayFromHttpResponse(httpResponse) {
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
    if(clearOldItems) {
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
  makeStateFromLoadItemsApiSuccessResponse(httpResponse, paginationOptions, clearOldItems) {
    return {
      isLoadingItemsFromApi: false,
      listItemsDataArray: this.makeNewItemsDataArrayFromApiResponse(
        httpResponse, clearOldItems),
      currentPaginationOptions: paginationOptions,
      paginationState: this.makePaginationStateFromHttpResponse(httpResponse)
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
      <span className='loading-indicator__indicator'/>
      <span className='loading-indicator__indicator'/>
      <span className='loading-indicator__indicator'/>
      <span className='loading-indicator__text'>
        {window.gettext('Loading ...')}
      </span>
    </span>
  }

  renderListItem(listItemData) {
    return React.createElement(
      this.getItemComponentClass(listItemData),
      this.getItemComponentProps(listItemData))
  }

  renderListItems () {
    const renderedListItems = []
    for(let listItemData of this.state.listItemsDataArray) {
      renderedListItems.push(this.renderListItem(listItemData))
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
    return this.renderFiltersAtLocation(RENDER_LOCATION_BOTTOM)
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
      this.renderTopBar(),
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
