import React from 'react'
import PropTypes from 'prop-types'
import AbstractListFilter from './AbstractListFilter'

export default class CheckboxBooleanFilter extends AbstractListFilter {
  static get propTypes() {
    const propTypes = super.propTypes
    propTypes.label = PropTypes.string.isRequired
    propTypes.value = PropTypes.bool.isRequired
    return propTypes
  }

  static get defaultProps () {
    const defaultProps = super.defaultProps
    defaultProps.value = false
    return defaultProps
  }

  static filterHttpRequest (httpRequest, filterState) {

  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(event) {
    this.setFilterValue(!this.props.value)
  }

  onFocus(event) {
  }

  onBlur(event) {
  }

  renderLabel() {
    return this.props.label;
  }

  get indicatorClassName () {
    return 'checkbox__control-indicator'
  }

  get labelClassName () {
    return 'checkbox checkbox--block'
  }

  render() {
    return <label className={this.labelClassName}>
      <input type="checkbox"
             checked={this.props.value}
             onChange={this.onChange}
             onFocus={this.onFocus}
             onBlur={this.onBlur}/>
      <span className={this.indicatorClassName} />
      {this.renderLabel()}
    </label>;
  }
}
