import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";


export default class AbstractDataListWidget extends AbstractWidget {

  getDefaultConfig() {
    return {
      signalNameSpace: null,
      keyAttribute: 'id',
      multiselect: false,
      selectedKeys: [],
      minimumSearchStringLength: 0,
      initialSearchString: ''
    };
  }

  get name() {
    throw new Error('Must be overridden');
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    this.logger = new window.ievv_jsbase_core.LoggerSingleton().getLogger(
      this.name);
    this._onSearchValueChangeSignal = this._onSearchValueChangeSignal.bind(this);
    this._onSelectItemSignal = this._onSelectItemSignal.bind(this);
    this._onDeSelectItemSignal = this._onDeSelectItemSignal.bind(this);
    this._onFocusSignal = this._onFocusSignal.bind(this);
    this._onBlurSignal = this._onBlurSignal.bind(this);
    if(this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this.state = null;
    this.signalHandlersInitialized = false;
  }

  _initialize(state) {
    this._initializeSignalHandlers();
    this.signalHandlersInitialized = true;
    this.state = {
      data: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      selectedItemsMap: new Map(),
      searchString: ''
    };
    this._sendDataListInitializedSignal();
    this.setState(state);
  }

  _makeItemMapFromArray(itemDataArray) {
    const itemMap = new Map();
    for(let itemData of itemDataArray) {
      itemMap.set(this._getKeyFromItemData(itemData), itemData);
    }
    return itemMap;
  }

  _requestItemDataForKeys(keys) {
    const promises = [];
    for(let key of keys) {
      promises.push(this.requestItemData(key));
    }
    return Promise.all(promises);
  }

  _loadInitialState() {
    const state = {
      searchString: this.config.initialSearchString
    };
    this._requestItemDataForKeys(this.config.selectedKeys)
      .then((selectedItemsArray) => {
        state.setSelectedItems = selectedItemsArray;
        this._initialize(state);
      })
      .catch((error) => {
        this.logger.error('Failed to load config.selectedKeys:', this.config.selectedKeys, '. Error:', error.toString());
        this._initialize(state);
      });
  }

  useAfterInitializeAllWidgets() {
    return true;
  }

  afterInitializeAllWidgets() {
    this._loadInitialState();
  }

  _initializeSignalHandlers() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.SearchValueChange`,
      this.name,
      this._onSearchValueChangeSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.SelectItem`,
      this.name,
      this._onSelectItemSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.DeSelectItem`,
      this.name,
      this._onDeSelectItemSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.Focus`,
      this.name,
      this._onFocusSignal
    );
    new window.ievv_jsbase_core.SignalHandlerSingleton().addReceiver(
      `${this.config.signalNameSpace}.Blur`,
      this.name,
      this._onBlurSignal
    );
  }

  destroy() {
    if(this.signalHandlersInitialized) {
      new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
        `${this.config.signalNameSpace}.SearchValueChange`,
        this.name
      );
      new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
        `${this.config.signalNameSpace}.SelectItem`,
        this.name
      );
      new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
        `${this.config.signalNameSpace}.DeSelectItem`,
        this.name
      );
      new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
        `${this.config.signalNameSpace}.Focus`,
        this.name
      );
      new window.ievv_jsbase_core.SignalHandlerSingleton().removeReceiver(
        `${this.config.signalNameSpace}.Blur`,
        this.name
      );
    }
  }

  _updateSearchStringStateChange(stateChange, stateChangesSet) {
    if(stateChange.searchString != undefined) {
      this.state.searchString = stateChange.searchString;
      if(stateChange.searchString.length >= this.config.minimumSearchStringLength) {
        stateChangesSet.add('searchString');
      } else {
        stateChange.data = {
          count: 0,
          next: null,
          previous: null,
          results: []
        }
      }
    }
  }

  _updateDataStateChange(stateChange, stateChangesSet) {
    if(stateChange.data != undefined) {
      this.state.data = stateChange.data;
      stateChangesSet.add('data');
    }
  }

  _updateSelectionStateChange(stateChange, stateChangesSet) {
    if(stateChange.addSelectedItem != undefined) {
      if(!this.config.multiselect) {
        this.state.selectedItemsMap.clear();
      }
      this.state.selectedItemsMap.set(
        this._getKeyFromItemData(stateChange.addSelectedItem), stateChange.addSelectedItem);
      stateChangesSet.add('selection');
    }
    if(stateChange.removeSelectedItem != undefined) {
      if(this.config.multiselect) {
        this.state.selectedItemsMap.delete(
          this._getKeyFromItemData(stateChange.removeSelectedItem));
      } else {
        this.state.selectedItemsMap.clear();
      }
      stateChangesSet.add('selection');
    }
    if(stateChange.clearSelectedKeys != undefined) {
      this.state.selectedItemsMap.clear();
      stateChangesSet.add('selection');
    }
    if(stateChange.setSelectedItems != undefined) {
      this.state.selectedItemsMap = this._makeItemMapFromArray(stateChange.setSelectedItems);
      stateChangesSet.add('selection');
    }
  }

  _updateFocusStateChange(stateChange, stateChangesSet) {
    if(stateChange.focus != undefined) {
      this.state.focus = stateChange.focus;
      stateChangesSet.add('focus');
    }
  }

  setState(stateChange) {
    this.logger.debug('setState', stateChange);
    const stateChangesSet = new Set();
    this._updateSearchStringStateChange(stateChange, stateChangesSet);
    this._updateDataStateChange(stateChange, stateChangesSet);
    this._updateSelectionStateChange(stateChange, stateChangesSet);
    this._updateFocusStateChange(stateChange, stateChangesSet);

    if(stateChangesSet.has('data')) {
      this._sendDataChangeSignal();
    }
    if(stateChangesSet.has('selection')) {
      this._sendSelectionChangeSignal();
    }
    if(stateChangesSet.has('searchString')) {
      this._requestDataListAndRefresh({
        searchString: this.state.searchString
      });
    }
    this._sendStateChangeSignal(stateChangesSet);
  }

  _sendDataChangeSignal() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.DataChange`,
      this.state.data,
      (sentSignalInfo) => {
        this.logger.debug('Sent:', sentSignalInfo.toString());
      }
    );
  }

  _sendSelectionChangeSignal() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.SelectionChange`,
      {selectedItemsMap: this.state.selectedItemsMap},
      (sentSignalInfo) => {
        this.logger.debug('Sent:', sentSignalInfo.toString());
      }
    );
  }

  _sendStateChangeSignal(stateChanges) {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.StateChange`,
      {state: this.state, stateChanges: stateChanges},
      (sentSignalInfo) => {
        this.logger.debug('Sent:', sentSignalInfo.toString());
      }
    );
  }

  _sendDataListInitializedSignal() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.DataListInitialized`,
      this.state,
      (sentSignalInfo) => {
        this.logger.debug('Sent:', sentSignalInfo.toString());
      }
    );
  }

  _onSearchValueChangeSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    this.setState({
      searchString: receivedSignalInfo.data
    });
  }

  _getKeyFromItemData(itemData) {
    return itemData[this.config.keyAttribute];
  }

  _onSelectItemSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    const itemData = receivedSignalInfo.data;
    this.setState({
      addSelectedItem: itemData
    });
  }

  _onDeSelectItemSignal(receivedSignalInfo) {
    this.logger.debug('Received:', receivedSignalInfo.toString());
    const itemData = receivedSignalInfo.data;
    this.setState({
      removeSelectedItem: itemData
    });
  }

  _cancelBlurTimer() {
    if(this._blurTimeoutId != undefined) {
      window.clearTimeout(this._blurTimeoutId);
    }
  }

  _startBlurTimer(callback) {
    this._blurTimeoutId = window.setTimeout(
      callback,
      100);
  }

  _onFocusSignal(receivedSignalInfo) {
    this._cancelBlurTimer();
    this.setState({
      focus: true
    });
  }

  _onBlurSignal(receivedSignalInfo) {
    this._startBlurTimer(() => {
      this.setState({
        focus: false
      });
    });
  }

  requestItemData(key) {
    throw new Error('requestItemData must be implemented in subclasses of AbstractDataListWidget.');
  }

  requestDataList() {
    throw new Error('requestDataList must be implemented in subclasses of AbstractDataListWidget.');
  }

  makeRequestDataListOptions(options={}) {
    return Object.assign({}, {
      searchString: ''
    }, options);
  }

  _requestDataListAndRefresh(options) {
    this.requestDataList(options)
      .then((data) => {
        this.setState({
          data: data
        });
      })
      .catch((error) => {
        throw error;
      });
  }
}
