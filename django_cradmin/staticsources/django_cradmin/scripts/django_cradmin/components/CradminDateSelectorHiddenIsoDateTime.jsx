import React from "react";
import ReactDOM from "react-dom";
import CradminDateSelectorHiddenIsoDate from "./CradminDateSelectorHiddenIsoDate";


export default class CradminDateSelectorHiddenIsoDateTime extends CradminDateSelectorHiddenIsoDate {
  makeInitialState() {
    let initialState = super.makeInitialState();
    initialState.hour = null;
    initialState.minute = null;
    return initialState;
  }

  isInvalid(stateObject) {
    let invalid = super.isInvalid(stateObject)
      || stateObject.hour == null
      || stateObject.minute == null;
    return invalid;
  }

  makeValueFromStateObject(stateObject) {
    let date = new Date(Date.UTC(
      stateObject.year, stateObject.month, stateObject.day,
      stateObject.hour, stateObject.minute));
    return date.toISOString().split('.')[0].replace('T', ' ');
  }

  initializeSignalHandlers() {
    super.initializeSignalHandlers();
    this._onHourValueChangeSignal = this._onHourValueChangeSignal.bind(this);
    this._onMinuteValueChangeSignal = this._onMinuteValueChangeSignal.bind(this);
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.HourValueChange`,
      this._name,
      this._onHourValueChangeSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.MinuteValueChange`,
      this._name,
      this._onMinuteValueChangeSignal
    );
  }

  _onHourValueChangeSignal(receivedSignalInfo) {
    this.setState({hour: receivedSignalInfo.data});
    this.updateDate();
  }

  _onMinuteValueChangeSignal(receivedSignalInfo) {
    this.setState({minute: receivedSignalInfo.data});
    this.updateDate();
  }
}
