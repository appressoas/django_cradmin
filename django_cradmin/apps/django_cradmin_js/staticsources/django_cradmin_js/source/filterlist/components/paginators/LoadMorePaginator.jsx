import React from 'react'
import PropTypes from 'prop-types'
import AbstractPaginator from './AbstractPaginator'

export default class LoadMorePaginator extends AbstractPaginator {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.loadMoreItemsFromApi = PropTypes.func.isRequired
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
    this.props.loadMoreItemsFromApi()
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
    if (this.props.hasNextPage) {
      return this.renderLoadMoreButton()
    }
    return null
  }
}
