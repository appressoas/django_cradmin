import React from 'react'
import PropTypes from 'prop-types'
import TimeDisplay from './TimeDisplay'
import RangeSlider from '../../components/RangeSlider'
import { gettext } from 'ievv_jsbase/lib/gettext'
import moment from 'moment/moment'

export default class TimePicker extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      showSeconds: false,
      onChange: null,
      showNowButton: true
    }
  }

  static get propTypes () {
    return {
      moment: PropTypes.any,
      locale: PropTypes.string,
      showSeconds: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired,
      showNowButton: PropTypes.bool
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
    return <label className='label' key={'hour'}>
      {gettext('Hours')}:
      <RangeSlider
        value={this.props.moment.hour()}
        min={0}
        max={23}
        onChange={this.changeHours.bind(this)}
      />
    </label>
  }

  renderMinutePicker () {
    return <label className='label' key={'minute'}>
      {gettext('Minutes')}:
      <RangeSlider
        value={this.props.moment.minute()}
        min={0}
        max={59}
        onChange={this.changeMinutes.bind(this)}
      />
    </label>
  }

  renderSecondPicker () {
    if (!this.props.showSeconds) {
      return null
    }
    return <label className='label' key={'second'}>
      {gettext('Seconds')}:
      <RangeSlider
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

  renderNowButtonLabel () {
    return gettext('Now')
  }

  renderNowButton () {
    if (!this.props.showNowButton) {
      return null
    }
    return <button
      key={'nowButton'}
      type={'button'}
      className={'button button--compact button--block'}
      onClick={this.onClickNowButton.bind(this)}
    >
      {this.renderNowButtonLabel()}
    </button>
  }

  render () {
    return [
      this.renderTimeDisplayWrapper(),
      this.renderTimePickers(),
      this.renderNowButton()
    ]
  }

  onClickNowButton () {
    const today = moment()
    let momentObject = this.props.moment.clone()
    momentObject.hour(today.hour())
    momentObject.minute(today.minute())
    momentObject.second(today.second())
    momentObject.millisecond(0)
    this.props.onChange(momentObject)
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
