import React from "react";
import ReactDOM from "react-dom";

/*
<AbstractList
  filters={[
    {
      "component": "AmountFilter",
      "props": {
        "name": "max_amount",
        "location": "leftColumn"
      }
    }
  ]}
  itemComponent={'MyItem'}
  searchComponent={'MySearchComponent'}
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

  static get defaultProps() {
    return {
      bemBlock: 'filterlist',
      filters: []
      // updateHttpMethod: 'post'
    }
  }

  static renderLocations = {
    leftColumn: 'leftColumn',
    rightColumn: 'rightColumn',
    topBar: 'topBar',
    bottomBar: 'bottomBar'
  }

  constructor(props) {
    super(props)

    // TODO: Handle filters defined as Objects
    this.filters = this.props.filters
  }

  /**
   * Can be overriden if you need to ignore props.filters, and customize
   * filters in a subclass.
   */
  getFilters() {
    return this.filters
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
  shouldRenderFilter (filterClass, filterProps) {
    return true
  }

  getFilterProps (filterClass) {

  }

  itemIsSelected (listItemData) {

  }

  filterHttpRequest (httpRequest) {
    for(let filter of this.getFilters()) {
      filter.filterHttpRequest(httpRequest)
    }
  }

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
