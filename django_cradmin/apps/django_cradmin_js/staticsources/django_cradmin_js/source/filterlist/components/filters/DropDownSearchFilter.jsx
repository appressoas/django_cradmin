import React from 'react'
import PropTypes from 'prop-types'
import AbstractSearchFilter from './AbstractSearchFilter'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import { COMPONENT_GROUP_EXPANDABLE } from '../../filterListConstants'
import BemUtilities from '../../../utilities/BemUtilities'

/**
 * Dropdown search input filter.
 *
 * Works mostly like {@link SearchFilter} except that it expands/collapses
 * the {@link COMPONENT_GROUP_EXPANDABLE} component group when
 * it has focus and any search input (or when the expand button is clicked).
 *
 * See {@link SearchFilter.defaultProps} for documentation for
 * props and their defaults.
 *
 * @example <caption>Spec - minimal</caption>
 * {
 *    "component": "DropDownSearchFilter",
 *    "props": {
 *      "name": "search"
 *    }
 * }
 *
 * @example <caption>Spec - with initial value</caption>
 * {
 *    "component": "DropDownSearchFilter",
 *    "initialValue": "people",
 *    "props": {
 *      "name": "search"
 *    }
 * }
 *
 * @example <caption>Spec - with label and rotating placeholder</caption>
 * {
 *    "component": "DropDownSearchFilter",
 *    "props": {
 *      "name": "search",
 *      "label": "Search for some people",
 *      "placeholder": ["Thor", "Santa Claus", "Odin"]
 *    }
 * }
 *
 * @example <caption>Spec - full example with something to expand</caption>

 */
export default class DropDownSearchFilter extends AbstractSearchFilter {
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

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onClickExpandCollapseButton = this.onClickExpandCollapseButton.bind(this)
  }

  isExpanded () {
    return this.props.childExposedApi.componentGroupIsEnabled(COMPONENT_GROUP_EXPANDABLE)
  }

  onClickExpandCollapseButton () {
    this.props.childExposedApi.toggleComponentGroup(COMPONENT_GROUP_EXPANDABLE)
    if (this.isExpanded()) {
      this.getSearchInputRef().focus()
    }
  }

  getSearchInputRef () {
    return this._searchInputRef
  }

  renderLabel () {
    return this.props.label
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

  get expandCollapseButtonLabel () {
    if (this.isExpanded()) {
      return window.gettext('Collapse')
    } else {
      return window.gettext('Expand')
    }
  }

  get clearButtonClassName () {
    return 'searchinput__button'
  }

  get clearButtonIconClassName () {
    if (this.isExpanded()) {
      return 'icon-chevron-up'
    } else {
      return 'icon-chevron-down'
    }
  }

  renderExpandCollapseIcon () {
    return <span className={this.clearButtonIconClassName} aria-hidden='true' />
  }

  renderExpandCollapseButton () {
    return <button
      type='button'
      className={this.clearButtonClassName}
      title={this.expandCollapseButtonLabel}
      onClick={this.onClickExpandCollapseButton}
    >
      {this.renderExpandCollapseIcon()}
    </button>
  }

  renderSearchInput () {
    return <input
      type='text'
      ref={(input) => { this._searchInputRef = input }}
      placeholder={this.placeholder}
      className={this.searchInputClassName}
      value={this.stringValue}
      onChange={this.onChange} />
  }

  render () {
    return <label className={this.labelClassName}>
      {this.renderLabel()}
      <div className={this.fieldWrapperClassName}>
        {this.renderSearchInput()}
        {this.renderExpandCollapseButton()}
      </div>
    </label>
  }
}
