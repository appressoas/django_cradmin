import React from 'react'
import PropTypes from 'prop-types'

/**
 * Base class for all child components of {@link AbstractFilterList}.
 *
 * See {@link AbstractListChild#defaultProps} for documentation about
 * props and their defaults.
 */
export default class AbstractListChild extends React.Component {
  static get propTypes () {
    return {
      renderArea: PropTypes.string.isRequired,
      childExposedApi: PropTypes.object.isRequired,
      componentGroup: PropTypes.string
    }
  }

  /**
   * Get default props.
   *
   * @return {Object}
   * @property {string} renderArea The area the component is rendered within.
   *    Will normally be one of {@link RENDER_AREA_HEADER} or {@link RENDER_AREA_BODY}.
   * @property {ChildExposedApi} childExposedApi Object with public methods from
   *    {@link AbstractFilterList}.
   * @property {string|null} componentGroup The group this component belongs to.
   *    See {@link AbstractFilterList#toggleComponentGroup}.
   */
  static get defaultProps () {
    return {
      renderArea: null,
      childExposedApi: null,
      componentGroup: null
    }
  }

  constructor (props) {
    super(props)
    this.setupBoundMethods()
  }

  setupBoundMethods () {
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  /**
   * See {@link AbstractListChild#onBlur} and {@link AbstractListChild#onFocus}.
   *
   * @return {{}} An object with information about this component relevant
   *    for blur/focus management.
   */
  getBlurFocusCallbackInfo () {
    return {
      renderArea: this.props.renderArea
    }
  }

  /**
   * Should be called when the component looses focus.
   *
   * By default this calls AbstractFilterList#onChildBlur with the
   * information from AbstractListChild#getBlurFocusCallbackInfo.
   */
  onBlur () {
    this.props.childExposedApi.onChildBlur(this.getBlurFocusCallbackInfo())
  }

  /**
   * Should be called when the component gains focus.
   *
   * By default this calls AbstractFilterList#onChildFocus with the
   * information from AbstractListChild#getBlurFocusCallbackInfo.
   */
  onFocus () {
    this.props.childExposedApi.onChildFocus(this.getBlurFocusCallbackInfo())
  }

  /**
   * Make props for child components that is also a subclass
   * of AbstractListChild.
   *
   * @param extraProps Extra props. These will override any props
   *    set by default.
   * @returns {{}} Object with child component props.
   */
  makeChildComponentProps (extraProps) {
    return Object.assign({
      renderArea: this.props.renderArea,
      childExposedApi: this.props.childExposedApi
    }, extraProps)
  }
}
