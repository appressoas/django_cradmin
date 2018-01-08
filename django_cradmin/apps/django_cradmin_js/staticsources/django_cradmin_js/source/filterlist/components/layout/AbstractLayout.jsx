import React from 'react'
import PropTypes from 'prop-types'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import AbstractListChild from '../AbstractListChild'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { RENDER_AREA_HEADER } from '../../filterListConstants'
import AbstractListFilter from '../filters/AbstractListFilter'
import AbstractList from '../lists/AbstractList'
import AbstractPaginator from '../paginators/AbstractPaginator'

export default class AbstractLayout extends AbstractListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      layout: PropTypes.object.isRequired,
      listItemsDataArray: PropTypes.array.isRequired,
      listItemsDataMap: PropTypes.instanceOf(Map).isRequired,
      selectedListItemsMap: PropTypes.instanceOf(Map).isRequired,
      isLoadingNewItemsFromApi: PropTypes.bool.isRequired,
      isLoadingMoreItemsFromApi: PropTypes.bool.isRequired
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      layout: null,
      listItemsDataArray: null,
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

  renderLoadingIndicator (keySuffix='') {
    return <LoadingIndicator key={`loadingIndicator${keySuffix}`}/>
  }

  // getPaginatorComponentClass () {
  //   return this.props.cachedPaginatorSpec.componentClass
  // }
  //
  // getPaginatorComponentProps () {
  //   return this.makeChildComponentProps(Object.assign({
  //     key: 'paginator',
  //   }, this.props.cachedPaginatorSpec.props))
  // }

  // renderPaginator () {
  //   if (!this.cachedPaginatorSpec) {
  //     return null
  //   }
  //   return React.createElement(
  //     this.getPaginatorComponentClass(),
  //     this.getPaginatorComponentProps())
  // }

  // getListComponentClass () {
  //   return this.props.cachedListSpec.componentClass
  // }
  //
  // getListComponentProps () {
  //   return this.makeChildComponentProps(Object.assign({
  //     key: 'list',
  //     cachedItemSpec: this.props.cachedItemSpec,
  //     listItemsDataArray: this.props.listItemsDataArray,
  //     selectedListItemsMap: this.props.selectedListItemsMap
  //   }, this.props.cachedListSpec.props))
  // }

  renderAreaIsHeader () {
    return this.props.renderArea === RENDER_AREA_HEADER
  }

  // renderList () {
  //   if (!this.props.cachedListSpec || this.renderAreaIsHeader()) {
  //     return null
  //   }
  //   return React.createElement(
  //     this.getListComponentClass(),
  //     this.getListComponentProps())
  // }

  /**
   * Determine if a component should be rendered.
   *
   * Perfect place to hook in things like "show advanced" filters etc.
   * in subclasses.
   *
   * @param componentSpec The filter we want to determine if should be rendered.
   * @returns {boolean} `true` to render the filter, and `false` to not render
   *    the filter. Returns `true` by default.
   */
  shouldRenderComponent (componentSpec) {
    return true
  }

  getFilterComponentProps (componentSpec) {
    return {
      value: this.props.childExposedApi.getFilterValue(componentSpec.props.name)
    }
  }

  getListComponentProps (componentSpec) {
    return {
      listItemsDataArray: this.props.listItemsDataArray,
      selectedListItemsMap: this.props.selectedListItemsMap
    }
  }

  getPaginatorComponentProps (componentSpec) {
    return {
      listItemsDataArray: this.props.listItemsDataArray
    }
  }

  getComponentProps (componentSpec) {
    let extraProps = {}
    if (componentSpec.componentClass.prototype instanceof AbstractListFilter) {
      extraProps = this.getFilterComponentProps(componentSpec)
    } else if (componentSpec.componentClass.prototype instanceof AbstractList) {
      extraProps = this.getListComponentProps(componentSpec)
    } else if (componentSpec.componentClass.prototype instanceof AbstractPaginator) {
      extraProps = this.getPaginatorComponentProps(componentSpec)
    }
    return this.makeChildComponentProps(Object.assign(componentSpec.props, {
      key: componentSpec.props.uniqueComponentKey
    }, extraProps))
  }

  renderComponent (componentSpec) {
    return React.createElement(
      componentSpec.componentClass,
      this.getComponentProps(componentSpec))
  }

  renderComponentsAtLocation (location, fallback=null) {
    const renderedComponents = []
    for (let componentSpec of this.props.layout.getComponentsAtLocation(location)) {
      if (this.shouldRenderComponent(componentSpec)) {
        renderedComponents.push(this.renderComponent(componentSpec))
      }
    }
    if(renderedComponents.length === 0) {
      return fallback
    }
    return renderedComponents
  }
}
