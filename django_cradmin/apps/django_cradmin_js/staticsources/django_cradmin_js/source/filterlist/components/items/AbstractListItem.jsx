import React from "react"
import ReactDOM from "react-dom"
import PropTypes from 'prop-types';

export default class AbstractListItem extends React.Component {
  static get propTypes() {
    return {
      listItemId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired
    }
  }

  // constructor(props) {
  //   super(props)
  // }


}
