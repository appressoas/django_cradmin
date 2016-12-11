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
      focusWhenItemSelected: false,
      focusWhenItemDeSelected: false,
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
    this._onSelectItemSignal = this._onSelectItemSignal.bind(this);
    this._onDeSelectItemSignal = this._onDeSelectItemSignal.bind(this);
    this._onFocusOnFallbackSignal = this._onFocusOnFallbackSignal.bind(this);
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
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.DeSelectItem`,
      this._name,
      this._onDeSelectItemSignal
    );
    if(this.props.useAsFocusFallback) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.props.signalNameSpace}.FocusOnFallback`,
        this._name,
        this._onFocusOnFallbackSignal
      );
    }
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

  _onSelectItemSignal(receivedSignalInfo) {
    if(this.props.clearWhenItemSelected) {
      this.setState({
        searchString: ''
      });
      this._sendChangeSignal();
    }
    if(this.props.focusWhenItemSelected) {
      this._forceFocus();
    }
  }

  _onDeSelectItemSignal(receivedSignalInfo) {
    if(this.props.focusWhenItemDeSelected) {
      this._forceFocus();
    }
  }

  _onFocusOnFallbackSignal(receivedSignalInfo) {
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
