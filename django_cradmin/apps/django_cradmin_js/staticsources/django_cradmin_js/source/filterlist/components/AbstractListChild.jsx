import React from 'react'
import PropTypes from 'prop-types'

export default class AbstractListChild extends React.Component {
  static get propTypes () {
    return {
      // Function that is used to notify blur events
      blurCallback: PropTypes.func.isRequired,

      // Function that is used to notify focus events
      focusCallback: PropTypes.func.isRequired
    }
  }

  static get defaultProps () {
    return {
      blurCallback: null,
      focusCallback: null
    }
  }

  constructor (props) {
    super(props)
    this.setupBoundMethods()
  }

  getBlurFocusCallbackInfo () {
    return this.props
  }

  setupBoundMethods () {
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur () {
    this.props.blurCallback(this.getBlurFocusCallbackInfo())
  }

  onFocus () {
    this.props.focusCallback(this.getBlurFocusCallbackInfo())
  }
}
