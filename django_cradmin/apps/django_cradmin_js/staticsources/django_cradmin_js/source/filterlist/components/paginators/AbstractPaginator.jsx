import React from 'react'
import PropTypes from 'prop-types'
import AbstractListChild from '../AbstractListChild'

export default class AbstractPaginator extends AbstractListChild {
  static get propTypes () {
    return Object.assign(super.propTypes, {
      // Not normally something used by a paginator, but needed
      // to trigger re-render when the list changes
      listItemsDataArray: PropTypes.array.isRequired
    })
  }

  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      listItemsDataArray: null
    })
  }

  constructor (props) {
    super(props)
    this.setupBoundMethods()
  }

  setupBoundMethods () {}
}
