import React from 'react'
import PropTypes from 'prop-types'

export default class AbstractListFilter extends React.Component {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,

      // The filter does not control where it is rendered,
      // but it may want to be rendered a bit differently depending
      // on the location where the list places it.
      location: PropTypes.string.isRequired,

      // If this is ``true``, the filter is not rendered,
      // but the API requests is always filtered by the
      // value specified for the filter.
      //
      // This means that {@link filterHttpRequest} is used,
      // but render is not used.
      isStatic: PropTypes.bool,

      // Function that the filter calls to update its state.
      // Takes the name of the filter, and a value.
      setFilterValueCallback: PropTypes.func.isRequired,

      // The value of the filter.
      // This is changed using {@link AbstractListFilter#setFilterValue},
      // which uses the setFilterValueCallback prop to update the filter
      // value in the {@link AbstractList} state, which will lead to
      // a re-render of the filter with new value prop.
      value: PropTypes.any
    }
  }

  static get defaultProps () {
    return {
      isStatic: false,
      value: null
    }
  }

  static filterHttpRequest (httpRequest, filterState) {

  }

  constructor(props) {
    super(props)
    this.setupBoundMethods()
    // this.state = this.getInitialState()
  }

  // getInitialState () {
  //   return {
  //     value: this.props.value
  //   }
  // }

  setupBoundMethods () {
    this.setFilterValue = this.setFilterValue.bind(this)
  }

  setFilterValue (value) {
    this.props.setFilterValueCallback(this.props.name, value)
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log('nextProps', nextProps)
  //   this.setState({
  //     value: nextProps.value
  //   })
  // }
}
