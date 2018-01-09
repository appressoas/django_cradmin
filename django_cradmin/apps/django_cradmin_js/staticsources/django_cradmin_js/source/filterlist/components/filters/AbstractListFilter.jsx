import React from 'react'
import PropTypes from 'prop-types'
import AbstractListChild from '../AbstractListChild'

/**
 * Base class for filter components.
 *
 * See {@link AbstractListFilter#defaultProps} for documentation about
 * props and their defaults.
 */
export default class AbstractListFilter extends AbstractListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      isStatic: PropTypes.bool,
      value: PropTypes.any,
    })
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractListChild#defaultProps}.
   *
   * @return {Object}
   * @property {string} name The name of the filter.
   *    This is required, and defaults to `null`.
   * @property {string} location The location where the filter is rendered.
   *    In advanced cases, you may want to render the filter
   *    differently depending on the location, but this is generally
   *    not recommended for reusable filters.
   *
   *    Will normally be one of {@link RENDER_LOCATION_LEFT},
   *    {@link RENDER_LOCATION_RIGHT}, {@link RENDER_LOCATION_TOP},
   *    {@link RENDER_LOCATION_BOTTOM} or {@link RENDER_LOCATION_CENTER}.
   *
   *    This is required, and defaults to `null`.
   * @property {bool} isStatic If this is `true`, the filter is not rendered,
   *    but API requests is always filtered by the value specified for the
   *    filter in the `initialValue` of the spec for the filter.
   *    Defaults to `false`.
   * @property {*} value The current value of the filter.
   */
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      location: null,
      name: null,
      isStatic: false,
      value: null
    })
  }

  /**
   * Filter the provided HTTP request.
   *
   * Defaults to setting `<name>=<value>` is the querystring.
   * Non-trivial filters will need to override this.
   *
   * @param httpRequest The HTTP request.
   *    An object of the class returned by {@link AbstractListFilter#getHttpRequestClass}
   * @param name The name of the filter. Will be the same as
   *    `props.name`.
   * @param value The current value of the filter.
   */
  static filterHttpRequest (httpRequest, name, value) {
    httpRequest.urlParser.queryString.set(name, value)
  }

  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  /**
   * Get the initial state for the filter.
   * @returns {{}}
   */
  getInitialState () {
    return {}
  }

  /**
   * Setup bound methods.
   *
   * Calls {@link AbstractListChild#setupBoundMethods}, and
   * binds {@link AbstractListFilter#setFilterValue}
   * to ``this` by default, but you can override this
   * method to bind more methods. In that case, ensure
   * you call `super.setupBoundMethods()`!
   */
  setupBoundMethods () {
    super.setupBoundMethods()
    this.setFilterValue = this.setFilterValue.bind(this)
  }

  /**
   * Set the value of the filter.
   *
   * If you set complex objects as value (array, object, map, set, ...),
   * you will need to override {@link AbstractListFilter#filterHttpRequest}.
   *
   * @param value The value to set.
   */
  setFilterValue (value) {
    this.props.childExposedApi.setFilterValue(this.props.name, value)
  }
}
