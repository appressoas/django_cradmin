import React from "react";
import {HotKeys} from 'react-hotkeys';
import DomUtilities from "../utilities/DomUtilities";


export default class CradminFilterCheckbox extends React.Component {
  static get defaultProps() {
    return {
      label: '',
      filterKey: null,
      initialValue: false,
      checkedLabel: '',
      uncheckedLabel: '',
      className: 'checkbox  checkbox--block',
      indicatorClassName: 'checkbox__control-indicator',
      signalNameSpace: null,
    }
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminFilterCheckbox.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminFilterCheckbox');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    if(this.props.filterKey == null) {
      throw new Error('The filterKey prop is required.');
    }
    this._onDataListInitializedSignal = this._onDataListInitializedSignal.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onFiltersChangeSignal = this._onFiltersChangeSignal.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);

    this.state = {
      value: this.props.initialValue
    };
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.DataListInitialized`,
      this._name,
      this._onDataListInitializedSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.FiltersChange`,
      this._name,
      this._onFiltersChangeSignal
    );
  }

  _setValueFromFiltersMap(filtersMap) {
    let newValue = filtersMap.get(this.props.filterKey);
    if(newValue == undefined) {
      newValue = false;
    }
    if(newValue != this.state.value) {
      this.setState({
        value: newValue
      });
    }
  }

  _onDataListInitializedSignal(receivedSignalInfo) {
    const state = receivedSignalInfo.data;
    this._setValueFromFiltersMap(state.filtersMap);
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton()
      .removeAllSignalsFromReceiver(this._name);
  }

  _onChange(event) {
    event.preventDefault();
    const filtersMapPatch = new Map();
    filtersMapPatch.set(this.props.filterKey, !this.state.value);
    console.log('Change', filtersMapPatch);
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.PatchFilters`,
      filtersMapPatch);
  }

  _onFocus(event) {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Focus`);
  }

  _onBlur(event) {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Blur`);
  }

  _onFiltersChangeSignal(receivedSignalInfo) {
    this.logger.info(receivedSignalInfo.toString(), receivedSignalInfo.data);
    const filtersMap = receivedSignalInfo.data;
    this._setValueFromFiltersMap(filtersMap);
  }

  renderLabel() {
    return this.props.label;
  }

  render() {
    return <label className={this.props.className}>
      <input type="checkbox"
             checked={this.state.value}
             onChange={this._onChange}
             onFocus={this._onFocus}
             onBlur={this._onBlur}/>
      <span className={this.props.indicatorClassName} />
      {this.renderLabel()}
    </label>;
  }
}
