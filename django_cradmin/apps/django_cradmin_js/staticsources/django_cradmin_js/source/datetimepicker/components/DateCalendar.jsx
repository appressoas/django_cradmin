import React from 'react'
import moment from 'moment'
import range from 'lodash/range'
import chunk from 'lodash/chunk'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'

export default class DateCalendar extends React.Component {
  static get defaultProps () {
    return {
      momentObject: null,
      initialFocusMomentObject: moment(),
      bemBlock: 'calendar-month',
      bemVariants: [],
      onDaySelect: null
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any,
      initialFocusMomentObject: PropTypes.any.isRequired,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      onDaySelect: PropTypes.func.isRequired
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

  get className () {
    return BemUtilities.addVariants(this.props.bemBlock, this.props.bemVariants)
  }

  get headerClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'header')
  }

  get headerRowClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'header-row')
  }

  get headerDayClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'header-day')
  }

  get bodyClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'body')
  }

  get weekClassName () {
    return BemUtilities.buildBemElement(this.props.bemBlock, 'week')
  }

  makeDayClassName (year, month, week, day) {
    const isInPrevMonth = (week === 0 && day > 7)
    const isInNextMonth = (week >= 4 && day <= 14)
    const bemVariants = []
    if (isInPrevMonth || isInNextMonth) {
      bemVariants.push('muted')
    } else if (this.props.momentObject !== null && this.props.momentObject.isSame(moment({year: year, month: month, day: day}), 'day')) {
      bemVariants.push('selected')
    } else {
      const now = moment()
      if (year === now.year() && month === now.month() && day === now.date()) {
        bemVariants.push('today')
      }
    }

    return BemUtilities.buildBemElement(this.props.bemBlock, 'day', bemVariants)
  }

  renderDay (year, month, week, day) {
    return <div
      role={'button'}
      tabIndex={0}
      key={day}
      className={this.makeDayClassName(year, month, week, day)}
      onClick={() => {
        this.props.onDaySelect(day, week)
      }}
    >
      {day}
    </div>
  }

  renderDaysInWeek (daysInWeek, year, month, week) {
    return daysInWeek.map(day => {
      return this.renderDay(year, month, week, day)
    })
  }

  renderWeek (daysInWeek, year, month, week) {
    return <div key={week} className={this.weekClassName}>
      {this.renderDaysInWeek(daysInWeek, year, month, week)}
    </div>
  }

  renderWeeks () {
    const momentObject = this.getMoment()
    const firstDayOfWeek = momentObject.localeData().firstDayOfWeek()
    const endOfPreviousMonth = momentObject.clone().subtract(1, 'month').endOf('month').date()
    const startDayOfCurrentMonth = momentObject.clone().date(1).day()
    const endOfCurrentMonth = momentObject.clone().endOf('month').date()
    const year = momentObject.year()
    const month = momentObject.month()

    let days = [].concat(
      range(
        (endOfPreviousMonth - startDayOfCurrentMonth + firstDayOfWeek + 1),
        (endOfPreviousMonth + 1)
      ),
      range(
        1,
        (endOfCurrentMonth + 1)
      ),
      range(
        1,
        (42 - endOfCurrentMonth - startDayOfCurrentMonth + firstDayOfWeek + 1)
      )
    )
    return chunk(days, 7).map((daysInWeek, week) => {
      return this.renderWeek(daysInWeek, year, month, week)
    })
  }

  renderBody () {
    return <div className={this.bodyClassName}>
      {this.renderWeeks()}
    </div>
  }

  renderHeaderRowContent () {
    const momentObject = this.getMoment()
    const firstDayOfWeek = momentObject.localeData().firstDayOfWeek()
    let weeks = momentObject.localeData().weekdaysShort()
    weeks = weeks.slice(firstDayOfWeek).concat(weeks.slice(0, firstDayOfWeek))

    return weeks.map((week, index) => {
      return <div key={index} className={this.headerDayClassName}>{week}</div>
    })
  }

  renderHeaderRow () {
    return <div className={this.headerRowClassName}>
      {this.renderHeaderRowContent()}
    </div>
  }

  renderHeader () {
    return <div className={this.headerClassName}>
      {this.renderHeaderRow()}
    </div>
  }

  render () {
    return <div className={this.className}>
      {this.renderHeader()}
      {this.renderBody()}
    </div>
  }
}
