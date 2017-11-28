import React from "react";
import ReactDOM from "react-dom";
import HttpDjangoJsonRequest from 'ievv_jsbase/lib/http/HttpDjangoJsonRequest'
import FilterListRegistrySingleton from '../FilterListRegistry'
import { List as ImmutableList } from 'immutable'
import { RENDER_LOCATION_RIGHT } from './filterListConstants'

/*
<AbstractList
  filters={[
    {
      "component": "AmountFilter",
      "props": {
        "name": "max_amount",
        "location": "left"
      }
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
      itemComponent: PropTypes.object,
      idAttribute: PropTypes.string.isRequired
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
      idAttribute: 'id'
      // updateHttpMethod: 'post'
    }
  }

  get defaultFilterLocation () {
    return RENDER_LOCATION_RIGHT
  }

  constructor(props) {
    super(props)
    this._filtersCache = null
    this.filterListRegistry = new FilterListRegistrySingleton()
    this.state = this.getInitialState()
  }

  getInitialState () {
    return {
      itemsRawData: ImmutableList(),
      currentPaginationOptions: null
    }
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
    if(!filterSpec.location) {
      filterSpec.location = this.defaultFilterLocation
    }
    return filterSpec
  }

  refreshFiltersCache () {
    this._filtersCache = new Map()
    const allFilters = []
    for(let filterSpec of this.props.filters) {
      filterSpec = this.parseFilterSpec(filterSpec)
      allFilters.push(filterSpec)
      if(!this._filtersCache.has(filterSpec.location)) {
        this._filtersCache.set(filterSpec.location, [])
      }
      this._filtersCache.get(filterSpec.location).push(filterSpec)
    }
    this._filtersCache.set('all', allFilters)
  }

  /**
   * Can be overriden if you need to ignore props.filters, and customize
   * filters in a subclass.
   */
  getFiltersAtLocation (location) {
    if(this._filtersCache) {
      this.refreshFiltersCache()
    }
    return this._filtersCache.get(location)
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

  getFilterProps (filterSpec) {

  }


  //
  //
  // List items
  //
  //

  itemIsSelected (listItemData) {

  }

  //
  //
  // HTTP requests
  //
  //

  filterListItemsHttpRequest (httpRequest) {
    for(let filterSpec of this.getAllFilters()) {
      const filterState = {}  // TODO: Get from somewhere
      filterSpec.componentClass.filterHttpRequest(httpRequest, filterState)
    }
  }

  get httpRequestClass () {
    return HttpDjangoJsonRequest
  }

  paginateListItemsHttpRequest (httpRequest, paginationOptions) {
    httpRequest.urlParser.queryString.setValuesFromObject(paginationOptions)
  }

  makeListItemsHttpRequest(paginationOptions) {
    const httpRequest = new this.httpRequestClass(this.props.getItemsApiUrl)
    this.filterListItemsHttpRequest(httpRequest)
    this.paginateListItemsHttpRequest(httpRequest, paginationOptions)
    return httpRequest.get()
  }

  handleGetListItemsFromApiRequestError (error) {
    console.error('Error:', error.toString());
  }

  makePaginationStateFromHttpResponse(httpResponse) {
    return {
      page: httpResponse.bodydata.page
    }
  }

  getNextPagePaginationOptions() {
    if (this.state.currentPaginationOptions) {
      return {
        page: this.state.currentPaginationOptions.page + 1
      }
    }
    return this.props.getItemsApiUrl
  }

  getPreviousPagePaginationOptions() {
    return null
  }

  hasPreviousPage() {
    return this.getPreviousPagePaginationOptions() !== null
  }

  hasNextPage() {
    return this.getNextPagePaginationOptions() !== null
  }

  getItemsArrayFromHttpResponse(httpResponse) {
    return httpResponse.bodydata.results
  }

  makeNewItemsRawDataFromApiResponse (httpResponse, clearOldItems) {
    let itemsRawData;
    if(clearOldItems) {
      itemsRawData = ImmutableList()
    } else {
      itemsRawData = this.state.itemsRawData
    }
    itemsRawData.push(...this.getItemsArrayFromHttpResponse(httpResponse))
    return itemsRawData
  }

  makeStateFromLoadItemsApiResponse(httpResponse, paginationOptions, clearOldItems) {
    return {
      itemsRawData: this.makeNewItemsRawDataFromApiResponse(
        httpResponse, clearOldItems),
      currentPaginationOptions: paginationOptions,
      paginationState: this.makePaginationStateFromHttpResponse(httpResponse)
    }
  }

  loadItemsFromApi (paginationOptions, clearOldItems) {
    return new Promise((reject, resolve) => {
      this.makeListItemsHttpRequest(paginationOptions)
        .then((httpResponse) => {
          resolve({
            httpResponse: httpResponse,
            newState: this.makeStateFromLoadItemsApiResponse(
              httpResponse, paginationOptions, clearOldItems)
          })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  loadMoreItemsFromApi () {
    this.loadItemsFromApi(this.getNextPagePaginationOptions(), false)
      .then((result) => {
        this.setState(result.newState)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  loadNextPageFromApi () {
    this.loadItemsFromApi(this.getNextPagePaginationOptions(), true)
      .then((result) => {
        this.setState(result.newState)
      })
      .catch((error) => {
        this.handleGetListItemsFromApiRequestError(error)
      })
  }

  loadPreviousPageFromApi () {
    this.loadItemsFromApi(this.getPreviousPagePaginationOptions(), true)
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
    return `${this.props.className}__leftcolumn`
  }

  get centerColumnClassName () {
    return `${this.props.className}__centercolumn`
  }

  get rightColumnClassName () {
    return `${this.props.className}__rightcolumn`
  }

  get topBarClassName () {
    return `${this.props.className}__topbar`
  }

  get listClassName () {
    return `${this.props.className}__list`
  }

  get bottomBarClassName () {
    return `${this.props.className}__bottombar`
  }

  //
  //
  // Rendering
  //
  //

  renderLeftColumn () {
    return null
  }

  renderTopBar () {
    return null
  }

  renderListItems () {
    const renderedListItems = []
    return renderedListItems
  }

  renderList () {
    return <div className={this.listClassName}>
      {this.renderListItems()}
    </div>
  }

  renderBottomBar () {
    return null
  }

  renderCenterColumn () {
    return <div className={this.centerColumnClassName}>
      {this.renderTopBar()}
      {this.renderList()}
      {this.renderBottomBar()}
    </div>
  }

  renderRightColumn () {
    return null
  }

  render () {
    return <div className={this.props.bemBlock}>
      {this.renderLeftColumn()}
      {this.renderCenterColumn()}
      {this.renderRightColumn()}
    </div>
  }
}
