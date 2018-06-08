import React from 'react'
import DateTimePicker from '../components/DateTimePicker'

export default class DateTimePickerForWidget extends React.Component {
  static get defaultProps () {
    return {
      moment: null,
      locale: null,
      showSeconds: null,
      size: null,
      signalNameSpace: null
    }
  }

  constructor (props) {
    super(props)
    this.state = this.makeInitialState()
  }

  makeInitialState () {
    return {
      inputMoment: this.props.moment,
      showSeconds: this.props.showSeconds,
      locale: this.props.locale,
      size: this.props.size
    }
  }

  render () {
    let {inputMoment, showSeconds, locale, size} = this.state
    let wrapperClass = 'wrapper ' + size

    return (
      <div className='app'>
        <input
          type='text'
          className='input  input--outlined'
          value={this.state.inputMoment.format('llll')}
          readOnly
        />
        <div className={wrapperClass}>
          <DateTimePicker
            moment={inputMoment}
            locale={locale}
            showSeconds={showSeconds}
            onChange={moment => this.setState({inputMoment: moment})}
          />
        </div>
      </div>
    )
  }
}
