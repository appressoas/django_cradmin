import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";


export default class AbstractDataListWidget extends AbstractWidget {

  getDefaultConfig() {
    return {
      signalNameSpace: null,
      keyAttribute: 'id',
      multiselect: false,
      selectedKeys: []
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
    if(this.config.signalNameSpace == null) {
      throw new Error('The signalNameSpace config is required.');
    }
    this.state = null;
    this.signalHandlersInitialized = false;
  }

  _initialize(state) {
    this._initializeSignalHandlers();
    this.signalHandlersInitialized = true;
    this._sendDataListInitializedSignal();
    this.state = {
      data: undefined,
      selectedItemsMap: new Map(),
      searchString: ''
    };
    this.setState(state);
  }

  _loadInitialState() {
    const state = {};
    this.requestDataList()
      .then((data) => {
        state.data = data;
        this._initialize(state);
      })
      .catch((error) => {
        throw error;
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
    }
  }

  setState(state) {
    this.logger.debug('setState', state);
    const stateChanges = new Set();
    if(state.data != undefined) {
      this.state.data = state.data;
      stateChanges.add('data');
    }
    if(state.searchString != undefined) {
      this.state.searchString = state.searchString;
      stateChanges.add('searchString');
    }
    if(state.addSelectedItem != undefined) {
      if(!this.config.multiselect) {
        this.state.selectedItemsMap.clear();
      }
      this.state.selectedItemsMap.set(
        this._getKeyFromItemData(state.addSelectedItem), state.addSelectedItem);
      stateChanges.add('selection');
    }
    if(state.removeSelectedItem != undefined) {
      if(this.config.multiselect) {
        this.state.selectedItemsMap.delete(
          this._getKeyFromItemData(state.removeSelectedItem));
      } else {
        this.state.selectedItemsMap.clear();
      }
      stateChanges.add('selection');
    }
    if(state.clearSelectedKeys != undefined) {
      this.state.selectedItemsMap.clear();
      stateChanges.add('selection');
    }

    if(stateChanges.has('data')) {
      this._sendDataChangeSignal();
    }
    if(stateChanges.has('selection')) {
      this._sendSelectionChangeSignal();
    }
    if(stateChanges.has('searchString')) {
      this._requestDataListAndRefresh({
        searchString: this.state.searchString
      });
    }
    this._sendStateChangeSignal(stateChanges);
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
