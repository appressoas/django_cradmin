import moment from 'moment'
import React from 'react'
import { gettext } from 'ievv_jsbase/lib/gettext'

import DateCalendar from './DateCalendar'
import DateMonths from './DateMonths'

import PropTypes from 'prop-types'
import DatePickerToolbar from './DatePickerToolbar'
import BemUtilities from '../../utilities/BemUtilities'

export default class DatePicker extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      onChange: null,
      includeShortcuts: true
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      includeShortcuts: PropTypes.bool
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      mode: 'calendar'
    }
  }

  getMoment () {
    let momentObject = this.props.moment ? this.props.moment.clone() : moment()
    if (this.props.locale) {
      momentObject = momentObject.locale(this.props.locale)
    }
    return momentObject
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

  makeShortcutButtonClassName (bemVariants = []) {
    return BemUtilities.buildBemElement('buttonbar', 'button', [bemVariants, ...['compact']])
  }

  renderTodayButtonLabel () {
    return gettext('Today')
  }

  renderTodayButton () {
    return <button
      type={'button'}
      key={'todayButton'}
      className={this.makeShortcutButtonClassName()}
      onClick={this.onClickTodayButton.bind(this)}
    >
      {this.renderTodayButtonLabel()}
    </button>
  }

  renderShortcutButtons () {
    return [
      this.renderTodayButton()
    ]
  }

  renderShortcutButtonBar () {
    return <div key={'shortcutButtonBar'} className={'buttonbar buttonbar--center'}>
      {this.renderShortcutButtons()}
    </div>
  }

  render () {
    return [
      this.renderToolbar(),
      this.renderPicker(),
      this.props.includeShortcuts ? this.renderShortcutButtonBar() : null
    ]
  }

  onPrevMonth (e) {
    e.preventDefault()
    let momentObject = this.getMoment().clone()
    this.props.onChange(momentObject.subtract(1, 'month'))
  }

  onNextMonth (e) {
    e.preventDefault()
    let momentObject = this.getMoment().clone()
    this.props.onChange(momentObject.add(1, 'month'))
  }

  onPrevYear (e) {
    e.preventDefault()
    let momentObject = this.getMoment().clone()
    this.props.onChange(momentObject.subtract(1, 'year'))
  }

  onNextYear (e) {
    e.preventDefault()
    let momentObject = this.getMoment().clone()
    this.props.onChange(momentObject.add(1, 'year'))
  }

  onToggleMode () {
    this.setState({
      mode: this.state.mode === 'calendar' ? 'months' : 'calendar'
    })
  }

  onClickTodayButton () {
    const today = moment()
    let momentObject = this.props.moment.clone()
    momentObject.year(today.year())
    momentObject.month(today.month())
    momentObject.date(today.date())
    this.props.onChange(momentObject)
  }

  onDaySelect (day, week) {
    let momentObject = this.props.moment.clone()
    let prevMonth = (week === 0 && day > 7)
    let nextMonth = (week >= 4 && day <= 14)

    momentObject.date(day)
    if (prevMonth) momentObject.subtract(1, 'month')
    if (nextMonth) momentObject.add(1, 'month')
    this.props.onChange(momentObject)
  }

  onMonthSelect (monthNumber) {
    let momentObject = this.props.moment.clone()
    this.setState({mode: 'calendar'}, () => {
      this.props.onChange(momentObject.month(monthNumber))
    })
  }
}
