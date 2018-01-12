import React from 'react'
import PropTypes from 'prop-types'
import AbstractFilterListChild from './AbstractFilterListChild'

/**
 * Abstract base class for components that is rendered as children
 * of a {@link AbstractLayout}.
 *
 * See {@link AbstractLayoutComponentChild.defaultProps} for documentation for
 * props and their defaults.
 */
export default class AbstractLayoutComponentChild extends AbstractFilterListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      location: PropTypes.string.isRequired
    })
  }

  /**
   * Get default props. Extends the default props
   * from {@link AbstractFilterListChild.defaultProps}.
   *
   * @return {Object}
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
   *    **Can be used in spec**.
   */
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      location: null
    })
  }
}
