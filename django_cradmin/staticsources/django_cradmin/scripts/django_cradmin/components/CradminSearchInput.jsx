import React from "react";


export default class CradminSearchInput extends React.Component {
  static get defaultProps() {
    return {
      changeDelay: 250,
      placeholder: 'Search ...',
      className: 'input input--outlined',
      autofocus: false,
      signalNameSpace: null,
      clearWhenItemSelected: false,
      focusWhenItemSelected: false
    }
  }

  constructor(props) {
    super(props);
    this._name = 'django_cradmin.components.CradminSearchInput';
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      this._name);
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this._onDataListInitializedSignal = this._onDataListInitializedSignal.bind(this);
    this._onSelectItemSignal = this._onSelectItemSignal.bind(this);
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
      `${this.props.signalNameSpace}.SelectItem`,
      this._name,
      this._onSelectItemSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.props.signalNameSpace}.DataListInitialized`,
      this._name
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.props.signalNameSpace}.SelectItem`,
      this._name
    );
  }

  _handleAutoFocus(tries=0) {
    if(tries > 2) {
      // Give up - the element will probably not become visible
      // within a useful amount of time.
      return;
    }
    this._inputDomElement.focus();
    if(document.activeElement != this._inputDomElement) {
      setTimeout(() => {
        this._handleAutoFocus(tries + 1);
      }, 100);
    }
  }

  _onDataListInitializedSignal(receivedSignalInfo) {
    if(this.props.autofocus) {
      this.handleFocus();
      this._handleAutoFocus();
    }
  }

  _onSelectItemSignal(receivedSignalInfo) {
    if(this.props.clearWhenItemSelected) {
      this.setState({
        searchString: ''
      });
      this._sendChangeSignal();
    }
    if(this.props.focusWhenItemSelected) {
      this._inputDomElement.focus();
    }
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

  render() {
    return <input type="search"
                  ref={(input) => { this._inputDomElement = input; }}
                  placeholder={this.props.placeholder}
                  className={this.props.className}
                  value={this.state.searchString}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}/>;
  }
}
