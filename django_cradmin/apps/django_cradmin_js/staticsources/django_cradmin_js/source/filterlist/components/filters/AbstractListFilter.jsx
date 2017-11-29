import React from 'react'
import PropTypes from 'prop-types'
import { FILTER_ROLE_FILTER } from '../../filterListConstants'

export default class AbstractListFilter extends React.Component {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,

      // The filter does not control where it is rendered,
      // but it may want to be rendered a bit differently depending
      // on the location where the list places it.
      renderAtLocation: PropTypes.string.isRequired,

      // If this is ``true``, the filter is not rendered,
      // but the API requests is always filtered by the
      // value specified for the filter.
      //
      // This means that {@link filterHttpRequest} is used,
      // but render is not used.
      isStatic: PropTypes.bool
    }
  }

  static get defaultProps () {
    return {
      isStatic: false
    }
  }

  // static requiresApiResponseData () {
  //   return false
  // }

  static filterHttpRequest (httpRequest, filterState) {

  }

  // constructor(props) {
  //   super(props)
  // }

  // get renderAtLocation() {
  //   return AbstractList.renderLocations.left
  // }

}
