import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import AbstractFilterListChild from '../AbstractFilterListChild'

export default class AbstractListItem extends AbstractFilterListChild {
  static get propTypes () {
    return {
      listItemId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      isSelected: PropTypes.bool
    }
  }

  static get defaultProps () {
    return {
      listItemId: null,
      isSelected: false
    }
  }

  get domIdSuffix () {
    return `${this.props.uniqueComponentKey}-${this.props.listItemId}`
  }
}
