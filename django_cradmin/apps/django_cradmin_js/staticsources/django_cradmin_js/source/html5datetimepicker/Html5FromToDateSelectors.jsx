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
      fromDateOptions: PropTypes.shape({
        label: PropTypes.string.isRequired
      }).isRequired,
      toDateOptions: PropTypes.shape({
        label: PropTypes.string.isRequired
      }).isRequired,
      commonDateOptions: PropTypes.shape({}).isRequired,
      onChange: PropTypes.func.isRequired,
      showToFieldInitially: PropTypes.bool.isRequired
    }
  }

  static get defaultProps () {
    return {
      fromDateValue: '',
      toDateValue: '',
      fromDateOptions: {
        label: gettext.gettext('From date')
      },
      toDateOptions: {
        label: gettext.gettext('To date')
      },
      commonDateOptions: {},
      showToFieldInitially: false
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
      showToDateField: this.props.showToFieldInitially,
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

    if (!this.state.showToDateField || !toDate) {
      this.props.onChange(fromDate, fromDate)
    }
    this.props.onChange(fromDate, toDate)
  }

  handleShowToDateChange (event) {
    this.setState({
      showToDateField: event.target.checked
    })
  }

  get commonDateOptions () {
    return {
      ...this.props.commonDateOptions
    }
  }

  get fromDateOptions () {
    return {
      ...this.commonDateOptions,
      ...this.props.fromDateOptions,
      value: this.props.fromDateValue,
      max: this.props.toDateValue,
      onChange: (value) => { this.handleDateChange('fromDate', value) }
    }
  }

  get toDateOptions () {
    return {
      ...this.commonDateOptions,
      ...this.props.toDateOptions,
      value: this.props.toDateValue,
      min: this.props.fromDateValue,
      onChange: (value) => { this.handleDateChange('toDate', value) }
    }
  }

  /* Render functions */

  renderHelpText (helpText) {
    if (!helpText) {
      return null
    }
    return <p className={'help-text'}>{helpText}</p>
  }

  renderFieldWrappedDateSelector (options, helpText = null) {
    const {label, ...config} = options
    return <div className='fieldwrapper'>
      <label className='label'>
        {label}
        <Html5DateInput {...config} />
      </label>
      {this.renderHelpText(helpText)}
    </div>
  }

  renderFromDateField () {
    return this.renderFieldWrappedDateSelector(this.fromDateOptions)
  }

  renderToDateField () {
    if (!this.state.showToDateField) {
      return null
    }
    return this.renderFieldWrappedDateSelector(this.toDateOptions)
  }

  renderShowToFieldCheckbox () {
    return <div className='fieldwrapper'>
      <label className='checkbox  checkbox--block'>
        <input type='checkbox' checked={this.state.showToDateField} onChange={this.handleShowToDateChange} />
        <span className='checkbox__control-indicator' />
        {gettext.gettext('Display to-date?')}
      </label>
    </div>
  }

  renderInvalidRangeError () {
    if (!this.state.invalidRangeAttempted) {
      return null
    }
    return <p className={'message message--error'}>{gettext.gettext('To date cannot be before from date')}</p>
  }

  render () {
    console.log(`Rendering with values: ${this.props.fromDateValue}, ${this.props.toDateValue}`)
    return <React.Fragment>
      {this.renderFromDateField()}
      {this.renderToDateField()}
      {this.renderShowToFieldCheckbox()}
      {this.renderInvalidRangeError()}
    </React.Fragment>
  }
}
