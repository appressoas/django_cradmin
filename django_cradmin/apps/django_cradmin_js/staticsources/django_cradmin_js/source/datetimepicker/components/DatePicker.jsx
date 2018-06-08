import cx from 'classnames'
import moment from 'moment'
import React from 'react'

import DateCalendar from './DateCalendar'
import DateMonths from './DateMonths'

import LeftIcon from 'react-icons/lib/fa/angle-left'
import RightIcon from 'react-icons/lib/fa/angle-right'

export default class DatePicker extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: 'calendar',
    }
  }

  getMoment () {
    let moment = this.props.moment ? this.props.moment.clone() : moment()

    if (this.props.locale) {
      moment = moment.locale(this.props.locale)
    }

    return moment
  }

  render () {
    let {mode} = this.state
    let moment = this.getMoment()

    return (
      <div className={cx('im-date-picker', this.props.className)}>
        <Toolbar
          display={moment.format('MMMM YYYY')}
          onPrevMonth={this.onPrevMonth.bind(this)}
          onNextMonth={this.onNextMonth.bind(this)}
          onPrevYear={this.onPrevYear.bind(this)}
          onNextYear={this.onNextYear.bind(this)}
          onToggleMode={this.onToggleMode.bind(this)}
        />
        {mode === 'calendar' && <DateCalendar moment={moment} onDaySelect={this.onDaySelect.bind(this)}/>}
        {mode === 'months' && <DateMonths moment={moment} onMonthSelect={this.onMonthSelect.bind(this)}/>}
      </div>
    )
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
      mode: this.state.mode === 'calendar' ? 'months' : 'calendar',
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

  onMonthSelect (month) {
    let moment = this.props.moment.clone()
    this.setState({mode: 'calendar'}, () => this.props.onChange(moment.month(month)))
  }
}

class Toolbar extends React.Component {
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
