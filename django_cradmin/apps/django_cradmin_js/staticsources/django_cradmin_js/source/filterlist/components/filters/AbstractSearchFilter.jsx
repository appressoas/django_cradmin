import React from 'react'
import PropTypes from 'prop-types'
import AbstractListFilter from './AbstractListFilter'

/**
 * Abstract base class for filters.
 *
 * See {@link AbstractSearchFilter.defaultProps} for documentation for
 * props and their defaults.
 */
export default class AbstractSearchFilter extends AbstractListFilter {
  static get propTypes () {
    const propTypes = super.propTypes
    propTypes.placeholder = PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
    propTypes.value = PropTypes.string
    return propTypes
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractListFilter.defaultProps}.
   *
   * @return {Object}
   * @property {[string]|string} placeholder A placeholder string,
   *    or an array of placeholder strings.
   *    **Can be used in spec**.
   * @property {string} value The value as a string.
   *    _Provided automatically by the parent component_.
   */
  static get defaultProps () {
    const defaultProps = super.defaultProps
    defaultProps.placeholder = ''
    defaultProps.value = ''
    return defaultProps
  }

  static filterHttpRequest (httpRequest, name, value) {
    httpRequest.urlParser.queryString.set(name, value || '')
  }

  constructor (props) {
    super(props)
    this.placeholderRotateTimeoutId = null
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      currentPlaceholderIndex: 0
    })
  }

  componentDidMount () {
    super.componentDidMount()
    if (this.placeholderIsRotatable()) {
      this.queuePlaceholderRotation()
    }
  }

  componentWillUnmount () {
    this.cancelPlaceholderRotation()
  }

  getInitialState () {
    return {
      currentPlaceholderIndex: 0
    }
  }

  setupBoundMethods () {
    super.setupBoundMethods()
    this.onChange = this.onChange.bind(this)
    this.onClickClearButton = this.onClickClearButton.bind(this)
    this.rotatePlaceholder = this.rotatePlaceholder.bind(this)
  }

  get stringValue () {
    return this.props.value || ''
  }

  getSearchInputRef () {
    throw new Error('getSearchInputRef() must be implemented in subclasses')
  }

  //
  //
  // Rotating placeholder
  //
  //

  get placeholderArray () {
    if (Array.isArray(this.props.placeholder)) {
      return this.props.placeholder
    }
    return [this.props.placeholder]
  }

  get placeholderRotateIntervalMilliseconds () {
    return 2000
  }

  get placeholder () {
    if (Array.isArray(this.props.placeholder)) {
      if (this.props.placeholder.length === 0) {
        return ''
      }
      return this.props.placeholder[this.state.currentPlaceholderIndex]
    }
    return this.props.placeholder
  }

  placeholderIsRotatable () {
    return Array.isArray(this.props.placeholder) && this.props.placeholder.length > 1
  }

  cancelPlaceholderRotation () {
    if (this.placeholderRotateTimeoutId !== null) {
      window.clearTimeout(this.placeholderRotateTimeoutId)
    }
  }

  queuePlaceholderRotation () {
    this.cancelPlaceholderRotation()
    this.placeholderRotateTimeoutId = window.setTimeout(
      this.rotatePlaceholder,
      this.placeholderRotateIntervalMilliseconds)
  }

  rotatePlaceholder () {
    let currentPlaceholderIndex = this.state.currentPlaceholderIndex + 1
    if (currentPlaceholderIndex >= this.placeholderArray.length) {
      currentPlaceholderIndex = 0
    }
    this.setState({
      currentPlaceholderIndex: currentPlaceholderIndex
    })
    this.queuePlaceholderRotation()
  }

  //
  //
  // Search text value change
  //
  //

  onChange (event) {
    const searchString = event.target.value;
    this.setFilterValue(searchString)
  }

  onClickClearButton () {
    this.setFilterValue('')
    this.getSearchInputRef().focus()
  }
}
