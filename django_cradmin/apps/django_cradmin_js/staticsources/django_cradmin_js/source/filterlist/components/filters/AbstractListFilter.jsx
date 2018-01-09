import React from 'react'
import PropTypes from 'prop-types'
import AbstractListChild from '../AbstractListChild'

export default class AbstractListFilter extends AbstractListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      name: PropTypes.string.isRequired,

      // The filter does not control where it is rendered,
      // but it may want to be rendered a bit differently depending
      // on the location where the list places it.
      location: PropTypes.string.isRequired,

      // If this is ``true``, the filter is not rendered,
      // but the API requests is always filtered by the
      // value specified for the filter.
      //
      // This means that {@link filterHttpRequest} is used,
      // but render is not used.
      isStatic: PropTypes.bool,

      // The value of the filter.
      // This is changed using {@link AbstractListFilter#setFilterValue},
      // which uses the setFilterValueCallback prop to update the filter
      // value in the {@link AbstractList} state, which will lead to
      // a re-render of the filter with new value prop.
      value: PropTypes.any
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
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
   * Binds {@link AbstractListFilter#setFilterValue}
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
