import React from 'react'
import PropTypes from 'prop-types'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import AbstractListChild from '../AbstractListChild'
import LoadingIndicator from '../../../components/LoadingIndicator'

export default class AbstractLayout extends AbstractListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      cachedPaginatorSpec: PropTypes.object.isRequired,
      cachedListSpec: PropTypes.object.isRequired,
      listItemsDataArray: PropTypes.array.isRequired,
      listItemsDataMap: PropTypes.map.isRequired,
      selectedListItemsMap: PropTypes.map.isRequired,
      isLoadingNewItemsFromApi: PropTypes.bool.isRequired,
      isLoadingMoreItemsFromApi: PropTypes.bool.isRequired
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      cachedPaginatorSpec: null,
      listItemsDataArray: [],
      listItemsDataMap: new Map(),
      selectedListItemsMap: new Map(),
      isLoadingNewItemsFromApi: false,
      isLoadingMoreItemsFromApi: false
    })
  }

  //
  //
  // Rendering
  //
  //

  renderLoadingIndicator () {
    return <LoadingIndicator/>
  }

  getPaginatorComponentClass () {
    return this.props.cachedPaginatorSpec.componentClass
  }

  getPaginatorComponentProps () {
    return this.makeChildComponentProps(Object.assign({
      key: 'paginator',
    }, this.props.cachedPaginatorSpec.props))
  }

  renderPaginator () {
    if (!this.cachedPaginatorSpec) {
      return null
    }
    return React.createElement(
      this.getPaginatorComponentClass(),
      this.getPaginatorComponentProps())
  }

  getListComponentClass () {
    return this.props.cachedListSpec.componentClass
  }

  getListComponentProps () {
    return this.makeChildComponentProps(Object.assign({
      key: 'list',
      cachedItemSpec: this.props.cachedItemSpec
    }, this.props.cachedListSpec.props))
  }

  renderList () {
    if (!this.cachedListSpec) {
      return null
    }
    return React.createElement(
      this.getListComponentClass(),
      this.getListComponentProps())
  }

  /**
   * Determine if a filter should be rendered.
   *
   * Perfect place to hook in things like "show advanced" filters etc.
   * in subclasses.
   *
   * @param cachedFilterSpec The filter we want to determine if should be rendered.
   * @returns {boolean} `true` to render the filter, and `false` to not render
   *    the filter. Returns `true` by default.
   */
  shouldRenderFilter (cachedFilterSpec) {
    return true
  }

  getFilterComponentClass (cachedFilterSpec) {
    return cachedFilterSpec.componentClass
  }

  getFilterComponentProps (cachedFilterSpec) {
    return this.makeChildComponentProps(Object.assign(cachedFilterSpec.props, {
      value: this.props.childExposedApi.getFilterValue(cachedFilterSpec.props.name),
      key: cachedFilterSpec.props.name
    }))
  }

  renderFilter (cachedFilterSpec) {
    return React.createElement(
      this.getFilterComponentClass(cachedFilterSpec),
      this.getFilterComponentProps(cachedFilterSpec))
  }

  getFiltersAtLocation (location) {
    this.props.childExposedApi.getFiltersAtLocation(this.props.renderArea, location)
  }

  renderFiltersAtLocation (location) {
    const renderedFilters = []
    for (let cachedFilterSpec of this.getFiltersAtLocation(location)) {
      if (this.shouldRenderFilter(cachedFilterSpec)) {
        renderedFilters.push(this.renderFilter(cachedFilterSpec))
      }
    }
    if(renderedFilters.length === 0) {
      return null
    }
    return renderedFilters
  }
}
