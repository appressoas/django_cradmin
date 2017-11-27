import React from "react"
import ReactDOM from "react-dom"
import PropTypes from 'prop-types';

import AbstractList from "./AbstractList"

export default class AbstractListFilter extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    renderAtLocation: PropTypes.string.isRequired
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
