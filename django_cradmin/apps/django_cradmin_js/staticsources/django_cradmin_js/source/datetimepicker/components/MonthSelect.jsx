import React from 'react'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'
import * as gettext from 'ievv_jsbase/lib/gettext'

export default class MonthSelect extends React.Component {
  static get defaultProps () {
    return {
      bemBlock: 'select',
      bemVariants: ['outlined', 'size-xsmall', 'width-xxsmall'],
      ariaLabel: gettext.gettext('Month'),
      momentObject: null,
      onChange: null
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any.isRequired,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      ariaLabel: PropTypes.string.isRequired,
      onChange: PropTypes.func
    }
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  isSelectedMonth (monthNumber) {
    return this.props.momentObject.month() === monthNumber
  }

  renderMonth (monthNumber, monthName) {
    return <option key={monthNumber} value={monthNumber} selected={this.isSelectedMonth(monthNumber)}>
      {monthName}
    </option>
  }

  renderMonths () {
    const renderedMonths = []
    let monthNames = this.props.momentObject.localeData().monthsShort()
    let monthNumber = 0
    for (let monthName of monthNames) {
      renderedMonths.push(this.renderMonth(monthNumber, monthName))
      monthNumber++
    }
    return renderedMonths
  }

  handleChange (e) {
    const value = parseInt(e.target.value, 10)
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render () {
    return <label className={this.className} onChange={this.handleChange.bind(this)}>
      <select aria-label={this.props.ariaLabel}>
        {this.renderMonths()}
      </select>
    </label>
  }
}
