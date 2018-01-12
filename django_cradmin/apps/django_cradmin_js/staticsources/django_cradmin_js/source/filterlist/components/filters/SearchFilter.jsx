import React from 'react'
import PropTypes from 'prop-types'
import AbstractSearchFilter from './AbstractSearchFilter'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import BemUtilities from '../../../utilities/BemUtilities'

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
export default class SearchFilter extends AbstractSearchFilter {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.label = PropTypes.string
    propTypes.inputBemVariants = PropTypes.arrayOf(PropTypes.string).isRequired
    return propTypes
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractSearchFilter.defaultProps}.
   *
   * @return {Object}
   * @property {string} label An optional label for the search field.
   *    Defaults to empty string.
   *    **Can be used in spec**.
   * @property {[string]} inputBemVariants Array of BEM variants
   *    for the search input element.
   *    Defaults to `['outlined']`.
   *    **Can be used in spec**.
   */
  static get defaultProps () {
    const defaultProps = super.defaultProps
    defaultProps.label = null
    defaultProps.inputBemVariants = ['outlined']
    return defaultProps
  }

  getSearchInputRef () {
    return this._searchInputRef
  }

  renderLabel () {
    return this.props.label;
  }

  get labelClassName () {
    return 'label'
  }

  get fieldWrapperClassName () {
    return 'searchinput'
  }

  get searchInputClassName () {
    return `searchinput__input ${BemUtilities.addVariants('input', this.props.inputBemVariants)}`
  }

  get buttonTitle () {
    return window.gettext('Clear search field')
  }

  get clearButtonClassName () {
    return 'searchinput__button'
  }

  get clearButtonIconClassName () {
    return 'icon-close'
  }

  renderbuttonIcon () {
    return <span className={this.clearButtonIconClassName} aria-hidden='true' />
  }

  renderbutton () {
    return <button
      type='button'
      className={this.clearButtonClassName}
      title={this.buttonTitle}
      onClick={this.onClickbutton}
      onBlur={this.onBlur}
      onFocus={this.onFocus}>
      {this.renderbuttonIcon()}
    </button>
  }

  renderSearchInput () {
    return <input
      type='text'
      ref={(input) => { this._searchInputRef = input }}
      placeholder={this.placeholder}
      className={this.searchInputClassName}
      value={this.stringValue}
      onChange={this.onChange}
      onBlur={this.onBlur}
      onFocus={this.onFocus} />
  }

  render () {
    return <label className={this.labelClassName}>
      {this.renderLabel()}
      <div className={this.fieldWrapperClassName}>
        {this.renderSearchInput()}
        {this.renderbutton()}
      </div>
    </label>
  }
}
