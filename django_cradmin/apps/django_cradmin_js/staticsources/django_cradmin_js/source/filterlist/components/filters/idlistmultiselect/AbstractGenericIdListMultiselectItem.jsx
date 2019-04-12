import React from 'react'
import PropTypes from 'prop-types'

export default class AbstractGenericIdListMultiselectItem extends React.Component {
  static get propTypes () {
    return {
      id: PropTypes.number.isRequired
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  renderContents () {
    console.warn(`You should make a subclass of AbstractIdGenericListMultiselectItem, and override renderContents()!`)
    return <p>Got id: {this.props.id}</p>
  }

  render () {
    return this.renderContents()
  }
}
