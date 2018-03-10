import React from 'react'
import PropTypes from 'prop-types'
import 'ievv_jsbase/lib/utils/i18nFallbacks'

/**
 * Renders a loading indicator.
 *
 * Uses the `loading-indicator` bem block from the cradmin styles by default.
 *
 * @example
 * <LoadingIndicator/>
 *
 * @example
 * <LoadingIndicator message="Loading the awesome ..."/>
 */
export default class LoadingIndicator extends React.Component {
  static get propTypes () {
    return {
      message: PropTypes.string.isRequired,
      bemBlock: PropTypes.string.isRequired
    }
  }

  static get defaultProps () {
    return {
      message: window.gettext('Loading ...'),
      bemBlock: 'loading-indicator'
    }
  }

  indicatorClassName () {
    return `${this.props.bemBlock}__indicator`
  }

  messageClassName () {
    return `${this.props.bemBlock}__text`
  }

  renderMessage () {
    return <span className={this.messageClassName}>
      {this.props.message}
    </span>
  }

  render () {
    return <span className={this.props.bemBlock}>
      <span className={this.indicatorClassName} />
      <span className={this.indicatorClassName} />
      <span className={this.indicatorClassName} />
      {this.renderMessage()}
    </span>
  }
}
