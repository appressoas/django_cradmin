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
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      'django_cradmin.components.CradminSelectedList');
    if(this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this._onClick = this._onClick.bind(this);
    this.element.addEventListener('click', this._onClick);
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
  }

  _onClick(event) {
    event.preventDefault();
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.LoadMore`);
  }
}
