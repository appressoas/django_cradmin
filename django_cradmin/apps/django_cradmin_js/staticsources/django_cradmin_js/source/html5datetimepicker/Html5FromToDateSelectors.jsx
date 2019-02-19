import React from 'react'
import PropTypes from 'prop-types'
import Html5DateInput from './Html5DateInput'
import * as gettext from 'ievv_jsbase/lib/gettext'
import moment from 'moment'

export default class Html5FromToDateSelectors extends React.Component {
  static get propTypes () {
    return {
      fromDateValue: PropTypes.string.isRequired,
      toDateValue: PropTypes.string.isRequired,
      commonDateOptions: PropTypes.shape({}).isRequired,
      onChange: PropTypes.func.isRequired,
      isExpandedInitially: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      expandedLabel: PropTypes.string,
      expandToggleLabel: PropTypes.string.isRequired,
      toDateExpandedLabel: PropTypes.string.isRequired,
      fromDateExpandedLabel: PropTypes.string.isRequired
    }
  }

  static get defaultProps () {
    return {
      fromDateValue: '',
      toDateValue: '',
      label: null,
      expandedLabel: null,
      commonDateOptions: {},
      isExpandedInitially: false,
      expandToggleLabel: gettext.gettext('Display to-date?'),
      toDateExpandedLabel: gettext.gettext('To date'),
      fromDateExpandedLabel: gettext.gettext('From date')
    }
  }

  constructor (props) {
    super(props)
    this.state = this._getInitialState()
    this._setupBoundFunctions()
  }

  /* initialization functions */

  _getInitialState () {
    return {
      isExpanded: this.props.isExpandedInitially,
      invalidRangeAttempted: false
    }
  }

  _setupBoundFunctions () {
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleShowToDateChange = this.handleShowToDateChange.bind(this)
  }

  handleDateChange (valueKey, value) {
    const fromDate = valueKey === 'fromDate' ? value : this.props.fromDateValue
    const toDate = valueKey === 'toDate' ? value : this.props.toDateValue

    if (fromDate && toDate) {
      const momentFromDate = moment(fromDate)
      const momentToDate = moment(toDate)
      if (momentFromDate > momentToDate) {
        this.setState({
          invalidRangeAttempted: true
        })
        return
      }
    }

    if (this.state.invalidRangeAttempted) {
      this.setState({
        invalidRangeAttempted: false
      })
    }

    if (!this.state.isExpanded || !toDate) {
      this.props.onChange(fromDate, fromDate)
      return
    }
    this.props.onChange(fromDate, toDate)
  }

  handleShowToDateChange (event) {
    this.setState({
      isExpanded: event.target.checked
    }, this.handleDateChange)
  }

  get commonDateOptions () {
    return {
      ...this.props.commonDateOptions
    }
  }

  get fromDateOptions () {
    return {
      ...this.commonDateOptions,
      value: this.props.fromDateValue,
      max: this.props.toDateValue,
      onChange: (value) => { this.handleDateChange('fromDate', value) }
    }
  }

  get toDateOptions () {
    return {
      ...this.commonDateOptions,
      value: this.props.toDateValue,
      min: this.props.fromDateValue,
      onChange: (value) => { this.handleDateChange('toDate', value) }
    }
  }

  get collapsedLabel () {
    return this.props.label
  }

  get expandedLabel () {
    if (this.props.expandedLabel) {
      return this.props.expandedLabel
    }
    return this.collapsedLabel
  }

  get label () {
    if (this.state.isExpanded) {
      return this.expandedLabel
    }
    return this.collapsedLabel
  }

  get toDateExpandedLabel () {
    return this.props.toDateExpandedLabel
  }

  get fromDateExpandedLabel () {
    return this.props.fromDateExpandedLabel
  }

  get expandToggleLabel () {
    return this.props.expandToggleLabel
  }

  /* Render functions */

  renderFromDateField () {
    return <Html5DateInput {...this.fromDateOptions} />
  }

  renderToDateField () {
    return <Html5DateInput {...this.toDateOptions} />
  }

  renderShowToFieldCheckbox () {
    return <label className='checkbox  checkbox--block'>
      <input type='checkbox' checked={this.state.isExpanded} onChange={this.handleShowToDateChange} />
      <span className='checkbox__control-indicator' />
      {this.expandToggleLabel}
    </label>
  }

  renderInvalidRangeError () {
    if (!this.state.invalidRangeAttempted) {
      return null
    }
    return <p className={'message message--error'}>{gettext.gettext('To date cannot be before from date')}</p>
  }

  renderIfExpandedLabel (labelText) {
    if (!this.state.isExpanded) {
      return null
    }
    return <label className={'label'} aria-hidden>
      {labelText}
    </label>
  }

  renderLabel () {
    return <label className={'label'}>
      {this.label}
    </label>
  }

  renderToDateLayout () {
    if (!this.state.isExpanded) {
      return null
    }
    return <React.Fragment>
      <div className={'fieldwrapper fieldwrapper--compact'} style={{display: 'inline-block'}}>
        {this.renderIfExpandedLabel(this.toDateExpandedLabel)}
        {this.renderToDateField()}
      </div>
    </React.Fragment>
  }

  renderDateFields () {
    return <div>
      <div className={'fieldwrapper fieldwrapper--compact'} style={{display: 'inline-block'}}>
        {this.renderIfExpandedLabel(this.fromDateExpandedLabel)}
        {this.renderFromDateField()}
      </div>
      {this.renderToDateLayout()}
    </div>
  }

  render () {
    return <div className='fieldwrapper'>
      {this.renderLabel()}
      {this.renderDateFields()}
      {this.renderShowToFieldCheckbox()}
      {this.renderInvalidRangeError()}
    </div>
  }
}
