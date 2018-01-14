import React from 'react'
import PropTypes from 'prop-types'
import AbstractFilter from './AbstractFilter'
import BemUtilities from '../../../utilities/BemUtilities'
import SearchInputClearButton from './components/SearchInputClearButton'

/**
 * Abstract base class for filters.
 *
 * See {@link AbstractSearchFilter.defaultProps} for documentation for
 * props and their defaults.
 */
export default class AbstractSearchFilter extends AbstractFilter {
  static get propTypes () {
    return Object.assign({}, {
      label: PropTypes.string,
      placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]),
      fieldWrapperBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      value: PropTypes.string
    })
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractFilter.defaultProps}.
   *
   * @return {Object}
   * @property {[string]|string} placeholder A placeholder string,
   *    or an array of placeholder strings.
   *    **Can be used in spec**.
   * @property {string} label An optional label for the search field.
   *    Defaults to empty string.
   *    **Can be used in spec**.
   * @property {[string]} fieldWrapperBemVariants Array of BEM variants
   *    for the field wrapper element.
   *    Defaults to `['outlined']`.
   *    **Can be used in spec**.
   * @property {string} value The value as a string.
   *    _Provided automatically by the parent component_.
   */
  static get defaultProps () {
    return Object.assign({}, super.defaultProps, {
      placeholder: '',
      label: null,
      fieldWrapperBemVariants: ['outlined'],
      value: ''
    })
  }

  static filterHttpRequest (httpRequest, name, value) {
    httpRequest.urlParser.queryString.set(name, value || '')
  }

  constructor (props) {
    super(props)
    this.placeholderRotateTimeoutId = null
  }

  componentWillReceiveProps () {
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
    const searchString = event.target.value
    this.setFilterValue(searchString)
  }

  onClickClearButton () {
    this.setFilterValue('')
    this.getSearchInputRef().focus()
  }

  //
  //
  // Rendering
  //
  //

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

  renderClearButton () {
    return <SearchInputClearButton
      key={'clear-button'}
      onClick={this.onClickClearButton}
      onBlur={this.onBlur}
      onFocus={this.onFocus} />
  }

  renderButtons () {
    throw new Error('renderButtons() must be overridden in subclasses')
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
        {this.renderButtons()}
      </div>
    </label>
  }
}
