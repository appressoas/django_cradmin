import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";


export default class DataListDisplayByStateWidget extends AbstractWidget {
  getDefaultConfig() {
    return {
      signalNameSpace: null,
      displayStyle: 'block',
      // Valid values:
      // - 'initializing'
      // - 'hasData'
      // - 'noData'
      // - 'hasSearchString'
      // - 'noSearchString'
      // - 'focus'
      // - 'blur'
      showStates: []
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
    this._onStateChangeSignal = this._onStateChangeSignal.bind(this);
    this.stateSet = new Set(['initializing']);
    this._refresh();
    this.initializeSignalHandlers();
  }

  initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.StateChange`,
      this._name,
      this._onStateChangeSignal
    );
  }

  destroy() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
      `${this.config.signalNameSpace}.StateChange`,
      this._name
    );
  }

  _display(display) {
    if(display) {
      this.element.setAttribute('style', `display: ${this.config.displayStyle}`);
    } else {
      this.element.setAttribute('style', 'display: none');
    }
  }

  _onStateChangeSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    const state = receivedSignalInfo.data.state;
    const stateChanges = receivedSignalInfo.data.stateChanges;

    this.stateSet.delete('initializing');
    if (stateChanges.has('data')) {
      if(state.data.count > 0) {
        this.stateSet.add('hasData');
        this.stateSet.delete('noData');
      } else {
        this.stateSet.add('noData');
        this.stateSet.delete('hasData');
      }
    }
    if (stateChanges.has('searchString')) {
      if (state.searchString.length > 0) {
        this.stateSet.add('hasSearchString');
        this.stateSet.delete('noSearchString');
      } else {
        this.stateSet.add('noSearchString');
        this.stateSet.delete('hasSearchString');
      }
    }
    if (stateChanges.has('focus')) {
      if (state.focus) {
        this.stateSet.add('focus');
        this.stateSet.delete('blur');
      } else {
        this.stateSet.add('blur');
        this.stateSet.delete('focus');
      }
    }
    this._refresh();
  }

  _refresh() {
    console.log(this.stateSet);
    let display = false;
    for(let state of this.stateSet) {
      if(this.config.showStates.indexOf(state) != -1) {
        display = true;
        break;
      }
    }
    this._display(display);
  }
}
