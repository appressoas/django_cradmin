import moment from 'moment'
import React from 'react'

import DateCalendar from './DateCalendar'
import DateMonths from './DateMonths'

import PropTypes from 'prop-types'
import DatePickerToolbar from './DatePickerToolbar'

export default class DatePicker extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      onChange: null
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      onChange: PropTypes.func.isRequired
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      mode: 'calendar'
    }
  }

  getMoment () {
    let moment = this.props.moment ? this.props.moment.clone() : moment()

    if (this.props.locale) {
      moment = moment.locale(this.props.locale)
    }

    return moment
  }

  get monthPickerComponentClass () {
    return DateMonths
  }

  get monthPickerComponentProps () {
    return {
      moment: this.getMoment(),
      onMonthSelect: this.onMonthSelect.bind(this),
      key: 'monthPicker'
    }
  }

  get datePickerComponentClass () {
    return DateCalendar
  }

  get datePickerComponentProps () {
    return {
      moment: this.getMoment(),
      onDaySelect: this.onDaySelect.bind(this),
      key: 'datePicker'
    }
  }

  get toolbarComponentClass () {
    return DatePickerToolbar
  }

  get toolbarComponentProps () {
    return {
      display: this.getMoment().format('MMMM YYYY'),
      onPrevMonth: this.onPrevMonth.bind(this),
      onNextMonth: this.onNextMonth.bind(this),
      onPrevYear: this.onPrevYear.bind(this),
      onNextYear: this.onNextYear.bind(this),
      onToggleMode: this.onToggleMode.bind(this),
      key: 'toolbar'
    }
  }

  renderMonthPicker () {
    const MonthPickerComponent = this.monthPickerComponentClass
    return <MonthPickerComponent {...this.monthPickerComponentProps} />
  }

  renderDatePicker () {
    const DatePickerComponent = this.datePickerComponentClass
    return <DatePickerComponent {...this.datePickerComponentProps} />
  }

  renderPicker () {
    if (this.state.mode === 'months') {
      return this.renderMonthPicker()
    }
    return this.renderDatePicker()
  }

  renderToolbar () {
    const ToolbarComponent = this.toolbarComponentClass
    return <ToolbarComponent {...this.toolbarComponentProps} />
  }

  render () {
    return [
      this.renderToolbar(),
      this.renderPicker()
    ]
  }

  onPrevMonth (e) {
    e.preventDefault()
    let moment = this.getMoment().clone()
    this.props.onChange(moment.subtract(1, 'month'))
  }

  onNextMonth (e) {
    e.preventDefault()
    let moment = this.getMoment().clone()
    this.props.onChange(moment.add(1, 'month'))
  }

  onPrevYear (e) {
    e.preventDefault()
    let moment = this.getMoment().clone()
    this.props.onChange(moment.subtract(1, 'year'))
  }

  onNextYear (e) {
    e.preventDefault()
    let moment = this.getMoment().clone()
    this.props.onChange(moment.add(1, 'year'))
  }

  onToggleMode () {
    this.setState({
      mode: this.state.mode === 'calendar' ? 'months' : 'calendar'
    })
  }

  onDaySelect (day, week) {
    let moment = this.props.moment.clone()
    let prevMonth = (week === 0 && day > 7)
    let nextMonth = (week >= 4 && day <= 14)

    moment.date(day)
    if (prevMonth) moment.subtract(1, 'month')
    if (nextMonth) moment.add(1, 'month')
    this.props.onChange(moment)
  }

  onMonthSelect (monthNumber) {
    let moment = this.props.moment.clone()
    this.setState({mode: 'calendar'}, () => {
      this.props.onChange(moment.month(monthNumber))
    })
  }
}
