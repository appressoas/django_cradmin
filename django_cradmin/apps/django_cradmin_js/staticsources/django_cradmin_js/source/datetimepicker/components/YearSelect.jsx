import React from 'react'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'
import * as gettext from 'ievv_jsbase/lib/gettext'
import moment from 'moment'

export default class YearSelect extends React.Component {
  static get defaultProps () {
    return {
      selectBemBlock: 'select',
      selectBemVariants: ['outlined', 'size-xsmall', 'width-xxsmall'],
      inputBemBlock: 'input',
      inputBemVariants: ['outlined', 'inline', 'size-xsmall', 'width-xxsmall'],
      ariaLabel: gettext.gettext('Year'),
      min: 1900,
      max: 2100,
      momentObject: null,
      onChange: null,
      renderAsInputThreshold: 200
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any.isRequired,
      selectBemBlock: PropTypes.string.isRequired,
      selectBemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      ariaLabel: PropTypes.string.isRequired,
      min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      onChange: PropTypes.func
    }
  }

  get selectClassName () {
    return BemUtilities.addVariants(this.props.selectBemBlock, this.props.selectBemVariants)
  }

  get inputClassName () {
    return BemUtilities.addVariants(this.props.inputBemBlock, this.props.inputBemVariants)
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

  get selectedYear () {
    return this.props.momentObject.year()
  }

  isSelectedYear (year) {
    return this.selectedYear === year
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

  handleSelectChange (e) {
    const value = parseInt(e.target.value, 10)
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleInputChange (e) {
    const value = parseInt(e.target.value, 10)
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  shouldRenderAsSelect () {
    return (this.maxYear - this.minYear) <= this.props.renderAsInputThreshold
  }

  renderAsSelect () {
    return <label className={this.selectClassName} onChange={this.handleSelectChange.bind(this)}>
      <select aria-label={this.props.ariaLabel}>
        {this.renderYears()}
      </select>
    </label>
  }

  renderAsInput () {
    return <input
      className={this.inputClassName}
      onChange={this.handleInputChange.bind(this)}
      value={this.selectedYear}
    />
  }

  render () {
    if (this.shouldRenderAsSelect()) {
      return this.renderAsSelect()
    }
    return this.renderAsInput()
  }
}
