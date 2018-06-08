import React from 'react'
import ReactDOM from 'react-dom'
import TimePicker from "./TimePicker"
import { withRouter } from 'react-router-dom'

class TimePickerForWidget extends React.Component {
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
      <div className="app">
        <input 
          type="text" 
          className="input  input--outlined" 
          value={this.state.inputMoment.format('LT')}
          readOnly
        />
        <div className={wrapperClass}>
          <TimePicker
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

export default withRouter(TimePickerForWidget)