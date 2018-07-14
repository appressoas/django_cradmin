import React from 'react'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'
import * as gettext from 'ievv_jsbase/lib/gettext'
import moment from 'moment'

export default class YearSelect extends React.Component {
  static get defaultProps () {
    return {
      bemBlock: 'select',
      bemVariants: ['outlined', 'size-xsmall'],
      ariaLabel: gettext.gettext('Year'),
      min: 1900,
      max: 2100,
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
      min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      onChange: PropTypes.func
    }
  }

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  parseMinMaxProp (value) {
    if (value === 'now') {
      return moment().year()
    }
    return value
  }

  get minYear () {
    return this.parseMinMaxProp(this.props.min)
  }

  get maxYear () {
    return this.parseMinMaxProp(this.props.max)
  }

  isSelectedYear (year) {
    return this.props.momentObject.year() === year
  }

  renderYear (year) {
    return <option key={year} value={year} selected={this.isSelectedYear(year)}>
      {year}
    </option>
  }

  renderYears () {
    let year = this.minYear
    let renderedYears = []
    while (year <= this.maxYear) {
      renderedYears.push(this.renderYear(year))
      year += 1
    }
    return renderedYears
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
        {this.renderYears()}
      </select>
    </label>
  }
}
