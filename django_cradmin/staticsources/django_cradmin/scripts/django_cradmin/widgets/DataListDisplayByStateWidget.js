import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";


export default class DataListDisplayByStateWidget extends AbstractWidget {
  getDefaultConfig() {
    return {
      signalNameSpace: null,
      displayStyle: 'block',
      // Valid values:
      // - 'initializingDataList'
      // - 'currentResultIsNotEmpty'
      // - 'currentResultIsEmpty'
      // - 'hasSearchString'
      // - 'noSearchString'
      // - 'focus'
      // - 'blur'
      // - 'empty'
      // - 'notEmpty'
      showStates: [],

      hideStates: []
    };
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this._widgetInstanceId = widgetInstanceId;
    this._name = `django_cradmin.widgets.DataListDisplayByStateWidget.${widgetInstanceId}`;
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      this._name);
    if (this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this._onDataListInitializedSignal = this._onDataListInitializedSignal.bind(this);
    this._onIsEmpyDataListSignal = this._onIsEmpyDataListSignal.bind(this);
    this._onNotEmpyDataListSignal = this._onNotEmpyDataListSignal.bind(this);
    this._onDataChangeSignal = this._onDataChangeSignal.bind(this);
    this._onSearchValueChangeSignal = this._onSearchValueChangeSignal.bind(this);
    this._onFocusSignal = this._onFocusSignal.bind(this);
    this._onBlurSignal = this._onBlurSignal.bind(this);
    this._onLoadingStateChangeSignal = this._onLoadingStateChangeSignal.bind(this);

    this._watchedStates = new Set(this.config.showStates);
    for(let hideState of this.config.hideStates) {
      this._watchedStates.add(hideState);
    }
    this.stateSet = new Set();
    if(this._watchInitializingDataList()) {
      this.stateSet.add('initializingDataList');
    }
    this._refresh();
    this.initializeSignalHandlers();
  }

  _watchIsEmpty() {
    return this._watchedStates.has('empty');
  }

  _watchNotEmpty() {
    return this._watchedStates.has('notEmpty');
  }

  _watchInitializingDataList() {
    return this._watchedStates.has('initializingDataList');
  }

  _watchResultCount() {
    return this._watchedStates.has('currentResultIsNotEmpty') ||
         this._watchedStates.has('currentResultIsEmpty');
  }

  _watchNextPage() {
    return this._watchedStates.has('hasNextPage');
  }

  _watchSearchString() {
    return this._watchedStates.has('hasSearchString') ||
         this._watchedStates.has('noSearchString');
  }

  _watchFocus() {
    return this._watchedStates.has('focus') ||
         this._watchedStates.has('blur');
  }

  _watchLoadingStateChange() {
    return this._watchedStates.has('loading');
  }

  _listenForDataListInitializedSignal() {
    return this._watchInitializingDataList();
  }

  _listenForIsEmpyDataListSignal() {
    return this._watchIsEmpty();
  }

  _listenForNotEmpyDataListSignal() {
    return this._watchNotEmpty();
  }

  _listenForDataChangeSignal() {
    return this._watchResultCount() || this._watchNextPage();
  }

  _listenForSearchValueChangeSignal() {
    return this._watchSearchString();
  }

  _listenForFocusSignal() {
    return this._watchFocus();
  }

  _listenForBlurSignal() {
    return this._watchFocus();
  }

  _listenForLoadingStateChangeSignal() {
    return this._watchLoadingStateChange();
  }

