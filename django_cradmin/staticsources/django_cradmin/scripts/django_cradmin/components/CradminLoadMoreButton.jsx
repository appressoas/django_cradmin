import React from "react";
import {HotKeys} from 'react-hotkeys';
import DomUtilities from "../utilities/DomUtilities";


export default class LoadMoreButton extends React.Component {
  static get defaultProps() {
    return {
      label: 'Load more',
      className: 'button',
      signalNameSpace: null,
      useHotKeys: false,
      disableTabNavigation: false
    }
  }

  constructor(props) {
    super(props);
    this._name = `django_cradmin.components.LoadMoreButton.${this.props.signalNameSpace}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.LoadMoreButton');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this._onClick = this._onClick.bind(this);
    this._onLoadingStateChangeSignal = this._onLoadingStateChangeSignal.bind(this);
    this._onFocusOnLoadMoreButtonSignal = this._onFocusOnLoadMoreButtonSignal.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);

    this.state = {
      isLoading: false
    };
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.LoadingStateChange`,
      this._name,
      this._onLoadingStateChangeSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.FocusOnLoadMoreButton`,
      this._name,
      this._onFocusOnLoadMoreButtonSignal
    );
  }

  componentWillUnmount() {
    new window.ievv_jsbase_core.SignalHandlerSingleton()
      .removeAllSignalsFromReceiver(this._name);
  }

  _onClick(event) {
    event.preventDefault();
    if(!this.state.isLoading) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.LoadMore`);
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.LoadMoreButtonClick`);
    }
  }

  _onFocus(event) {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Focus`);
  }

  _onBlur(event) {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Blur`);
  }

  _onLoadingStateChangeSignal(receivedSignalInfo) {
    this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    this.setState({
      isLoading: receivedSignalInfo.data
    });
  }

  _onFocusOnLoadMoreButtonSignal(receivedSignalInfo) {
    this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    DomUtilities.forceFocus(this._buttonDomElement);
  }

  get hotKeysMap() {
    return {
      'upKey': ['up'],
      'downKey': ['down'],
      'escapeKey': ['escape']
    };
  }

  _onUpKey() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.LoadMoreUpKey`);
  }

  _onDownKey() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.LoadMoreDownKey`);
  }

  _onEscapeKey() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.LoadMoreEscapeKey`);
  }

  get hotKeysHandlers() {
    return {
      'upKey': (event) => {
        event.preventDefault();
        this._onUpKey();
      },
      'downKey': (event) => {
        event.preventDefault();
        this._onDownKey();
      },
      'escapeKey': (event) => {
        event.preventDefault();
        this._onEscapeKey();
      },
    }
  }

  getTabIndex() {
    if(this.props.disableTabNavigation) {
      return "-1";
    } else {
      return "0";
    }
  }

  renderButtonContent() {
    return this.props.label;
  }

  renderButton() {
    return <button type="button"
                  ref={(input) => { this._buttonDomElement = input; }}
                  className={this.props.className}
                  value={this.state.searchString}
                  onClick={this._onClick}
                  onFocus={this._onFocus}
                  onBlur={this._onBlur}
                  tabIndex={this.getTabIndex()}>
      {this.renderButtonContent()}
    </button>;
  }

  render() {
    if(this.props.useHotKeys) {
      return <HotKeys keyMap={this.hotKeysMap} handlers={this.hotKeysHandlers}>
        {this.renderButton()}
      </HotKeys>;
    } else {
      return this.renderButton();
    }
  }
}
