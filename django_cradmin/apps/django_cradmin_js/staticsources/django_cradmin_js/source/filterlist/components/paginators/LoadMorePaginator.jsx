import React from 'react'
import PropTypes from 'prop-types'
import AbstractPaginator from './AbstractPaginator'
import 'ievv_jsbase/lib/utils/i18nFallbacks'

/**
 * Load more paginator.
 *
 * See {@link LoadMorePaginator.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "LoadMorePaginator"
 * }
 *
 * @example <caption>Spec - advanced</caption>
 * {
 *    "component": "LoadMorePaginator",
 *    "props": {
 *       "label": "Load some more items!",
 *       "className": "button button--primary",
 *       "location": "left"
 *    }
 * }
 */
export default class LoadMorePaginator extends AbstractPaginator {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.className = PropTypes.string.isRequired
    propTypes.label = PropTypes.string.isRequired
    return propTypes
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractPaginator.defaultProps}.
   *
   * @return {Object}
   * @property {string} className The CSS class name
   *    for the rendered button.
   *    This is required, and defaults to `'button'`.
   *    **Can be used in spec**.
   * @property {string} label The label of the button.
   *    This is required, and defaults to `'Load more'` (marked for translation).
   *    **Can be used in spec**.
   */
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