  initializeSignalHandlers() {
    if(this._listenForDataListInitializedSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.DataListInitialized`,
        this._name,
        this._onDataListInitializedSignal
      );
    }
    if(this._listenForIsEmpyDataListSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.IsEmpyDataList`,
        this._name,
        this._onIsEmpyDataListSignal
      );
    }
    if(this._listenForNotEmpyDataListSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.NotEmpyDataList`,
        this._name,
        this._onNotEmpyDataListSignal
      );
    }
    if(this._listenForDataChangeSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.DataChange`,
        this._name,
        this._onDataChangeSignal
      );
    }
    if(this._listenForSearchValueChangeSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.SearchValueChange`,
        this._name,
        this._onSearchValueChangeSignal
      );
    }
    if(this._listenForFocusSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.Focus`,
        this._name,
        this._onFocusSignal
      );
    }
    if(this._listenForBlurSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.Blur`,
        this._name,
        this._onBlurSignal
      );
    }
    if(this._listenForLoadingStateChangeSignal()) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
        `${this.config.signalNameSpace}.LoadingStateChange`,
        this._name,
        this._onLoadingStateChangeSignal
      );
    }
  }

  destroy() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().removeAllSignalsFromReceiver(
      this._name);
  }

  _onDataListInitializedSignal(receivedSignalInfo) {
    if(this.stateSet.has('initializingDataList')) {
      this.stateSet.delete('initializingDataList');
      this._refresh();
    }
  }

  _onIsEmpyDataListSignal(receivedSignalInfo) {
    if(!this.stateSet.has('empty')) {
      this.stateSet.add('empty');
      this.stateSet.delete('notEmpty');
      this._refresh();
    }
  }

  _onNotEmpyDataListSignal(receivedSignalInfo) {
    if(!this.stateSet.has('notEmpty')) {
      this.stateSet.add('notEmpty');
      this.stateSet.delete('empty');
      this._refresh();
    }
  }

  _checkDataChanges(data) {
    let hasChanges = false;
    if(this._watchResultCount()) {
      if (data.count > 0) {
        if (!this.stateSet.has('currentResultIsNotEmpty')) {
          this.stateSet.add('currentResultIsNotEmpty');
          this.stateSet.delete('currentResultIsEmpty');
          hasChanges = true;
        }
      } else {
        if (!this.stateSet.has('currentResultIsEmpty')) {
          this.stateSet.add('currentResultIsEmpty');
          this.stateSet.delete('currentResultIsNotEmpty');
          hasChanges = true;
        }
      }
    }

    if(this._watchNextPage()) {
      if(data.next) {
        if(!this.stateSet.has('hasNextPage')) {
          this.stateSet.add('hasNextPage');
          hasChanges = true;
        }
      } else {
        if(this.stateSet.has('hasNextPage')) {
          this.stateSet.delete('hasNextPage');
          hasChanges = true;
        }
      }
    }

    return hasChanges;
  }

  _onDataChangeSignal(receivedSignalInfo) {
    const data = receivedSignalInfo.data;
    if(this._checkDataChanges(data)) {
      this._refresh();
    }
  }

  _checkSearchStringChanges(searchString) {
    let hasChanges = false;
    if (searchString.length > 0) {
      if (!this.stateSet.has('hasSearchString')) {
        this.stateSet.add('hasSearchString');
        this.stateSet.delete('noSearchString');
        hasChanges = true;
      }
    } else {
      if (!this.stateSet.has('noSearchString')) {
        this.stateSet.add('noSearchString');
        this.stateSet.delete('hasSearchString');
        hasChanges = true;
      }
    }
    return hasChanges;
  }

  _onSearchValueChangeSignal(receivedSignalInfo) {
    const searchString = receivedSignalInfo.data;
    if(this._checkSearchStringChanges(searchString)) {
      this._refresh();
    }
  }

  _onFocusSignal(receivedSignalInfo) {
    if (!this.stateSet.has('focus')) {
      this.stateSet.add('focus');
      this.stateSet.delete('blur');
      this._refresh();
    }
  }

  _onBlurSignal(receivedSignalInfo) {
    if (!this.stateSet.has('blur')) {
      this.stateSet.add('blur');
      this.stateSet.delete('focus');
      this._refresh();
    }
  }

  _checkLoadingChanges(isLoading) {
    let hasChanges = false;
    if (isLoading) {
      if(!this.stateSet.has('loading')) {
        this.stateSet.add('loading');
        hasChanges = true;
      }
    } else {
      if(this.stateSet.has('loading')) {
        this.stateSet.delete('loading');
        hasChanges = true;
      }
    }
    return hasChanges;
  }

  _onLoadingStateChangeSignal(receivedSignalInfo) {
    const isLoading = receivedSignalInfo.data;
    if(this._checkLoadingChanges(isLoading)) {
      this._refresh();
    }
  }

  _display(display) {
    if(display) {
      this.element.setAttribute('style', `display: ${this.config.displayStyle}`);
    } else {
      this.element.setAttribute('style', 'display: none');
    }
  }

  _refresh() {
    let display = false;
    for(let state of this.config.showStates) {
      if(this.stateSet.has(state)) {
        display = true;
        break;
      }
    }
    for(let state of this.config.hideStates) {
      if(this.stateSet.has(state)) {
        display = false;
        break;
      }
    }
    if(this.logger.isDebug) {
      this.logger.debug(
        `State changes detected by widgetInstanceId=${this._widgetInstanceId}. New stateSet`,
        this.stateSet, 'Display:', display);
    }
    this._display(display);
  }
}
