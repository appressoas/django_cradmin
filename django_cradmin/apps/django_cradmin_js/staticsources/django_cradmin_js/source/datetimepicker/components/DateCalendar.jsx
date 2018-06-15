import cx from 'classnames'
import React from 'react'
import range from 'lodash/range'
import chunk from 'lodash/chunk'
import PropTypes from 'prop-types'
import BemUtilities from '../../utilities/BemUtilities'

export default class DateCalendar extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      bemBlock: 'calendar-month',
      bemVariants: [],
      onDaySelect: null
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      bemBlock: PropTypes.string.isRequired,
      bemVariants: PropTypes.arrayOf(PropTypes.string).isRequired,
      onDaySelect: PropTypes.func.isRequired
    }
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

  makeDayClassName (day, week, currentDay) {
    const isInPrevMonth = (week === 0 && day > 7)
    const isInNextMonth = (week >= 4 && day <= 14)
    const bemVariants = []
    if (isInPrevMonth || isInNextMonth) {
      bemVariants.push('muted')
    } else if (day === currentDay) {
      bemVariants.push('selected')
    }
    return BemUtilities.buildBemElement(this.props.bemBlock, 'day', bemVariants)
  }

  renderDay (day, week, currentDay) {
    return <div
      role={'button'}
      tabIndex={0}
      key={day}
      className={this.makeDayClassName(day, week, currentDay)}
      onClick={() => {
        this.props.onDaySelect(day, week)
      }}
    >
      {day}
    </div>
  }

  renderDaysInWeek (daysInWeek, week, currentDay) {
    return daysInWeek.map(day => {
      return this.renderDay(day, week, currentDay)
    })
  }

  renderWeek (daysInWeek, week, currentDay) {
    return <div key={week} className={this.weekClassName}>
      {this.renderDaysInWeek(daysInWeek, week, currentDay)}
    </div>
  }

  renderWeeks () {
    let currentDay = this.props.moment.date()
    let firstDayOfWeek = this.props.moment.localeData().firstDayOfWeek()
    let endOfPreviousMonth = this.props.moment.clone().subtract(1, 'month').endOf('month').date()
    let startDayOfCurrentMonth = this.props.moment.clone().date(1).day()
    let endOfCurrentMonth = this.props.moment.clone().endOf('month').date()

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
      return this.renderWeek(daysInWeek, week, currentDay)
    })
  }

  renderBody () {
    return <div className={this.bodyClassName}>
      {this.renderWeeks()}
    </div>
  }

  renderHeaderRowContent () {
    const firstDayOfWeek = this.props.moment.localeData().firstDayOfWeek()
    let weeks = this.props.moment.localeData().weekdaysShort()
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
