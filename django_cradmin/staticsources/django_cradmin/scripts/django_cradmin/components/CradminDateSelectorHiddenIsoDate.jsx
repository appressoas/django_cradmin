import React from "react";
import ReactDOM from "react-dom";


export default class CradminDateSelectorHiddenIsoDate extends React.Component {
  static get defaultProps() {
    return {
      signalNameSpace: null,
      inputType: 'hidden',
      inputName: null,
      initialDay: null,
      initialMonth: null,
      initialYear: null,
    };
  }

  makeInitialState() {
    return {
      day: this.props.initialDay,
      month: this.props.initialMonth,
      year: this.props.initialYear,
    }
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminDateSelectorHiddenIsoDate.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminDateSelectorHiddenIsoDate');

    this.state = this.makeInitialState();
    let valueObject = this._makeValue(this.state);
    this.state.value = valueObject.value;
    this.state.invalid = valueObject.invalid;

    this._onDayValueChangeSignal = this._onDayValueChangeSignal.bind(this);
    this._onMonthValueChangeSignal = this._onMonthValueChangeSignal.bind(this);
    this._onYearValueChangeSignal = this._onYearValueChangeSignal.bind(this);
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.DayValueChange`,
      this._name,
      this._onDayValueChangeSignal
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

  isInvalid(stateObject) {
    return stateObject.day == null
      || stateObject.year == null
      || stateObject.month == null;
  }

  makeValueFromStateObject(stateObject) {
      let date = new Date(Date.UTC(stateObject.year, stateObject.month, stateObject.day));
      return date.toISOString().split('T')[0];
  }

  _makeValue(stateObject) {
    let invalid = this.isInvalid(stateObject);
    let value = '';
    if (!invalid) {
      value = this.makeValueFromStateObject(stateObject);
    }

    return {
      invalid: invalid,
      value: value
    };
  }

  updateDate() {
    this.setState((prevState, props) => {
      return this._makeValue(prevState);
    })
  }

  _onDayValueChangeSignal(receivedSignalInfo) {
    this.setState({day: receivedSignalInfo.data});
    this.updateDate();
  }

  _onMonthValueChangeSignal(receivedSignalInfo) {
    this.setState({month: receivedSignalInfo.data});
    this.updateDate();
  }

  _onYearValueChangeSignal(receivedSignalInfo) {
    this.setState({year: receivedSignalInfo.data});
    this.updateDate();
  }

  render() {
    return <input
      type={this.props.inputType}
      name={this.props.inputName}
      value={this.state.value}
    />;
  }
}
