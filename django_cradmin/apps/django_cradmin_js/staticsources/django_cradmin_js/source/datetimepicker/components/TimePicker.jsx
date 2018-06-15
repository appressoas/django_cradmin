import React from 'react'
import PropTypes from 'prop-types'
import TimeDisplay from './TimeDisplay'
import RangeSlider from '../../components/RangeSlider'
import { gettext } from 'ievv_jsbase/lib/gettext'

export default class TimePicker extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      showSeconds: false,
      onChange: null
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      showSeconds: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired
    }
  }

  get timeDisplayComponentProps () {
    return {
      moment: this.props.moment,
      showSeconds: this.props.showSeconds,
      bemVariants: ['xlarge']
    }
  }

  renderTimeDisplay () {
    return <TimeDisplay {...this.timeDisplayComponentProps} />
  }

  renderTimeDisplayWrapper () {
    return <p className={'text-center'} key={'time-display-wrapper'}>
      {this.renderTimeDisplay()}
    </p>
  }

  renderHourPicker () {
    return <label className='label'>
      {gettext('Hours')}:
      <RangeSlider
        key={'hour'}
        value={this.props.moment.hour()}
        min={0}
        max={23}
        onChange={this.changeHours.bind(this)}
      />
    </label>
  }

  renderMinutePicker () {
    return <label className='label'>
      {gettext('Minutes')}:
      <RangeSlider
        key={'minute'}
        value={this.props.moment.minute()}
        min={0}
        max={23}
        onChange={this.changeMinutes.bind(this)}
      />
    </label>
  }

  renderSecondPicker () {
    if (!this.props.showSeconds) {
      return null
    }
    return <label className='label'>
      {gettext('Seconds')}:
      <RangeSlider
        key={'second'}
        value={this.props.moment.second()}
        min={0}
        max={59}
        onChange={this.changeSeconds.bind(this)}
      />
    </label>
  }

  renderTimePickers () {
    return [
      this.renderHourPicker(),
      this.renderMinutePicker(),
      this.renderSecondPicker()
    ]
  }

  render () {
    return [
      this.renderTimeDisplayWrapper(),
      this.renderTimePickers()
    ]
  }

  changeHours (hours) {
    let moment = this.props.moment.clone()
    moment.hours(hours)
    this.props.onChange(moment)
  }

  changeMinutes (minutes) {
    let moment = this.props.moment.clone()
    moment.minutes(minutes)
    this.props.onChange(moment)
  }

  changeSeconds (seconds) {
    let moment = this.props.moment.clone()
    moment.seconds(seconds)
    this.props.onChange(moment)
  }
}
