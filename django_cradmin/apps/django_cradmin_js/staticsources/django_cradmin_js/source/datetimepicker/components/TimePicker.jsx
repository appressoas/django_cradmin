import cx from 'classnames'
import React from 'react'
import InputSlider from 'react-input-slider'

export default class TimePicker extends React.Component {
  render () {
    let moment = this.props.moment

    return (
      <div className={cx('im-time-picker', this.props.className)}>
        <div className='time-picker-wrapper'>
          <div className='showtime'>
            <span className='time'>{moment.format('HH')}</span>
            <span className='separator'>:</span>
            <span className='time'>{moment.format('mm')}</span>
            {this.props.showSeconds &&
              <span>
                <span className='separator'>:</span>
                <span className='time'>{moment.format('ss')}</span>
              </span>
            }
          </div>

          <div className='sliders'>
            <div className='time-text'>Hours:</div>
            <InputSlider
              className='im-slider'
              xmin={0}
              xmax={23}
              x={moment.hour()}
              onChange={this.changeHours.bind(this)}
            />
            <div className='time-text'>Minutes:</div>
            <InputSlider
              className='im-slider'
              xmin={0}
              xmax={59}
              x={moment.minute()}
              onChange={this.changeMinutes.bind(this)}
            />
            {this.props.showSeconds &&
              <div className='time-text'>Seconds:</div>
            }
            {this.props.showSeconds &&
              <InputSlider
                className='im-slider'
                xmin={0}
                xmax={59}
                x={moment.second()}
                onChange={this.changeSeconds.bind(this)}
              />
            }
          </div>
        </div>
      </div>
    )
  }

  changeHours (pos) {
    let moment = this.props.moment.clone()
    moment.hours(parseInt(pos.x, 10))
    this.props.onChange(moment)
  }

  changeMinutes (pos) {
    let moment = this.props.moment.clone()
    moment.minutes(parseInt(pos.x, 10))
    this.props.onChange(moment)
  }

  changeSeconds (pos) {
    let moment = this.props.moment.clone()
    moment.seconds(parseInt(pos.x, 10))
    this.props.onChange(moment)
  }
}
