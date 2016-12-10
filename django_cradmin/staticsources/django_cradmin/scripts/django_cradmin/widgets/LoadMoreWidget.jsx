import React from "react";
import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";


export default class LoadMoreWidget extends AbstractWidget {

  getDefaultConfig() {
    return {
      signalNameSpace: null
    };
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this._name = 'django_cradmin.components.CradminSelectedList';
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      this._name);
    if(this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this._onClick = this._onClick.bind(this);
    this._onLoadingStateChangeSignal = this._onLoadingStateChangeSignal.bind(this);
    this._isLoading = false;
    this.initializeSignalHandlers();
    this.element.addEventListener('click', this._onClick);
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.LoadingStateChange`,
      this._name,
      this._onLoadingStateChangeSignal
    );
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.config.signalNameSpace}.LoadingStateChange`,
      this._name
    );
  }

  _onClick(event) {
    event.preventDefault();
    if(!this._isLoading) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().send(
        `${this.config.signalNameSpace}.LoadMore`);
    }
  }

  _onLoadingStateChangeSignal(receivedSignalInfo) {
    this.logger.debug(receivedSignalInfo.toString(), receivedSignalInfo.data);
    this._isLoading = receivedSignalInfo.data;
  }
}
