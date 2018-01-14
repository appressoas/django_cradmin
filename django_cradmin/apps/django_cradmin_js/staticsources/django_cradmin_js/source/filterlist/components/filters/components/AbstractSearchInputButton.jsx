import React from 'react'
import PropTypes from 'prop-types'

/**
 * Abstract base class for rendering a ``searchinput__button``.
 *
 * See {@link AbstractSearchInputButton.defaultProps} for documentation for
 * props and their defaults.
 */
export default class AbstractSearchInputButton extends React.Component {
  static get propTypes () {
    return {
      onClick: PropTypes.func.isRequired,
      onFocus: PropTypes.func.isRequired,
      onBlur: PropTypes.func.isRequired
    }
  }

  /**
   * Get default props.
   *
   * @return {Object}
   * @property {func} onClick On click callback.
   * @property {func} onFocus On focus callback.
   * @property {func} onBlur On blur callback.
   */
  static get defaultProps () {
    return {
      onClick: null,
      onFocus: null,
      onBlur: null
    }
  }

  get className () {
    return 'searchinput__button'
  }

  get iconClassName () {
    throw new Error('iconClassName must be overridden in subclasses.')
  }

  get label () {
    throw new Error('label must be overridden in subclasses.')
  }

  renderIcon () {
    return <span className={this.iconClassName} aria-hidden='true' />
  }

  render () {
    return <button
      type='button'
      className={this.className}
      title={this.label}
      onClick={this.props.onClick}
      onFocus={this.props.onFocus}
      onBlur={this.props.onBlur}
    >
      {this.renderIcon()}
    </button>
  }
}
