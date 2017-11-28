import React from 'react'
import PropTypes from 'prop-types'
import { FILTER_ROLE_FILTER } from './filterListConstants'

export default class AbstractListFilter extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    renderAtLocation: PropTypes.string.isRequired,
    role: PropTypes.string
  }

  static defaultProps = {
    role: null
  }

  static requiresApiResponseData () {
    return false
  }

  filterHttpRequest (httpRequest) {

  }

  // constructor(props) {
  //   super(props)
  // }

  // get renderAtLocation() {
  //   return AbstractList.renderLocations.left
  // }

}
