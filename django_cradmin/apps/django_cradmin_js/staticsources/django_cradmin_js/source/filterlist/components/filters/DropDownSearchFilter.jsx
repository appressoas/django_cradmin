import React from 'react'
import PropTypes from 'prop-types'
import AbstractSearchFilter from './AbstractSearchFilter'
import 'ievv_jsbase/lib/utils/i18nFallbacks'
import { COMPONENT_GROUP_EXPANDABLE } from '../../filterListConstants'

export default class DropDownSearchFilter extends AbstractSearchFilter {
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
    if (this.isExpanded()) {
      return 'icon-chevron-up'
    } else {
      return 'icon-chevron-down'
    }
  }

  renderExpandCollapseIcon () {
    return <span className={this.clearButtonIconClassName} aria-hidden="true"/>
  }

  renderExpandCollapseButton () {
    return <button type="button"
                   className={this.clearButtonClassName}
                   title={this.clearButtonTitle}
                   onClick={this.onClickExpandCollapseButton}>
      {this.renderExpandCollapseIcon()}
    </button>
  }

  renderSearchInput () {
    return <input type="text"
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
