import React from 'react'
import PropTypes from 'prop-types'
import TimeDisplay from './TimeDisplay'
import RangeSlider from '../../components/RangeSlider'
import { gettext } from 'ievv_jsbase/lib/gettext'
import moment from 'moment/moment'
import BemUtilities from '../../utilities/BemUtilities'

export default class TimePicker extends React.Component {
  static get defaultProps () {
    return {
      momentObject: null,
      locale: null,
      showSeconds: false,
      onChange: null,
      includeShortcuts: true
    }
  }

  static get propTypes () {
    return {
      momentObject: PropTypes.any,
      locale: PropTypes.string,
      showSeconds: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired,
      includeShortcuts: PropTypes.bool
    }
  }

  get timeDisplayComponentProps () {
    return {
      momentObject: this.props.momentObject,
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
        value={this.props.momentObject.hour()}
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
        value={this.props.momentObject.minute()}
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
        value={this.props.momentObject.second()}
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

  makeShortcutButtonClassName (bemVariants = []) {
    return BemUtilities.buildBemElement('buttonbar', 'button', [bemVariants, ...['compact']])
  }

  renderNowButtonLabel () {
    return gettext('Now')
  }

  renderNowButton () {
    return <button
      type={'button'}
      key={'nowButton'}
      className={this.makeShortcutButtonClassName()}
      onClick={this.onClickNowButton.bind(this)}
    >
      {this.renderNowButtonLabel()}
    </button>
  }

  renderShortcutButtons () {
    return [
      this.renderNowButton()
    ]
  }

  renderShortcutButtonBar () {
    return <div key={'shortcutButtonBar'} className={'buttonbar buttonbar--center'}>
      {this.renderShortcutButtons()}
    </div>
  }

  render () {
    return [
      this.renderTimeDisplayWrapper(),
      this.renderTimePickers(),
      this.props.includeShortcuts ? this.renderShortcutButtonBar() : null
    ]
  }

  _cleanMoment (momentObject) {
    momentObject.millisecond(0)
    if (!this.showSeconds) {
      momentObject.second(0)
    }
    return momentObject
  }

  onClickNowButton () {
    const today = moment()
    let momentObject = this.props.momentObject.clone()
    momentObject.hour(today.hour())
    momentObject.minute(today.minute())
    momentObject.second(today.second())
    momentObject.millisecond(0)
    this.props.onChange(this._cleanMoment(momentObject))
  }

  changeHours (hours) {
    let momentObject = this.props.momentObject.clone()
    momentObject.hours(hours)
    this.props.onChange(this._cleanMoment(momentObject))
  }

  changeMinutes (minutes) {
    let momentObject = this.props.momentObject.clone()
    momentObject.minutes(minutes)
    this.props.onChange(this._cleanMoment(momentObject))
  }

  changeSeconds (seconds) {
    let momentObject = this.props.momentObject.clone()
    momentObject.seconds(seconds)
    this.props.onChange(this._cleanMoment(momentObject))
  }
}
