import React from 'react'
import PropTypes from 'prop-types'
import AbstractFilterListChild from '../AbstractFilterListChild'

export default class AbstractPaginator extends AbstractFilterListChild {
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
}