import React from "react";
import {HotKeys} from 'react-hotkeys';
import DomUtilities from "../utilities/DomUtilities";


export default class CradminSearchInput extends React.Component {
  static get defaultProps() {
    return {
      changeDelay: 250,
      placeholder: 'Search ...',
      className: 'input input--outlined',
      autofocus: false,
      signalNameSpace: null,
    }
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.CradminSearchInput.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminSearchInput');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this._onDataListInitializedSignal = this._onDataListInitializedSignal.bind(this);
    this._onClearSearchFieldSignal = this._onClearSearchFieldSignal.bind(this);
    this._onFocusOnSearchFieldSignal = this._onFocusOnSearchFieldSignal.bind(this);
    this.state = {
      searchString: ''
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
      `${this.props.signalNameSpace}.ClearSearchField`,
      this._name,
      this._onClearSearchFieldSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.FocusOnSearchField`,
      this._name,
      this._onFocusOnSearchFieldSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton()
      .removeAllSignalsFromReceiver(this._name);
  }

  _onDataListInitializedSignal(receivedSignalInfo) {
    if(this.props.autofocus) {
      this.handleFocus();
      DomUtilities.forceFocus(this._inputDomElement);
    }
  }

  _onClearSearchFieldSignal(receivedSignalInfo) {
    this.setState({
      searchString: ''
    });
    this._sendChangeSignal();
  }

  _onFocusOnSearchFieldSignal(receivedSignalInfo) {
    DomUtilities.forceFocus(this._inputDomElement);
  }

  handleChange(event) {
    this._cancelInputTimeout();
    const searchString = event.target.value;
    this.setState({searchString: searchString});
    this._timeoutId = window.setTimeout(
      () => {this._sendChangeSignal()},
      this.props.changeDelay);
    if(searchString.length > 0) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.SearchValueChangeNotEmpty`,
        this.state.searchString);
    } else {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.SearchValueChangeEmpty`,
        this.state.searchString);
    }
  }

  _cancelInputTimeout() {
    if(this._timeoutId != undefined) {
      window.clearTimeout(this._timeoutId);
    }
  }

  _sendChangeSignal() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.SearchValueChange`,
      this.state.searchString);
  }

  handleFocus() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Focus`);
  }

  handleBlur() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Blur`);
  }

  get hotKeysMap() {
    return {
      'downKey': ['down'],
      'enterKey': ['enter'],
      'escapeKey': ['escape']
    };
  }

  _onDownKey() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.SearchDownKey`);
  }

  _onEnterKey() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.SearchEnterKey`);
  }

  _onEscapeKey() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.SearchEscapeKey`);
  }

  get hotKeysHandlers() {
    return {
      'downKey': (event) => {
        event.preventDefault();
        this._onDownKey();
      },
      'enterKey': (event) => {
        event.preventDefault();
        this._onEnterKey();
      },
      'escapeKey': (event) => {
        event.preventDefault();
        this._onEscapeKey();
      },
    }
  }

  renderInputField() {
    return <input type="search"
                  ref={(input) => { this._inputDomElement = input; }}
                  placeholder={this.props.placeholder}
                  className={this.props.className}
                  value={this.state.searchString}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}/>;
  }

  render() {
    return <HotKeys keyMap={this.hotKeysMap} handlers={this.hotKeysHandlers}>
      {this.renderInputField()}
    </HotKeys>;
  }
}
