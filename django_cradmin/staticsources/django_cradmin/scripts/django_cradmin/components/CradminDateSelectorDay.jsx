import React from "react";
import ReactDOM from "react-dom";


export default class CradminDateSelectorDay extends React.Component {
  static get defaultProps() {
    return {
      signalNameSpace: null,
      labelCssClass: "select select--outlined",
      extraSelectAttributes: {},
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
      disabled: true
    };
    this.state.daysInMonth = this._calculateDaysInMonth(this.state)['daysInMonth'];

    this._handleDayChange = this._handleDayChange.bind(this);
    this._onMonthValueChangeSignal = this._onMonthValueChangeSignal.bind(this);
    this._onYearValueChangeSignal = this._onYearValueChangeSignal.bind(this);
    this._postInit = this._postInit.bind(this);
    this._initializeSignalHandlers();
  }

  _initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.initializeValues`,
      this._name,
      this._postInit
    );
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

  _postInit() {
    if (!this.state.disabled) {
      return;
    }
    this.setState({disabled: false});
    this._sendDateUpdateSignal(this.props.initialDay)
  }

  _calculateDaysInMonth(stateObject) {
    let daysInMonth = 31;
    let value = 0;
    if(stateObject.year != null && stateObject.month != null) {
      let date = new Date(Date.UTC(stateObject.year, stateObject.month + 1, 0));
      daysInMonth = date.getUTCDate();
    }
    if(stateObject.value != null) {
      value = stateObject.value;
    }

    return {
      daysInMonth: daysInMonth,
      value: value <= daysInMonth ? value : daysInMonth
    };
  }

  _updateDate() {
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

  _sendDateUpdateSignal(newDay) {
    this.setState({value: newDay});
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.DayValueChange`, newDay, (info) => {
        if (this.logger.isDebug) {
          this.logger.debug(`Update day: \n\tNew day: ${newDay}\n\t${info}`);
        }
      });
  }

  _handleDayChange(event) {
    let newDay = event.target.value;
    this._sendDateUpdateSignal(newDay);
  }

  render() {
    let dayOptions = [
      <option key={`${this._name}.dayOption.0`} value={0}>{this.props.labelText}</option>
    ];
    for (let day = 1; day <= this.state.daysInMonth; day++) {
      dayOptions.push(
        <option key={`${this._name}.dayOption.${day}`} value={day}>{day}</option>
      );
    }

    return (
      <label className={this.props.labelCssClass}>
        <select value={this.state.value || 0}
                onChange={this._handleDayChange}
                {...this.props.extraSelectAttributes}>
          {dayOptions}
        </select>
      </label>
    )
  }
}
