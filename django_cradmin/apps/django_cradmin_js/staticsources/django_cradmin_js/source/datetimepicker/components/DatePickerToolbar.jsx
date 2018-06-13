import React from 'react'
import LeftIcon from 'react-icons/lib/fa/angle-left'
import RightIcon from 'react-icons/lib/fa/angle-right'
import PropTypes from 'prop-types'

export default class DatePickerToolbar extends React.Component {
  static get defaultProps () {
    return {
      display: null,
      bemBlock: 'paginator',
      bemVariants: [],
      onPrevMonth: null,
      onToggleMode: null,
      onNextMonth: null
    }
  }

  static get propTypes () {
    return {
      display: PropTypes.string,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      onPrevMonth: PropTypes.func.isRequired,
      onToggleMode: PropTypes.func.isRequired,
      onNextMonth: PropTypes.func.isRequired
    }
  }

  render () {
    return (
      <div className='toolbar'>
        <LeftIcon
          className='prev-nav left'
          onClick={this.props.onPrevMonth}
        />
        <span
          className='current-date'
          onClick={this.props.onToggleMode}>
          {this.props.display}
        </span>
        <RightIcon
          className='next-nav right'
          onClick={this.props.onNextMonth}
        />
      </div>
    )
  }
}
