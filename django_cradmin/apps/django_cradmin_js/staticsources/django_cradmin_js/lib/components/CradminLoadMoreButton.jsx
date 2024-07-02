import React from "react";
import DomUtilities from "../utilities/DomUtilities";
import LoggerSingleton from "ievv_jsbase/lib/log/LoggerSingleton";
import SignalHandlerSingleton from "ievv_jsbase/lib/SignalHandlerSingleton";


export default class CradminLoadMoreButton extends React.Component {
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
    this._name = `django_cradmin.components.CradminLoadMoreButton.${this.props.signalNameSpace}`;
    this.logger = new LoggerSingleton().getLogger(
      'django_cradmin.components.CradminLoadMoreButton');
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this._onClick = this._onClick.bind(this);
    this._onLoadingStateChangeSignal = this._onLoadingStateChangeSignal.bind(this);
    this._onFocusOnLoadMoreButtonSignal = this._onFocusOnLoadMoreButtonSignal.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      isLoading: false
    };
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.LoadingStateChange`,
      this._name,
      this._onLoadingStateChangeSignal
    );
    new SignalHandlerSingleton().addReceiver(
      `${this.props.signalNameSpace}.FocusOnLoadMoreButton`,
      this._name,
      this._onFocusOnLoadMoreButtonSignal
    );
  }

  componentWillUnmount() {
    new SignalHandlerSingleton()
      .removeAllSignalsFromReceiver(this._name);
  }

  _onClick(event) {
    event.preventDefault();
    if(!this.state.isLoading) {
      new SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.LoadMore`);
      new SignalHandlerSingleton().send(
        `${this.props.signalNameSpace}.LoadMoreButtonClick`);
    }
  }

  _onFocus(event) {
    new SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.Focus`);
  }

  _onBlur(event) {
    new SignalHandlerSingleton().send(
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

  _onUpKey() {
    new SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.LoadMoreUpKey`);
  }

  _onDownKey() {
    new SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.LoadMoreDownKey`);
  }

  _onEscapeKey() {
    new SignalHandlerSingleton().send(
      `${this.props.signalNameSpace}.LoadMoreEscapeKey`);
  }

  handleKeyDown(e) {
    if (!this.props.useHotKeys) {
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._onDownKey();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._onUpKey();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._onEscapeKey();
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
                  tabIndex={this.getTabIndex()}
                  onKeyDown={this.handleKeyDown}>
      {this.renderButtonContent()}
    </button>;
  }

  render() {
    return this.renderButton();
  }
}
