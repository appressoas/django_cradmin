import React from 'react'
import PropTypes from 'prop-types'
import AbstractSearchFilter from './AbstractSearchFilter'
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
export default class SearchFilter extends AbstractSearchFilter {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.label = PropTypes.string
    propTypes.fieldWrapperBemVariants = PropTypes.arrayOf(PropTypes.string).isRequired
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
   * @property {[string]} fieldWrapperBemVariants Array of BEM variants
   *    for the field wrapper element.
   *    Defaults to `['outlined']`.
   *    **Can be used in spec**.
   */
  static get defaultProps () {
    const defaultProps = super.defaultProps
    defaultProps.label = null
    defaultProps.fieldWrapperBemVariants = ['outlined']
    return defaultProps
  }

  getSearchInputRef () {
    return this._searchInputRef
  }

  get labelClassName () {
    return 'label'
  }

  get fieldWrapperClassName () {
    return BemUtilities.addVariants('searchinput', this.props.fieldWrapperBemVariants)
  }

  get bodyClassName () {
    return 'searchinput__body'
  }

  get inputClassName () {
    return 'searchinput__input'
  }

  get labelTextClassName () {
    if (process.env.NODE_ENV === 'test') {
      return 'test-label-text'
    }
    return null
  }

  renderLabelText () {
    if (this.props.label) {
      return <span className={this.labelTextClassName}>{this.props.label}</span>
    }
    return null
  }

  renderButton () {
    return <SearchInputClearButton
      onClick={this.onClickbutton}
      onBlur={this.onBlur}
      onFocus={this.onFocus} />
  }

  renderSearchInput () {
    return <input
      type='text'
      ref={(input) => { this._searchInputRef = input }}
      placeholder={this.placeholder}
      className={this.inputClassName}
      value={this.stringValue}
      onChange={this.onChange}
      onBlur={this.onBlur}
      onFocus={this.onFocus} />
  }

  renderBodyContent () {
    return this.renderSearchInput()
  }

  render () {
    return <label className={this.labelClassName}>
      {this.renderLabelText()}
      <div className={this.fieldWrapperClassName}>
        <span className={this.bodyClassName}>
          {this.renderBodyContent()}
        </span>
        {this.renderButton()}
      </div>
    </label>
  }
}
