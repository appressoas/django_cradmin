import React from 'react'
import PropTypes from 'prop-types'
import AbstractSearchFilter from './AbstractSearchFilter'
import 'ievv_jsbase/lib/utils/i18nFallbacks'

export default class SearchFilter extends AbstractSearchFilter {
  static get propTypes() {
    const propTypes = super.propTypes
    propTypes.label = PropTypes.string
    return propTypes
  }

  static get defaultProps () {
    const defaultProps = super.defaultProps
    defaultProps.label = null
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
    return 'searchinput__input input input--outlined'
  }

  get clearButtonTitle () {
    return window.gettext('Clear')
  }

  get clearButtonClassName () {
    return 'searchinput__button'
  }

  get clearButtonIconClassName () {
    return 'icon-close'
  }

  renderClearButtonIcon () {
    return <span className={this.clearButtonIconClassName} aria-hidden="true"/>
  }

  renderClearButton () {
    return <button type="button"
                   className={this.clearButtonClassName}
                   title={this.clearButtonTitle}
                   onClick={this.onClickClearButton}
                   onBlur={this.onBlur}
                   onFocus={this.onFocus}>
      {this.renderClearButtonIcon()}
    </button>
  }

  renderSearchInput () {
    return <input type="text"
                  ref={(input) => { this._searchInputRef = input }}
                  placeholder={this.placeholder}
                  className={this.searchInputClassName}
                  value={this.stringValue}
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}/>
  }

  render () {
    return <label className={this.labelClassName}>
      {this.renderLabel()}
      <div className={this.fieldWrapperClassName}>
        {this.renderSearchInput()}
        {this.renderClearButton()}
      </div>
    </label>
  }
}
