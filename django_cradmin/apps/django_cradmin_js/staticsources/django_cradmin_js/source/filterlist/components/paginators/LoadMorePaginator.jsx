import React from 'react'
import PropTypes from 'prop-types'
import AbstractPaginator from './AbstractPaginator'
import 'ievv_jsbase/lib/utils/i18nFallbacks'

export default class LoadMorePaginator extends AbstractPaginator {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.className = PropTypes.string.isRequired
    propTypes.label = PropTypes.string.isRequired
    return propTypes
  }

  static get defaultProps () {
    const defaultProps = super.defaultProps
    defaultProps.className = 'button'
    defaultProps.label = window.gettext('Load more')
    return defaultProps
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    this.props.childExposedApi.loadMoreItemsFromApi()
  }

  renderLoadMoreButton () {
    return <button type={'button'}
      className={this.props.className}
      onClick={this.onClick}
    >
      {this.props.label}
    </button>
  }

  render () {
    if (this.props.childExposedApi.hasNextPaginationPage()) {
      return this.renderLoadMoreButton()
    }
    return null
  }
}
