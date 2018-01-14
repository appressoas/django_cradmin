import React from 'react'
import PropTypes from 'prop-types'
import AbstractSearchInputFilter from './AbstractSearchInputFilter'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import BemUtilities from '../../../utilities/BemUtilities'
import SearchInputClearButton from './components/SearchInputClearButton'

/**
 * Search input filter.
 *
 * See {@link SearchFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "SearchFilter",
 *    "props": {
 *      "name": "search"
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "SearchFilter",
 *    "initialValue": "people",
 *    "props": {
 *      "name": "search"
 *    }
 * }
 *
 * @example <caption>Spec - with label and rotating placeholder</caption>
 * {
 *    "component": "SearchFilter",
 *    "props": {
 *      "name": "search",
 *      "label": "Search for some people",
 *      "placeholder": ["Thor", "Santa Claus", "Odin"]
 *    }
 * }
 */
export default class SearchFilter extends AbstractSearchInputFilter {
  /**
   * Get default props. Same props as for
   * {@link AbstractSearchInputFilter.defaultProps}.
   *
   * @return {Object}
   */
  static get defaultProps () {
    return super.defaultProps
  }

  renderButtons () {
    return [
      this.renderClearButton()
    ]
  }
}
