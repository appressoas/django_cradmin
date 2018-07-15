import moment from 'moment'
import React from 'react'
import { gettext } from 'ievv_jsbase/lib/gettext'

import DateCalendar from './DateCalendar'

import PropTypes from 'prop-types'
import DatePickerToolbar from './DatePickerToolbar'
import BemUtilities from '../../utilities/BemUtilities'

export default class DatePicker extends React.Component {
  static get defaultProps () {
    return {
      momentObject: null,
      initialFocusMomentObject: moment(),
      locale: null,
      onChange: null,
      includeShortcuts: true
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any,
      initialFocusMomentObject: PropTypes.any.isRequired,
      locale: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      includeShortcuts: PropTypes.bool
    }
  }

  getMoment () {
    let momentObject = null
    if (this.props.momentObject === null) {
      momentObject = this.props.initialFocusMomentObject.clone()
    } else {
      momentObject = this.props.momentObject.clone()
    }
    if (this.props.locale) {
      momentObject = momentObject.locale(this.props.locale)
    }
    return momentObject
  }

  get datePickerComponentClass () {
    return DateCalendar
  }

  get datePickerComponentProps () {
    return {
      momentObject: this.props.momentObject,
      initialFocusMomentObject: this.props.initialFocusMomentObject,
      onDaySelect: this.onDaySelect.bind(this),
      key: 'datePicker'
    }
  }

  get toolbarComponentClass () {
    return DatePickerToolbar
  }

  get toolbarComponentProps () {
    return {
      onPrevMonth: this.onPrevMonth.bind(this),
      onNextMonth: this.onNextMonth.bind(this),
      onMonthSelect: this.onMonthSelect.bind(this),
      onYearSelect: this.onYearSelect.bind(this),
      momentObject: this.getMoment(),
      key: 'toolbar'
    }
  }

  renderDatePicker () {
    const DatePickerComponent = this.datePickerComponentClass
    return <DatePickerComponent {...this.datePickerComponentProps} />
  }

  renderPicker () {
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
    return <div key={'shortcutButtonBar'} className={'text-center'}>
      <div className={'buttonbar buttonbar--inline'}>
        {this.renderShortcutButtons()}
      </div>
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

  onClickTodayButton () {
    const today = moment()
    let momentObject = this.getMoment().clone()
    momentObject.year(today.year())
    momentObject.month(today.month())
    momentObject.date(today.date())
    this.props.onChange(momentObject)
  }

  onDaySelect (day, week) {
    let momentObject = this.getMoment().clone()
    let prevMonth = (week === 0 && day > 7)
    let nextMonth = (week >= 4 && day <= 14)

    momentObject.date(day)
    if (prevMonth) momentObject.subtract(1, 'month')
    if (nextMonth) momentObject.add(1, 'month')
    this.props.onChange(momentObject)
  }

  onMonthSelect (monthNumber) {
    let momentObject = this.getMoment().clone()
    this.props.onChange(momentObject.month(monthNumber))
  }

  onYearSelect (year) {
    let momentObject = this.getMoment().clone()
    this.props.onChange(momentObject.year(year))
  }

}
