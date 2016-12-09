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

  _initialize() {
    this._initializeSignalHandlers();
    this.signalHandlersInitialized = true;
    this._sendDataListInitializedSignal();
  }

  _loadInitialState() {
    const state = {
      data: null,
      selectedItemsMap: new Map()
    };
    this.requestDataList()
      .then((data) => {
        state.data = data;
        this.state = state;
        this._initialize();
      })
      .catch((error) => {
        throw error;
      })
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
        this.state.selectedItemsMap.remove(
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
      this.sendDataChangeSignal();
    }
    if(stateChanges.has('selection')) {
      this.sendSelectionChangeSignal();
    }
  }

  sendDataChangeSignal() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.DataChange`,
      this.state.data,
      (sentSignalInfo) => {
        this.logger.debug('Sent:', sentSignalInfo.toString());
      }
    );
  }

  sendSelectionChangeSignal() {
    new window.ievv_jsbase_core.SignalHandlerSingleton().send(
      `${this.config.signalNameSpace}.SelectionChange`,
      {selectedItemsMap: this.state.selectedItemsMap},
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

  requestDataList(searchString='') {
    throw new Error('requestDataList must be implemented in subclasses of AbstractDataListWidget.');
  }
}
