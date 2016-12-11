import React from "react";
import {HotKeys} from 'react-hotkeys';


export default class CradminSearchInput extends React.Component {
  static get defaultProps() {
    return {
      changeDelay: 250,
      placeholder: 'Search ...',
      className: 'input input--outlined',
      autofocus: false,
      signalNameSpace: null,
      // TODO: Get rid of useAsFocusFallback
      useAsFocusFallback: true
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
    this._onFocusOnFallbackSignal = this._onFocusOnFallbackSignal.bind(this);
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
    if(this.props.useAsFocusFallback) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.props.signalNameSpace}.FocusOnFallback`,
        this._name,
        this._onFocusOnFallbackSignal
      );
    }
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

  _forceFocus(tries=0) {
    if(tries > 2) {
      // Give up - the element will probably not become visible
      // within a useful amount of time.
      return;
    }
    this._inputDomElement.focus();
    if(document.activeElement != this._inputDomElement) {
      setTimeout(() => {
        this._forceFocus(tries + 1);
      }, 100);
    }
  }

  _onDataListInitializedSignal(receivedSignalInfo) {
    if(this.props.autofocus) {
      this.handleFocus();
      this._forceFocus();
    }
  }

  _onClearSearchFieldSignal(receivedSignalInfo) {
    this.setState({
      searchString: ''
    });
    this._sendChangeSignal();
  }

  _onFocusOnFallbackSignal(receivedSignalInfo) {
    this._forceFocus();
  }

  _onFocusOnSearchFieldSignal(receivedSignalInfo) {
    this._forceFocus();
  }

  handleChange(event) {
    this._cancelInputTimeout();
    this.setState({searchString: event.target.value});
    this._timeoutId = window.setTimeout(
      () => {this._sendChangeSignal()},
      this.props.changeDelay);
  }

  _cancelInputTimeout() {
    if(this._timeoutId != undefined) {
      window.clearTimeout(this._timeoutId);
    }
  }

  _sendChangeSignal() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.SearchValueChange`,
      this.state.searchString,
      (sentSignalInfo) => {
        this.logger.debug(sentSignalInfo.toString());
      }
    );
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
      'downKey': ['down']
    };
  }

  _onDownKey() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.SearchDownKey`);
  }

  get hotKeysHandlers() {
    return {
      'downKey': (event) => {
        event.preventDefault();
        this._onDownKey();
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
