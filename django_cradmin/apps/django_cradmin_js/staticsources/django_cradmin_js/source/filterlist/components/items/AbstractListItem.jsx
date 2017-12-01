import React from "react"
import ReactDOM from "react-dom"
import PropTypes from 'prop-types';

export default class AbstractListItem extends React.Component {
  static get propTypes () {
    return {
      listItemId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired
    }
  }

  static get defaultProps () {
    return {
      listItemId: null
    }
  }

  // constructor(props) {
  //   super(props)
  // }

  componentWillReceiveProps (nextProps) {
    console.log('NEW props', this.props, nextProps)
  }
}
