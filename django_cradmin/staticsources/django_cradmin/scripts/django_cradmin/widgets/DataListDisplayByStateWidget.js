import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";


export default class DataListDisplayByStateWidget extends AbstractWidget {
  getDefaultConfig() {
    return {
      signalNameSpace: null,
      displayStyle: 'block',
      showStates: [] // Valid values: 'initializing', 'hasData', 'noData'
    };
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this._name = `django_cradmin.widgets.DataListDisplayByStateWidget.${widgetInstanceId}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      this._name);
    if (this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this._onDataListInitializedSignal = this._onDataListInitializedSignal.bind(this);
    this._onDataChangeSignal = this._onDataChangeSignal.bind(this);
    this._dataListIsInitializing = true;
    this._refresh();
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.DataListInitialized`,
      this._name,
      this._onDataListInitializedSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.DataChange`,
      this._name,
      this._onDataChangeSignal
    );
  }

  destroy() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.config.signalNameSpace}.DataChange`,
      this._name
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.config.signalNameSpace}.SelectionChange`,
      this._name
    );
  }

  _onDataListInitializedSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this._dataListIsInitializing = false;
    const state = receivedSignalInfo.data;
    this._dataListCount = state.data.count;
    this._refresh();
  }

  _onDataChangeSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this._dataListCount = receivedSignalInfo.data.count;
    this._refresh();
  }

  _display(display) {
    if(display) {
      this.element.setAttribute('style', `display: ${this.config.displayStyle}`);
    } else {
      this.element.setAttribute('style', 'display: none');
    }
  }

  _refresh(count) {
    let state = 'initializing';
    if(!this._dataListIsInitializing) {
      if(this._dataListCount > 0) {
        state = 'hasData';
      } else {
        state = 'noData';
      }
    }
    let display = this.config.showStates.indexOf(state) != -1;
    this._display(display);
  }
}
