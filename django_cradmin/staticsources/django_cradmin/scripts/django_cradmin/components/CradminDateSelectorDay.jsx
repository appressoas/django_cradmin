import React from "react";
import ReactDOM from "react-dom";


export default class CradminDateSelectorDay extends React.Component {
  static get defaultProps() {
    return {
      signalNameSpace: null,
      labelCssClass: "",
      extraSelectProperties: {},
      labelText: "Day",
      initialYear: null,
      initialMonth: null,
      initialDay: 0
    };
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminDateSelectorDay.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminDateSelectorDay');

    this.state = {
      value: this.props.initialDay,
      year: this.props.initialYear,
      month: this.props.initialMonth,
      disabled: this.props.initialYear == null || this.props.initialMonth == null
    };

    this.state.daysInMonth = this._calculateDaysInMonth(this.state)['daysInMonth'];

    this._sendDateUpdateSignal = this._sendDateUpdateSignal.bind(this);
    this._onMonthValueChangeSignal = this._onMonthValueChangeSignal.bind(this);
    this._onYearValueChangeSignal = this._onYearValueChangeSignal.bind(this);
    this._initializeSignalHandlers()
  }

  _initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.MonthValueChange`,
      this._name,
      this._onMonthValueChangeSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.YearValueChange`,
      this._name,
      this._onYearValueChangeSignal
    );
  }

  _checkIfYearAndMonthIsValid() {
    this.setState((prevState, props) => {
      return {
        disabled: prevState.year == null || prevState.month == null
      }
    })
  }

  _calculateDaysInMonth(stateObject) {
    let date = new Date(Date.UTC(stateObject.year, stateObject.month+1, 0));

    let daysInMonth = date.getUTCDate();
    return {
      daysInMonth: daysInMonth,
      value: stateObject.value <= daysInMonth ? stateObject.value : daysInMonth
    };
  }

  _updateDate() {
    this._checkIfYearAndMonthIsValid();

    if (this.state.disabled) {
      return;
    }

    this.setState((prevState, props) => {
      return this._calculateDaysInMonth(prevState);
    });

    if (this.logger.isDebug) {
      this.logger.debug(`Updated year/month. State is now:\n\tdaysInMonth: ${this.state.daysInMonth}\n\tvalue: ${this.state.value}`);
    }
  }

  _onMonthValueChangeSignal(receivedSignalInfo) {
    this.setState({month: receivedSignalInfo.data});
    this._updateDate();
  }

  _onYearValueChangeSignal(receivedSignalInfo) {
    this.setState({year: receivedSignalInfo.data});
    this._updateDate();
  }

  _sendDateUpdateSignal(event) {
    let newDay = event.target.value;
    this.setState({value: newDay});

    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.DayValueChange`, newDay, (info) => {
        if (this.logger.isDebug) {
          this.logger.debug(`Update day: \n\tNew day: ${newDay}\n\t${info}`);
        }
      });
  }

  render() {
    let yearOptions = [
      <option key={`${this._name}.yearOption.0`} value={0}>{this.props.labelText}</option>
    ];
    for (let day = 1; day <= this.state.daysInMonth; day++) {
      yearOptions.push(
        <option key={`${this._name}.yearOption.${day}`} value={day}>{day}</option>
      );
    }

    return (
      <label className={this.props.labelCssClass}>
        <select value={this.state.value}
                onChange={this._sendDateUpdateSignal}
                disabled={this.state.disabled}
                {...this.props.extraSelectProperties}>
          {yearOptions}
        </select>
      </label>
    )
  }
}
