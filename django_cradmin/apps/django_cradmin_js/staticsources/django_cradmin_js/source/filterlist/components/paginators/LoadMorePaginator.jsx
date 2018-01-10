import React from 'react'
import PropTypes from 'prop-types'
import AbstractPaginator from './AbstractPaginator'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import BemUtilities from '../../../utilities/BemUtilities'

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
 *       "bemBlock": "custombutton",
 *       "bemVariants": ["large", "dark"],
 *       "location": "left"
 *    }
 * }
 */
export default class LoadMorePaginator extends AbstractPaginator {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.bemBlock = PropTypes.string.isRequired
    propTypes.bemVariants = PropTypes.arrayOf(PropTypes.string).isRequired
    propTypes.label = PropTypes.string.isRequired
    return propTypes
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractPaginator.defaultProps}.
   *
   * @return {Object}
   * @property {string} bemBlock The BEM block for the button.
   *    This is required, and defaults to `'button'`.
   *    **Can be used in spec**.
   * @property {[string]} bemVariants The BEM variants for the button as an array of strings.
   *    Defaults to empty array.
   *    **Can be used in spec**.
   * @property {string} label The label of the button.
   *    This is required, and defaults to `'Load more'` (marked for translation).
   *    **Can be used in spec**.
   */
  static get defaultProps () {
    const defaultProps = super.defaultProps
    defaultProps.bemBlock = 'button'
    defaultProps.bemVariants = []
    defaultProps.label = window.gettext('Load more')
    return defaultProps
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onClick = this.onClick.bind(this)
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  onClick (e) {
    e.preventDefault()
    this.props.childExposedApi.loadMoreItemsFromApi()
  }

  renderLoadMoreButton () {
    return <button type={'button'}
      className={this.className}
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
