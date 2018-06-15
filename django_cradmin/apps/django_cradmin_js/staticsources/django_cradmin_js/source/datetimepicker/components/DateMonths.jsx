import React from 'react'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'

export default class DateMonths extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      bemBlock: 'month-picker',
      bemVariants: [],
      onMonthSelect: null
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      onMonthSelect: PropTypes.func.isRequired
    }
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  getMonthClassName (monthNumber) {
    let bemVariants = []
    if (this.props.moment.month() === monthNumber) {
      bemVariants.push('selected')
    }
    return BemUtilities.buildBemElement(this.props.bemBlock, 'month', bemVariants)
  }

  renderMonth (monthNumber, monthName) {
    return <button
      key={monthNumber}
      type={'button'}
      className={this.getMonthClassName(monthNumber)}
      onClick={() => this.props.onMonthSelect(monthNumber)}
    >
      {monthName}
    </button>
  }

  renderMonths () {
    const monthRenderables = []
    let monthNames = this.props.moment.localeData().months()
    let monthNumber = 0
    for (let monthName of monthNames) {
      monthRenderables.push(this.renderMonth(monthNumber, monthName))
      monthNumber++
    }
    return monthRenderables
  }

  render () {
    return <div className={this.className}>
      {this.renderMonths()}
    </div>
  }
}
