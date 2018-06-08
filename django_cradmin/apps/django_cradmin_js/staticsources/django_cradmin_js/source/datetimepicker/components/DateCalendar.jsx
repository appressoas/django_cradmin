import cx from 'classnames'
import React from 'react'
import range from 'lodash/range'
import chunk from 'lodash/chunk'

export default class DateCalendar extends React.Component {
  render () {
    let moment = this.props.moment

    let currentDay = moment.date()
    let firstDayOfWeek = moment.localeData().firstDayOfWeek()
    let endOfPreviousMonth = moment.clone().subtract(1, 'month').endOf('month').date()
    let startDayOfCurrentMonth = moment.clone().date(1).day()
    let endOfCurrentMonth = moment.clone().endOf('month').date()

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

    let weeks = moment.localeData().weekdaysShort()
    weeks = weeks.slice(firstDayOfWeek).concat(weeks.slice(0, firstDayOfWeek))

    return (
      <table>
        <thead>
          <tr>
            {weeks.map((week, index) => <td key={index}>{week}</td>)}
          </tr>
        </thead>

        <tbody>
          {chunk(days, 7).map((row, week) => (
            <tr key={week}>
              {row.map(day => (
                <Day key={day} day={day} currentDay={currentDay} week={week} onClick={() => this.props.onDaySelect(day, week)}/>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

class Day extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { day, week, currentDay } = this.props

    let prevMonth = (week === 0 && day > 7)
    let nextMonth = (week >= 4 && day <= 14)

    let cn = cx({
      'prev-month': prevMonth,
      'next-month': nextMonth,
      'current': !prevMonth && !nextMonth && (day === currentDay)
    })

    return <td className={cn} onClick={this.props.onClick}>{day}</td>
  }
}
